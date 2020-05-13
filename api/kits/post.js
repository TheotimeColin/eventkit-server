const authenticate = require('../../utils/authenticate')

const slugify = require('slugify')
const Kit = require('../../entities/kits/kit')

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
            
            kit = await exists.update({
                ...req.body,
                slug: slugify(req.body.title, { lower: true, strict: true }),
                modifiedDate: new Date()
            })
        } else {
            kit = await Kit.create({
                ...req.body,
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