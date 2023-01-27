const mongoose = require('mongoose')
const { create } = require('./order')

const orderItem = new mongoose.Schema ({
    order_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'order',
        required: true,
        index: true
    },
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product', 
        required: true,
        index: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    },
    created_at: {
        type: Date,
        default: Date.now,
        required: true,
        index: true
    }
})

module.exports = mongoose.model('Order_item', orderItem)