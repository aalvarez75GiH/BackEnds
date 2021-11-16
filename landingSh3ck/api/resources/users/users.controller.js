const user = require('./users.model')

const createUser = (newUser, hashedPassword) => {
    new user({
        ...newUser,
        password: hashedPassword
    }).save()
        
}


module.exports = {
    createUser
}