const authenticate = require('../../../utils/authenticate')
const slugify = require('slugify')
const ArticleCategory = require('../../../entities/article-category')

module.exports = async function (req, res) {
    let user = await authenticate(req.headers)
    if (!user || !user.admin) {
        res.sendStatus(403)
        return
    }

    let errors = []
    let category = null

    const id = req.body.id
    delete req.body.id

    try {
        let exists = await ArticleCategory.findOne({ id })

        if (exists) {
            category = await ArticleCategory.findOneAndUpdate({ id }, {
                ...req.body,
                slug: slugify(req.body.title, { lower: true, strict: true })
            })
        } else {
            category = await ArticleCategory.create({
                ...req.body,
                slug: slugify(req.body.title, { lower: true, strict: true })
            })
        }

        if (!category) throw new Error()
    } catch (err) {
        errors.push({ code: err.code, message: err.errmsg })
    }

    res.send({
        category,
        status: errors.length > 0 ? 0 : 1,
        errors
    }) 
}