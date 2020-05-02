const slugify = require('slugify')
const Article = require('../../entities/article')
const ArticleCategory = require('../../entities/article-category')


module.exports = async function (req, res) {
    let errors = []
    let article = null
    let newCategory = await ArticleCategory.findById(req.body.categoryId)

    const id = req.body.id
    delete req.body.id

    try {
        let exists = await Article.findOne({ id })
        
        if (exists) {
            if (exists.category && exists.category._id != req.body.categoryId) {
                let oldCategory = await ArticleCategory.findById(exists.category._id)
                oldCategory.articles = oldCategory.articles.filter(article => !article._id.equals(exists._id))
                await oldCategory.save()

                newCategory.articles.unshift(exists._id)
                await newCategory.save()
            }

            article = await Article.findOneAndUpdate({ id }, {
                ...req.body,
                category: newCategory._id,
                slug: slugify(req.body.title, { lower: true, strict: true }),
                modifiedDate: new Date()
            }).exec()

            article = await Article.findOne({ id }).populate('category')
        } else {
            article = await Article.create({
                ...req.body,
                category: newCategory._id,
                slug: slugify(req.body.title, { lower: true, strict: true })
            })

            newCategory.articles.unshift(article._id)
            await newCategory.save()
        }
    } catch (err) {
        console.warn(err)
        errors.push({ code: err.code, message: err.errmsg })
    }

    res.send({
        article,
        status: errors.length > 0 ? 0 : 1,
        errors
    })
}