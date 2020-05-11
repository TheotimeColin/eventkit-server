require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const MongoClient = require('mongodb').MongoClient
const mongoose = require('mongoose')
const multer  = require('multer');
const AWS = require('aws-sdk')
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
const userLogout = require('../api/user/logout')

const kitsGet = require('../api/kits/get')
const kitsPost = require('../api/kits/post')

const kitsProjectsPost = require('../api/kits/projects/post')
const kitsProjectsGet = require('../api/kits/projects/get')

const packsGet = require('../api/kits/packs/get')
const packsPost = require('../api/kits/packs/post')

const premiumPost = require('../api/premium/post')
const premiumPortal = require('../api/premium/portal')

const app = express()

app.use(morgan('combined'))
app.use(bodyParser.json())
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
    app.post('/logout', userLogout)

    app.post('/files', upload.array('files', 5), filesPost)
    app.get('/files', filesGet)
    app.delete('/files', filesDelete)

    app.post('/reactions', reactionsPost)
    app.get('/reactions', reactionsGet)
    app.delete('/reactions', reactionsDelete)

    app.get('/kits', kitsGet)
    app.post('/kits', kitsPost)
        app.post('/kits/projects', kitsProjectsPost)
        app.get('/kits/projects', kitsProjectsGet)
        app.get('/kits/packs', packsGet)
        app.post('/kits/packs', packsPost)

    app.post('/premium', premiumPost)
        app.post('/premium/portal', premiumPortal)

})

app.listen(process.env.PORT || 8081)