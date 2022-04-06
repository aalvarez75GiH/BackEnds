const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const jwtAuthorization = passport.authenticate('jwt', { session: false })
const { v4: uuidv4 } = require('uuid')

const logger = require('../../../../utils/logger')
const reviewsController = require('./reviews.controllers')
const checkerController = require('../checkers/checkers.controller')
const processingErrors = require('../../../libs/errorHandler').processingErrors
const reviewsRouter = express.Router()


reviewsRouter.get('/', (req,res) => {
    return reviewsController.getReviews()
    .then(foundReviews => {
        res.json(foundReviews)
    })
})

reviewsRouter.get('/:id', (req,res)=> {
    let id = req.params.id
    return reviewsController.getReviewByChecker(id)
    .then(reviews => {
        res.json(reviews)
    })
})

reviewsRouter.post('/', processingErrors(async(req,res) => {
    const newReview = req.body
    logger.info(newReview)
    let foundChecker
    foundChecker = await checkerController.findOneChecker(newReview.checker_id)

    if (!foundChecker){
        logger.info(`Checker with Id ${newReview.user_id} has not been found at DB`)
        res.status(404).send(`El chequeador con ID ${newReview.user_id} no ha sido encontrado en la BD`)
        return
    }
    await reviewsController.createReview(newReview)
    logger.info(`Review for checker: [${foundChecker.fullName}] has been registered`)
    res.status(201).send(newReview)
    return
}))

module.exports = reviewsRouter