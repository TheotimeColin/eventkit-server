const Idea = require('../../../entities/packs/idea')
const IdeaTag = require('../../../entities/packs/idea-tag')

module.exports = async function (req, res) {
    let errors = []
    let ideas = []
    let search = {}

    if (req.query.kit) search.kit = req.query.kit
    if (req.query.kickstarter) search.kickstarter = req.query.kickstarter

    try {
        ideas = await Idea.find(search).populate('tags').populate('kit')
    } catch (err) {
        console.log(err)
        errors.push({ code: err.code, message: err.errmsg })
    }

    res.send({
        ideas,
        status: errors.length > 0 ? 0 : 1,
        errors
    }) 
}