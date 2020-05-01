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

    published: { type: Boolean, default: false },
    publishedDate: { type: Date },
    modifiedDate: { type: Date },

    hitsNumber: { type: Number, default: 0 },
    readTime: { type: Number, default: 5 }
})

ArticleSchema.pre('save', function(next) {
    this.publishedDate = new Date()
    this.modifiedDate = new Date()

    next()
})

ArticleSchema.pre('findOneAndUpdate', function(next) {
    const data = this.getUpdate()

    data.publishedDate = data.publishedDate ? data.publishedDate : new Date()
    data.modifiedDate = new Date()
    this.update({}, data).exec()

    next()
})

ArticleSchema.plugin(AutoIncrement, { inc_field: 'id', start_seq: 1000 })

module.exports = mongoose.model('Article', ArticleSchema);