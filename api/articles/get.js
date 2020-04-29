const mongoose = require('mongoose')
const Article = require('../../entities/article')

module.exports = async function (req, res) {
    let errors = []
    let articles = []
    
    try {
        articles = await Article.find({ ...req.query })
    } catch (err) {
        errors.push({ code: err.code, message: err.errmsg })
    }

    res.send({
        articles,
        status: errors.length > 0 ? 0 : 1,
        errors
    }) 
}