const user = require('./users.model')

const getUsers = () => {
    return user.find({})
}

const findUser = (newUser) => {
    return new Promise((resolve, reject) => {
        user.find().or([{'username': newUser.username},{'email': newUser.email}])
        .then(users => {
            resolve(users.length > 0)
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
    createUser,
    findUser,
}

