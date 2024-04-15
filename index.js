require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const Note = require('./models/note')


const requestLogger = (request, response, next) => {
    console.log('Method: ', request.method)
    console.log('Path:   ', request.path)
    console.log('Body:   ', request.body)
    console.log('---')
    next()
}


app.use(express.static('build'))
app.use(express.json())
app.use(requestLogger)
app.use(cors())

/*
let notes = [
    {
        id: 1,
        content: "Briseida esta bien hermosa",
        important: true
    },
    {
        id: 2,
        content: "Me gusta la programación",
        important: true
    },
    {
        id: 3,
        content: "Soy SIMP",
        important: false
    }
]*/

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
    Note.find({}).then(notes => {
        response.json(notes)
    })
})

app.get('/api/notes/:id', (request, response, next) => {
    Note.findById(request.params.id)
    .then(note => {
        if(note) {
            response.json(note)
        } else {
            response.status(500).end()
        }
    })
    .catch(error => next(error))
})

app.delete('/api/notes/:id', (request, response, next) => {
    Note.findByIdAndDelete(request.params.id)
    .then(result => {
        response.status(204).end()
    })
    .catch(error => next(error))
})

const genereteId = () => {
    const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id)) 
    : 0 
    return maxId + 1
}

app.post('/api/notes', (request, response) => {
    const body = request.body

    if(body.content === undefined) {
        return response.status(404).json({
            error: 'content missing'
        })
    }

    const note = new Note({
        content: body.content,
        important: body.important || false,
        date: new Date()
    })

    note.save().then(savedNote => {
        response.json(savedNote)
    })
})

app.put('/api/notes/:id', (request, response, next) => {
    const body = request.body

    const note = {
        content: body.content,
        important: body.important,
        date: body.date,
    }

    Note.findByIdAndUpdate(request.params.id, note, {new: true})
    .then(updatedNote => {
        response.json(updatedNote)
    })
    .catch(error => next(error))
})


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)



const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } 
  
    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})