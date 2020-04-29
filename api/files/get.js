const mongoose = require('mongoose')

module.exports = async function (req, res) {
    let errors = []
    let files = []

    files = await new Promise(resolve => {
        req.app.locals.s3.listObjects({ Bucket: process.env.S3_BUCKET, Prefix: req.query.prefix }, (err, data) => {
            console.warn(err)
            resolve(data.Contents)
        })
    })
    
    files = files.map(file => ({
        key: file.Key,
        src: `https://${process.env.S3_BUCKET}.s3.eu-west-3.amazonaws.com/${file.Key}`
    }))

    res.send({
        files,
        status: errors.length > 0 ? 0 : 1,
        errors
    }) 
}