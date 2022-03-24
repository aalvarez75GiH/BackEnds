const logger = require('../../../../utils/logger')
const adminUser = require('./adminUsers.model')

const getAdminUsers = () => {
    return adminUser.find({}) 
}

const findAdminUser = (newUser) => {
    return new Promise((resolve,reject) => {
        adminUser.find({email: newUser.email})
        .then( users => {
            resolve( users.length > 0)
        })
        .catch(error => {
            reject(error)
        })
    })
}
const findAdminUserForLogin = ({
    email,
    id
}) => {
    if (email) return adminUser.findOne({ email: email })
    if (id) return adminUser.findOne({ _id: id })
    throw new Error ('Get admin function from controller was called without specifying id or email')
}

const createAdminUser = (newUser, hashedPIN) => {
    return new adminUser({
        ...newUser,
        pin: hashedPIN,
        role: 'admin'
    }).save()      
}

module.exports = {
    getAdminUsers,
    findAdminUser,
    createAdminUser,
    findAdminUserForLogin
}