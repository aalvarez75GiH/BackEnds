const express = require('express')
const logger = require('../../../utils/logger')
const interestedUser = require('./interestedUsers.model')
const validateUsers = require('./interestedUsers.validate')
const interestedUsersController = require('./interestedUsers.controller')
const processingErrors  = require('../../libs/errorHandler').processingErrors
const intUsersRouter = express.Router()

const transformBodyToLowerCase = (req, res, next) => {
    req.body.fullName && (req.body.fullName = req.body.fullName.toLowerCase())
    req.body.email && (req.body.email = req.body.email.toLowerCase())
    next()
}

intUsersRouter.get('/', processingErrors((req,res)=> {
    return interestedUsersController.getInterestedUsers()
    .then(interestedUsers => {
        res.status(201).json(interestedUsers)
    })
}))

// turn into try/catch and refactoring with error handler
intUsersRouter.post('/', [validateUsers, transformBodyToLowerCase], processingErrors(async(req, res)=>{
    let newUser = req.body
    let foundInterestedUser
    
    foundInterestedUser = await interestedUsersController.findInterestedUser(newUser) 
    
    if (foundInterestedUser){
        logger.info(` User with email ${newUser.email} is already registered as interested User `)
        res.status(409).send(`${newUser.fullName}`)
        return
    }
    
    const interestedUser = await interestedUsersController.createInterestedUser(newUser)
    logger.info(`User [${interestedUser.email}] has been created...`)
    res.status(201).send(`${interestedUser.fullName}`)
    
           
}))


module.exports = intUsersRouter