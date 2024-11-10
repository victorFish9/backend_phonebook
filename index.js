/* eslint-disable @stylistic/js/semi */
/* eslint-disable no-unused-vars */
/* eslint-disable @stylistic/js/quotes */
/* eslint-disable @stylistic/js/indent */
const express = require('express')
const morgan = require('morgan')
// const mongoose = require('mongoose');
const cors = require('cors')
const app = express()

const Person = require('./models/person')



app.use(cors())
app.use(express.json())
app.use(express.static('dist'))



morgan.token('body', (req) => {
    if (req.method === 'POST') {
        return JSON.stringify(req.body)
    }
    return ''
})

const logFormat = ':method :url :status :res[content-length] - :response-time ms :body'

app.use(morgan(logFormat))

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}

let persons = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    },
    {
        "id": "5",
        "name": "Victor Cherkasov",
        "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/info', (request, response) => {
    Person.find({}).then(persons => {
        const currentTime = new Date();
        const info = `<p>Phonebook has info for ${persons.length} people</p>
    <p>${currentTime}</p>`;
        response.send(info);
    }).catch(error => {
        response.status(500).send({ error: 'Internal server error' })
    })

})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id).then(person => {
        if (!person) {
            return response.status(404).json({ error: 'Person not found' })
        }
        response.json(person)
    })
        .catch(error => {
            next(error)
        })
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body
    console.log(body)



    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'Name or number is missing'
        })
    }


    if (persons.some(person => person.name === body.name)) {
        return response.status(400).json({
            error: 'Name must be unique'
        })
    }


    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save()
        .then(savedPerson => response.json(savedPerson))
        .catch(error => next(error));

})

app.use(express.json())

app.put('/api/persons/:id', (request, response, next) => {
    const { name, number } = request.body;

    const updatedPerson = { name, number };

    Person.findByIdAndUpdate(
        request.params.id,
        updatedPerson,
        { new: true, runValidators: true, context: 'query' }
    )
        .then(updatedPerson => {
            if (!updatedPerson) {
                return response.status(404).json({ error: 'Person not found' });
            }
            response.json(updatedPerson);
        })
        .catch(error => next(error));
});

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(person => {
            if (!person) {
                return response.status(404).json({ error: 'Person not found' });
            }
            response.status(204).end();
        })
        .catch(error => next(error));
});

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)



app.use(errorHandler)






const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
