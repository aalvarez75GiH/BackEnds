const bcrypt = require('bcrypt')
const logger = require('../../utils/logger')
const users = require('../../database').users
const _ = require('underscore')



module.exports = (username, password, done) => {
    const index = _.findIndex(users, user => user.username === username )
    if (index === -1){
        logger.warn(`User ${ username } doesn't exist in the Database..`)
        done(null, false)
        return
    }
    const hashedPassword = users[index].password
    bcrypt.compare(password, hashedPassword, ( err, same )=> {
        if (same){
            logger.info(`User [${username}] has been authenticated...`)
            done(null, true)
            
        }else{
            logger.info(`User [${username}] failed authentication process...`)
            done(null,false)
        }

    })
}