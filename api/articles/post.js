const mongoose = require('mongoose')
const fs = require('fs')
const Article = require('../../entities/article')

module.exports = async function (req, res) {
    let errors = []
    let article = null

    const id = req.body.id
    delete req.body.id

    try {
        let exists = await Article.findOne({ id })

        if (exists) {
            article = await Article.findOneAndUpdate({ id }, {
                ...req.body
            })

            article = await Article.findOne({ id })
        } else {
            article = await Article.create({
                ...req.body
            })
        }


        if (!article) throw new Error()
    } catch (err) {
        errors.push({ code: err.code, message: err.errmsg })
    }

    res.send({
        article,
        status: errors.length > 0 ? 0 : 1,
        errors
    }) 
}