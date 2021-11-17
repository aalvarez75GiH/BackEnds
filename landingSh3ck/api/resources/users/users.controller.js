const logger = require('../../../utils/logger')
const user = require('./users.model')

const getUsers = () => {
    return user.find({}) 
}

const findUser = (newUser) => {
    return new Promise((resolve,reject) => {
        user.find({email: newUser.email})
        .then( users => {
            resolve( users.length > 0)
        })
        .catch(error => {
            reject(error)
        })
    })
}

const findUserForLogin = (notAuthUser) => {
    return new Promise((resolve, reject) => {
        user.findOne({'email': notAuthUser.email})
        .exec()
        .then(user => {
            logger.info(user)
            resolve(user)
        })
        .catch(error => {
            reject(error)
        })
    })
}


const createUser = (newUser, hashedPassword) => {
    return new user({
        ...newUser,
        password: hashedPassword
    }).save()      
}


module.exports = {
    getUsers,
    findUser,
    findUserForLogin,
    createUser
}