const authenticate = require('../../utils/authenticate')

const slugify = require('slugify')
const shortId = require('shortid')
const Kit = require('../../entities/kits/kit')
const KitVariant = require('../../entities/kits/kit-variant')

module.exports = async function (req, res) {
    let user = await authenticate(req.headers)
    if (!user || !user.admin) {
        res.sendStatus(403)
        return
    }
    
    let errors = []
    let kit = null

    try {
        let exists = req.body._id ? await Kit.findById(req.body._id) : null

        if (exists) {
            kit = await updateKit(exists, { ...req.body })
        } else {
            kit = await createKit({ ...req.body })
        }
    } catch (err) {
        console.warn(err)
        errors.push({ code: err.code, message: err.errmsg })
    }

    kit = await Kit.findById(kit._id)
        .populate('cover')
        .populate('variants')
        .populate('thumbnail')
        .populate({ path: 'translations', populate: { path: 'variants' } })

    res.send({
        kit,
        status: errors.length > 0 ? 0 : 1,
        errors
    })
}

async function updateKit (exists, { title, subtitle, published, excerpt, content, complexity, material, time, theme, thumbnail, variants, translations }) {
    return new Promise(async resolve => {
        let query = {
            title, subtitle, excerpt, content, complexity, material, time, theme, thumbnail, published,
            modifiedDate: new Date(),
            variants: await getVariants(exists ? exists.variants : [], variants)
        }

        if (!exists.published && published) query.publishedDate = new Date()

        query.translations = await Promise.all(Object.keys(translations).map(async lang => {
            const TRANSLATABLE = ['title', 'content', 'excerpt', 'subtitle', 'variants']
            
            let values = Object.keys(translations[lang]).filter(key => TRANSLATABLE.includes(key)).reduce((obj, key) => {
                obj[key] = translations[lang][key]
                return obj
            }, {})

            let translation = await Kit.findById(translations[lang]._id)
            values.variants = await getVariants(translation.variants ? translation.variants : [], values.variants)

            if (translation) {
                await translation.update(values)
            } else {
                translation = await Kit.create({ ...values, lang })
            }

            return translation._id
        }))

        let result = await Kit.findByIdAndUpdate(exists._id, query)
        resolve(result)
    })
}

async function createKit ({ title, subtitle, excerpt, content, complexity, material, time, theme, thumbnail, variants, translations }) {
    return new Promise(async resolve => {
        let query = {
            title, slug: slugify(title, { lower: true, strict: true }),
            subtitle, excerpt, content, complexity, material, time, theme, thumbnail, variants
        }

        query.translations = await Promise.all(Object.keys(translations).map(async lang => {
            if (lang != 'fr') {
                let translation = await Kit.create({
                    ...translations[lang],
                    lang: lang,
                    slug: shortId.generate()
                })

                return translation._id
            } else {
                return false
            }
        }))

        query.translations = query.translations.filter(v => v)

        let result = await Kit.create(query)
        resolve(result)
    })
}

async function getVariants (original, variants) {
    try {
        let result = []
        original = original.map(id => ({
            _id: id,
            processed: false
        }))

        result = await Promise.all(variants.map(async variant => {
            let item = null

            if (variant._id) {
                item = await KitVariant.findByIdAndUpdate(variant._id, {
                    title: variant.title,
                    content: variant.content,
                    theme: variant.theme
                })

                original = original.map(v => ({...v, processed: v._id.equals(item._id) ? true : v.processed }))
            } else {
                item = await KitVariant.create({
                    title: variant.title,
                    content: variant.content,
                    theme: variant.theme
                })
            }

            return item._id
        }))

        await Promise.all(original.filter(v => !v.processed).map(async variant => {
            return await KitVariant.findByIdAndDelete(variant._id)
        }))
        
        return result
    } catch (e) {
        console.error(e)
        return []
    }
}