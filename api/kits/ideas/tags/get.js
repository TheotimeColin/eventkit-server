const IdeaTag = require('../../../../entities/packs/idea-tag')

module.exports = async function (req, res) {
    let errors = []
    let tags = []
    let search = {}

    if (req.query.kit) search.kit = req.query.kit
    if (req.query.type) search.type = req.query.type
    
    try {
        tags = await IdeaTag.find(search)
    } catch (err) {
        console.log(err)
        errors.push(err)
    }

    res.send({
        tags,
        status: errors.length > 0 ? 0 : 1,
        errors
    }) 
}