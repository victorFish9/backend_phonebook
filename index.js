const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.json())

morgan.token('body', (req) => {
    if (req.method === 'POST') {
        return JSON.stringify(req.body)
    }
    return '';
})

const logFormat = ':method :url :status :res[content-length] - :response-time ms :body'

app.use(morgan(logFormat))

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
    response.json(persons)
})

app.get('/info', (request, response) => {
    const currentTime = new Date();
    const info = `<p>Phonebook has info for ${persons.length} people</p>
    <p>${currentTime}</p>`;
    response.send(info);
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).send({ error: 'Person not found' })
    }
})

app.post('/api/persons', (request, response) => {
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


    const newPerson = {
        id: Math.floor(Math.random() * 1000000).toString(),
        name: body.name,
        number: body.number
    }


    persons = persons.concat(newPerson)


    response.status(201).json(newPerson)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)

    response.status(200).json({ message: 'Person deleted' })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
