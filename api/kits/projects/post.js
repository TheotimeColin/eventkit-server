const shortid = require('shortid')
const slugify = require('slugify')
const ObjectId = require('mongoose').Types.ObjectId;
const authenticate = require('../../../utils/authenticate')
const { replaceFile } = require('../../../utils/upload')

const Kit = require('../../../entities/kits/kit')
const KitProject = require('../../../entities/kits/project')
const generateCategories = require('../../../utils/generateIdeas')

module.exports = async function (req, res) {
    let errors = []
    let project = null

    try {
        let exists = await KitProject.findOne({ id: req.body.id })
        let user = await authenticate(req.headers)

        if (exists) {
            if (!user || exists.user && !exists.user.equals(user._id)) throw 'not-owner'

            project = await updateProject(exists, req.body, user, req.file, req.app)
        } else {
            project = await createProject(req.body, user)
        }

        if (!project) throw 'error'

        await project
            .populate('kit')
            .populate({ path: 'ideaCategories', populate: { path: 'ideas', populate: [{ path: 'original' }] } })
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

async function updateProject (exists, { title, description, theme, template = false, ideaCategories, templateTags = '' }, user, file = null, app) {
    if (exists.temporary || exists.premium && !user.plan) return false
    let values = {
        modifiedDate: new Date(),
        user: user._id,
        title, theme: JSON.parse(theme), description
    }

    if (user.admin) {
        values.template = template
        values.templateTags = templateTags
    }

    let categories = await generateCategories(exists.ideaCategories, JSON.parse(ideaCategories)) 
    values.ideaCategories = categories ? categories : []

    if (file) {
        let fileName = 'projects/' + slugify(title, { strict: true, lower: true }).slice(0, 20) + '-' + shortid.generate() + '.zip'

        let result = await replaceFile({
            app, file,
            name: fileName,
            old: exists.mainZippedFile ? exists.mainZippedFile : false
        })

        if (result) {
            values.mainZippedFile = fileName
            values.publishedDate = new Date()
        }
    }

    return await KitProject.findByIdAndUpdate(exists._id, values, { new: true })
}

async function createProject ({ title, theme, kit, ideaCategories, template = false }, user) {
    try {
        let values = {
            id: shortid.generate(),
            title,
            theme: JSON.parse(theme),
            template
        }

        let categories = ideaCategories ? await generateCategories([], JSON.parse(ideaCategories)) : false
        values.ideaCategories = categories ? categories : []
        
        kit = await Kit.findById(kit)
        
        if (!kit) throw 'non-existing-kit'

        values.kit = kit._id
        values.temporary = !user || !user.plan && user.projects >= 1

        if (user) values.user = user._id
        if (user && user.plan) values.premium = true

        return await KitProject.create(values)
    } catch (e) {
        console.error(e)
        return false
    }
}