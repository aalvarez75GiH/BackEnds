const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const validateUsers = require('./users.validate').validateUsers
const validateLoginRequest =  require('./users.validate').validateLoginRequest
const logger = require('../../../utils/logger')
const config = require('../../../config')
const usersController = require('./users.controller')
const processingErrors = require('../../libs/errorHandler').processingErrors

const usersRouter = express.Router()

class UserDataAlreadyInUse extends Error {
    constructor(message){
        super(message)
        this.message = message || 'Email or username already associatted to an account'
        this.status = 409
        this.name = 'UserDataAlreadyInUse'
    }
}


const transformBodyToLowerCase = (req, res, next) => {
    req.body.username && (req.body.username = req.body.username.toLowerCase())
    req.body.email && (req.body.email = req.body.email.toLowerCase())
    next()
}

usersRouter.get('/', processingErrors((req,res) => {
    return usersController.getUsers()
    .then(users => {
        res.status(201).json(users)
    })
}))

usersRouter.post('/', [validateUsers, transformBodyToLowerCase],processingErrors((req, res) => {
    
    let newUser = req.body
    return usersController.findUser(newUser)
    .then(foundUser => {
        if (foundUser){
            logger.info('username or email already registered...')
            throw new UserDataAlreadyInUse()
            // res.status(409).send(`User with username: [${newUser.username}] or email [${newUser.email}] already exists at our DB`)
            // return
        }
        return bcrypt.hash(newUser.password, 10)
    })
    .then((hashedPassword)=> {
        logger.info('pasa por aqui...')
        return  usersController.createUser(newUser, hashedPassword)
        .then(user => {
            logger.info(`User [${user.username}] has been created...`)
            res.status(201).send(`User [${user.username}] has been created...`)
        })
    })         
}))
 
usersRouter.post('/login', [validateLoginRequest, transformBodyToLowerCase], processingErrors(async(req, res) => {
    let notAuthUser = req.body
    let foundUser
    
    try {
        foundUser = await usersController.findUserForLogin({username: notAuthUser.username})
        
    } catch (error) {
        logger.error(`An error Ocurred when we try to verify if user 
        with username [${notAuthUser.username}] does exists at DB`, error)
        res.status(500).send('An error ocurred processing verification...')
        return 
    }

    if (!foundUser){
        logger.warn(`User ${ notAuthUser.username } doesn't exist in the Database..`)
        res.status(400).send('Invalid credentials, user do not exist...')
        return
    }
    const hashedPassword = foundUser.password
    let correctPassword

    try {
        correctPassword = await bcrypt.compare(notAuthUser.password, hashedPassword)
    } catch (error) {
        logger.info(`Compare passwords process failed...`)
        res.status(500).send('There was an error when comparing passwords')
        return
    }
    if (correctPassword){
        logger.info(`User [${notAuthUser.username}] has been authenticated...`)
        //create token and send it
        const token = jwt.sign({ id: foundUser.id }, 
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
    
}))

// My login process...
// usersRouter.post('/login', [validateLoginRequest, transformBodyToLowerCase], (req, res) => {
    //     let notAuthUser = req.body
        
    //     usersController.findUserForLogin(notAuthUser)
    //     .then(foundUser => {
    //         if (!foundUser){
    //             logger.warn(`User ${ notAuthUser.username } doesn't exist in the Database..`)
    //             res.status(404).send('Invalid credentials, user do not exist...')
    //             return    
    //         }
            // const hashedPassword = foundUser.password
            // bcrypt.compare(notAuthUser.password, hashedPassword, (error, match )=> {
            //     if(match){
            //         logger.info(`User [${notAuthUser.username}] has been authenticated...`)    
            //         const token = jwt.sign({ id: foundUser.id }, 
            //         config.jwt.secret, {
            //             expiresIn: config.jwt.expirationDate,
            //         })
            //         res.status(200).json({
            //             token: token
            //         })
            //         return
            //     }else{
            //         logger.info(`User [${notAuthUser.username}] failed authentication process...`)
            //         res.status(400).send('Invalid credentials, user failed authentication...')    
            //     }
            // })
    
    //     }).catch(error => {
    //         logger.error(`An error Ocurred when we try to verify if user 
    //         with email [${notAuthUser.email}] does exists at DB`, error)
    //         res.status(500).send('An error ocurred processing verification...')
    
    //     })
        
    // })
module.exports = usersRouter