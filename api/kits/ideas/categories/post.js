const IdeaCategory = require('../../../../entities/packs/idea-category')

module.exports = async function (req, res) {    
    let errors = []
    let category = null

    try {
        category = await IdeaCategory.create({
            label: req.body.label,
            theme: req.body.theme
        })
    } catch (err) {
        console.log(err)
        errors.push(err)
    }

    res.send({
        category,
        status: errors.length > 0 ? 0 : 1,
        errors
    }) 
}