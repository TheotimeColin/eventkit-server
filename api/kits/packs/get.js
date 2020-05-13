const Pack = require('../../../entities/packs/pack')

module.exports = async function (req, res) {
    let errors = []
    let packs = []
    let search = {}

    if (req.query.default) search.default = req.query.default
    if (req.query.kit) search.kits = [req.query.kit]

    try {
        packs = await Pack.find(search).populate('ideas')
    } catch (err) {
        console.log(err)
        errors.push({ code: err.code, message: err.errmsg })
    }

    res.send({
        packs,
        status: errors.length > 0 ? 0 : 1,
        errors
    }) 
}