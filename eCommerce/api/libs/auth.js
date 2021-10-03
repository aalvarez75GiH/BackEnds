const _ = require('underscore')
const logger = require('../../utils/logger')
const users = require('../../database').users
const bcrypt = require('bcrypt')
const passportJWT = require('passport-jwt')


const jwtOptions = {
    secretOrKey: 'this is a secret',
    jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken()
}

const jwtStrategy = new passportJWT.Strategy(jwtOptions, (jwtPayload, next) => {
    const index = _.findIndex(users, user => user.id === jwtPayload.id)
    if (index === -1){
        logger.warn(`JWT not válid. User with id ${ jwtPayload.id } couldn't be found...`)
        next(null, false)
    } else {
        logger.info(`User ${ users[index].username } has provided a valid token and has been authenticated `)
        //next(null,true)
        // next(null, users[index].username)
        next(null, {
            username: users[index].username,
            id: users[index].id
        })
    }

})

module.exports = jwtStrategy


// this is the Basic Passport Autentication ********************************
// module.exports = (username, password, done) => {
//     const index = _.findIndex(users, user => user.username === username )
//     if (index === -1){
//         logger.warn(`User ${ username } doesn't exist in the Database..`)
//         done(null, false)
//         return
//     }
//     const hashedPassword = users[index].password
//     bcrypt.compare(password, hashedPassword, ( err, same )=> {
//         if (same){
//             logger.info(`User [${username}] has been authenticated...`)
//             done(null, true)
            
//         }else{
//             logger.info(`User [${username}] failed authentication process...`)
//             done(null,false)
//         }

//     })
// }