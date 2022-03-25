const mongoose = require('mongoose')
const Schema = mongoose.Schema
// let ObjectId = Schema.Types.ObjectId

const checker = mongoose.model('checker', new Schema({
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
    identification: {
        type: String,
        min: 3,
        max: 10,
        required: [true, 'Please enter an identification number']
    },
    address: {
        type: String,
        min: 3,
        max: 300,
        required: [true, 'Please enter a physical address']
    },
    picture: {
        type: String
    },
    backgroundCheck: {
        type: Boolean,
        required: [true, 'Please enter if checkbackground was confirmed']
    },
    city_name:{
        type: String,
        required: [true, 'Please enter City name where checker will work']
    },
    cityToCheck:{
        type: String,
        required: [true, 'Please enter _id of City where checker will work']
    },
    category_name: {
        type: String,
        required: [true, 'Please enter category name hecker will check']
    },
    categoryToCheck:{
        type: String,
        required: [true, 'Please enter _id of checker preferred Category to work with']
    },
    serviceTime: {
        type: String,
        required: [true, 'Please enter _id of checker preferred Service Time to work']
    },
    rating:{
        type: Number,
        max: 5,
        required: [true, 'Please enter checker rating']

    },
    pin: {
        type: String,
        min: 4,
        max: 4,
        required: [true, 'Please enter a PIN number']
    },
    role: {
        type: String,
        required: [true, 'Please enter a role']
    }    
}))

module.exports = checker


