const mongoose = require('mongoose')
const AutoIncrementFactory = require('mongoose-sequence');
const AutoIncrement = AutoIncrementFactory(mongoose.connection)

const ArticleSchema = new mongoose.Schema({
    id: { type: Number, unique: true },
    title: { type: String },
    slug: { type: String },
    excerpt: { type: String },
    content: { type: String },
    cover: { type: String },
    thumbnail: { type: String },
    readTime: { type: Number, default: 5 }
})

ArticleSchema.plugin(AutoIncrement, { inc_field: 'id', start_seq: 1000 })

module.exports = mongoose.model('Article', ArticleSchema);