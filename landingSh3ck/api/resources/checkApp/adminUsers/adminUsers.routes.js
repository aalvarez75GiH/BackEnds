const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const adminUsersRouter = express.Router()


const processingErrors = require('../../../libs/errorHandler').processingErrors 
const config = require('../../../../config')
const adminUserController = require('../adminUsers/adminUsers.controller')
const logger = require('../../../../utils/logger')
const emailSender = require('../../../../utils/emailSender').emailSenderModule
const validateAdminUsers = require('./adminUsers.validate').validateAdminUsers
const validateAdminLoginRequest = require('./adminUsers.validate').validateAdminLoginRequest 
const jwtAuthorization = passport.authenticate('jwt', { session: false })
const { ErrorHashingData } = require('./adminUsers.errors')

     

const transformBodyToLowerCase = (req, res, next) => {
    req.body.fullName && (req.body.fullName = req.body.fullName.toLowerCase())
    req.body.email && (req.body.email = req.body.email.toLowerCase())
    next()
}

adminUsersRouter.get('/', processingErrors((req,res)=> {
    return adminUserController.getAdminUsers()
    .then(users => {
        res.json(users)
    })
}))

adminUsersRouter.post('/', [validateAdminUsers, transformBodyToLowerCase], processingErrors(async(req, res)=>{
    let newUser = req.body
    let foundUser
    logger.info(newUser)
    foundUser = await adminUserController.findAdminUser(newUser)  
    logger.info(foundUser)   
    
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
        await adminUserController.createAdminUser(newUser, hashedPIN)
        logger.info(`User with email [${newUser.email}] has been created...`)
        emailSender('users', newUser.email, randomPIN)
        res.status(201).send(newUser.fullName)

    })
    
}))

adminUsersRouter.post('/login', [validateAdminLoginRequest, transformBodyToLowerCase], processingErrors(async(req,res) => {
    const notAuthUser = req.body
    let foundUser
    console.log(notAuthUser)

    foundUser = await adminUserController.findAdminUserForLogin({ email: notAuthUser.email })    
    
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
        logger.info(`User [${notAuthUser.email}] have authenticated as an Admin User`)
        res.status(200).send({token})
        return        
    }else{
        logger.info(`User with email ${notAuthUser.email} didn't complete authentication process`)
        res.status(400).send(`${foundUser.fullName}`)     
    }
}))

adminUsersRouter.get('/me', jwtAuthorization, (req,res) => {
    let dataUser = req.user.fullName
    let role = req.user.role
    logger.info(dataUser)
    logger.info(role)

    res.send(dataUser)
})



module.exports = adminUsersRouter
