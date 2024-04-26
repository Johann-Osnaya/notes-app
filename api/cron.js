require('dotenv').config()
const express = require('express')
const app = express()
const Note = require('../models/note')


app.use(express.static('public'))
app.use(express.json())
app.use(cors())



app.get('/api/cron', (request, response, next) => {
    Note.deleteMany({})
    .then(result => {
        response.status(204).end()
    })
    .catch(error => next(error))
})