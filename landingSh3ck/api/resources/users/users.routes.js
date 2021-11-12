const express = require('express')
const _ = require('underscore')
const { v4: uuidv4 } = require("uuid")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const config = require('../../../config')

const logger = require('../../../utils/logger')
const jwtAuthorization = passport.authenticate('jwt', { session: false })

const users = require('../../../database').users
const validateUsers = require('./users.validate').validateUsers
const validateLoginRequest = require('./users.validate').validateLoginRequest
const usersRouter = express.Router()

usersRouter.get('/', (req,res)=> {
    logger.info('Request get to registered users successful...')
    res.send(users)
})

usersRouter.post('/', validateUsers, (req, res)=>{
    let newUser = req.body

    const index = _.findIndex(users, user => {
        return user.email === newUser.email
    })

    if (index !== -1){
        logger.info(`User owning ${newUser.email} already registered...`)
        // res.status(409).send(`User with email address: [${newUser.email}] already exists`)
        res.status(409).send(newUser.fullName)
        return
    }
    bcrypt.hash(newUser.password, 10, ( err, hashedPassword )=> {
        if (err){
            logger.error('An error Ocurred when we try to get hash of user`s password', err)
            res.status(500).send('An error ocurred processing user creation process')
            return
        }    

        users.push({
            fullName:newUser.fullName,
            email:newUser.email,
            phoneNumber: newUser.phoneNumber,
            password: hashedPassword,
            id: uuidv4()
        })
        logger.info(`User [${newUser.email}] has been created...`)
        // res.status(201).send(`User [${newUser.email}] has been created...`)
        res.status(201).send(newUser.fullName)
    })
})

usersRouter.post('/login', validateLoginRequest, ( req, res ) => {
    const notAuthUser = req.body
    const index = _.findIndex(users, user => {
        return user.email === notAuthUser.email
    })
    if (index === -1){
        logger.info(`User with email ${notAuthUser.email} was not found at DB`)
        res.status(400).send(`${notAuthUser.email}`)
        return
    }

    const hashedPassword = users[index].password
    bcrypt.compare(notAuthUser.password, hashedPassword, (err, match) => {
        if (match){
            //here is where i create token and send it to frontEnd
            const token = jwt.sign({id: users[index].id},
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

usersRouter.get('/me', jwtAuthorization, (req,res) => {
    let dataUser = req.user.fullName
    res.send(dataUser)
})




module.exports = usersRouter