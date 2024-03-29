const mongoose = require('mongoose')

const IdeaCategory = new mongoose.Schema({
    label: { type: String },
    theme: { type: Object },
    themeSync: { type: Boolean, default: true },
    ideas: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Idea' }
    ]
})

module.exports = mongoose.model('IdeaCategory', IdeaCategory);