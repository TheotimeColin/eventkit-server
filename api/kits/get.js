const authenticate = require('../../utils/authenticate')
const Kit = require('../../entities/kits/kit')

module.exports = async function (req, res) {
    let user = await authenticate(req.headers)

    let errors = []
    let kits = []

    let search = { lang: 'fr' }

    if (req.query.slug) search.slug = req.query.slug
    if (req.query._id) search._id = req.query._id
    if (req.query.published == undefined || req.query.published == true || !user || !user.admin) search.published = true
    
    try {
        kits = await Kit.find(search)
            .populate('cover')
            .populate('thumbnail')
            .populate('variants')
            .populate({ path: 'translations', populate: { path: 'variants' } })
            .sort({ publishedDate: 'desc' })
    } catch (err) {
        errors.push({ code: err.code, message: err.errmsg })
    }

    const TRANSLATABLE = ['title', 'content', 'excerpt', 'subtitle', 'variants']

    if (req.query.lang ) {
        kits = kits.map(kit => {
            kit = kit.toObject()
            let translated = kit.translations.find(t => t.lang == req.query.lang)
            
            if (translated) {
                translated = Object.keys(translated).filter(key => TRANSLATABLE.includes(key)).reduce((obj, key) => {
                  obj[key] = translated[key]
                  return obj
                }, {})
            }

            return { ...kit, ...translated }
        })
    }
    
    res.send({
        kits,
        status: errors.length > 0 ? 0 : 1,
        errors
    }) 
}