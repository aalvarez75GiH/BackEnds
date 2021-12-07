const logger = require('../../utils/logger')
const mongoose = require('mongoose')

exports.processingErrors = (fn) => {
    return function(req, res, next) {
        fn(req, res, next).catch(next)
    }
}

exports.processingDBErrors = (error,req, res, next) => {
    console.log('passing for processingDBErrors...')
    if (error instanceof mongoose.Error || error.name === 'MongoError'){
        console.log('its a Mongo Error')
        logger.error('An error related with MongoDB has occurred')
        err.message = 'Ha ocurrido un error inésperado. Para más información contacte al equipo de soporte de Sh3ck'
        error.status = 500
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
    console.log('its a development Error')
    console.log(req.body)
    res.status(error.status || 500)
    res.send({
        message: error.message, 
        stack: error.stack || ''
    }) 
}
