const mongoose = require('mongoose')
const ImageFile = require('../../entities/image-file')

module.exports = async function (req, res) {
    let errors = []
    let files = []

    files = await ImageFile.find()
    
    res.send({
        files,
        status: errors.length > 0 ? 0 : 1,
        errors
    }) 
}