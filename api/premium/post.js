const User = require('../../entities/user')

const stripe = require('stripe')(process.env.STRIPE_KEY)

module.exports = async function (req, res) {
    let errors = []
    let customer = null
    let subscription = null

    try {
        let user = await User.findById(req.body.user)
        if (!user) throw 'no-user'

        customer = await createCustomer({ ...req.body, email: user.email })
        await user.update({ stripeId: customer.id, premiumProjects: 3 }).exec()

        subscription = await createSubscription(customer)

        if (subscription) {
            let now = new Date()
            await user.update({ planRenewal: new Date(now.setMonth(now.getMonth() + 1)) }).exec()
        }
    } catch (err) {
        console.log(err)
        errors.push({ code: err.code, message: err.errmsg })
    }

    res.send({
        subscription,
        status: errors.length > 0 ? 0 : 1,
        errors
    })
}

async function createCustomer ({ email, paymentMethod }) {
    return await stripe.customers.create({
        payment_method: paymentMethod,
        email: email,
        invoice_settings: {
            default_payment_method: paymentMethod,
        }
    })
}

async function createSubscription (customer) {
    return await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ plan: "premium-personal-1" }],
        expand: ["latest_invoice.payment_intent"]
    })
}