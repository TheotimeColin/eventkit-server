const mongoose = require('mongoose')

const ReactionSchema = new mongoose.Schema({
    id: { type: String },
    title: { type: String },
    description: { type: String },
    emoji: { type: String },
})

module.exports = mongoose.model('ReactionType', ReactionSchema);