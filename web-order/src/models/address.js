const mongoose = require('mongoose')

const address = new mongoose.Schema ({
    account_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'account',
        required: true,
        index: true
    },
    name: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        trim: true
    },
    is_complete: {
        type: Boolean,
        default: false
    },
    phone: {
        type: String,
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    city: {
        type: String,
        trim: true
    },
    country: {
        type: String,
        trim: true
    },
    postal_code: {
        type: Number,
        trim: true
    }
})

module.exports = mongoose.model('Address', address)