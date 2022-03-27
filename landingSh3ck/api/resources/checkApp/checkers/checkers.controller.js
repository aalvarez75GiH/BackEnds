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

const findCheckerByCategory = (categoryId) => {
    logger.info(categoryId) 
    return checker.find({
        // cityId: cityId,
        category:  
        {$elemMatch:
            {
                categoryToCheck: categoryId 
            }
        }      
    })
}

const findCheckerByServiceTime = (serviceTimeId) => {
    logger.info(serviceTimeId) 
    return checker.find({
        // cityId: cityId,
        service_time:  
        {$elemMatch:
            {
                service_time_id: serviceTimeId 
            }
        }      
    })
}

const findCheckerByCityAndCategory = (cityId, categoryId) => {
    logger.info(cityId)
    logger.info(categoryId) 
    return checker.find({
        // cityId: cityId,
        cityToCheck: cityId,
        category:    {
            $elemMatch: {
                categoryToCheck: categoryId, 
            }
        }
    })
}

const findCheckerByEveryThing = (cityId, categoryId, serviceTimeId) => {
    logger.info(cityId)
    logger.info(categoryId) 
    logger.info(serviceTimeId)
    return checker.find({
        // cityId: cityId,
        cityToCheck: cityId,
        category:    {
            $elemMatch: {
                categoryToCheck: categoryId, 
            }
        },
        service_time:  {
            $elemMatch: {
                service_time_id: serviceTimeId 
            }
        }
    })
}
// .find(
//     {
//         EmployeeDetails: {
//             $elemMatch:{ 
//                 EmployeePerformanceArea : "C++", 
//                 Year : 1998
//             }
//         }
//     }).pretty();
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
    findCheckerByCategory,
    findCheckerByServiceTime,
    findCheckerByCityAndCategory,
    findCheckerByEveryThing,
    editChecker,
    deleteChecker,
    savePictureUrl,
    findCheckerForLogin,
}
