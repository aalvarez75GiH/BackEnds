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
const userController = require('./users.controller')
const processingErrors = require('../../libs/errorHandler').processingErrors 

class UserDataAlreadyInUse extends Error {
    constructor(message){
        super(message)
        this.message = message || 'Email or username already associated to an account'
        this.status = 409
        this.name = 'UserDataAlreadyInUse'
    }
}


const transformBodyToLowerCase = (req, res, next) => {
    req.body.fullName && (req.body.fullName = req.body.fullName.toLowerCase())
    req.body.email && (req.body.email = req.body.email.toLowerCase())
    next()
}

usersRouter.get('/', processingErrors((req,res)=> {
    return userController.getUsers()
    .then(users => {
        res.status(201).json(users)
    })
}))

usersRouter.post('/', [validateUsers, transformBodyToLowerCase], processingErrors((req, res)=>{
    let newUser = req.body
    
    return userController.findUser(newUser)
    .then(foundUser =>{
        if (foundUser){
            logger.info(`User with ${newUser.email} already registered...`)
            throw new UserDataAlreadyInUse()
        }
        return bcrypt.hash(newUser.password, 10)
    })
    .then (hashedPassword => {
        logger.info('Pasa por aqui')
        logger.info(hashedPassword)
        return userController.createUser(newUser, hashedPassword)
        .then(user => {
            logger.info(`User with [${user.email}] has been created...`)
            res.status(201).send(user.fullName)
        })
    })
    
}))


// ****************************** with async/await
usersRouter.post('/login', [validateLoginRequest, transformBodyToLowerCase], processingErrors(async(req,res) => {
    const notAuthUser = req.body
    let foundUser

    foundUser = await userController.findUserForLogin({ email: notAuthUser.email })    
    
    if (!foundUser){
        logger.info(`User with email ${notAuthUser.email} was not found at DB`)
        res.status(400).send(`${notAuthUser.email}`)
        return
    }

    const hashedPassword = foundUser.password
    let correctPassword

    correctPassword = await bcrypt.compare(notAuthUser.password, hashedPassword)
    
    if(correctPassword){
        const token = jwt.sign({id: foundUser.id},
        config.jwt.secret, {
            expiresIn: 60 * 60 * 24 * 365
        })
        logger.info(`User [${notAuthUser.email}] has been authenticated succesfully...`)
        res.status(200).send({token})        
    }else{
        logger.info(`User with email ${notAuthUser.email} didn't complete authentication process`)
        res.status(400).send(`email or password incorrect, check your credentials and try again...`)     
    }
}))


usersRouter.get('/me', jwtAuthorization, (req,res) => {
    let dataUser = req.user.fullName
    logger.info(dataUser)
    res.send(dataUser)
})

module.exports = usersRouter