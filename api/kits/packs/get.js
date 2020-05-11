const mongoose = require('mongoose')
const Pack = require('../../../entities/packs/pack')

module.exports = async function (req, res) {
    let errors = []
    let packs = []

    try {
        packs = await Pack.find().populate('ideas')
    } catch (err) {
        console.log(err)
        errors.push({ code: err.code, message: err.errmsg })
    }

    res.send({
        packs,
        status: errors.length > 0 ? 0 : 1,
        errors
    }) 
}