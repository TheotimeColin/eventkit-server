const mongoose = require('mongoose')
const ArticleCategory = require('../../../entities/article-category')

module.exports = async function (req, res) {
    let errors = []
    let categories = []

    let search = {}

    if (req.query.title) search.title = req.query.title
    if (req.query.id) search.id = req.query.id

    try {
        categories = await ArticleCategory.find(search).populate('articles', 'id')
    } catch (err) {
        errors.push({ code: err.code, message: err.errmsg })
    }

    res.send({
        categories,
        status: errors.length > 0 ? 0 : 1,
        errors
    }) 
}