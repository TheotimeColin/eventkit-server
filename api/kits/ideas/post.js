const authenticate = require('../../../utils/authenticate')
const Idea = require('../../../entities/packs/idea')

module.exports = async function (req, res) {
    let user = await authenticate(req.headers)
    if (!user || !user.admin) {
        res.sendStatus(403)
        return
    }
    
    let errors = []
    let idea = null

    try {
        idea = req.body._id ? await Idea.findById(req.body._id) : null

        if (idea) {
            idea.content = req.body.content
            idea.tags = req.body.tags
            idea.kickstarter = req.body.kickstarter
            await idea.save()
        } else {
            idea = await Idea.create(req.body)
        }
    } catch (err) {
        console.log(err)
        errors.push(err)
    }

    await idea.populate('tags').populate('kit').execPopulate()

    res.send({
        idea,
        status: errors.length > 0 ? 0 : 1,
        errors
    }) 
}