const Joi = require('@hapi/joi')
const logger = require('../../../utils/logger')

const bluePrintUsers = Joi.object({
    fullName: Joi.string().min(3).max(100).required(),
    password: Joi.string().min(6).max(200).required(),
    email: Joi.string().email().required(),
    phoneNumber: Joi.string().length(11).pattern(/^[0-9]+$/).required()
})

const validateUsers = ( req, res, next ) => {
    const result = bluePrintUsers.validate(req.body, {abortEarly: false, convert: false})
    if (result.error === undefined){
        next()
    }else{
        const validationErrors = result.error.details.reduce((accumulator, error)=> {
            return accumulator + `[${error.message}]`
        },"")
        logger.warn(`Information sent by user is not complete ${validationErrors}`)
        res.status(400).send(`Errors at the request: ${validationErrors}`)
    }
}

const bluePrintLoginRequest = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
}) 

const validateLoginRequest = ( req, res, next ) => {
    const result = bluePrintLoginRequest.validate(req.body, {abortEarly:false, convert: false})
    if (result.error === undefined){
        next()
    }else {
        const validationErrors = result.error.details.reduce((accumulator, error)=> {
            return accumulator + `[${error.message}]`
        },"")
        logger.warn(`Creadentials sent by user is not complete ${validationErrors}`)
        res.status(400).send(`Errors at the request: ${validationErrors}`)
    }

}

module.exports = {
    validateUsers,
    validateLoginRequest
}