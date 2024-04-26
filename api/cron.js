require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const Note = require('../models/note')

app.delete('/api/cron', (request, response, next) => {
    Note.deleteMany()
    .then(result => {
        response.status(204).end()
    })
    .catch(error => next(error))
})