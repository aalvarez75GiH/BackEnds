const mongoose = require('mongoose')

const Schema = mongoose.Schema

const user = mongoose.model('user', new Schema({
    username: {
        type: String,
        min: 3, 
        max: 30,
        required: [true, 'User must enter a username']
    },
    email: {
        type: String,
        min: 1,
        required: [true, ' User must enter an email address'] 
    },
    password: {
        type: String,
        min: 6,
        max: 200,
        required: [true, 'User must enter a password']
    }

}))

module.exports = user