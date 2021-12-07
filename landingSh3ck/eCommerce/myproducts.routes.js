const express = require('express')

const products = [
    {
        id:'000001',
        title: 'this is my fender guitar...',
        price: 800,
        currency: 'USD'
    },
    {
        id:'000002',
        title: 'this is my Bed...',
        price: 600,
        currency: 'USD'
    },
    {
        id:'000003',
        title: 'Selling these Books..',
        price: 5,
        currency: 'USD'
    },
    {
        id:'000004',
        title: 'Beatiful Lamp from my grandMa...',
        price: 5,
        currency: 'USD'
    }
]

const productsRouter = express.Router();

productsRouter.get('/', (req,res)=> {
    res.json(products)
    return
})

productsRouter.get('/explore',(req,res)=> {
    res.send('Here you will have products to explore...')
})
productsRouter.get('/:id', (req,res)=> {
    // for (let product of products){
    //     if (product.id == req.params.id){
    //         res.json(product)
    //         return
    //     }
    // }
    products.map((product)=> {
        if (product.id === req.params.id){
            res.json(product)
            return
        }
    })
    res.status(404).send('Product not found from .map')
})

module.exports = productsRouter