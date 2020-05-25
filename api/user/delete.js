const authenticate = require('../../utils/authenticate')

const KitProject = require('../../entities/kits/project')
const Idea = require('../../entities/packs/idea')

module.exports = async function (req, res) {
    let errors = []

    try {
        let user = await authenticate(req.headers)
        if (!user) throw 'not-found'

        let projects = await KitProject.find({ user: user._id})
        
        await Promise.all(projects.map(async project => {
            await Promise.all(project.ideas.map(async idea => {
                return await Idea.findByIdAndDelete(idea)
            }))

            project.deleteOne()

            return true
        }))
    
        user.deleteOne()
    } catch (err) {
        console.log(err)
        errors.push({ code: err.code, message: err.errmsg ? err.errmsg : err })
    }

    res.send({
        status: errors.length > 0 ? 0 : 1,
        errors
    })
}