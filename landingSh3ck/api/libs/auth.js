const passport = require('passport')
const users = require('../../database').users
const _ = require('underscore')
const logger = require('../../utils/logger')
const bcrypt = require('bcrypt')

module.exports = (username, password, done) => {
    const index =  _.findIndex(users, user => user.email === username)
    if (index === -1){
        logger.warn(`User ${username} was not found...`)
        return done(null, false)
    }
    
    const hashedPassword = users[index].password
    bcrypt.compare(password, hashedPassword, (err, match)=> {
        if (match) {
            logger.info(`User [${username}] has been authenticated...`)
            return done(null, true)
            
        }else{
            logger.info(`User [${username}] not authenticated...`)
            done(null, false)
        }
    })
    
}

