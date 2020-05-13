const authenticate = require('../../../utils/authenticate')
const ArticleCategory = require('../../../entities/article-category')
const Article = require('../../../entities/article')

module.exports = async function (req, res) {
    let user = await authenticate(req.headers)
    if (!user || !user.admin) {
        res.sendStatus(403)
        return
    }
    
    let errors = []

    try {
        let category = await ArticleCategory.findOne({ id: req.body.id })

        category.articles.forEach(async article => {
            await Article.findByIdAndUpdate(article, { category: null })
        })

        await category.remove()
    } catch (err) {
        console.log(err)
        errors.push({ code: err.code, message: err.errmsg })
    }

    res.send({
        status: errors.length > 0 ? 0 : 1,
        errors
    }) 
}