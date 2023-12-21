const Blog = require('../models/blog')
const asyncHandler = require('express-async-handler')

const createNewBlog = asyncHandler(async(req, res) => {
    const { title, description, category } = req.body

    if(!title || !description || !category) throw new Error('Missing inputs!!')
    const response= await Blog.create(req.body)
    return res.json({
        success: response ? true : false,
        createdBlog: response ? response : 'Cannot create new blog'
    })
})


const updateBlog = asyncHandler(async(req, res) => {
    const { bid } = req.params
    if(Object.keys(req.body).length === 0) throw new Error('Missing inputs!')
    const response= await Blog.findByIdAndUpdate(bid, req.body, { new: true })
    return res.json({
        success: response ? true : false,
        updatedBlog: response ? response : 'Cannot update blog'
    })
})

const getBlogs = asyncHandler(async(req, res) => {
    const response= await Blog.find()
    return res.json({
        success: response ? true : false,
        blogs: response ? response : 'Cannot get blog'
    })
})

/**
 * Khi người dùng like 1 bài blog thì:
 * 1. Check xem người dùng đó trước đó có dislike hay không => nếu có thì bỏ dislike
 * 2. Nếu k có dislike check xem người đó trước đó có like hay k => bỏ like / thêm like 
 */

const likeBlog = asyncHandler(async(req, res) => {
    const { _id } = req.user 
    const { bid } = req.params
    if(!bid) throw new Error('Missing inputs!')
    const blog = await Blog.findById(bid)
    const alreadyLiked = blog?.dislikes?.find(el => el.toString() === _id)
    if(alreadyLiked) {
        const response = await Blog.findByIdAndUpdate(bid, {$pull: {dislikes: _id}}, {new: true})
        return res.json({
            success: response ? true : false,
            rs: response
        })
    }
    const isLiked = blog?.likes?.find(el => el.toString() === _id)
    if(isLiked) {
        const response = await Blog.findByIdAndUpdate(bid, {$pull: {likes: _id}}, {new: true})
        return res.json({
            success: response ? true : false,
            rs: response
        })
    } else {
        const response = await Blog.findByIdAndUpdate(bid, {$push: { likes: _id}}, {new: true})
        return res.json({
            success: response ? true : false,
            rs: response
        })
    }
})

const dislikeBlog = asyncHandler(async(req, res) => {
    const { _id } = req.user 
    const { bid } = req.params
    if(!bid) throw new Error('Missing inputs!')
    const blog = await Blog.findById(bid)
    const alreadyLiked = blog?.likes?.find(el => el.toString() === _id)
    if(alreadyLiked) {
        const response = await Blog.findByIdAndUpdate(bid, {$pull: {likes: _id}}, {new: true})
        return res.json({
            success: response ? true : false,
            rs: response
        })
    }
    const isDisLiked = blog?.dislikes?.find(el => el.toString() === _id)
    if(isDisLiked) {
        const response = await Blog.findByIdAndUpdate(bid, {$pull: {dislikes: _id}}, {new: true})
        return res.json({
            success: response ? true : false,
            rs: response
        })
    } else {
        const response = await Blog.findByIdAndUpdate(bid, {$push: { dislikes: _id}}, {new: true})
        return res.json({
            success: response ? true : false,
            rs: response
        })
    }
})

const getBlog = asyncHandler(async(req, res) => {
    const { bid } = req.params
    const blog = await Blog.findByIdAndUpdate(bid, { $inc: {numberViews: 1}}, {new: true})
        .populate('likes', 'firstname lastname')
        .populate('dislikes', 'firstname lastname')
    return res.json({
        success: blog ? true : false,
        rs: blog
    })
})

const deleteBlog = asyncHandler(async(req, res) => {
    const { bid } = req.params
    const blog = await Blog.findByIdAndDelete(bid)
    return res.json({
        success: blog ? true : false,
        rs: blog || 'Something went wrong'
    })
})
module.exports = {
    createNewBlog,
    updateBlog,
    getBlogs,
    likeBlog,
    dislikeBlog,
    getBlog,
    deleteBlog
}