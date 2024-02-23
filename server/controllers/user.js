const User = require('../models/user')
const asyncHandler = require('express-async-handler')
const { generateAccessToken, generateRefreshToken } = require('../middewares/jwt')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const sendMail = require('../utils/sendMail')
const makeToken = require('uniqid')
const {users} = require('../utils/constants')
// const register = asyncHandler(async (req, res) => {
//     const {email, password, firstname, lastname} = req.body
//     if(!email || !password || !lastname || !firstname)
//     return res.status(400).json({
//         success: false,
//         mes: 'Missing inputs'
//     })

//     const user = await User.findOne({ email })
//     if(user) throw new Error('User has existed!')
//     else {
//         const newUser = await User.create(req.body)
//         return res.status(200).json({
//             success: newUser ? true : false,
//             mes: newUser ? 'Register is successfully. Please go login~' : 'Something went wrong'
//         })
//     }

// })

//Refresh token => cấp mới access token
//Access token => xác thực người dùng, phân quyền người dùng 

const register = asyncHandler(async (req, res) => {
    const { email, password, firstname, lastname, mobile } = req.body
    if (!email || !password || !lastname || !firstname || !mobile)
        return res.status(400).json({
            success: false,
            mes: 'Missing inputs'
        })
    const user = await User.findOne({ email })
    if (user) throw new Error('User has existed!')
    else {
        const token = makeToken()
        const emailedited = btoa(email) + '@' + token
        const newUser = await User.create({
            email: emailedited,
            password,
            firstname,
            lastname,
            mobile
        })
        if(newUser) {
            const html = `<h2>Register code: </h2><br /><blockquote>${token}</blockquote>`
            await sendMail({ email, html, subject: 'Confirm register account world' })
        }
        setTimeout(async() => {
            await User.deleteOne({email: emailedited})
        }, [300000])
        return res.json({
            success: newUser ? true : false,
            mes: newUser ? 'Please check your email to active account' : 'Something went wrong, please try again later.'
        })
    }
})

const finalRegister = asyncHandler(async (req, res) => {
    // const cookie = req.cookies
    const { token } = req.params
    const notActivedEmail = await User.findOne({email: new RegExp(`${token}$`)})
    if(notActivedEmail) {
        notActivedEmail.email = atob(notActivedEmail?.email?.split('@')[0])
        notActivedEmail.save()
    }
    
    return res.json({
        success: notActivedEmail ? true : false,
        response: notActivedEmail ? 'Register is successfully. Please go log in.' : 'Something went wrong'
    })
})
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    if (!email || !password)
        return res.status(400).json({
            success: false,
            mes: 'Missing inputs'
        })

    const response = await User.findOne({ email })
    if (response && await response.isCorrectPassword(password)) {
        //Tách password và role ra khỏi response
        const { password, role, refreshToken, ...userData } = response.toObject()

        //Tạo accesc token
        const accessToken = generateAccessToken(response._id, role)

        //Tạo refresh token
        const newrefreshToken = generateRefreshToken(response._id)

        // Lưu refresh token vào database 
        await User.findByIdAndUpdate(response._id, { refreshToken: newrefreshToken }, { new: true })
        //Lưu refresh token vào cookie
        res.cookie('refreshToken', newrefreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 })

        return res.status(200).json({
            success: true,
            accessToken,
            userData
        })
    } else {
        throw new Error('Invalid credentials!')
    }

})


const getCurrent = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const user = await User.findById(_id).select('-refreshToken -password')
    return res.status(200).json({
        success: user ? true : false,
        rs: user ? user : 'User not found'
    })

})

const refreshAccessToken = asyncHandler(async (req, res) => {
    //Lấy token từ cookies
    const cookie = req.cookies

    //Check xem có token hay không
    if (!cookie && !cookie.refreshToken) throw new Error('No refresh token in cookies')

    //Check token có hợp lệ hay không
    const rs = await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET)
    const response = await User.findOne({ _id: rs._id, refreshToken: cookie.refreshToken })
    return res.status(200).json({
        success: response ? true : false,
        newAccessToken: response ? generateAccessToken(response._id, response.role) : 'Refresh token not matched!!'
    })
})

const logout = asyncHandler(async (req, res) => {
    //Lấy cookie
    const cookie = req.cookies
    if (!cookie || !cookie.refreshToken) throw new Error('No refresh token in cookie')

    //xóa refresh token trong db 
    await User.findOneAndUpdate({ refreshToken: cookie.refreshToken }, { refreshToken: '' }, { new: true })
    //xóa refresh token ở cookie trình duyệt
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true
    })
    return res.status(200).json({
        success: true,
        mes: 'Logout is done!!'
    })
})

// client gửi mail 
// Server check xem email có hợp lệ hay không => gửi mail + kèm theo link (pass word change token)
// Client check mail => click vào link 
// Client gửi kèm api kèm token 
// Server token có giống như token mà server gửi mail hay không 
// Change password 

const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body
    if (!email) throw new Error('Missing email')
    const user = await User.findOne({ email })
    if (!user) throw new Error('User not found')
    const resetToken = user.createPasswordChangeToken()
    await user.save()

    const html = `Xin vui lòng click vào link dưới đây để thay đổi mật khẩu.Link này sẽ hết hạn sau 15 phút 
    <a href=${process.env.CLIENT_URL}/reset-password/${resetToken}>Click here</a>`

    const data = {
        email,
        html,
        subject: 'Forgot password'
    }
    const rs = await sendMail(data)
    return res.status(200).json({
        success: rs.response?.includes('OK') ? true : false,
        mes: rs.response?.includes('OK') ? 'Please check your email ~' : 'Your email has an error,  please try again later'
    })
})

const resetPassword = asyncHandler(async (req, res,) => {
    const { password, token } = req.body
    if (!password || !token) throw new Error('Missing inputs!')
    const passwordResetToken = crypto.createHash('sha256').update(token).digest('hex')
    const user = await User.findOne({ passwordResetToken, passwordResetExpires: { $gt: Date.now() } })
    if (!user) throw new Error('Invalid reset token')
    user.password = password
    user.passwordResetToken = undefined
    user.passwordChangedAt = Date.now()
    user.passwordResetExpires = undefined
    await user.save()
    return res.status(200).json({
        success: user ? true : false,
        mes: user ? 'Update password' : 'Something went wrongf'
    })
})

const getUsers = asyncHandler(async (req, res) => {
    const queries = {...req.query}

    // Tách các trường đặc biệt ra khỏi query 
    const exculdeFields = ['limit', 'sort', 'page', 'fields']
    exculdeFields.forEach(el => delete queries[el])

    // Format lại các operators cho đúng cú pháp của mongoose
    let queryString = JSON.stringify(queries)
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, matchedEl => `$${matchedEl}`)
    const restQueries = JSON.parse(queryString)

    let formatedQueries = {}
    /**
     * {quantity}
     */
    // Filtering 
    if(queries?.firstname) restQueries.firstname = {$regex: queries.firstname, $options: 'i'}
    if(queries?.lastname) restQueries.lastname = {$regex: queries.lastname, $options: 'i'}

    if(queries?.category) restQueries.category = { $regex: queries.category, $options: 'i'}

    let queryCommand = User.find(restQueries)


    //Sorting 
    //acb, efg => [acb, efg] => acb efg 
    if(req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ')
        queryCommand = queryCommand.sort(sortBy)
    }

    //Fields limiting 
    if(req.query.fields) {
        const fields = req.query.fields.split(',').join(' ')
        queryCommand = queryCommand.select(fields)
    }


    //Pagination 
    // limit: số object lấy về 1 lần gọi api 
    // skip: 2 
    // 1 2 3 .... 10 
    const page = +req.query.page || 1
    const limit = +req.query.limit || process.env.LIMIT_PRODUCT
    const skip = (page - 1) * limit
    queryCommand.skip(skip).limit(limit)
    // Execute query
    // Số sản phẩm thỏa mãn điều kiện !== số lượng sản phẩm trả về 1 lần gọi api
    queryCommand.exec(async(err, response) => {
        if(err) throw new Error(err.message)
        const counts = await User.find(restQueries).countDocuments()
        return res.status(200).json({
            success: response ? true : false,
            counts,
            users: response ? response : 'Cannot get user',
        })
    })
})

const deleteUser = asyncHandler(async (req, res) => {
    const { _id } = req.query
    if (!_id) throw new Error('Mising inputs')
    const response = await User.findByIdAndDelete(_id)
    return res.status(200).json({
        success: response ? true : false,
        deletedUser: response ? `User with email ${response.email} deleted` : 'No user delete'
    })
})

const updateUser = asyncHandler(async (req, res) => {
    const { _id } = req.user
    if (!_id || Object.keys(req.body).length === 0) throw new Error('Mising inputs')
    const response = await User.findByIdAndUpdate(_id, req.body, { new: true }).select('-password -role')
    return res.status(200).json({
        success: response ? true : false,
        updatedUser: response ? response : 'Something went wrong'
    })
})

const updateUserByAdmin = asyncHandler(async (req, res) => {
    const { uid } = req.params
    if (Object.keys(req.body).length === 0) throw new Error('Mising inputs')
    const response = await User.findByIdAndUpdate(uid, req.body, { new: true }).select('-password -role -refreshToken')
    return res.status(200).json({
        success: response ? true : false,
        updatedUser: response ? response : 'Something went wrong'
    })
})

const updateUserAddress = asyncHandler(async (req, res) => {
    const { _id } = req.user
    if (!req.body.address) throw new Error('Mising inputs')
    const response = await User.findByIdAndUpdate(_id, { $push: { address: req.body.address } }, { new: true }).select('-password -role -refreshToken')
    return res.status(200).json({
        success: response ? true : false,
        updatedUser: response ? response : 'Something went wrong'
    })
})


const updateCart = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { pid, quantity, color } = req.body
    if (!pid || !quantity || !color) throw new Error('Mising inputs')
    const user = await User.findById(_id).select('cart')
    const alreadyProduct = user?.cart?.find(el => el.product.toString() === pid)
    if (alreadyProduct) {
        if (alreadyProduct.color === color) {
            const response = await User.updateOne({ cart: { $elemMatch: alreadyProduct } }, { $set: { "cart.$.quantity": quantity } }, { new: true })
            return res.status(200).json({
                success: response ? true : false,
                updatedUser: response ? response : 'Something went wrong'
            })
        } else {
            const response = await User.findByIdAndUpdate(_id, { $push: { cart: { product: pid, quantity, color } } }, { new: true })
            return res.status(200).json({
                success: response ? true : false,
                updatedUser: response ? response : 'Something went wrong'
            })
        }
    } else {
        const response = await User.findByIdAndUpdate(_id, { $push: { cart: { product: pid, quantity, color } } }, { new: true })
        return res.status(200).json({
            success: response ? true : false,
            updatedUser: response ? response : 'Something went wrong'
        })
    }
})

const createUsers = asyncHandler(async (req, res) => {
    const response = await User.create(users)
    return res.status(200).json({
        success: response ? true : false,
        users: response ? response : 'Something went wrong'
    })
})
module.exports = {
    register,
    login,
    getCurrent,
    refreshAccessToken,
    logout,
    forgotPassword,
    resetPassword,
    getUsers,
    deleteUser,
    updateUser,
    updateUserByAdmin,
    updateUserAddress,
    updateCart,
    finalRegister,
    createUsers
}