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
 
usersRouter.post('/login', [validateLoginRequest, transformBodyToLowerCase], async(req, res) => {
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
    
})

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