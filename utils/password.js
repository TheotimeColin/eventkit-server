const bcrypt = require('bcrypt')

const generatePassword = function (password) {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(10, function(err, salt) {
            if (err) reject(err)
            
            bcrypt.hash(password, salt, function(err, hash) {
                if (err) reject(err)

                resolve(hash)
            })
        })
    })
}

module.exports = {
    generatePassword
}