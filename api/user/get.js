const mongoose = require('mongoose')
const User = require('../../entities/user')
const jwt = require('jsonwebtoken')
const stripe = require('stripe')(process.env.STRIPE_KEY)

module.exports = async function (req, res) {
    let errors = []
    let user = null

    try {
        let token = req.headers['authorization'].split(' ')[1]
        if (!token) throw 'no-token'

        user = await jwt.verify(token, process.env.SECRET, (err, decoded) => {
            return new Promise (resolve => {
                let fetched = false

                if (err)  throw 'fail-token'
                fetched = User.findOne({ _id: decoded.id }, '-password')

                resolve(!err && fetched ? fetched : false)
            })
        })

        if (user.stripeId) {
            let plan = null
            let planRenewal = user.planRenewal
            let premiumProjects = user.premiumProjects

            let customer = await stripe.customers.retrieve(user.stripeId)
            let subscriptions = customer.subscriptions.data
            
            if (subscriptions[0]) {
                plan = subscriptions[0].plan.id
            }

            let today = new Date()

            if (plan && new Date(user.planRenewal) <= today) {
                premiumProjects = 3
                planRenewal = new Date(today.setMonth(today.getMonth() + 1))
            }

            await user.update({ plan, planRenewal, premiumProjects }, { new: true }).exec()
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