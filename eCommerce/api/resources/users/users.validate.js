const Joi = require('@hapi/joi')
const logger = require('../../../utils/logger')

const bluePrintUsers = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().min(6).max(200).required(),
    email: Joi.string().email().required()
})

module.exports = ( req, res, next ) => { 
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
