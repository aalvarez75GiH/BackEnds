const express = require('express')
const _ = require('underscore')
const jwt = require('jsonwebtoken')
const logger = require('../../../utils/logger')
const users = require('../../../provisionalDB').users
const bcrypt = require('bcrypt')
const router = express.Router()


router.post('/login', (req, res)=> {
    
    const { email, password } = req.body 
    const index = _.findIndex(users, user => {
        return user.email === email
    })
    if (index === -1){
        logger.info(`User with email ${email} has Not been found...`)
        return res.status(400).json({message: `User with email ${email} has Not been found...`})
    }

    const storedPassword = users[index].password
    bcrypt.compare(password, storedPassword, (err, match)=>{
        if (match){
            const token = jwt.sign({ id: users[index].id }, 
                'this is a secret', {
                    expiresIn: 60 * 60 * 24 * 365,
                })
                logger.info(`User with email [${email}] has been authenticated...`)
                res.status(200).json({
                    message:'Welcome back',
                    token: token
                })
        }else{
            logger.info(`Email or password has NOT been authenticated...`)
            return res.status(400).json({message: 'Email or password does not match...'})
        }
    })
})

module.exports = router