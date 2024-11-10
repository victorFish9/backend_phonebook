const mongoose = require('mongoose')

require('dotenv').config();

mongoose.set('strictQuery', false)


const url = process.env.MONGODB_URI


const validatePhoneNumber = (number) => {
    const phoneRegex = /^\d{2,3}-\d{5,}$/
    return phoneRegex.test(number)
}

mongoose.connect(url)

    .then(result => {
        console.log('connected to MongoDB:)')
    })
    .catch(error => {
        console.log('error connecting to MongoDB:', error.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true,
    },
    number: {
        type: String,
        minLength: 8,
        required: true,
        validate: {
            validator: validatePhoneNumber,
            message: props => `${props.value} is not a valid phone number! It should be in the format 'xx-xxxxxxx' or 'xxx-xxxxxxx'.`
        }
    },
});




personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})


module.exports = mongoose.model('Person', personSchema)