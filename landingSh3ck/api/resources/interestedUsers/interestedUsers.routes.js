const express = require('express')
const _ = require('underscore')
const { v4: uuidv4 } = require("uuid")

const logger = require('../../../utils/logger')
const interestedUsers = require('../../../database').interestedUsers
const validateUsers = require('./interestedUsers.validate')
const intUsersRouter = express.Router()

intUsersRouter.get('/', (req,res)=> {
    logger.info('Request get to users successful...')
    res.send(interestedUsers)
})

intUsersRouter.post('/', validateUsers, (req, res)=>{
    let newUser = req.body

    const index = _.findIndex(interestedUsers, interestedUser => {
        return interestedUser.email === newUser.email
    })

    if (index !== -1){
        logger.info(`User owning ${newUser.email} already registered...`)
        res.status(409).send(`User with email address: [${newUser.email}] already exists`)
        return
    }
    newUser.id = uuidv4()    
    interestedUsers.push(newUser)   
    logger.info(`User [${newUser.email}] has been created...`)
    res.status(201).send(`User [${newUser.email}] has been created...`)
})

module.exports = intUsersRouter