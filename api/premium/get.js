const stripe = require('stripe')(process.env.STRIPE_KEY)

module.exports = async function (req, res) {
    let errors = []
    let information = {}

    try {
        let coupon = await stripe.coupons.retrieve('early-40')
        
        information.early = {
            times_redeemed: Math.min(coupon.times_redeemed * 3, 89)
        }
    } catch (err) {
        console.log(err)
        errors.push(err)
    }

    res.send({
        information,
        status: errors.length > 0 ? 0 : 1,
        errors
    })
}