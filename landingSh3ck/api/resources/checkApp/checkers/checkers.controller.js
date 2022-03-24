const logger = require('../../../../utils/logger')
const checker = require('./checkers.model')

const getCheckers = () => {
    return checker.find({}) 
}
const findChecker = (newChecker) => {
    return new Promise((resolve,reject) => {
        checker.find({email: newChecker.email})
        .then( checkers => {
            resolve( checkers.length > 0)
        })
        .catch(error => {
            reject(error)
        })
    })
}

const findCheckerForLogin = ({
    email,
    id
}) => {
    if (email) return checker.findOne({ email: email })
    if (id) return checker.findOne({ _id: id })
    throw new Error ('Get checker function from controller was called without specifying id or email')
}

const findOneChecker = (id) => {
    return checker.findById(id)
}

const findCheckerByCity = (cityId) => {
    return checker.find({
        cityToCheck: cityId
    })
}
// const findCheckerByEveryThing = (cityId, categoryId, serviceTimeId) => {
//     return checker.find({
//         cityToCheck: cityId,
//         categoryToCheck: categoryId,
//         serviceTime: serviceTimeId

//     })
// }
const createChecker = (newChecker, hashedPIN) => {
    return new checker({
        ...newChecker,
        pin: hashedPIN,
        role: 'checker'
    }).save()      
}

const editChecker = (updatedChecker, id) => {
    return checker.findOneAndUpdate({_id: id}, {
        ...updatedChecker,
        fullName: updatedChecker.fullName,
        email: updatedChecker.email,
        phoneNumber: updatedChecker.phoneNumber,
        identification: updatedChecker.identification,
        address: updatedChecker.address,
        picture: updatedChecker.picture,
        backgroundCheck: updatedChecker.backgroundCheck,
        cityToCheck: updatedChecker.cityToCheck,
        categoryToCheck: updatedChecker.categoryToCheck,
        serviceTime: updatedChecker.serviceTime,
        rating: updatedChecker.rating
    
    },{
        new: true //This option is in order to return the new document modified
    })
}

const deleteChecker = (id) => {
    return checker.findByIdAndRemove(id)
}

const savePictureUrl = (id, pictureUrl) => {
    logger.info(`this is pictureUrl at controller: ${pictureUrl}`)
    return checker.findOneAndUpdate({_id: id},{
        picture: pictureUrl
    },{
        new: true //This option is in order to return the new document modified
    })
}

module.exports = {
    getCheckers,
    findOneChecker,
    findChecker,
    createChecker,
    findCheckerByCity,
    editChecker,
    deleteChecker,
    savePictureUrl,
    findCheckerForLogin,
    // findCheckerByEveryThing
}
