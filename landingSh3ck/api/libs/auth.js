const logger = require('../../utils/logger')
const passportJWT = require('passport-jwt')
const config = require('../../config')
const usersController = require('../resources/users/users.controller')
const adminUsersController = require('../resources/checkApp/adminUsers/adminUsers.controller')


const jwtOptions = {
    secretOrKey: config.jwt.secret,
    jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken()
}


module.exports = new passportJWT.Strategy(jwtOptions, (jwtPayload, next) => {
    logger.info('jwtPayload:', jwtPayload)
    usersController.findUserForLogin({ id: jwtPayload.id})
    .then( foundUser => {
        if(!foundUser){
            adminUsersController.findAdminUserForLogin({ id: jwtPayload.id})
            .then( found => {
                if(!found){
                    // logger.warn(`JWT not valid. User with id ${ jwtPayload.id } couldn't be found...`)
                    logger.warn(`JWT not valid. Token couldn't be found...`)
                    next(null, false)
                    return
                }
                // logger.info('its here tho:', found.fullName)
                next(null, {
                    fullName: found.fullName,
                    role: found.role    
                }) 
            }) 
            return
        }
        logger.info(`User ${ foundUser.email } has provided a valid token `)
        next(null, {
            fullName: foundUser.fullName,
            email: foundUser.email,
            role: foundUser.role
        })            
    })
    .catch(error => {
        logger.error(`An error occurred when we tried to find user with id: [${jwtPayload.id}]`, error)
        next(error, false)
    })
})



// const adminUsersAuth = new passportJWT.Strategy(jwtOptions, (jwtPayload, next) => {
//     logger.info('jwtPayload:', jwtPayload)
//     adminUsersController.findAdminUserForLogin({ id: jwtPayload.id})
//     .then( foundUser => {
//         if(!foundUser){
//             logger.warn(`JWT not valid. User with id ${ jwtPayload.id } couldn't be found...`)
//             next(null, false)    
//             return
//         }
//         logger.info(`User ${ foundUser.email } has provided a valid admin token`)
//         //next(null, 'hello')
//         next(null, {
//             fullName: foundUser.fullName,
//             email: foundUser.email,
//             role: foundUser.role
//         })            
//     })
//     .catch(error => {
//         logger.error(`An error occurred when we tried to find user with id: [${jwtPayload.id}]`, error)
//         next(error, false)
//     })
// })

// module.exports = usersAuth
    // adminUsersAuth



