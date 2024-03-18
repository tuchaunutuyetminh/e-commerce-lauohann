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
const getUserOrder = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const response = await Order.find({ orderBy: _id })
    return res.json({
        success: response ? true : false,
        response: response ? response : 'Something went wrong'
    })
})

const getOrders = asyncHandler(async (req, res) => {
    const response = await Order.find()
    return res.json({
        success: response ? true : false,
        response: response ? response : 'Something went wrong'
    })
})
module.exports = {
    createNewOrder,
    updateStatus,
    getUserOrder,
    getOrders
}