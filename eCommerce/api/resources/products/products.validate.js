const Joi = require('@hapi/joi')
const logger = require('../../../utils/logger')

const bluePrintProduct = Joi.object({
    title: Joi.string().max(100).required(),
    price: Joi.number().positive().precision(2).required(),
    currency: Joi.string().length(3).uppercase().required()
})

module.exports = ( req, res, next ) => { 
    const result = bluePrintProduct.validate( req.body, { abortEarly:false , convert: false})
    // console.log(result)
    if (result.error === undefined){
        next()
    }else {
        // console.log(result.error.details)
        const validationErrors = result.error.details.reduce((accumulator, error)=>{
            return accumulator + `[${error.message}]`
        }, "")
        logger.warn(`Product did not passed validation process`, req.body, validationErrors)
        res.status(400).send(`Errors on your request: ${validationErrors}`)
    }
}
