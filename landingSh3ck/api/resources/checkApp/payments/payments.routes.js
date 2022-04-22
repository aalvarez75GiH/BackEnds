const express = require('express')
const passport = require('passport')
const { v4: uuidv4 } = require('uuid')
const jwtAuthorization = passport.authenticate('jwt', { session: false })

const paymentController = require('./payments.controller')
const logger = require('../../../../utils/logger')
const processingErrors = require('../../../libs/errorHandler').processingErrors 
const validatePayment = require('./payments.validate').validatePayment
const validatePaymentImage = require('./payments.validate').validatePaymentImage
const { savePaymentPicture } = require('../../../../aws/images.controller')


const paymentRouter = express.Router()

const validarID = (req, res, next) => {
    let id = req.params.id
    if(id.match(/^[a-fA-F0-9]{24}$/) === null){
        res.status(400). send(`id [${id}] entered is not valid...`)
        return
    }
    next()
}

paymentRouter.get('/', processingErrors((req,res) => {
    return paymentController.getPayment()
    .then((payments) => {
        res.status(200).json(payments)
        logger.info(`Payments were found at DB and have been sent to requester`)
        return
    })   
}))


paymentRouter.post('/',[jwtAuthorization] , processingErrors(async(req,res) => {
    let user = req.user.fullName
    let role = req.user.role
    let newPayment = req.body
    logger.info(`payment caption: ${newPayment.name}`)
    logger.info(`newPayment: ${newPayment}`)
    let foundPayment
    foundPayment = await paymentController.findPayment(newPayment.name)
    if (foundPayment){
        logger.info(`foundPayment: ${foundPayment}`)
        res.status(409).send(`payment:${foundPayment} is already created at DB...`)
        return
    }
    if (role === 'user') {
        logger.info(`The user with name: ${user} does NOT have privileges to Update this collection`)
        res.status(403).send('Usuario sin privilégios suficientes para agregar datos a esta colección')
        return
    }
    if (role === 'admin'){
        await paymentController.createPayment(newPayment)
        logger.info(`Payment with name ${newPayment.name} has been created successfully at DB`)
        res.status(201).send(newPayment.name)
        return
    }
 
}))

module.exports = paymentRouter


