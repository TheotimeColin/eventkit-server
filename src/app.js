require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const MongoClient = require('mongodb').MongoClient
const mongoose = require('mongoose')
const multer  = require('multer');
const AWS = require('aws-sdk')
const nodemailer = require('nodemailer')
const AutoIncrementFactory = require('mongoose-sequence');

const articlesGet = require('../api/articles/get')
const articlesPost = require('../api/articles/post')
const articlesDelete = require('../api/articles/delete')
const articleCategoriesPost = require('../api/articles/categories/post')
const articleCategoriesGet = require('../api/articles/categories/get')
const articleCategoriesDelete = require('../api/articles/categories/delete')
const articlesReactionGet = require('../api/articles/reaction/get')

const filesGet = require('../api/files/get')
const filesPost = require('../api/files/post')
const filesDelete = require('../api/files/delete')

const reactionsGet = require('../api/reactions/get')
const reactionsPost = require('../api/reactions/post')
const reactionsDelete = require('../api/reactions/delete')

const userPost = require('../api/user/post')
const userGet = require('../api/user/get')
const userDelete = require('../api/user/delete')
const userLogout = require('../api/user/logout')
const userResetGet = require('../api/user/reset/get')
const userResetPost = require('../api/user/reset/post')

const kitsGet = require('../api/kits/get')
const kitsPost = require('../api/kits/post')

const kitsProjectsPost = require('../api/kits/projects/post')
const kitsProjectsGet = require('../api/kits/projects/get')
const kitsProjectsDelete = require('../api/kits/projects/delete')

const ideasGet = require('../api/kits/ideas/get')
const ideasPost = require('../api/kits/ideas/post')
const ideasTagsGet = require('../api/kits/ideas/tags/get')
const ideasTagsPost = require('../api/kits/ideas/tags/post')

const premiumGet = require('../api/premium/get')
const premiumPost = require('../api/premium/post')
const premiumPortal = require('../api/premium/portal')

const app = express()

app.use(morgan('combined'))
app.use(bodyParser.json({ limit: '10mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))
app.use(cors())

mongoose.connect(process.env.MONGO)

const s3 = new AWS.S3({
    accessKeyId: process.env.S3_ID,
    secretAccessKey: process.env.S3_SECRET
})

const storage = multer.diskStorage({
    destination : 'uploads/',
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
})

const upload = multer({ storage: storage })

app.locals.s3 = s3
app.locals.increment = AutoIncrementFactory(mongoose.connection)
app.locals.mailer = nodemailer.createTransport({
    host: 'pro2.mail.ovh.net',
    port: '587',
    secure: false,
    auth: {
        user: 'theotime@eventkit.social',
        pass: 'GibLorMin111%'
    }
})

mongoose.connection.on('error', console.error.bind(console, 'connection error:'))

mongoose.connection.once('open', () => {
    app.get('/articles', articlesGet)
    app.post('/articles', articlesPost)
    app.delete('/articles', articlesDelete)
        app.post('/articles/categories', articleCategoriesPost)
        app.get('/articles/categories', articleCategoriesGet)
        app.delete('/articles/categories', articleCategoriesDelete)

        app.get('/articles/reaction', articlesReactionGet)

    app.post('/user', userPost)
    app.get('/user', userGet)
    app.delete('/user', userDelete)
    app.post('/logout', userLogout)
        app.get('/user/reset', userResetGet)
        app.post('/user/reset', userResetPost)

    app.post('/files', upload.array('files', 5), filesPost)
    app.get('/files', filesGet)
    app.delete('/files', filesDelete)

    app.post('/reactions', reactionsPost)
    app.get('/reactions', reactionsGet)
    app.delete('/reactions', reactionsDelete)

    app.get('/kits', kitsGet)
    app.post('/kits', kitsPost)
        app.post('/kits/projects', upload.single('zip'), kitsProjectsPost)
        app.get('/kits/projects', kitsProjectsGet)
        app.delete('/kits/projects', kitsProjectsDelete)
        app.get('/kits/ideas', ideasGet)
        app.post('/kits/ideas', ideasPost)
            app.get('/kits/ideas/tags', ideasTagsGet)
            app.post('/kits/ideas/tags', ideasTagsPost)

    app.post('/premium', premiumPost)
    app.get('/premium', premiumGet)
        app.post('/premium/portal', premiumPortal)

})

app.listen(process.env.PORT || 8081)