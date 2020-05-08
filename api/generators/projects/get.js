const mongoose = require('mongoose')
const GeneratorProject = require('../../../entities/generator/project')

module.exports = async function (req, res) {
    let errors = []
    let project = null

    try {
        project = await GeneratorProject.findOne({ id: req.query.id })
    } catch (err) {
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