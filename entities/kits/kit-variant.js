const mongoose = require('mongoose')

let KitVariantSchema = new mongoose.Schema({
    title: { type: String },
    content: { type: String },
    theme: { type: Object, default: ({}) }
})

global.KitVariantSchema = global.KitVariantSchema || mongoose.model('KitVariant', KitVariantSchema)
module.exports = global.KitVariantSchema