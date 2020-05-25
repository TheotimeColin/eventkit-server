const authenticate = require('../../../utils/authenticate')
const KitProject = require('../../../entities/kits/project')
const Idea = require('../../../entities/packs/idea')

module.exports = async function (req, res) {
    let errors = []

    try {
        let project = await KitProject.findById(req.body._id)
        if (!project) throw 'project-not-found'

        let user = await authenticate(req.headers)
        if (!user || !project.user.equals(user._id)) throw 'not-owner'

        await Promise.all(project.ideas.map(async idea => {
            return await Idea.findByIdAndDelete(idea)
        }))

        project.deleteOne()
    } catch (err) {
        console.log(err)
        errors.push({ code: err.code, message: err.errmsg ? err.errmsg : err })
    }

    res.send({
        status: errors.length > 0 ? 0 : 1,
        errors
    })
}