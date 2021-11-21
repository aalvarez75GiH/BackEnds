const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const validateUsers = require('./users.validate').validateUsers
const validateLoginRequest =  require('./users.validate').validateLoginRequest
const logger = require('../../../utils/logger')
const config = require('../../../config')
const usersController = require('./users.controller')
const processingErrors = require('../../libs/errorHandler').processingErrors
const { UserDataAlreadyInUse, IncorrectCredentials } = require('./users.errors')

const usersRouter = express.Router()



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
    
    foundUser = await usersController.findUserForLogin({username: notAuthUser.username})
        
    if (!foundUser){
        logger.warn(`User ${ notAuthUser.username } doesn't exist in the Database..`)
        throw new IncorrectCredentials()
    }
    
    const hashedPassword = foundUser.password
    let correctPassword

    correctPassword = await bcrypt.compare(notAuthUser.password, hashedPassword)
    
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
        throw new IncorrectCredentials()
    }
    
}))

module.exports = usersRouter