const Order = require('../models/order')
const User = require('../models/user')
const Coupon = require('../models/coupon')
const asyncHandler = require('express-async-handler')
const slugify = require('slugify')

const createNewOrder = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { products, total, address, status } = req.body

    if (address) {
        await User.findByIdAndUpdate(_id, { address, cart: [] })
    }

    const data = { products, total, orderBy: _id }
    if(status) data.status = status
    const rs = await Order.create(data)
    return res.status(200).json({
        success: rs ? true : false,
        rs: rs ? rs : 'Something went wrong'
    })
})

const updateStatus = asyncHandler(async (req, res) => {
    const { oid } = req.params
    const { status } = req.body
    if (!status) throw new Error('Missing input!!')
    const response = await Order.findByIdAndUpdate(oid, { status }, { new: true })
    return res.status(200).json({
        success: response ? true : false,
        response: response ? response : 'Something went wrong'
    })
})
const getOrders = asyncHandler(async (req, res) => {
    const queries = {...req.query}

    // Tách các trường đặc biệt ra khỏi query 
    const exculdeFields = ['limit', 'sort', 'page', 'fields']
    exculdeFields.forEach(el => delete queries[el])

    // Format lại các operators cho đúng cú pháp của mongoose
    let queryString = JSON.stringify(queries)
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, matchedEl => `$${matchedEl}`)
    const formatedQueries = JSON.parse(queryString)

    let colorQueryObject = {}
    // if(queries?.color) {
    //     delete formatedQueries.color
    //     const colorArr = queries.color?.split(',')
    //     const colorQuery = colorArr.map(el => ({ color: { $regex: el, $options: 'i'}}))
    //     colorQueryObject = { $or: colorQuery}
    // }
    // let queryObject = {}
    // if(queries.q) {
    //     delete formatedQueries.q
    //     queryObject = { $or: [
    //         { color: { $regex: queries.q, $options: 'i'}},
    //         // { title: { $regex: queries.q, $options: 'i'}},
    //         // { category: { $regex: queries.q, $options: 'i'}},
    //         // { brand: { $regex: queries.q, $options: 'i'}},
    //         // { description: { $regex: queries.q, $options: 'i'}},

    //     ]}
    // }
    // if(queries?.title) formatedQueries.title = {$regex: queries.title, $options: 'i'}
    // if(queries?.category) formatedQueries.category = { $regex: queries.category, $options: 'i'}

    
    const qr = { ...formatedQueries }
    let queryCommand = Order.find(qr)

    /**
     * {quantity}
    */
   // Filtering 


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
        const counts = await Order.find(qr).countDocuments()
        return res.status(200).json({
            success: response ? true : false,
            counts,
            orders: response ? response : 'Cannot get orders',
        })
    })
})

const getUserOrder = asyncHandler(async (req, res) => {
    const queries = {...req.query}
    const { _id} = req.user
    // Tách các trường đặc biệt ra khỏi query 
    const exculdeFields = ['limit', 'sort', 'page', 'fields']
    exculdeFields.forEach(el => delete queries[el])

    // Format lại các operators cho đúng cú pháp của mongoose
    let queryString = JSON.stringify(queries)
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, matchedEl => `$${matchedEl}`)
    const formatedQueries = JSON.parse(queryString)

    let colorQueryObject = {}
    // if(queries?.color) {
    //     delete formatedQueries.color
    //     const colorArr = queries.color?.split(',')
    //     const colorQuery = colorArr.map(el => ({ color: { $regex: el, $options: 'i'}}))
    //     colorQueryObject = { $or: colorQuery}
    // }
    // let queryObject = {}
    // if(queries.q) {
    //     delete formatedQueries.q
    //     queryObject = { $or: [
    //         { color: { $regex: queries.q, $options: 'i'}},
    //         // { title: { $regex: queries.q, $options: 'i'}},
    //         // { category: { $regex: queries.q, $options: 'i'}},
    //         // { brand: { $regex: queries.q, $options: 'i'}},
    //         // { description: { $regex: queries.q, $options: 'i'}},

    //     ]}
    // }
    // if(queries?.title) formatedQueries.title = {$regex: queries.title, $options: 'i'}
    // if(queries?.category) formatedQueries.category = { $regex: queries.category, $options: 'i'}

    
    const qr = { ...formatedQueries, orderBy: _id }
    let queryCommand = Order.find(qr)

    /**
     * {quantity}
    */
   // Filtering 


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
        const counts = await Order.find(qr).countDocuments()
        return res.status(200).json({
            success: response ? true : false,
            counts,
            orders: response ? response : 'Cannot get orders',
        })
    })
})

module.exports = {
    createNewOrder,
    updateStatus,
    getUserOrder,
    getOrders
}