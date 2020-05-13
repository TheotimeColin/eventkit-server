const authenticate = require('../../utils/authenticate')
const ImageFile = require('../../entities/image-file')

module.exports = async function (req, res) {
    let user = await authenticate(req.headers)
    if (!user || !user.admin) {
        res.sendStatus(403)
        return
    }
    
    let errors = []
    let files = []

    files = await ImageFile.find().populate('sizes')
    
    res.send({
        files,
        status: errors.length > 0 ? 0 : 1,
        errors
    }) 
}