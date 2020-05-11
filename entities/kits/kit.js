const mongoose = require('mongoose')

const KitSchema = new mongoose.Schema({
    title: { type: String },
    slug: { type: String, unique: true },

    excerpt: { type: String },
    content: { type: String },
    
    cover: { type: mongoose.Schema.Types.ObjectId, ref: 'ImageSize' },
    thumbnail: { type: mongoose.Schema.Types.ObjectId, ref: 'ImageSize' },

    projects: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'KitProject' }
    ],

    published: { type: Boolean, default: false },
    publishedDate: { type: Date },
    modifiedDate: { type: Date },

    category: { type: mongoose.Schema.Types.ObjectId, ref: 'ArticleCategory' }
})

KitSchema.pre('save', function(next) {
    this.publishedDate = new Date()
    this.modifiedDate = new Date()

    next()
})

module.exports = mongoose.model('Kit', KitSchema);