const mongoose = require('mongoose')
const Article = require('../../entities/article')

module.exports = async function (req, res) {
    let errors = []
    let articles = []

    let search = {}

    if (req.query.slug) search.slug = req.query.slug
    if (req.query.id) search.id = req.query.id

    try {
        articles = await Article.find(search)
            .populate('category', '-articles')
            .populate({ path: 'linked', populate: { path: 'article', select: 'id' }})
            .populate('cover')
            .populate('thumbnail')
            .sort({ publishedDate: 'asc' })

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