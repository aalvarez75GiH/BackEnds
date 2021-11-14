const express = require('express')
const logger = require('../../../utils/logger')
const interestedUser = require('./interestedUsers.model')
const validateUsers = require('./interestedUsers.validate')
const interestedUsersController = require('./interestedUsers.controller')
const intUsersRouter = express.Router()

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

intUsersRouter.post('/', validateUsers, (req, res)=>{
    let newUser = req.body
        interestedUser.findOne({ email: newUser.email})
        .exec()
        .then(foundUser => {
            if (foundUser){
                logger.info(` User with email ${newUser.email} already enrolled as interested User `)
                return res.status(409).send(`${newUser.fullName}`)
            }
            interestedUsersController.createInterestedUser(newUser)
            .then((interestedUser)=>{
                logger.info(`User [${interestedUser.email}] has been created...`)
                res.status(201).send(`${interestedUser.fullName}`)
            }).catch(error => {
                logger.error('Interested User could not be added to collection...', product)
                res.status(500).send('Interested user could not be added to collection...')
            })
             
        })     
})

module.exports = intUsersRouter