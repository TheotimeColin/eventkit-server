const authenticate = require('../../utils/authenticate')
const Article = require('../../entities/article')

module.exports = async function (req, res) {
    let user = await authenticate(req.headers)

    let errors = []
    let articles = []

    let search = {}
    let select = {}

    if (req.query.slug) search.slug = req.query.slug
    if (req.query.id) search.id = req.query.id
    if (req.query.published == undefined || req.query.published == true || !user || !user.admin) search.published = true
    if (req.query.notes !== 'true') select.notes = 0

    try {
        articles = await Article.find(search)
            .select(select)
            .populate('category', '-articles')
            .populate({ path: 'linked', populate: { path: 'article', select: 'id published' }})
            .populate('cover')
            .populate('thumbnail')
            .populate({ path: 'reactions', populate: { path: 'type' }})
            .sort({ publishedDate: 'desc' })

        if (req.query.hitCount) {
            await Article.findOneAndUpdate(search, { $inc: { hitCount: 1 } })
        }
    } catch (err) {
        errors.push({ code: err.code, message: err.errmsg })
    }
    
    res.send({
        articles,
        status: errors.length > 0 ? 0 : 1,
        errors
    }) 
}