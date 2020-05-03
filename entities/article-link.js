const mongoose = require('mongoose')

const ArticleSchema = new mongoose.Schema({
    article: { type: mongoose.Schema.Types.ObjectId, ref: 'Article' },
    boost: { type: Number, default: 0 }
})

module.exports = mongoose.model('ArticleLink', ArticleSchema);