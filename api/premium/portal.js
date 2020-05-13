const stripe = require('stripe')(process.env.STRIPE_KEY)
const User = require('../../entities/user')

module.exports = async function (req, res) {
    let errors = []
    let portal = null

    try {
        let user = await User.findById(req.body.user)
        if (!user) throw 'no-user'

        portal = await stripe.billingPortal.sessions.create({
            customer: user.stripeId,
            return_url: 'https://example.com/account',
        })
    } catch (err) {
        console.log(err)
        errors.push({ code: err.code, message: err.errmsg })
    }

    res.send({
        portal,
        status: errors.length > 0 ? 0 : 1,
        errors
    })
}