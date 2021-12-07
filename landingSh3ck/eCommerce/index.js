require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const mongoose = require('mongoose')
const passport = require('passport')
const productsRouter = require('./api/resources/products/products.routes')
const usersRouter = require('./api/resources/users/users.routes')
const logger = require('./utils/logger')
const authJWT = require('./api/libs/auth')
const config = require('./config')
const errorhandler = require('./api/libs/errorHandler')



const app = express()
app.use(bodyParser.json())
app.use(bodyParser.raw({ type: 'image/*', limit: '1mb'  }))
app.use(morgan('short', {
    stream: {
        write: message => logger.info(message.trim())
    }
}))


passport.use(authJWT)
app.use(passport.initialize())

mongoose.connect('mongodb://localhost:27017/vendetuscorotos')
mongoose.connection.on('error', () => {
    logger.error('Connection with MongoDB failed...')
    process.exit(1)
})



app.use('/api/products', productsRouter)
app.use('/api/users', usersRouter)
app.use(errorhandler.processingDBErrors)
app.use(errorhandler.processingBodySizeErrors)
if (config.environment === 'prod'){
    app.use(errorhandler.productionErrors)
}else{
    app.use(errorhandler.developmentErrors)
}

const server = app.listen(config.port, ()=> {
    logger.info('Server running at port 3000...')
})

module.exports = {
    app,
    server
}



