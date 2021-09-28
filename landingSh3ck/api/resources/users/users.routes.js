const express = require('express')
const _ = require('underscore')
const { v4: uuidv4 } = require("uuid")

const logger = require('../../../utils/logger')
const users = require('../../../database').users
const validateUsers = require('./users.validate')
const usersRouter = express.Router()

usersRouter.get('/', (req,res)=> {
    logger.info('Request get to users successful...')
    res.send(users)
})

usersRouter.post('/', validateUsers, (req, res)=>{
    let newUser = req.body

    const index = _.findIndex(users, user => {
        return user.email === newUser.email
    })

    if (index !== -1){
        logger.info(`User owning ${newUser.email} already registered...`)
        res.status(409).send(`User with email address: [${newUser.email}] already exists`)
        return
    }
    newUser.id = uuidv4()    
    users.push(newUser)   
    logger.info(`User [${newUser.email}] has been created...`)
    res.status(201).send(`User [${newUser.email}] has been created...`)
})

module.exports = usersRouter