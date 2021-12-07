const logger = require('../../utils/logger')
const passportJWT = require('passport-jwt')
const config = require('../../config')
const usersController = require('../resources/users/users.controller')


const jwtOptions = {
    secretOrKey: config.jwt.secret,
    jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken()
}

module.exports = new passportJWT.Strategy(jwtOptions, (jwtPayload, next) => {
    
    usersController.findUserForLogin({ id: jwtPayload.id })
    .then(user => {
        if (!user){
            logger.warn(`JWT not valid. User with id ${ jwtPayload.id } couldn't be found...`)
            next(null, false)
            return 
        }
        logger.info(`User ${ user.username } has provided a valid token and has been authenticated `)
        next(null, {
            username: user.username,
            id: user.id
        })
    })
    .catch( error => {
        logger.error(`An error occurred when we tried to find user with id: [${jwtPayload.id}]`, error)
        next(error, false)
        // res.status(500).send(`An error occurred when we tried to find user with ID [${jwtPayload.id}]`)
    })
})

// module.exports = jwtStrategy


