const ReactionType = require('../../entities/reaction-type')

module.exports = async function (req, res) {
    let errors = []

    try {
        await ReactionType.findByIdAndDelete(req.body._id)
    } catch (err) {
        console.log(err)
        errors.push({ code: err.code, message: err.errmsg })
    }

    res.send({
        status: errors.length > 0 ? 0 : 1,
        errors
    })
}