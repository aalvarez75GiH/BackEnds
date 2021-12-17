const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const passport = require('passport')

const logger = require('../../../utils/logger')
const emailSender = require('../../../utils/emailSender').emailSenderModule
const jwtAuthorization = passport.authenticate('jwt', { session: false })
const config = require('../../../config')
const validateUsers = require('./users.validate').validateUsers
const validateLoginRequest = require('./users.validate').validateLoginRequest
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
    // bcrypt.hash(newUser.password, 10, async(error, hashedPassword) => {
    //     if (error){
    //         logger.info(`Error trying hashing password...`)
    //         throw new ErrorHashingData()
    //     }
    //     await userController.createUser(newUser, hashedPassword, randomPIN)
    //     logger.info(`User with email [${newUser.email}] has been created...`)
    //     emailSender('users', newUser.email, randomPIN)
    //     res.status(201).send(newUser.fullName)

    // })
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


// ****************************** with async/await
// usersRouter.post('/login', [validateLoginRequest, transformBodyToLowerCase], processingErrors(async(req,res) => {
//     const notAuthUser = req.body
//     let foundUser

//     foundUser = await userController.findUserForLogin({ email: notAuthUser.email })    
    
//     if (!foundUser){
//         logger.info(`User with email ${notAuthUser.email} was not found at DB`)
//         res.status(400).send(`${notAuthUser.email}`)
//         return
//     }
//     console.log('lo consiguió...')
//     const hashedPassword = foundUser.password
//     let correctPassword

//     correctPassword = await bcrypt.compare(notAuthUser.password, hashedPassword)
    
//     if(correctPassword){
//         console.log('password correcto...')
//         const token = jwt.sign({id: foundUser.id},
//         config.jwt.secret, {
//             expiresIn: 60 * 60 * 24 * 365
//         })
//         logger.info(`User [${notAuthUser.email}] has been authenticated succesfully...`)
//         res.status(200).send({token})
//         return        
//     }else{
//         logger.info(`User with email ${notAuthUser.email} didn't complete authentication process`)
//         res.status(400).send(`${foundUser.fullName}`)     
//     }
// }))


// using PIN
usersRouter.post('/login', [validateLoginRequest, transformBodyToLowerCase], processingErrors(async(req,res) => {
    const notAuthUser = req.body
    let foundUser

    foundUser = await userController.findUserForLogin({ email: notAuthUser.email })    
    
    if (!foundUser){
        logger.info(`User with email ${notAuthUser.email} was not found at DB`)
        res.status(400).send(`${notAuthUser.email}`)
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

usersRouter.get('/me', jwtAuthorization, (req,res) => {
    let dataUser = req.user.fullName
    logger.info(dataUser)
    res.send(dataUser)
})

module.exports = usersRouter