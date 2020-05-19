const mongoose = require('mongoose')

const IdeaTag = new mongoose.Schema({
    label: { type: String },
    type: { type: String, default: 'tag' },
    kit: { type: mongoose.Schema.Types.ObjectId, ref: 'Kit' }
})

module.exports = mongoose.model('IdeaTag', IdeaTag);