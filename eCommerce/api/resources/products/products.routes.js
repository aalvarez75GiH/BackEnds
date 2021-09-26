const express = require('express')
const bodyParser = require('body-parser')
const _ = require('underscore')
const { v4: uuidv4 } = require("uuid");

const products = require('./../../../database').products
const validateProduct = require('./products.validate')
const logger = require('../../../utils/logger')

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

productsRouter.post( '/', validateProduct, ( req,res ) => {
        let newProduct = req.body
        newProduct.id = uuidv4();  
        products.push(newProduct)
        logger.info('Product added to the Products collection', newProduct)
        res.status(201).json(newProduct)
})


productsRouter.put( '/:id', validateProduct, ( req, res ) => {
    let id = req.params.id
    let dataToChange = req.body

    const index = _.findIndex(products, product => product.id == id)
    if (index !== -1 ){
        dataToChange.id = id
        products[index] = dataToChange
        logger.info(`Product with id: [${id}] has been replaced it`, dataToChange)
        res.status(200).json(dataToChange)
    }else {
        res.status(404).send(`Sorry, we could NOT find the product with ID [${id}]`)
    } 
})

productsRouter.delete( '/:id' , ( req,res ) => {
    let id = req.params.id
    const index = _.findIndex(products, product => product.id == id)
    if (index !== -1){
        const productDeleted = products.splice(index,1)
        logger.info(`Product with id: [${id}] has been deleted`, productDeleted)
        res.status(200).json(productDeleted).send('The Product has been Removed successfully...')
        //res.status(200).json(productDeleted)
        
    }else{
        logger.warn(`Product with id: [${id}] do not exists...`)
        res.status(404).send(`Sorry, we could NOT find the product with ID [${id}]`)
    }
})

module.exports = productsRouter




