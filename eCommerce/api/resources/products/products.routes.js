const express = require('express')
const _ = require('underscore')
const { v4: uuidv4 } = require("uuid")
const passport = require('passport')


const products = require('./../../../database').products
const validateProduct = require('./products.validate')
const logger = require('../../../utils/logger');
const jwtAuthorization = passport.authenticate('jwt', { session: false })
const productsRouter = express.Router()


productsRouter.get( '/', ( req, res ) => {
        res.json(products)
})

productsRouter.get( '/:id', ( req, res ) => {
    products.map((product)=> {
        if (product.id === req.params.id){
            res.json(product)
            return
        }
    })

    res.status(404).send('Product not found from .map')
})

productsRouter.post( '/', [ jwtAuthorization, validateProduct ], ( req,res ) => {
        let newProduct = {
            ...req.body,
            id: uuidv4(),
            owner: req.user.username
        }   
        products.push(newProduct)
        logger.info('Product added to the Products collection', newProduct)
        res.status(201).json(newProduct)
})


productsRouter.put( '/:id', [ jwtAuthorization, validateProduct ], ( req, res ) => {
    
    let dataToChange = {
        ...req.body,
        id: req.params.id,
        owner: req.user.username
    }
    
    // let dataToChange = {
    //     ...req.body,
    //     id: req.params.id,
    //     owner: req.user.username,
    //     ownerID: req.user.id
    // }

    const index = _.findIndex(products, product => product.id === dataToChange.id)
    if (index !== -1 ){
        if (products[index].owner !== dataToChange.owner){
            logger.info(`${req.user.username} do not own Product with id ${dataToChange.id}`)
            res.status(401).send(`Sorry, you are not the owner of Product ID ${dataToChange.id} `)
            return
        }
        
        products[index] = dataToChange
        logger.info(`Product with id: [${dataToChange.id}] has been replaced it`, dataToChange)
        res.status(200).json(dataToChange)
        
        
    }else {
        res.status(404).send(`Sorry, we could NOT find the product with ID [${dataToChange.id}]`)
    } 
})

productsRouter.delete( '/:id' , jwtAuthorization, ( req,res ) => {
    let id = req.params.id
    const index = _.findIndex(products, product => product.id === id)
    if (index !== -1){
        if (products[index].owner !== req.user.username){
            logger.info(`${req.user.username} do not own Product with id ${id}. it can not be deleted`)
            res.status(401).send(`Sorry, you are not the owner of Product ID ${id} 
            you can not delete it if you are not the owner`)
            return
        }

        const productDeleted = products.splice(index,1)
        logger.info(`Product with id: [${id}] has been deleted`, productDeleted)
        //res.status(200).json(productDeleted).send('The Product has been Removed successfully...')
        res.status(200).send('The Product has been Removed successfully...')
        //res.status(200).json(productDeleted)
        
    }else{
        logger.warn(`Product with id: [${id}] do not exists...`)
        res.status(404).send(`Sorry, we could NOT find the product with ID [${id}]`)
    }
})

module.exports = productsRouter




