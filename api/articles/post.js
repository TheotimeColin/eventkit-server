const slugify = require('slugify')
const Article = require('../../entities/article')
const ArticleCategory = require('../../entities/article-category')


module.exports = async function (req, res) {
    let errors = []
    let article = null
    let category = await ArticleCategory.findById(req.body.category._id)

    const id = req.body.id
    delete req.body.id

    try {
        let exists = await Article.findOne({ id })
        if (exists) {
            article = await Article.findOneAndUpdate({ id }, {
                ...req.body,
                category: category._id,
                slug: slugify(req.body.title, { lower: true, strict: true }),
                modifiedDate: new Date()
            }).exec()
        } else {
            article = await Article.create({
                ...req.body,
                category: category._id,
                slug: slugify(req.body.title, { lower: true, strict: true })
            })
        }
    } catch (err) {
        console.warn(err)
        errors.push({ code: err.code, message: err.errmsg })
    }

    article = await Article.findOne({ id }).populate('category')
    category.articles.push(article._id)
    await category.save()
    
    // category = await category.updatecategory.articles.push(article._id).save()
    
    res.send({
        article,
        status: errors.length > 0 ? 0 : 1,
        errors
    })
}