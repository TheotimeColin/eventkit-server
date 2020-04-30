const mongoose = require('mongoose')
const User = require('../../entities/user')
const jwt = require('jsonwebtoken')

module.exports = async function (req, res) {
    let errors = []
    let token = null
    let authenticated = false 

    try {
        user = await User.findOne({ email: req.body.email })

        if (user) {
            authenticated = await user.comparePassword(req.body.password)
        } else {
            user = await User.create({
                email: req.body.email,
                password: req.body.password
            })

            authenticated = true
        }

        if (authenticated) {
            token = jwt.sign({ id: user._id }, process.env.SECRET, {
                expiresIn: 86400
            })
        }
    } catch (err) {
        console.error(err)
        errors.push(err)
    }

    res.send({
        token,
        status: errors.length > 0 ? 0 : 1,
        errors
    }) 
}