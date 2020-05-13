const mongoose = require('mongoose')

const PackSchema = new mongoose.Schema({
    title: { type: String },
    description: { type: String },
    
    default: { type: Boolean, default: false },
    kits: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Kit' }
    ],

    color1: { type: String },
    color2: { type: String },
    pattern: { type: Object, default: {} },

    ideas: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Idea' }
    ]
})

module.exports = mongoose.model('Pack', PackSchema);