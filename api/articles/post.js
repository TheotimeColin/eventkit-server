const slugify = require('slugify')
const Article = require('../../entities/article')
const ArticleCategory = require('../../entities/article-category')
const ArticleLink = require('../../entities/article-link')
const Reaction = require('../../entities/reaction')
const ReactionType = require('../../entities/reaction-type')

module.exports = async function (req, res) {
    let errors = []
    let article = null
    let newCategory = req.body.categoryId ? await ArticleCategory.findById(req.body.categoryId) : false

    const id = req.body.id
    delete req.body.id

    let linkedArticles = await Promise.all(req.body.linked.map(async link => {
        let article = await Article.findById(link.article._id)
        let created = await ArticleLink.create({
            article: article._id,
            boost: link.boost
        })

        return created._id
    }))

    try {
        let exists = await Article.findOne({ id }).populate({ path: 'reactions', populate: { path: 'type' }})

        if (exists) {
            if (exists.category && !exists.category._id.equals(req.body.categoryId)) {
                let oldCategory = await ArticleCategory.findById(exists.category._id)
                oldCategory.articles = oldCategory.articles.filter(article => !article._id.equals(exists._id))
                await oldCategory.save()

                newCategory.articles.unshift(exists._id)
                await newCategory.save()
            } else if (!exists.category) {
                newCategory.articles.unshift(exists._id)
                await newCategory.save()
            }

            await Promise.all(exists.linked.map(async link => {
                return await ArticleLink.findByIdAndDelete(link._id)
            }))

            let reactions = await Promise.all(req.body.reactions.map(async reaction => {
                let reactionExists = null

                exists.reactions.forEach(e => {
                    if (e.type._id.equals(reaction.type._id)) reactionExists = e
                })

                if (!reactionExists) {
                    reactionExists = await Reaction.create({
                        type: reaction.type._id,
                        article: exists._id
                    })
                }

                return reactionExists._id
            }))

            article = await Article.findOneAndUpdate({ id }, {
                ...req.body,
                category: newCategory._id,
                slug: slugify(req.body.title, { lower: true, strict: true }),
                linked: linkedArticles,
                reactions: reactions,
                modifiedDate: new Date()
            }).exec()

            article = await Article.findOne({ id })
                .populate('category')
                .populate('cover')
                .populate('thumbnail')
                .populate('reactions')
        } else {
            article = await Article.create({
                ...req.body,
                linked: linkedArticles,
                category: newCategory._id,
                slug: slugify(req.body.title, { lower: true, strict: true })
            })
            
            if (newCategory) {
                newCategory.articles.unshift(article._id)
                await newCategory.save()
            }

            article = await Article.findById(article._id)
                .populate('category')
                .populate('cover')
                .populate('thumbnail')
                .populate('reactions')
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