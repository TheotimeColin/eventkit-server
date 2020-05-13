const authenticate = require('../../../utils/authenticate')
const Pack = require('../../../entities/packs/pack')
const generateIdeas = require('../../../utils/generateIdeas')

module.exports = async function (req, res) {
    let user = await authenticate(req.headers)
    if (!user || !user.admin) {
        res.sendStatus(403)
        return
    }
    
    let errors = []
    let pack = req.body._id ? await Pack.findById(req.body._id) : null

    try {
        if (pack) {
            let ideas = await generateIdeas(pack.ideas, req.body.ideas)

            pack.update({
                title: req.body.title,
                description: req.body.description,
                kits: req.body.kits,
                color1: req.body.color1,
                color2: req.body.color2,
                pattern: req.body.pattern,
                default: req.body.default,
                ideas: ideas
            }, { new: true }).exec()
        } else {
            pack = await Pack.create({
                title: req.body.title,
                description: req.body.description,
                kits: req.body.kits,
                color1: req.body.color1,
                color2: req.body.color2,
                pattern: req.body.pattern,
                default: req.body.default
            })
        }
    } catch (err) {
        console.log(err)
        errors.push({ code: err.code, message: err.errmsg })
    }

    await pack.populate('ideas').execPopulate()

    res.send({
        pack,
        status: errors.length > 0 ? 0 : 1,
        errors
    }) 
}