const mongoose = require('mongoose');


if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://user:${password}}@cluster0.yklvp.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false);
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
});

const Person = mongoose.model('Person', personSchema);


const person = new Person({
    name: 'Victor',
    number: '12345'
})

person.save().then(result => {
    console.log('saved')
    mongoose.connection.close()
})

