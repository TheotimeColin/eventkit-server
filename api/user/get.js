const mongoose = require('mongoose')
const User = require('../../entities/user')
const jwt = require('jsonwebtoken')

module.exports = async function (req, res) {
    let errors = []

    let token = req.headers['authorization'].split(' ')[1]
    if (!token) {
        res.status(500)
        errors.push('no-token')
    }
    let user = await jwt.verify(token, process.env.SECRET, (err, decoded) => {
        return new Promise (resolve => {
            let fetched = false

            if (err) {
                res.status(500)
                errors.push('fail-token')
            } else {
                fetched = User.findOne({ _id: decoded.id }, 'email admin')
            }

            resolve(!err && fetched ? fetched : false)
        })
    })
    
    res.send({
        user,
        status: errors.length > 0 ? 0 : 1,
        errors
    })
}