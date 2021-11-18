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

const findUserForLogin = ({
    username: username,
    id: id
}) => {
    if (username) return user.findOne({ username: username })
    if (id) return user.findOne({ id : id })
    throw new Error ('Get user function from controller was called without specifying id or username')
}

// const findUserForLogin = (notAuthUser) => {
//     return new Promise((resolve, reject) => {
//         user.findOne({'username': notAuthUser.username })
//         .exec()
//         .then(user => {
//             resolve(user)
//         })
//         .catch(error => {
//             reject(error)
//         })
//     })
// }

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

