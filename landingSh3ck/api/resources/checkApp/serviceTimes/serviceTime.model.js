const mongoose = require('mongoose')
const Schema = mongoose.Schema

const serviceTime = mongoose.model('service time', new Schema({
    caption: {
        type: String,
        min: 1,
        max: 10,
        required: [true, 'Service Time must be entered']
    },
    description: {
        type: String,
        min: 1,
        max: 20,
        required: [true, 'Description must provided']
    }
}))

module.exports = serviceTime