const mongoose = require('mongoose')

const ProjectSchema = new mongoose.Schema({
    id: { type: String, unique: true },
    title: { type: String },

    theme: { type: Object, default: ({}) },

    ideas: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Idea' }
    ],

    anonymous: { type: Boolean, default: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    creationDate: { type: Date },
    modifiedDate: { type: Date }
})

ProjectSchema.pre('save', function(next) {
    this.creationDate = new Date()
    this.modifiedDate = new Date()

    next()
})

module.exports = mongoose.model('GeneratorProject', ProjectSchema);