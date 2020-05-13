const mongoose = require('mongoose')

const TokenSchema = new mongoose.Schema({
    id: { type: String },
    value: { type: String },
    type: { type: String },
    expired: { type: Boolean, default: false },
    expiration: { type: Date }
})

module.exports = mongoose.model('Token', TokenSchema);