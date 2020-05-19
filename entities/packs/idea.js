const mongoose = require('mongoose')

const IdeaSchema = new mongoose.Schema({
    content: { type: Object },
    original: { type: mongoose.Schema.Types.ObjectId, ref: 'Idea' },
    disabled: { type: Boolean, default: false },
    kickstarter: { type: Boolean, default: false },
    kit: { type: mongoose.Schema.Types.ObjectId, ref: 'Kit' },
    tags: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'IdeaTag' }
    ]
})

module.exports = mongoose.model('Idea', IdeaSchema);