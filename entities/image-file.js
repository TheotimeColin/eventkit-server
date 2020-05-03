const mongoose = require('mongoose')

const ImageFile = new mongoose.Schema({
    name: { type: String },
    sizes: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'ImageSize' }
    ]
})

module.exports = mongoose.model('ImageFile', ImageFile);