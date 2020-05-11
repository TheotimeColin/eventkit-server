const shortid = require('shortid')
const ObjectId = require('mongoose').Types.ObjectId;

const Kit = require('../../../entities/kits/kit')
const KitProject = require('../../../entities/kits/project')
const generateIdeas = require('../../../utils/generateIdeas')

module.exports = async function (req, res) {
    let errors = []
    let project = null

    try {
        let exists = await KitProject.findOne({ id: req.body.id })

        if (exists) {
            project = await updateProject(exists, req.body)
        } else {
            project = await createProject(req.body)
        }

        if (!project) throw new Error()
    } catch (err) {
        console.log(err)
        errors.push({ code: err.code, message: err.errmsg })
    }

    await project
            .populate({ path: 'ideas', populate: [{ path: 'pack' }, { path: 'original' }] })
            .populate('kit')
            .execPopulate()

    res.send({
        project,
        status: errors.length > 0 ? 0 : 1,
        errors
    })
}

async function updateProject (exists, { title, anonymous = false, theme, ideas }) {
    ideas = await generateIdeas(exists.ideas, ideas)

    return await KitProject.findByIdAndUpdate(exists._id, {
        modifiedDate: new Date(),
        title, anonymous, theme, ideas
    }, { new: true })
}

async function createProject ({ title, anonymous = false, theme, ideas, kit, user }) {
    try {
        let values = {
            id: shortid.generate(),
            title, anonymous, theme
        }

        ideas = ideas ? await generateIdeas([], ideas) : []
        kit = await Kit.findOne({ slug: kit })

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