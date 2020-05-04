const slugify = require('slugify')
const ReactionType = require('../../entities/reaction-type')

module.exports = async function (req, res) {
    let errors = []
    let reaction = null

    try {
        let exists = await ReactionType.findById(req.body._id)

        if (exists) {
            reaction = await ReactionType.findByIdAndUpdate(exists._id, {
                ...req.body
            })
        } else {
            reaction = await ReactionType.create({
                ...req.body
            })
        }

        if (!reaction) throw new Error()
    } catch (err) {
        errors.push({ code: err.code, message: err.errmsg })
    }

    res.send({
        reaction,
        status: errors.length > 0 ? 0 : 1,
        errors
    }) 
}