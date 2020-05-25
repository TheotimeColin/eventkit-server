const authenticate = require('../../utils/authenticate')
const Kit = require('../../entities/kits/kit')

module.exports = async function (req, res) {
    let user = await authenticate(req.headers)

    let errors = []
    let kits = []

    let search = {}

    if (req.query.slug) search.slug = req.query.slug
    if (req.query._id) search._id = req.query._id
    if (req.query.published == undefined || req.query.published == true || !user || !user.admin) search.published = true
    
    try {
        kits = await Kit.find(search)
            .populate('cover')
            .populate('thumbnail')
            .populate('variants')
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