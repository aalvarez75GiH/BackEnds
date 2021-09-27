const express = require('express')
const _ = require('underscore')
const { v4: uuidv4 } = require("uuid")
const bcrypt = require('bcrypt')

const users = require('./../../../database').users
const validateUsers = require('./users.validate')
const logger = require('../../../utils/logger')

const usersRouter = express.Router()

usersRouter.get('/',( req, res ) => {
    res.json(users)
})

usersRouter.post('/', validateUsers, (req, res)=>{
    let newUser = req.body

    const index = _.findIndex(users, user => {
        return user.username === newUser.username || user.email === newUser.email
    })
    if (index !== -1){
        logger.info('username or email already registered...')
        res.status(409).send(`User with username: [${newUser.username}] already exists`)
        return
    }
    bcrypt.hash(newUser.password, 10, ( err, hashedPassword ) => {
        if (err){
            logger.error('An error Ocurred when we try to get hash of user`s password', err)
            res.status(500).send('An error ocurred processing user creation process')
            return 
        }
        // newUser.id = uuidv4()    
        // users.push(newUser)
        users.push({
            username: newUser.username,
            email: newUser.email,
            password: hashedPassword
        })    
        logger.info(`User [${newUser.username}] has been created...`)
        res.status(201).send(`User [${newUser.username}] has been created...`)
    })

})

module.exports = usersRouter