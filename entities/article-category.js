const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const ArticleCategorySchema = new mongoose.Schema({
    id: { type: Number, unique: true },
    title: { type: String },
    subtitle: { type: String },
    slug: { type: String },
    articles: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Article' }
    ]
})

ArticleCategorySchema.plugin(AutoIncrement, { id: 'article-category', inc_field: 'id', start_seq: 1000 })

module.exports = mongoose.model('ArticleCategory', ArticleCategorySchema);