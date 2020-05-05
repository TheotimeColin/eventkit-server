const shortid = require('shortid')
const GeneratorProject = require('../../../entities/generator-project')

module.exports = async function (req, res) {
    let errors = []
    let project = null

    const id = req.body.id
    delete req.body.id

    try {
        let exists = await GeneratorProject.findOne({ id })

        if (exists) {
            project = await GeneratorProject.findOneAndUpdate({ id }, {
                values: req.body.values,
                modifiedDate: new Date()
            }, { new: true })
        } else {
            project = await GeneratorProject.create({
                ...req.body,
                id: shortid.generate()
            })
        }

        if (!project) throw new Error()
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