const Joi = require('@hapi/joi')
const logger = require('../../../utils/logger')

const bluePrintUsers = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().min(6).max(30).required(),
    email: Joi.string().email().required()
})

const validateUsers = ( req, res, next ) => { 
    const result = bluePrintUsers.validate( req.body, { abortEarly:false, convert: false })
    // console.log(result)
    if (result.error === undefined){
        next()
    }else {
        const validationErrors = result.error.details.reduce((accumulator, error)=>{
            return accumulator + `[${error.message}]`
        }, "")
        logger.warn(`Credentials did not passed validation process ${validationErrors}` )
        res.status(400).send(`Errors on your request: ${validationErrors}`)
    }
}

const bluePrintLoginRequest = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
})

const validateLoginRequest = (req, res, next) => {
    const result = bluePrintLoginRequest.validate(req.body, {abortEarly:false, convert: false})
    if (result.error === undefined) {
        next()
    } else {
        
        const validationErrors = result.error.details.reduce((accumulator, error)=>{
            return accumulator + `[${error.message}]`
        }, "")
        logger.warn(`Login process failed with errors:  ${validationErrors}` )
        res.status(400).send(`Login failed, you must be sure that username and/or password are strings:`)
    }
}

module.exports = {
    validateUsers,
    validateLoginRequest
}

