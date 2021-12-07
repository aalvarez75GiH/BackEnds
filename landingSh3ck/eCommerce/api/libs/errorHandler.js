const logger = require('../../utils/logger')
const mongoose = require('mongoose')

exports.processingErrors = (fn) => {
    return function(req, res, next) {
        fn(req, res, next).catch(next)
    }
}

exports.processingDBErrors = (error, req, res, next) => {
    if (error instanceof mongoose.Error || error.name === 'MongoError'){
        logger.error('An error related with MongoDB has occurred')
        error.message = 'An error related with Mongo DB occurred unexpectedly. For more info contact to ecommerce technical support team'
        error.status = 500
    }
    next(error)
}

exports.processingBodySizeErrors = (error, req,res,next) => {
    if (error.status === 413){
        logger.error(`Request sent to route [${req.path}] has exceeded limit size. Request wont be processed`)
        error.message = `Request sent to route [${req.path}] has exceeded limit size. Request wont be processed`
    }
    next(error)
}

exports.productionErrors = (error, req, res, next) => {
 res.status(error.status || 500)
 res.send({
     message: error.message
 })
}

exports.developmentErrors = (error, req, res, next) => {
    res.status(error.status || 500)
    res.send({
        message: error.message, 
        stack: error.stack || ''
    }) 
}




