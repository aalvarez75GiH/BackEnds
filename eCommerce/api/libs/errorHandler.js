const logger = require('../../utils/logger')
const mongoose = require('mongoose')

exports.processingErrors = (fn) => {
    return function(req, res, next) {
        fn(req, res, next).catch(next)
    }
}

exports.processingDBErrors = (req, res, next) => {
    if (err instanceof mongoose.Error || err.name === 'MongoError'){
        logger.error('An error related with MongoDB has occurred')
        err.message = 'An error related with Mongo DB occurred unexpectedly. For more info contact to ecommerce technical support team'
        err.status = 500
    }
    next(err)
}

exports.productionErrors = (err, req, res, next) => {
 res.status(err.status || 500)
 res.send({
     message: err.message
 })
}
exports.developmentErrors = (err, req, res, next) => {
    res.status(err.status || 500)
    res.send({
        message: err.message, 
        stack: err.stack || ''
    }) 
}

// module.exports = {
//     processingErrors
// }



