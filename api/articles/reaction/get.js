const mongoose = require('mongoose')
const Reaction = require('../../../entities/reaction')

module.exports = async function (req, res) {
    let errors = []
    let reaction = null
    let unique = 0

    if (req.query.unique) unique = 1

    try {
        reaction = await Reaction.findByIdAndUpdate(req.query.id, { $inc: { count: 1, uniqueCount: unique }})

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