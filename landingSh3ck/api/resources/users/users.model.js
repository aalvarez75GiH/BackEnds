const mongoose = require('mongoose')
const Schema = mongoose.Schema

const user = mongoose.model('user', new Schema({
    fullName: {
        type: String,
        min: 3,
        max: 100,
        required: [true, 'You must enter a Full Name']
    },
    email: {
        type: String,
        required: [true, 'You must enter an Email']
    },
    phoneNumber: {
        type: String,
        length: 11,
        match: /^[0-9]+$/,
        required: [true, 'You must enter a Phone Number']

    }, 
    // password: {
    //     type: String,
    //     min: 3,
    //     max: 200,
    //     required: [true, 'Please enter a Password']
    // },
    pin: {
        type: String,
        min: 4,
        max: 4,
        required: [true, 'Please enter a PIN number']
    }

}))

module.exports = user