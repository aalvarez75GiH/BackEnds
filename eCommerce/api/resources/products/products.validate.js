const Joi = require('@hapi/joi')
const fileType = require('file-type')
const logger = require('../../../utils/logger')

const bluePrintProduct = Joi.object({
    title: Joi.string().max(100).required(),
    price: Joi.number().positive().precision(2).required(),
    currency: Joi.string().length(3).uppercase().required()
})

const CONTENT_TYPES_ALLOWED = [ 'image/jpeg', 'image/jpg', 'image/png' ]

const validatingProductImage = async(req, res, next) => {
    const contentType = req.get('Content-Type')
    if (!CONTENT_TYPES_ALLOWED.includes(contentType)){
        logger.warn(`Request to modify image of product with ID [${req.params.id}] DO NOT contain a valid content type [${contentType}]`)
        res.status(400).send(`File of type: ${contentType} is not supported. Please, use one
        of these types of images ${CONTENT_TYPES_ALLOWED.join(", ")}`)
        return
    }

    let fileInfo = fileType(req.body)
    console.log(fileInfo)    
    if(!CONTENT_TYPES_ALLOWED.includes(fileInfo.mime)){
        const message = `Disparity between content type [${contentType}] and type of file [${fileInfo.ext}]. Request won't be processed`
        logger.warn(`${message}. Request directed to product with ID [${req.params.id}]`)
        res.status(400).send(message)
        return
    }
    req.fileExtension = fileInfo.ext
    next()
}

const validatingProductData = ( req, res, next ) => { 
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

module.exports = {
    validatingProductImage,
    validatingProductData
}