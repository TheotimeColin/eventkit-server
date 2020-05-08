const slugify = require('slugify')
const Pack = require('../../../entities/packs/pack')
const generateIdeas = require('../../../utils/generateIdeas')

module.exports = async function (req, res) {
    let errors = []
    let pack = req.body._id ? await Pack.findById(req.body._id) : null

    try {
        if (pack) {
            let ideas = await generateIdeas(pack.ideas, req.body.ideas)

            pack.update({
                title: req.body.title,
                description: req.body.description,
                color1: req.body.color1,
                color2: req.body.color2,
                ideas: ideas
            }, { new: true }).exec()
        } else {
            pack = await Pack.create({
                title: req.body.title,
                description: req.body.description,
                color1: req.body.color1,
                color2: req.body.color2
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