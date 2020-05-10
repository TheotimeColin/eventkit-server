const shortid = require('shortid')
const GeneratorProject = require('../../../entities/generator/project')
const generateIdeas = require('../../../utils/generateIdeas')

module.exports = async function (req, res) {
    let errors = []
    let project = null

    try {
        let exists = await GeneratorProject.findOne({ id: req.body.id })

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
            .execPopulate()

    res.send({
        project,
        status: errors.length > 0 ? 0 : 1,
        errors
    })
}

async function updateProject (exists, { title, anonymous = false, theme, ideas }) {
    ideas = await generateIdeas(exists.ideas, ideas)

    return await GeneratorProject.findByIdAndUpdate(exists._id, {
        modifiedDate: new Date(),
        title, anonymous, theme, ideas
    }, { new: true })
}

async function createProject ({ title, anonymous = false, theme, ideas }) {
    ideas = ideas ? await generateIdeas([], ideas) : []

    return await GeneratorProject.create({
        id: shortid.generate(),
        title, anonymous, theme, ideas
    })
}