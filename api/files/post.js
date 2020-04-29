const shortid = require('shortid')
const sharp = require('sharp')
const fs = require('fs')
const mime = require('mime')
const ImageFile = require('../../entities/image-file')

module.exports = async function (req, res) {
    let errors = []

    let files = await Promise.all(req.files.map(file => {
        return new Promise(async resolve => {
            
            let uploaded = await uploadFile(req.app, file, req.body.folder)
            await ImageFile.create(uploaded)

            fs.unlink(file.path, () => {
                resolve(uploaded)
            })
        })
    }))

    res.send({
        files: files,
        status: errors.length > 0 ? 0 : 1,
        errors
    }) 
}

async function uploadFile (app, file, folder) {
    let id = shortid.generate()
    let sizes = [
        { id: 's', name: 'Petit (400px)', width: 400 },
        { id: 'm', name: 'Moyen (800px)', width: 800 }
    ]

    let createdSizes = await Promise.all(sizes.map(size => {
        return new Promise(async resolve => {
            let buffer = await sharp(file.path).resize(size.width).toBuffer()
            let name = `${folder}/${id}/${id}-${size.id}.${mime.getExtension(file.mimetype)}`

            app.locals.s3.putObject({
                Bucket: process.env.S3_BUCKET,
                Key: name,
                Body: buffer
            }, (err, data) => {
                resolve({
                    size: size.id,
                    name: size.name,
                    src: `https://${process.env.S3_BUCKET}.s3.eu-west-3.amazonaws.com/${name}`
                })
            })
        })
    }))

    return {
        id: id,
        sizes: createdSizes
    }
}