const mongoose = require('mongoose')

const IdeaSchema = new mongoose.Schema({
    pack: { type: mongoose.Schema.Types.ObjectId, ref: 'Pack' },
    content: { type: Object },
    disabled: { type: Boolean, default: false }
})

module.exports = mongoose.model('Idea', IdeaSchema);