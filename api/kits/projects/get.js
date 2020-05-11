const mongoose = require('mongoose')
const KitProject = require('../../../entities/kits/project')

module.exports = async function (req, res) {
    let errors = []
    let projects = []

    try {
        projects = await KitProject.find({ ...req.query })
            .populate('kit')
            .populate({ path: 'ideas', populate: [{ path: 'pack' }, { path: 'original' }] })
            .sort({ modifiedDate: 'desc' })
    } catch (err) {
        console.error(err)
        errors.push({ code: err.code, message: err.errmsg })
    }

    res.send({
        projects,
        status: errors.length > 0 ? 0 : 1,
        errors
    }) 
}