const mongoose = require('mongoose')

const ImageSize = new mongoose.Schema({
    type: { type: String },
    width: { type: Number },
    height: { type: Number },
    src: { type: String },
    alt: { type: String }
})

module.exports = mongoose.model('ImageSize', ImageSize);