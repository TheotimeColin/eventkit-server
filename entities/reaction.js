const mongoose = require('mongoose')

const ReactionSchema = new mongoose.Schema({
    uniqueCount: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
    type: { type: mongoose.Schema.Types.ObjectId, ref: 'ReactionType' },
    article: { type: mongoose.Schema.Types.ObjectId, ref: 'Article' }
})

module.exports = mongoose.model('Reaction', ReactionSchema);