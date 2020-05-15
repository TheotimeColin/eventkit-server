const authenticate = require('../../utils/authenticate')
const stripe = require('stripe')(process.env.STRIPE_KEY)

module.exports = async function (req, res) {
    let errors = []
    let user = null

    try {
        user = await authenticate(req.headers)
        
        if (user && user.stripeId) {
            let customer = await stripe.customers.retrieve(user.stripeId)
            let subscriptions = customer.subscriptions.data

            if (subscriptions[0]) {
                user.plan = subscriptions[0].plan.id
                await user.save()
            }
        }
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