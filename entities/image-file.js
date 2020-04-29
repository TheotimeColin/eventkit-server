const mongoose = require('mongoose')

const ImageFile = new mongoose.Schema({
    id: { type: String, unique: true },
    sizes: { type: Array }
})

module.exports = mongoose.model('ImageFile', ImageFile);