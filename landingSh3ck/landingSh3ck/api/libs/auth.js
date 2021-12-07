const logger = require('../../utils/logger')
const bcrypt = require('bcrypt')
const passportJWT = require('passport-jwt')
const config = require('../../config')
const usersController = require('../resources/users/users.controller')

const jwtOptions = {
    secretOrKey: config.jwt.secret,
    jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken()
}

module.exports = new passportJWT.Strategy(jwtOptions, (jwtPayload, next) => {
    logger.info('jwtPayload:', jwtPayload)
    usersController.findUserForLogin({ id: jwtPayload.id})
    .then( foundUser => {
        if(!foundUser){
            logger.warn(`JWT not valid. User with id ${ jwtPayload.id } couldn't be found...`)
            next(null, false)    
            return
        }
        logger.info(`User ${ foundUser.email } has provided a valid token and has been authenticated `)
        //next(null, 'hello')
        next(null, {
            fullName: foundUser.fullName,
            email: foundUser.email
        })            
    })
    .catch(error => {
        logger.error(`An error occurred when we tried to find user with id: [${jwtPayload.id}]`, error)
        next(error, false)
    })
})



