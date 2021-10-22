const express = require('express')
const _ = require('underscore')
const bcrypt = require('bcrypt')
const { v4: uuidv4 } = require('uuid')
const logger = require('../../../utils/logger')
const router = express.Router()
const users = require('../../../provisionalDB').users


router.get('/users', (req,res)=> {
    res.json(users)
})

router.post('/register', async(req, res)=> {
    
    const { fullName, email, password } = req.body
    
    const index = _.findIndex(users, user => {
        return user.email === email 
    })
    if (index !== -1){
        logger.info(`User with email ${email} already registered...`)
        return res.json({
            message: `User with email: ${email} already registered at Database...`
        })
    }

    bcrypt.hash(password, 10, (error, hashedPassword)=> {
        if (error){
            logger.error('An error ocurred when we tried to hash user`s password', error)
            res.status(500).json(`An error ocurred when we tried to hash user's ${email} password`)
        }

        users.push({
            fullName: fullName,
            email: email,
            password: hashedPassword,
            id: uuidv4()
        }) 
        console.log(req.body)
        logger.info(`User [${fullName}] has been created...`)
        res.status(201).json(`User [${fullName}] has been created...`)
    })
})
module.exports = router
























// Backup
// module.exports = router

// const express = require('express')
// const User = require('../../../models/user')
// const router = express.Router()
// const users = require('../../../provisionalDB').users


// router.post('/register', async(req, res)=> {
    
//     const { fullName, email, password } = req.body
    
//     const alreadyExistsUser = await User.findOne({where:{ email }}).catch((error) =>{
//         console.log(error)
//     })
//     if (alreadyExistsUser){
//         return res.json({
//             message: `User with email: ${email} already exists at Database...`
//         })
//     }
//     const newUser = new User({ fullName, email, password })
//     const savedUser = await newUser.save()
//     .catch((err)=>{
//         console.log('Error:' , err)
//         res.json({
//             error: `There was an error at the moment`
//         })
//     })
    
//     if (savedUser){
//         console.log(req.body)
//         res.json({
//             message: 'User has been registered...'
//         })
//     }
    
// })

// module.exports = router

