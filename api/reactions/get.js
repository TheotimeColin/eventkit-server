const slugify = require('slugify')
const ReactionType = require('../../entities/reaction-type')

module.exports = async function (req, res) {
    let errors = []
    let reactions = []
    let search = {}

    if (req.body.id) search['id'] = req.body.id
    if (req.body._id) search['_id'] = req.body._id

    try {
        reactions = await ReactionType.find(search)
    } catch (err) {
        errors.push({ code: err.code, message: err.errmsg })
    }

    res.send({
        reactions,
        status: errors.length > 0 ? 0 : 1,
        errors
    }) 
}