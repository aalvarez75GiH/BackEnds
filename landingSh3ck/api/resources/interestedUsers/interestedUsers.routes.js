const express = require('express')
const logger = require('../../../utils/logger')
const interestedUser = require('./interestedUsers.model')
const validateUsers = require('./interestedUsers.validate')
const interestedUsersController = require('./interestedUsers.controller')
const intUsersRouter = express.Router()

const transformBodyToLowerCase = (req, res, next) => {
    req.body.fullName && (req.body.fullName = req.body.fullName.toLowerCase())
    req.body.email && (req.body.email = req.body.email.toLowerCase())
    next()
}

intUsersRouter.get('/', (req,res)=> {
    interestedUsersController.getInterestedUsers()
    .then(interestedUsers => {
        res.status(201).json(interestedUsers)
    })
    .catch(error => {
        logger.error('Sorry, we had a problem when we were reading at DB...')
        res.status(500).send('Sorry, we had a problem when we were reading at DB...')
    })
})

intUsersRouter.post('/', [validateUsers, transformBodyToLowerCase], (req, res)=>{
    let newUser = req.body
    interestedUsersController.findInterestedUser(newUser)
    .then(foundInterestedUser => {
        if (foundInterestedUser){
            logger.info(` User with email ${newUser.email} already enrolled as interested User `)
            res.status(409).send(`${newUser.fullName}`)
            return
        }
        interestedUsersController.createInterestedUser(newUser)
        .then(interestedUser => {
            logger.info(`User [${interestedUser.email}] has been created...`)
            res.status(201).send(`${interestedUser.fullName}`)
        })
        .catch(error => {
            logger.error('Interested User could not be added to collection...', error)
            res.status(500).send('Interested user could not be added to collection...')
        })
    })
    .catch( error => {
        logger.error('An Error has occurred trying to find user at DB', error)
        res.status(500).send('Interested user could not be found due to an error')
    })        
})


module.exports = intUsersRouter