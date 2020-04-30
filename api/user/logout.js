const mongoose = require('mongoose')
const User = require('../../entities/user')
const jwt = require('jsonwebtoken')

module.exports = async function (req, res) {
    let errors = []

    res.send({
        token: null,
        status: errors.length > 0 ? 0 : 1,
        errors
    })
}