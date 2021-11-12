const _ = require('underscore')
const logger = require('../../utils/logger')
const users = require('../../database').users
const passportJWT = require('passport-jwt')
const config = require('../../config')


const jwtOptions = {
    secretOrKey: config.jwt.secret,
    jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken()
}

module.exports = new passportJWT.Strategy(jwtOptions, (jwtPayload, next) => {
    const index = _.findIndex(users, user => user.id === jwtPayload.id)
    if (index === -1){
        logger.warn(`JWT not valid. User with id ${ jwtPayload.id } couldn't be found...`)
        next(null, false)
    } else {
        logger.info(`User ${ users[index].username } has provided a valid token and has been authenticated `)
        //next(null, 'hello')
        next(null, {
            username: users[index].username,
            id: users[index].id
        })
    }

})

// module.exports = jwtStrategy


