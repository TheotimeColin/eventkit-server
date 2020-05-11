const mongoose = require('mongoose')
const Kit = require('../../entities/kits/kit')

module.exports = async function (req, res) {
    let errors = []
    let kits = []

    let search = {}

    if (req.query.slug) search.slug = req.query.slug
    if (req.query._id) search._id = req.query._id
    if (req.query.published == undefined || req.query.published == true) search.published = true
    console.log(search)
    try {
        kits = await Kit.find(search)
            .populate('cover')
            .populate('thumbnail')
            .sort({ publishedDate: 'desc' })
    } catch (err) {
        errors.push({ code: err.code, message: err.errmsg })
    }
    
    res.send({
        kits,
        status: errors.length > 0 ? 0 : 1,
        errors
    }) 
}