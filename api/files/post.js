const mongoose = require('mongoose')
const fs = require('fs')
const Article = require('../../entities/article')

module.exports = async function (req, res) {
    let errors = []
    
    let files = await Promise.all(req.files.map(file => {
        return new Promise(resolve => {
            let uploaded = uploadFile(req.app, file.path, req.body.prefix + file.filename)
            resolve(uploaded)
        })
    }))

    console.log(files)

    res.send({
        files: files,
        status: errors.length > 0 ? 0 : 1,
        errors
    }) 
}

function uploadFile (app, path, name) {
    return new Promise(resolve => {
        fs.readFile(path, (err, filedata) => {

            app.locals.s3.putObject({ Bucket: process.env.S3_BUCKET, Key: name, Body: filedata }, (err, data) => {
                resolve(data)
            })
        })
    })
}