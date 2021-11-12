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



const app = express()
app.use(bodyParser.json())
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

//app.get('/', passport.authenticate('jwt', { session: false }), (req,res) => {
    //logger.info(req.user)
    //logger.info(`username: ${req.user.username}, id: ${req.user.id}`)
    //res.send('Welcome to my E-Commerce API BackEnd...')
//})
// console.log(config)
app.listen(config.port, ()=> {
    logger.info('Server running at port 3000...')
})


//passport.authenticate('basic', {session: false}),
