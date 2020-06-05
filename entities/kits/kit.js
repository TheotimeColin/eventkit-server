const mongoose = require('mongoose')

const KitSchema = new mongoose.Schema({
    title: { type: String },
    subtitle: { type: String },
    slug: { type: String },
    excerpt: { type: String },
    content: { type: String },

    complexity: { type: Number },
    material: { type: Number },
    time: { type: Number },
    
    theme: { type: Object, default: () => ({}) },
    thumbnail: { type: mongoose.Schema.Types.ObjectId, ref: 'ImageSize' },

    projects: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'KitProject' }
    ],

    variants: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'KitVariant' }
    ],

    published: { type: Boolean, default: false },
    publishedDate: { type: Date },
    modifiedDate: { type: Date },

    lang: { type: String, default: 'fr' },
    translations: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Kit' }
    ]
})

KitSchema.pre('save', function(next) {
    this.publishedDate = new Date()
    this.modifiedDate = new Date()

    next()
})

module.exports = mongoose.model('Kit', KitSchema);