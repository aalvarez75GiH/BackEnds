const users = require('../../database').users
const _ = require('underscore')
const logger = require('../../utils/logger')
const bcrypt = require('bcrypt')
const passportJWT = require('passport-jwt')
const config = require('../../config')
const user = require('../../api/resources/users/users.model')

const jwtOptions = {
    secretOrKey: config.jwt.secret,
    jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken()
}

module.exports = new passportJWT.Strategy(jwtOptions, (jwtPayload, next) => {
    
    user.findOne({ id: jwtPayload.id })
    .exec()
    .then(foundUser => {
        if(foundUser){
            logger.info(`User ${ foundUser.email } has provided a valid token and has been authenticated `)
            //next(null, 'hello')
            next(null, {
                fullName: foundUser.fullName,
                email: foundUser.email
            })            
        }else{
            logger.warn(`JWT not valid. User with id ${ jwtPayload.id } couldn't be found...`)
            next(null, false)    
        }
    })
    
})



