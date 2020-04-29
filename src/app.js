require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const MongoClient = require('mongodb').MongoClient
const mongoose = require('mongoose')
const multer  = require('multer');
const AWS = require('aws-sdk')

const articlesGet = require('../api/articles/get')
const articlesPost = require('../api/articles/post')

const filesGet = require('../api/files/get')
const filesPost = require('../api/files/post')

const app = express()

app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())

mongoose.connect('mongodb://localhost:27017')

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

mongoose.connection.on('error', console.error.bind(console, 'connection error:'))

mongoose.connection.once('open', () => {
    app.get('/articles', articlesGet)
    app.post('/articles', articlesPost)

    app.post('/files', upload.array('images', 5), filesPost)
    app.get('/files', filesGet)
})

app.listen(process.env.PORT || 8081)