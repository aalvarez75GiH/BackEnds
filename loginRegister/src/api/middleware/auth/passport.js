const passport = require('passport')
const passportJWT = require('passport-jwt')
const _ = require('underscore')
const logger = require('../../../utils/logger')
const users = require('../../../provisionalDB').users

const extractJWT =  passportJWT.ExtractJwt
const strategyJWT = passportJWT.Strategy

passport.use(new strategyJWT({
    jwtFromRequest: extractJWT.fromAuthHeaderAsBearerToken(), 
    secretOrKey: 'this is a secret',
},
function(jwtPayload, done) {
    const index = _.findIndex(users, user => {
        return user.id === jwtPayload.id
    })
    
    if (index === -1){
        logger.warn(`JWT not valid. User with id ${ jwtPayload.id } couldn't be found...`)
        done(null, false)
    } else {
        logger.info(`User with email ${ users[index].email } has provided a valid token and has been authenticated `)
        //next(null, 'hello')
        done(null, {
            email: users[index].email,
            id: users[index].id
        })
    } 

}
)
) 


