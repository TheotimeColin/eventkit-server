const authenticate = require('../../../utils/authenticate')
const KitProject = require('../../../entities/kits/project')

module.exports = async function (req, res) {
    let user = await authenticate(req.headers)
    
    let errors = []
    let projects = []
    let search = {}

    try {
        if (!req.query.template && !req.query.userAnonymous && !user) throw 'not-authenticated'

        if (req.query.userAnonymous) search.userAnonymous = req.query.userAnonymous
        if (!req.query.id && !req.query.userAnonymous && !user || req.query.template) search.template = true
        if (req.query.id && req.query.userAnonymous || req.query.id && user) search.id = req.query.id
        if (req.query.id && user || user && !req.query.template) search.user = user._id

        projects = await KitProject.find(search)
            .populate('kit')
            .populate({ path: 'ideas', populate: [{ path: 'pack' }, { path: 'original' }] })
            .sort({ modifiedDate: 'desc' })
    } catch (err) {
        console.error(err)
        errors.push(err)
    }

    res.send({
        projects,
        status: errors.length > 0 ? 0 : 1,
        errors
    }) 
}