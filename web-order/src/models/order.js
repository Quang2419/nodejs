const mongoose = require('mongoose')

const order = new mongoose.Schema({
    order_item_id: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'orderItem',
        index: true
    },
    address_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'address',
        required: true,
        index: true
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        index: true
    },
    code: {
        type: String,
        trim: true,
        index: true
    },
    status: {
        type: String,
        index: true,
        enum: [ 'pending','open', 'closed', 'cancelled']
    },
    total_all: {
        type: Number,
    },
    created_at: {
        type: Date,
        default: Date.now,
        required: true,
        index: true
    },
    update_at: {
        type: Date,
        index: true
    }
})

module.exports = mongoose.model('Order', order)