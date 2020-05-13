const User = require('../entities/user')
const jwt = require('jsonwebtoken')

module.exports = async function authenticate (headers) {
    try {
        let user = null

        if (!headers['authorization']) throw 'no-headers'

        let token = headers['authorization'].split(' ')[1]
        if (!token) throw 'no-token'

        user = await jwt.verify(token, process.env.SECRET, (err, decoded) => {
            return new Promise (resolve => {
                let fetched = false

                if (err) throw 'fail-token'
                fetched = User.findOne({ _id: decoded.id }, '-password')

                resolve(!err && fetched ? fetched : false)
            })
        })

        return user
    } catch (e) {
        console.log(e)
        return null
    }
}