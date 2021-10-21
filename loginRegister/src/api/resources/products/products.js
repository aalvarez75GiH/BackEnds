const express = require('express')
const _ = require('underscore')
const { v4: uuidv4 } = require("uuid")
const passport = require('passport')
const router = express.Router()
jwtAuthorization = passport.authenticate('jwt', { session: false })

const products = require('../../../provisionalDB').products

router.get('/products', (req,res)=> {
    res.send(products)
})
// router.get('/payments', (req,res)=> {
//     res.send(' i am payments')
// })

// router.delete( '/:id' , jwtAuthorization, ( req,res ) => {
//     let id = req.params.id
//     const index = _.findIndex(products, product => product.id === id)
//     if (index !== -1){
//         if (products[index].owner !== req.user.username){
//             logger.info(`${req.user.username} do not own Product with id ${id}. it can not be deleted`)
//             res.status(401).send(`Sorry, you are not the owner of Product ID ${id} 
//             you can not delete it if you are not the owner`)
//             return
//         }

//         const productDeleted = products.splice(index,1)
//         logger.info(`Product with id: [${id}] has been deleted`, productDeleted)
//         //res.status(200).json(productDeleted).send('The Product has been Removed successfully...')
//         res.status(200).send('The Product has been Removed successfully...')
//         //res.status(200).json(productDeleted)
        
//     }else{
//         logger.warn(`Product with id: [${id}] do not exists...`)
//         res.status(404).send(`Sorry, we could NOT find the product with ID [${id}]`)
//     }
// })

module.exports = router