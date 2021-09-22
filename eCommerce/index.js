const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const productsRouter = require('./products.routes')
// Provisional DataBase...
// const products = [
//     {
//         id:'000001',
//         title: 'this is my fender guitar...',
//         price: 800,
//         currency: 'USD'
//     },
//     {
//         id:'000002',
//         title: 'this is my Bed...',
//         price: 600,
//         currency: 'USD'
//     },
//     {
//         id:'000003',
//         title: 'Selling these Books..',
//         price: 5,
//         currency: 'USD'
//     }
// ]
// app.route('/api/products')
//     .get((req,res)=> {
//         res.json(products)
//     })

//app.get('/api/products/:id', (req,res)=> {
    // for (let product of products){
    //     if (product.id == req.params.id){
    //         res.json(product)
    //         return
    //     }
    // }
//     products.map((product)=> {
//         if (product.id === req.params.id){
//             res.json(product)
//             return
//         }
//     })
//     res.status(404).send('Product not found from .map')
// })

app.get('/', (req,res)=> {
    res.send('Welcome to my E-Commerce API BackEnd...')
})

app.use('/api/products', productsRouter)

app.listen(3000, ()=> {
    console.log('Server running at port 3000...')
})

module.exports = app


