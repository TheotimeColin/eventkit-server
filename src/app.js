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

const filesGet = require('../api/files/get')
const filesPost = require('../api/files/post')

const userPost = require('../api/user/post')
const userGet = require('../api/user/get')
const userLogout = require('../api/user/logout')

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

    app.post('/user', userPost)
    app.get('/user', userGet)
    app.post('/logout', userLogout)

    app.post('/files', upload.array('files', 5), filesPost)
    app.get('/files', filesGet)
})

app.listen(process.env.PORT || 8081)