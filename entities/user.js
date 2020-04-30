const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

let UserSchema = new mongoose.Schema({
    email: { type: String },
    password: { type: String },
    admin: { type: Boolean, default: false }
})

UserSchema.pre('save', function(next) {
    var user = this
    if (!user.isModified('password')) return next()

    bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err)

        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err)
            user.password = hash
            next()
        })
    })
})

UserSchema.methods.comparePassword = function(candidatePassword) {
    return new Promise(resolve => {
        bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
            resolve(isMatch, err)
        })
    })
    
}

module.exports = mongoose.model('User', UserSchema);