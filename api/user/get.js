const authenticate = require('../../utils/authenticate')
const stripe = require('stripe')(process.env.STRIPE_KEY)

module.exports = async function (req, res) {
    let errors = []
    let user = null

    try {
        user = await authenticate(req.headers)
    } catch (err) {
        console.error(err)
        errors.push(err)
    }
    
    res.send({
        user,
        status: errors.length > 0 ? 0 : 1,
        errors
    })
}