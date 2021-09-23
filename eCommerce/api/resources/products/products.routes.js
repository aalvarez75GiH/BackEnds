const express = require('express')
const bodyParser = require('body-parser')
const _ = require('underscore')
const { v4: uuidv4 } = require("uuid");
const products = require('./../../../database').products

const productsRouter = express.Router()
// const app = express()


productsRouter.route('/')
    .get((req, res)=> {
        res.json(products)
    })
    .post((req,res)=> {
        let newProduct = req.body
        if (!newProduct.title || !newProduct.price || !newProduct.currency ){
            res.status(400).send('This request failed, incomplete information') 
            return
        }
        newProduct.id = uuidv4();  
        products.push(newProduct)
        res.status(201).json(newProduct)
    })


productsRouter.route('/:id')
    .get((req, res)=> {
        products.map((product)=> {
            if (product.id === req.params.id){
                res.json(product)
                return
            }
        })
        res.status(404).send('Product not found from .map')
    })
    .put((req, res)=> {
        let id = req.params.id
        let dataToChange = req.body
        if (!dataToChange.title || !dataToChange.price || !dataToChange.currency ){
            res.status(400).send('This request failed, incomplete information') 
            return
        }
        
        const index = _.findIndex(products, product => product.id == id)
        if (index !== -1 ){
            dataToChange.id = id
            products[index] = dataToChange
            res.status(200).json(dataToChange)
        }else {
            res.status(404).send(`Sorry, we could NOT find the product with ID [${id}]`)
        } 
    })
    .delete((req,res)=>{
        let id = req.params.id
        const index = _.findIndex(products, product => product.id == id)
        if (index !== -1){
            const productDeleted = products.splice(index,1)
            res.status(200).json(productDeleted).send('The Product has been Removed successfully...')
            //res.status(200).json(productDeleted)
            
        }else{
            res.status(404).send(`Sorry, we could NOT find the product with ID [${id}]`)
        }
    })

module.exports = productsRouter




