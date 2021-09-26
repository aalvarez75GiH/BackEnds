const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')

const productsRouter = require('./api/resources/products/products.routes')
const logger = require('./utils/logger')

const { debug } = require('winston')


const app = express()
app.use(bodyParser.json())
app.use(morgan('short', {
    stream: {
        write: message => logger.info(message.trim())
    }
}))

app.use('/api/products', productsRouter)

app.get('/', (req,res)=> {
    res.send('Welcome to my E-Commerce API BackEnd...')
})

app.listen(3000, ()=> {
    logger.info('Server running at port 3000...')
})



