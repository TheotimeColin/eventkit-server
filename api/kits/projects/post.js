const shortid = require('shortid')
const ObjectId = require('mongoose').Types.ObjectId;
const authenticate = require('../../../utils/authenticate')

const Kit = require('../../../entities/kits/kit')
const KitProject = require('../../../entities/kits/project')
const generateIdeas = require('../../../utils/generateIdeas')

module.exports = async function (req, res) {
    let errors = []
    let project = null

    try {
        let exists = await KitProject.findOne({ id: req.body.id })
        let user = await authenticate(req.headers)

        if (exists) {
            project = await updateProject(exists, req.body, user)
        } else {
            project = await createProject(req.body)
        }

        if (!project) throw 'error'

        await project
            .populate({ path: 'ideas', populate: [{ path: 'original' }] })
            .populate('kit')
            .execPopulate()
    } catch (err) {
        console.log(err)
        errors.push({ code: err.code, message: err.errmsg })
    }
    
    res.send({
        project,
        status: errors.length > 0 ? 0 : 1,
        errors
    })
}

async function updateProject (exists, { title, anonymous = false, theme, ideas, template = false, premium = false }, user) {
    if (exists.user && !exists.user.equals(user._id)) return false

    ideas = await generateIdeas(exists.ideas, ideas)

    if (!exists.premium && premium && user.premiumProjects > 0) {
        user.update({ $inc: { premiumProjects: -1 } }).exec()
        premium = true
    } else if (exists.premium) {
        premium = true
    } else {
        premium = false
    }

    return await KitProject.findByIdAndUpdate(exists._id, {
        modifiedDate: new Date(),
        title, anonymous, theme, ideas, template, premium
    }, { new: true })
}

async function createProject ({ title, anonymous = false, theme, ideas, kit, user, template = false }) {
    try {
        let values = {
            id: shortid.generate(),
            title, anonymous, theme, template
        }

        ideas = ideas ? await generateIdeas([], ideas) : []
        kit = await Kit.findById(kit)
        
        if (!kit) throw 'non-existing-kit'

        values.kit = kit._id
        values.ideas = ideas

        if (ObjectId.isValid(user)) {
            values.user = user
        } else {
            values.userAnonymous = user
        }

        return await KitProject.create(values)
    } catch (e) {
        console.error(e)
        return false
    }
}

async function canUnlock () {

}