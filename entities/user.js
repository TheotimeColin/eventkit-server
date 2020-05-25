const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const {
    generatePassword
} = require('../utils/password')

let UserSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String },
    password: { type: String },
    
    stripeId: { type: String },
    plan: { type: String },
    projects: { type: Number, default: 0 },

    admin: { type: Boolean }
})

UserSchema.pre('save', async function(next) {
    var user = this
    if (!user.isModified('password')) return next()

    let hash = await generatePassword(user.password)
    user.password = hash

    next()
})

UserSchema.methods.comparePassword = function(candidatePassword) {
    return new Promise(resolve => {
        bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
            resolve(isMatch, err)
        })
    })
    
}

global.UserSchema = global.UserSchema || mongoose.model('User', UserSchema)
module.exports = global.UserSchema