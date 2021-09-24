const express = require('express')
const bodyParser = require('body-parser')
const productsRouter = require('./api/resources/products/products.routes')

const app = express()
app.use(bodyParser.json())

app.use('/api/products', productsRouter)

app.get('/', (req,res)=> {
    res.send('Welcome to my E-Commerce API BackEnd...')
})

app.listen(3000, ()=> {
    console.log('Server running at port 3000...')
})



