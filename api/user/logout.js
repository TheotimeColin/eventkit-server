module.exports = async function (req, res) {
    let errors = []

    res.send({
        token: null,
        status: errors.length > 0 ? 0 : 1,
        errors
    })
}