const Product = require('../models/product')
const asyncHandler = require('express-async-handler')
const slugify = require('slugify')

const createProduct = asyncHandler(async (req, res) => {
    if(Object.keys(req.body).length === 0) throw new Error('Missing inputs!')
    if(req.body && req.body.title) req.body.slug = slugify(req.body.title)
    const newProduct = await Product.create(req.body)
    return res.status(200).json({
        success: newProduct ? true : false,
        createdProduct: newProduct ? newProduct : 'Cannot create new product'
    })
})

const getProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params
    const product = await Product.findById(pid)
    return res.status(200).json({
        success: product ? true : false,
        productData: product ? product : 'Cannot get product'
    })
})

//Filtering, Sorting and Pagination 
const getProducts = asyncHandler(async (req, res) => {
    const queries = {...req.query}

    // Tách các trường đặc biệt ra khỏi query 
    const exculdeFields = ['limit', 'sort', 'page', 'fields']
    exculdeFields.forEach(el => delete queries[el])

    // Format lại các operators cho đúng cú pháp của mongoose
    let queryString = JSON.stringify(queries)
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, matchedEl => `$${matchedEl}`)
    const restQueries = JSON.parse(queryString)

    let formatedQueries = {}
    if(queries?.color) {
        delete restQueries.color
        const colorQuery = queries.color?.split(',').map(el => ({ color: { $regex: el, $options: 'i'}}))
        formatedQueries = { $or: colorQuery}
    }
    /**
     * {quantity}
     */
    // Filtering 
    if(queries?.title) restQueries.title = {$regex: queries.title, $options: 'i'}
    if(queries?.category) restQueries.category = { $regex: queries.category, $options: 'i'}

    const q = { ...formatedQueries, ...restQueries }
    let queryCommand = Product.find(q)


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
        const counts = await Product.find(q).countDocuments()
        return res.status(200).json({
            success: response ? true : false,
            counts,
            products: response ? response : 'Cannot get products',
        })
    })
})

const updateProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params
    if(req.body && req.body.title) req.body.slug = slugify(req.body.title)
    const updatedProduct = await Product.findByIdAndUpdate(pid, req.body, {new: true})
    return res.status(200).json({
        success: updatedProduct ? true : false,
        updatedProduct: updatedProduct ? updatedProduct : 'Cannot update product'
    })
})


const deleteProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params
    const deleteProduct = await Product.findByIdAndDelete(pid)
    return res.status(200).json({
        success: deleteProduct ? true : false,
        deletedProduct: deleteProduct ? deleteProduct : 'Cannot delete product'
    })
})

//Logic: - Ng đánh giá là ai (phải đăng nhập mới )
const ratings = asyncHandler(async (req, res) => {
    const {_id} = req.user 
    const {star, comment, pid} = req.body 
    if(!star || !pid) throw new Error('Missing inputs!!')
    const ratingProduct = await Product.findById(pid)
    const alreadyRating = ratingProduct?.ratings?.find(el => el.postedBy.toString() === _id)
    if(alreadyRating) {
        //update star and comment
        await Product.updateOne({
            ratings: { $elemMatch: alreadyRating}
        }, {
            $set: { 
                "ratings.$.star": star,
                "ratings.$.comment": comment
            }
        }, { new: true })
    } else {
        //add star and comment
        await Product.findByIdAndUpdate(pid, {
            $push: {ratings: {star, comment, postedBy: _id}}
        }, { new: true})
    }

    //Sum ratings 
    const updatedProduct = await Product.findById(pid)
    const ratingCount = updatedProduct.ratings.length
    const sumRatings = updatedProduct.ratings.reduce((sum, el) => sum + +el.star, 0)
    updatedProduct.totalRatings = Math.round(sumRatings * 10/ ratingCount) / 10

    await updatedProduct.save()
    return res.status(200).json({
        status: true,
        updatedProduct
    })
})

const uploadImagesProduct = asyncHandler(async(req, res) => {
    const { pid } = req.params
    if(!req.files) throw new Error('Missing inputs!!')
    const response = await Product.findByIdAndUpdate(pid, {$push: {images: {$each: req.files.map(el => el.path)}}}, {new: true})
    return res.status(200).json({
        status: response ? true : false,
        updatedProduct: response ? response : 'Cannot upload images product'
    })
})


module.exports = {
    createProduct,
    getProduct,
    getProducts,
    updateProduct,
    deleteProduct,
    ratings,
    uploadImagesProduct,
}