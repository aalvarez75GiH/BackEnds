const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const passport = require('passport')

const logger = require('../../../utils/logger')
const jwtAuthorization = passport.authenticate('jwt', { session: false })
const config = require('../../../config')
const validateUsers = require('./users.validate').validateUsers
const validateLoginRequest = require('./users.validate').validateLoginRequest
const usersRouter = express.Router()
const user = require('./users.model')
const userController = require('./users.controller') 

usersRouter.get('/', (req,res)=> {
    userController.getUsers()
    .then(users => {
        res.status(201).json(users)
    })
    .catch(error => {
        logger.error('There has been a problem getting Users from database', error)
        res.status(500).send('There has been a problem getting Users from database')
    })
})

usersRouter.post('/', validateUsers, (req, res)=>{
    let newUser = req.body

    userController.findUser(newUser)
    .then(foundUser =>{
        if (foundUser){
            logger.info(`User with ${newUser.email} already registered...`)
            res.status(409).send(newUser.fullName)
            return
        }
        bcrypt.hash(newUser.password, 10, (error, hashedPassword) =>{
            if (error){
                logger.error('An error Ocurred when we try to get hash of user`s password', err)
                res.status(500).send('An error ocurred while trying to hash password...')
                return
            }
            userController.createUser(newUser, hashedPassword)
            .then(user => {
                logger.info(`User with [${user.email}] has been created...`)
                res.status(201).send(user.fullName)
            })
            .catch(error => {
                logger.error('An error Ocurred when we try to get hash of user`s password', err)
                res.status(500).send('An error ocurred processing user creation process')
            })
        })
    })
    .catch(error => {
        logger.error(`An error Ocurred when we try to verify if user 
        with email [${newUser.email}] does exists at DB`, error)
        res.status(500).send('An error ocurred processing verification...')
    })
})


usersRouter.post('/login', validateLoginRequest, ( req, res ) => {
    const notAuthUser = req.body

    userController.findUserForLogin(notAuthUser)
    .then(foundUser => {
        if (!foundUser){
            logger.info(`User with email ${notAuthUser.email} was not found at DB`)
            res.status(400).send(`${notAuthUser.email}`)
            return
        }
        const hashedPassword = foundUser.password
        bcrypt.compare(notAuthUser.password, hashedPassword, (error, match)=>{
            if (match){
                const token = jwt.sign({id: foundUser.id},
                config.jwt.secret, {
                    expiresIn: 60 * 60 * 24 * 365
                })
                logger.info(`User [${notAuthUser.email}] has been authenticated succesfully...`)
                res.status(200).send({token})
                return    
            }else{
                logger.info(`User with email ${notAuthUser.email} didn't complete authentication process`)
                res.status(400).send(`email or password incorrect, check your credentials and try again...`)    
            }    
        })
    })
    .catch(error => {
        logger.error(`An error Ocurred when we try to verify if user 
        with email [${notAuthUser.email}] does exists at DB`, error)
        res.status(500).send('An error ocurred processing verification...')
    })
})


usersRouter.get('/me', jwtAuthorization, (req,res) => {
    let dataUser = req.user.fullName
    res.send(dataUser)
})

module.exports = usersRouter