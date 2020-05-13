const {
    generatePassword
} = require('../../../utils/password')

const Token = require('../../../entities/Token')
const User = require('../../../entities/User')

module.exports = async function (req, res) {
    let errors = []
    
    try {
        if (!req.body.token || !req.body.password) throw 'missing-params'

        let token = await Token.findOne({ id: req.body.token })

        if (!token) throw 'token-not-found'

        let user = await User.findOne({ email: token.value })

        if (!user) throw 'user-not-found'

        let password = await generatePassword(req.body.password)

        if (!password) throw 'error'

        user.update({ password }).exec()
        token.deleteOne()
    } catch (err) {
        console.warn(err)
        errors.push(err)
    }
    
    res.send({
        status: errors.length > 0 ? 0 : 1,
        errors
    }) 
}