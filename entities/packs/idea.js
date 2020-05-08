const mongoose = require('mongoose')

const IdeaSchema = new mongoose.Schema({
    content: { type: Object },
    original: { type: mongoose.Schema.Types.ObjectId, ref: 'Idea' },
    pack: { type: mongoose.Schema.Types.ObjectId, ref: 'Pack' },
    disabled: { type: Boolean, default: false }
})

module.exports = mongoose.model('Idea', IdeaSchema);