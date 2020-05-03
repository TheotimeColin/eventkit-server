const shortid = require('shortid')
const sharp = require('sharp')
const fs = require('fs')
const mime = require('mime')
const ImageFile = require('../../entities/image-file')
const ImageSize = require('../../entities/image-size')

module.exports = async function (req, res) {
    let errors = []

    const files = await Promise.all(Object.keys(req.body.file).map(async key => {
        try {
            let data = req.body.file[key]
            let file = req.files.filter(file => file.originalname == key)[0]
            let fileId = shortid.generate()

            const sizes = await Promise.all(Object.keys(data.sizes).map(async key => {
                let size = data.sizes[key]

                return await createSize(req.app, file, {
                    ...size,
                    id: fileId,
                    folder: req.body.folder,
                    name: data.name,
                    alt: data.alt
                })
            }))

            return await ImageFile.create({
                name: data.name,
                alt: data.alt,
                sizes: sizes
            })
        } catch (e) {
            console.log(e)
        }
    }))

    res.send({
        status: errors.length > 0 ? 0 : 1,
        errors
    }) 
}

const SIZE_CONFIG = {
    s: { id: 's', width: 400 },
    m: { id: 'm', width: 1000 },
}

async function createSize (app, file, { id, folder, type, name, alt }) {
    return new Promise(async resolve => {
        const config = SIZE_CONFIG[type]

        if (!config) return false

        let buffer = await sharp(file.path).resize(config.width).toBuffer()
        let metadata = await sharp(buffer).metadata()

        const fileDirectory = `${folder}/${id}/${name}-${config.id}.${mime.getExtension(file.mimetype)}`
        const src = await new Promise(resolve => {
            app.locals.s3.putObject({
                Bucket: process.env.S3_BUCKET, Key: fileDirectory, Body: buffer
            }, (err, data) => {
                resolve(`https://${process.env.S3_BUCKET}.s3.eu-west-3.amazonaws.com/${fileDirectory}`)
            })
        })

        let size = await ImageSize.create({
            type: type,
            width: metadata.width,
            height: metadata.height,
            name: fileDirectory,
            alt: alt,
            src: src
        })

        fs.unlink(file.path, () => {})
        resolve(size._id)
    })
}