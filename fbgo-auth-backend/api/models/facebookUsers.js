const mongoose = require('mongoose')
const Schema = mongoose.Schema


const facebookUser = mongoose.model('facebookUser', new Schema({
    fullName: {
        type: String,
        min: 3,
        max: 100,
        required: [true, 'Failed name extraction from facebook']
    },
    fbID: {
        type: String,
        required:  [true, 'Failed ID extraction from facebook']
    } 
}))

module.exports = facebookUser