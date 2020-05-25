const mime = require('mime')
const fs = require('fs')

const uploadFile = function ({ app, file, name }) {
    return new Promise(async resolve => {
        const src = await new Promise(resolve => {
            app.locals.s3.putObject({
                Bucket: process.env.S3_BUCKET, Key: name, Body: fs.createReadStream(file.path)
            }, (err, data) => {
                console.warn(err)
                resolve(err ? false : true)
            })
        })

        fs.unlink(file.path, () => {})
        resolve(src)
    })
}

const replaceFile = function ({ app, file, name, old }) {
    return new Promise(async resolve => {
        if (old) {
            await new Promise(resolve => {
                app.locals.s3.deleteObject({
                    Bucket: process.env.S3_BUCKET, Key: old
                }, (err) => {
                    console.warn(err)
                    resolve(true)
                })
            })
        }

        let response = await uploadFile({ app, file, name })
        resolve(response)
    })
}

module.exports = {
    uploadFile,
    replaceFile
}