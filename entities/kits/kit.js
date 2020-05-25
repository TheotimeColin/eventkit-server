const mongoose = require('mongoose')

const KitSchema = new mongoose.Schema({
    title: { type: String },
    subtitle: { type: String },
    slug: { type: String, unique: true },
    excerpt: { type: String },
    content: { type: String },

    complexity: { type: Number, default: 1 },
    material: { type: Number, default: 1 },
    time: { type: Number, default: 1 },
    
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
    modifiedDate: { type: Date }
})

KitSchema.pre('save', function(next) {
    this.publishedDate = new Date()
    this.modifiedDate = new Date()

    next()
})

module.exports = mongoose.model('Kit', KitSchema);