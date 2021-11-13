const interestedUser = require('./interestedUsers.model')
const logger = require('../../../utils/logger')


const createInterestedUser = (newUser) => {
    return new interestedUser({
        ...newUser
    }).save()
        
}
const getInterestedUsers = () => {
    return interestedUser.find({})
}

module.exports = {
    createInterestedUser,
    getInterestedUsers 
}
