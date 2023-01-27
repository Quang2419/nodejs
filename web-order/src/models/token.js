const mongoose = require('mongoose')

const token = mongoose.Schema({
    account_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'account',
        required: true,
        index: true
    },
    token: {
        type: String,
        trim: true
    },
    expire: {
        type: String,
        
    },
    created_at: {
        type: Date,
        default: Date.now,
        required: true
    }
})

module.exports = mongoose.model('Token', token)