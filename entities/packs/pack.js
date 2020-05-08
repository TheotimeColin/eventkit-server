const mongoose = require('mongoose')

const PackSchema = new mongoose.Schema({
    title: { type: String },
    description: { type: String },
    
    kit: { type: String },

    color1: { type: String },
    color2: { type: String },

    ideas: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Idea' }
    ]
})

module.exports = mongoose.model('Pack', PackSchema);