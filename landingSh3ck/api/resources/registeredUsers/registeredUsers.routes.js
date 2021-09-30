const express = require('express')
const _ = require('underscore')
const { v4: uuidv4 } = require("uuid")
const bcrypt = require('bcrypt')

const logger = require('../../../utils/logger')
const registeredUsers = require('../../../database').registeredUsers
const validateUsers = require('./registeredUsers.validate')
const registeredUsersRouter = express.Router()

registeredUsersRouter.get('/', (req,res)=> {
    logger.info('Request get to registered users successful...')
    res.send(registeredUsers)
})

registeredUsersRouter.post('/', validateUsers, (req, res)=>{
    let newRegisteredUser = req.body

    const index = _.findIndex(registeredUsers, registeredUser => {
        return registeredUser.email === newRegisteredUser.email
    })

    if (index !== -1){
        logger.info(`User owning ${newRegisteredUser.email} already registered...`)
        res.status(409).send(`User with email address: [${newRegisteredUser.email}] already exists`)
        return
    }
    bcrypt.hash(newRegisteredUser.password, 10, ( err, hashedPassword )=> {
        if (err){
            logger.error('An error Ocurred when we try to get hash of user`s password', err)
            res.status(500).send('An error ocurred processing user creation process')
            return
        }    
        newRegisteredUser.id = uuidv4()
        registeredUsers.push({
            fullName:newRegisteredUser.fullName,
            email:newRegisteredUser.email,
            phoneNumber: newRegisteredUser.phoneNumber,
            password: hashedPassword
        })
        logger.info(`User [${newRegisteredUser.email}] has been created...`)
        res.status(201).send(`User [${newRegisteredUser.email}] has been created...`)
    })
})

module.exports = registeredUsersRouter