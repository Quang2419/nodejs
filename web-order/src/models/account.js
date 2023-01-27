const mongoose = require('mongoose')

const account = new mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        lowercase: true,
        required: true,
        index: true
    },
    phone: {
        type: Number,
        trim: true
    },
    password: {
        type: String,
        trim: true,
        required: true
    },
    roles: {
        type: [String],
        default: ['customer']
    },
    tokens: [{
        token: {
            type: String,
            trim: true
        }
}],
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

module.exports = mongoose.model('Account', account)