const express = require('express')
const _ = require('underscore')
const { v4: uuidv4 } = require("uuid")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const users = require('./../../../database').users
const validateUsers = require('./users.validate').validateUsers
const validateLoginRequest =  require('./users.validate').validateLoginRequest
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
        //  newUser.id = uuidv4()    
        //  users.push(newUser)
        users.push({
            username: newUser.username,
            email: newUser.email,
            password: hashedPassword,
            id: uuidv4()
        })    
        logger.info(`User [${newUser.username}] has been created...`)
        res.status(201).send(`User [${newUser.username}] has been created...`)
    })

})

usersRouter.post('/login', validateLoginRequest, (req, res) => {
    let notAuthUser = req.body
    const index = _.findIndex(users, user => {
        return user.username === notAuthUser.username 
    })
    if (index === -1){
        logger.warn(`User ${ notAuthUser.username } doesn't exist in the Database..`)
        res.status(400).send('Invalid credentials, user do not exist...')
        return
    }

    const hashedPassword = users[index].password
    bcrypt.compare(notAuthUser.password, hashedPassword, ( err, match )=> {
        if (match){
            logger.info(`User [${notAuthUser.username}] has been authenticated...`)
            //create token and send it
            const token = jwt.sign({ id: users[index].id }, 
                'this is a secret', {
                    expiresIn: 60 * 60 * 24 * 365,
                })
                logger.info(`User [${notAuthUser.username}] has been authenticated...`)
                res.status(200).json({
                    token: token
                })
                
        }else{
            logger.info(`User [${notAuthUser.username}] failed authentication process...`)
            res.status(400).send('Invalid credentials, user failed authentication...')
        }

    })
  

})

module.exports = usersRouter