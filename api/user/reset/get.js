const mongoose = require('mongoose')
const shortid = require('shortid')
const Token = require('../../../entities/token')
const User = require('../../../entities/user')
const { reset } = require('../../../mails')

module.exports = async function (req, res) {
    let errors = []
    
    try {
        let user = await User.findOne({ email: req.query.email })

        if (!user) throw 'user-not-found'

        let token = await Token.create({
            id: shortid.generate(),
            value: user.email
        })

        req.app.locals.mailer.sendMail(reset(user.email, {
            name: user.name,
            token: token.id
        }))

    } catch (err) {
        console.warn(err)
        errors.push(err)
    }
    
    res.send({
        status: errors.length > 0 ? 0 : 1,
        errors
    }) 
}