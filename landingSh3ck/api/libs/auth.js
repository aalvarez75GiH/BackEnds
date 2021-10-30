const users = require('../../database').users
const _ = require('underscore')
const logger = require('../../utils/logger')
const bcrypt = require('bcrypt')
const passportJWT = require('passport-jwt')



// const authPassword = (username, password, done) => {
//     const index =  _.findIndex(users, user => user.email === username)
//     if (index === -1){
//         logger.warn(`User ${username} was not found...`)
//         return done(null, false)
//     }
    
//     const hashedPassword = users[index].password
//     bcrypt.compare(password, hashedPassword, (err, match)=> {
//         if (match) {
//             logger.info(`User [${username}] has been authenticated...`)
//             return done(null, true)
            
//         }else{
//             logger.info(`User [${username}] not authenticated...`)
//             done(null, false)
//         }
//     })
    
// }

const jwtOptions = {
    secretOrKey: 'this is a secret',
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
            fullName: users[index].fullName,
            email: users[index].email
        })
    }

})



