const express = require('express')
const bodyParser = require('body-parser')
const productsRouter = require('./api/resources/products/products.routes')

const app = express()
app.use(bodyParser.json())
//const productsRouter = require('./products.routes')
// Provisional DataBase...

app.use('/api/products', productsRouter)

app.get('/', (req,res)=> {
    res.send('Welcome to my E-Commerce API BackEnd...')
})

// app.use('/api/products', productsRouter)

app.listen(3000, ()=> {
    console.log('Server running at port 3000...')
})

// module.exports = app


