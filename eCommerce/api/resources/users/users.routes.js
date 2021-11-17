const express = require('express')
const _ = require('underscore')
const { v4: uuidv4 } = require("uuid")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const users = require('./../../../database').users
const validateUsers = require('./users.validate').validateUsers
const validateLoginRequest =  require('./users.validate').validateLoginRequest
const logger = require('../../../utils/logger')
const config = require('../../../config')
const usersController = require('./users.controller')

const usersRouter = express.Router()

const transformBodyToLowerCase = (req, res, next) => {
    req.body.username && (req.body.username = req.body.username.toLowerCase())
    req.body.email && (req.body.email = req.body.email.toLowerCase())
    next()
}

usersRouter.get('/',( req, res ) => {
    usersController.getUsers()
    .then(users => {
        res.status(201).json(users)
    })
    .catch(error => {
        logger.error('There has been a problem getting Users from database', error)
        res.status(500).send('There has been a problem getting Users from database')
    })
})

usersRouter.post('/', [validateUsers, transformBodyToLowerCase],(req, res)=>{
    
    let newUser = req.body
    usersController.findUser(newUser)
    .then(foundUser => {
        if (foundUser){
            logger.info('username or email already registered...')
            res.status(409).send(`User with username: [${newUser.username}] or email [${newUser.email}] already exists at our DB`)
            return
        }
        bcrypt.hash(newUser.password, 10, ( err, hashedPassword ) => {
            if (err){
                logger.error('An error Ocurred when we try to get hash of user`s password', err)
                res.status(500).send('An error ocurred processing user creation process')
                return 
            }
           
            usersController.createUser(newUser, hashedPassword)
            .then(user => {
                logger.info(`User [${user.username}] has been created...`)
                res.status(201).send(`User [${user.username}] has been created...`)
            })
            .catch(error => {
                logger.error(`An error ocurred when we try to create user with email [${user.email}]`, error)
                res.status(500).send(`An error ocurred processing user with email [${user.email}]`)
                return
            })    
        })    
    })
    .catch(error => {
        logger.error(`An error Ocurred when we try to verify if user 
        [${newUser.username}] with email [${newUser.email}] does exists at DB`, error)
        res.status(500).send('An error ocurred processing verification...')
    })

})

usersRouter.post('/login', [validateLoginRequest, transformBodyToLowerCase], (req, res) => {
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
                config.jwt.secret, {
                    expiresIn: config.jwt.expirationDate,
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