const mongoose = require('mongoose')
const AutoIncrementFactory = require('mongoose-sequence');
const AutoIncrement = AutoIncrementFactory(mongoose.connection)

const ArticleSchema = new mongoose.Schema({
    id: { type: Number, unique: true },
    title: { type: String },
    slug: { type: String },
    excerpt: { type: String },
    content: { type: String },
    
    cover: { type: mongoose.Schema.Types.ObjectId, ref: 'ImageSize' },
    thumbnail: { type: mongoose.Schema.Types.ObjectId, ref: 'ImageSize' },

    published: { type: Boolean, default: false },
    publishedDate: { type: Date },
    modifiedDate: { type: Date },

    hitCount: { type: Number, default: 0 },
    readTime: { type: Number, default: 5 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'ArticleCategory' },

    linked: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'ArticleLink' }
    ]
})

ArticleSchema.pre('save', function(next) {
    this.publishedDate = new Date()
    this.modifiedDate = new Date()

    next()
})

ArticleSchema.plugin(AutoIncrement, { id: 'article', inc_field: 'id', start_seq: 1000 })

module.exports = mongoose.model('Article', ArticleSchema);