const mongoose = require('mongoose')
const Reaction = require('../../../entities/reaction')

module.exports = async function (req, res) {
    let errors = []
    let reaction = null

    try {
        reaction = await Reaction.findByIdAndUpdate(req.query.id, { $inc: { count: 1 }})

        if (!reaction) throw new Error 
    } catch (err) {
        errors.push({ code: err.code, message: err.errmsg })
    }

    res.send({
        count: reaction.count + 1,
        status: errors.length > 0 ? 0 : 1,
        errors
    }) 
}