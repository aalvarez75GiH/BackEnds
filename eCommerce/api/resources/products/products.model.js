const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Product = mongoose.model('product', new Schema({
    title: {
        type: String,
        required: [true, ' Product must have a title']
    },
    price: {
        type: Number,
        min: 0,
        required: [true, ' Product must have a price']
    },
    currency: {
        type: String,
        maxlength: 3,
        minlength:3,
        required: [true, ' Product must have a currency']
    },
    owner: {
        type: String,
        required: [true, ' Product must be related to an owner']
    }
})) 

module.exports = Product


