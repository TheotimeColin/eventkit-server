const authenticate = require('../../utils/authenticate')

const slugify = require('slugify')
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
        let variants = await getVariants(exists ? exists.variants : [], req.body.variants)

        if (exists) {
            kit = await exists.update({
                ...req.body,
                variants: variants,
                slug: slugify(req.body.title, { lower: true, strict: true }),
                modifiedDate: new Date()
            })
        } else {
            kit = await Kit.create({
                ...req.body,
                variants: variants,
                slug: slugify(req.body.title, { lower: true, strict: true })
            })
        }
    } catch (err) {
        console.warn(err)
        errors.push({ code: err.code, message: err.errmsg })
    }

    kit = await Kit.findById(kit._id)
        .populate('cover')
        .populate('thumbnail')

    res.send({
        kit,
        status: errors.length > 0 ? 0 : 1,
        errors
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