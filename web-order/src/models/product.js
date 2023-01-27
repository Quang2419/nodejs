const mongoose = require('mongoose')

const product = new mongoose.Schema ({
    title: {
        type: String,
        trim: true,
        required: true,
        index: true
    },
    decription: {
        type: String, 
        trim: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        trim: true
    },
    created_at: {
        type: Date,
        default: Date.now,
        required: true,
        index: true
    },
    update_at: {
        type: Date,
        default: Date.now,
        index: true
    }
})

module.exports = mongoose.model('Product', product)