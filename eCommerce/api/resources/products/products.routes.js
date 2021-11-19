const express = require('express')
const passport = require('passport')


const validateProduct = require('./products.validate')
const logger = require('../../../utils/logger')
const productController = require('./products.controller')
const jwtAuthorization = passport.authenticate('jwt', { session: false })
const processingErrors = require('../../libs/errorHandler').processingErrors
const productsRouter = express.Router()


const validarID = (req, res, next) => {
    let id = req.params.id
    if(id.match(/^[a-fA-F0-9]{24}$/) === null){
        res.status(400). send(`id [${id}] entered is not valid...`)
        return
    }
    next()

}

productsRouter.get( '/', processingErrors((req,res ) => {
    return productController.getProducts()
    .then(products => {
        res.status(201).json(products)
    })
    // .catch(error => {
    //     logger.error('Sorry, we had a problem when we were reading at DB...')
    //     res.status(500).send('Sorry, we had a problem when we were reading at DB...')
    // })    
}))


productsRouter.get( '/:id', validarID, processingErrors((req,res) => {
    let id = req.params.id
    return productController.getOneProduct(id)
    .then(product => {
        if (!product){
            logger.error(`Product with id [${id}] do not exists at DB...`)
            res.status(404).send(`Product with id [${id}] do not exists at DB...`)
        
        }else{
            logger.info(`Product with id [${id}] has been retrieved from DB successfully...`)
            res.status(201).json(product)
        }
        
    })
    // .catch(error => {
    //     logger.error(`Error: There was an exception when we tried to get Product with id: [${id}]`)
    //     res.status(500).send(`Error: There was an exception when we tried to get Product with id: [${id}]`)
    // })
}))

// productsRouter.post( '/', [ jwtAuthorization, validateProduct ], (req,res) => {
        
//     productController.createProduct(req.body, req.user.username)
//     .then(product => {
//         logger.info('Product added to the Products collection', product.toObject())
//         res.status(201).json(product)
//     })
//     .catch(error => {
//         logger.error('Product could not be added to collection...', product.toObject())
//         res.status(500).send('Product could not be added to collection...')
//     })
// })

productsRouter.post( '/', [ jwtAuthorization, validateProduct ], processingErrors((req,res) => {
    return productController.createProduct(req.body, req.user.username)
    .then(product => {
        logger.info('Product added to the Products collection', product.toObject())
        res.status(201).json(product)
    })
}))


productsRouter.put( '/:id', [ jwtAuthorization, validarID, validateProduct ], processingErrors(async(req,res) => {
    let id = req.params.id    
    let userWantToPut = req.user.username
    let productToReplace

    productToReplace = await productController.getOneProduct(id)
    
    if (!productToReplace){
        logger.info(`Product with id [${id}] do not exists at DB...`)
        res.status(404).send(`Product with id [${id}] do not exists at DB...`)    
        return
    }

    if( productToReplace.owner !== userWantToPut){
        logger.warn(`User ${userWantToPut} do not own Product with id ${id}. it can not be Replaced`)
        res.status(401).send(`Sorry, you are not the owner of Product ID ${id} 
        you can not replace it if you are not the owner`)
        return
    } 

    productController.replaceProduct(id, req.body, userWantToPut)
    .then(productReplaced => {
        logger.info(`Product with id [${id}] has been replaced successfully... `, productReplaced.toObject())
        res.json(productReplaced.toObject())
    })
     
}))

productsRouter.delete( '/:id' , [ jwtAuthorization, validarID ], processingErrors(async( req,res ) => {
    let id = req.params.id
    let userWantDelete = req.user.username
    let productToDelete
    
    productToDelete = await productController.getOneProduct(id)
            
    if (!productToDelete){
        logger.info(`Product with id [${id}] do not exists at DB...`)
        res.status(404).send(`Product with id [${id}] do not exists at DB...`)    
        return
    }

    if(productToDelete.owner !== userWantDelete){
        logger.info(`User ${userWantDelete} do not own Product with id ${id}. it can not be deleted`)
        res.status(401).send(`Sorry, you are not the owner of Product ID ${id} 
        you can not delete it if you are not the owner`)
        return 
    }

    const productDeleted = await productController.deleteProduct(id)
    logger.info(`Product with id [${id}] was deleted successfully...`)
    res.json(productDeleted)
}))

module.exports = productsRouter




