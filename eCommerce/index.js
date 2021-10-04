const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const passport = require('passport')
//const { BasicStrategy } = require('passport-http')
const productsRouter = require('./api/resources/products/products.routes')
const usersRouter = require('./api/resources/users/users.routes')
const logger = require('./utils/logger')
const authJWT = require('./api/libs/auth')
//const basicAuth = require('./api/libs/basicAuth')



const app = express()
app.use(bodyParser.json())
app.use(morgan('short', {
    stream: {
        write: message => logger.info(message.trim())
    }
}))

//passport.use( new BasicStrategy(basicAuth))
passport.use(authJWT)
app.use(passport.initialize())

app.use('/api/products', productsRouter)
app.use('/api/users', usersRouter)

//app.get('/', passport.authenticate('jwt', { session: false }), (req,res) => {
    //logger.info(req.user)
    //logger.info(`username: ${req.user.username}, id: ${req.user.id}`)
    //res.send('Welcome to my E-Commerce API BackEnd...')
//})

app.listen(3000, ()=> {
    logger.info('Server running at port 3000...')
})


//passport.authenticate('basic', {session: false}),
