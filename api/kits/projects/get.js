const authenticate = require('../../../utils/authenticate')
const KitProject = require('../../../entities/kits/project')

module.exports = async function (req, res) {
    let user = await authenticate(req.headers)
    
    let errors = []
    let projects = []
    let search = {}

    try {
        if (req.query.template) {
            search.template = true
            if (req.query.kit) search.kit = req.query.kit
        }
        
        if (user && !req.query.template) search.user = user._id
        if (!req.query.template) search.temporary = false

        if (req.query.id) {
            search.id = req.query.id

            if (user) {
                search.user = user._id
                delete search.temporary
            } else {
                search.temporary = true
            }
        }
        
        projects = await KitProject.find(search)
            .populate('kit')
            .populate({ path: 'ideas', populate: [{ path: 'original' }] })
            .sort({ modifiedDate: 'desc' })

        projects.forEach(project => {
            if (project.mainZippedFile) {
                project.mainZippedFile = `https://${process.env.S3_BUCKET}.s3.eu-west-3.amazonaws.com/${project.mainZippedFile}`
            }
        })
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