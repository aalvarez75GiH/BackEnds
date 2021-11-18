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

const findUserForLogin = ({
    email,
    id
}) => {
    if (email) return user.findOne({ email: email })
    if (id) return user.findOne({ _id: id })
    throw new Error ('Get user function from controller was called without specifying id or email')
}




// *************** with Promise
// const findUserForLogin = ({ email, id}) => {
//     return new Promise((resolve, reject) => {
//         if (email){
//             return user.findOne({'email': email})
//             .exec()
//             .then(user => {
//                 resolve(user)
//             })
//             .catch(error => {
//                 reject(error)
//             })
//         }
//         if (id){
//             return user.findOne({'_id': id})
//             .exec()
//             .then(user => {
//                 resolve(user)
//             })
//             .catch(error => {
//                 reject(error)
//             })
//         }
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