const mongoose = require('mongoose')

let ProjectSchema = new mongoose.Schema({
    id: { type: String, unique: true },
    title: { type: String },
    description: { type: String },

    theme: { type: Object, default: ({}) },
    ideas: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Idea' }
    ],
    kit: { type: mongoose.Schema.Types.ObjectId, ref: 'Kit' },

    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    template: { type: Boolean, default: false },
    temporary: { type: Boolean, default: false },
    premium: { type: Boolean, default: false },

    mainZippedFile: { type: String },

    publishedDate: { type: Date },
    creationDate: { type: Date },
    modifiedDate: { type: Date }
})

ProjectSchema.pre('save', function(next) {
    this.creationDate = new Date()
    this.modifiedDate = new Date()

    next()
})

global.ProjectSchema = global.ProjectSchema || mongoose.model('KitProject', ProjectSchema)
module.exports = global.ProjectSchema