const mongoose = require('mongoose')
const User = require('../../entities/user')
const KitProject = require('../../entities/kits/project')

const jwt = require('jsonwebtoken')

module.exports = async function (req, res) {
    let errors = []
    let token = null
    let authenticated = false

    try {
        if (!req.body.email || !req.body.password) throw 'missing-fields'

        user = await User.findOne({ email: req.body.email })
        
        if (user && req.body.register) throw 'already-registered'
        if (!user && req.body.login) throw 'email-not-found'

        if (user) {
            authenticated = await user.comparePassword(req.body.password)
        } else if (req.body.register) {
            user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            })

            if (req.body.userAnonymous) await attributeProjects({
                anonymous: req.body.userAnonymous,
                user: user._id
            })

            authenticated = true
        }

        if (!authenticated) throw 'wrong-credentials'

        token = jwt.sign({ id: user._id }, process.env.SECRET, {
            expiresIn: 86400
        })
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

async function attributeProjects ({ anonymous, user }) {
    return await KitProject.updateMany({ userAnonymous: anonymous }, { user: user, $unset: { userAnonymous: '' } })
}