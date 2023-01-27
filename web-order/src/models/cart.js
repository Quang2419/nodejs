const mongoose = require('mongoose')

const cart = new mongoose.Schema({
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        required: true,
        index: true
    },
    account_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'account',
        required: true,
        index: true
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    total: {
        type: Number,
        required: true
    }
})

cart.index({
    product_id: 1,
    account_id: 1
})

module.exports = mongoose.model('Cart', cart)