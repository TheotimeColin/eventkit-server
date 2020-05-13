const authenticate = require('../../utils/authenticate')
const Article = require('../../entities/article')

module.exports = async function (req, res) {
    let user = await authenticate(req.headers)
    if (!user || !user.admin) res.sendStatus(403)
    
    let errors = []

    try {
        await Article.findOneAndDelete({ id: req.body.id })
    } catch (err) {
        errors.push({ code: err.code, message: err.errmsg })
    }

    res.send({
        status: errors.length > 0 ? 0 : 1,
        errors
    }) 
}