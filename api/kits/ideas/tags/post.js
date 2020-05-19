const authenticate = require('../../../../utils/authenticate')
const IdeaTag = require('../../../../entities/packs/idea-tag')

module.exports = async function (req, res) {
    let user = await authenticate(req.headers)
    if (!user || !user.admin) {
        res.sendStatus(403)
        return
    }
    
    let errors = []
    let tag = null

    try {
        tag = await IdeaTag.create(req.body)
    } catch (err) {
        console.log(err)
        errors.push(err)
    }

    res.send({
        tag,
        status: errors.length > 0 ? 0 : 1,
        errors
    }) 
}