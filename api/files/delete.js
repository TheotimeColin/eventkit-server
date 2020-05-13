const authenticate = require('../../utils/authenticate')
const ImageFile = require('../../entities/image-file')
const ImageSize = require('../../entities/image-size')

module.exports = async function (req, res) {
    let user = await authenticate(req.headers)
    if (!user || !user.admin) {
        res.sendStatus(403)
        return
    }

    let errors = []

    try {
        let file = await ImageFile.findById(req.body.id)

        await Promise.all(file.sizes.map(async doc => {
            let size = await ImageSize.findById(doc._id)

            req.app.locals.s3.deleteObject({
                Bucket: process.env.S3_BUCKET, Key: size.name
            }, (err) => {
                console.log(err)
            })

            await size.remove()

            return true
        }))

        await file.remove()
    } catch (err) {
        console.log(err)
        errors.push({ code: err.code, message: err.errmsg })
    }

    res.send({
        status: errors.length > 0 ? 0 : 1,
        errors
    }) 
}