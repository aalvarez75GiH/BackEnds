const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const jwtAuthorization = passport.authenticate('jwt', { session: false })


const logger = require('../../../utils/logger')
const emailSender = require('../../../utils/emailSender').emailSenderModule
const config = require('../../../config')
const validateUsers = require('./users.validate').validateUsers
const validateLoginRequest = require('./users.validate').validateLoginRequest
const validateNewPINRequest = require('./users.validate').validateNewPINRequest
const usersRouter = express.Router()
const userController = require('./users.controller')
const processingErrors = require('../../libs/errorHandler').processingErrors 
const { ErrorHashingData } = require('./users.errors')
 

const transformBodyToLowerCase = (req, res, next) => {
    req.body.fullName && (req.body.fullName = req.body.fullName.toLowerCase())
    req.body.email && (req.body.email = req.body.email.toLowerCase())
    next()
}

usersRouter.get('/', processingErrors((req,res)=> {
    return userController.getUsers()
    .then(users => {
        res.json(users)
    })
}))

usersRouter.post('/', [validateUsers, transformBodyToLowerCase], processingErrors(async(req, res)=>{
    let newUser = req.body
    let foundUser
    
    foundUser = await userController.findUser(newUser)     
    
    if (foundUser){
        logger.info(`User with email ${newUser.email} already registered...`)
        res.status(409).send(`${newUser.fullName}`)
        return
    }
    const randomPIN = Math.floor(1000 + Math.random() * 9000)
    const PIN = randomPIN.toString()
    logger.info(PIN)
    bcrypt.hash(PIN, 10, async(error, hashedPIN) => {
        if (error){
            logger.info(`Error trying hashing PIN...`)
            throw new ErrorHashingData()
        }
        await userController.createUser(newUser, hashedPIN)
        logger.info(`User with email [${newUser.email}] has been created...`)
        emailSender('users', newUser.email, randomPIN)
        res.status(201).send(newUser.fullName)

    })
    
}))


usersRouter.post('/login', [validateLoginRequest, transformBodyToLowerCase], processingErrors(async(req,res) => {
    const notAuthUser = req.body
    let foundUser
    console.log(notAuthUser)

    foundUser = await userController.findUserForLogin({ email: notAuthUser.email })    
    
    if (!foundUser){
        logger.info(`User with email ${notAuthUser.email} was not found at DB`)
        res.status(400).send(`Amig@`)
        // res.status(400).send(`${notAuthUser.email}`)
        return
    }

    const hashedPIN = foundUser.pin
    let correctPIN

    correctPIN = await bcrypt.compare(notAuthUser.pin, hashedPIN)
    
    if(correctPIN){
        console.log('PIN correcto...')
        const token = jwt.sign({id: foundUser.id},
        config.jwt.secret, {
            expiresIn: 60 * 60 * 24 * 365
        })
        logger.info(`User [${notAuthUser.email}] has been authenticated succesfully...`)
        res.status(200).send({token})
        return        
    }else{
        logger.info(`User with email ${notAuthUser.email} didn't complete authentication process`)
        res.status(400).send(`${foundUser.fullName}`)     
    }
}))

usersRouter.put('/newPIN', validateNewPINRequest, processingErrors(async(req,res) => {
    const requesterUser = req.body
    let foundUser
    
    foundUser  = await userController.findUserForPIN({ email: requesterUser.email})
    if (!foundUser) {
        logger.info(`User with email ${requesterUser.email} was not found at DB`)
        res.status(400).send(`${requesterUser.email}`)
        return
    }
    logger.info(foundUser)
    const randomPIN = Math.floor(1000 + Math.random() * 9000)
    const PIN = randomPIN.toString()
    logger.info(PIN)
    bcrypt.hash(PIN, 10, async(error, hashedPIN) => {
        if (error){
            logger.info(`Error trying hashing PIN...`)
            throw new ErrorHashingData()
        }
        let updatedUser = await userController.updateUserPIN(foundUser.id, hashedPIN) 
        logger.info(updatedUser)
        emailSender('users', updatedUser.email, randomPIN)
        res.status(200).send(foundUser.fullName)
    })
}))



usersRouter.get('/me', jwtAuthorization, (req,res) => {
    let dataUser = {
        name: req.user.fullName,
        email: req.user.email,
        phoneNumber: req.user.phoneNumber,
        role: req.user.role
    }
    
    logger.info(`dataUser: ${dataUser.name}`)
    logger.info(`rol: ${dataUser.role}`)

    res.json(dataUser)
})

module.exports = usersRouter
