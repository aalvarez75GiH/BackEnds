const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const passport = require('passport')
const mongoose = require('mongoose')

const logger = require('./utils/logger')
const authJWT = require('./api/libs/auth')
const config = require('./config')
const errorHandler = require('./api/libs/errorHandler')
// const path = require('path')

const countersRouter = require('./api/resources/counters/counters.routes')
const intUsersRouter = require('./api/resources/interestedUsers/interestedUsers.routes')
const usersRouter = require('./api/resources/users/users.routes')

const app = express()



app.use(bodyParser.json())
app.use(cors())
app.use(morgan('short', {
    stream: {
        write: message => logger.info(message.trim())
    }
}))

passport.use(authJWT)
app.use(passport.initialize())

// *********** Data Base configuration ******************

mongoose.connect('mongodb://localhost:27017/sh3ch')
mongoose.connection.on('error', () => {
    logger.error('Connection with DB failed...')
    process.exit(1)
})
// ******************************************************


app.use('/api/counters', countersRouter)
app.use('/api/interestedUsers', intUsersRouter)
app.use('/api/users', usersRouter)
app.use(errorHandler.processingDBErrors)
if (config.environmentConfiguration === 'prod'){
    app.use(errorHandler.productionErrors)   
}else{
    app.use(errorHandler.developmentErrors)
}

app.get('/', passport.authenticate('basic', {session:false}), (req,res)=> {
    res.send('sh3ck has born today...')
})



console.log(config)

const server = app.listen(config.port, () => {
    logger.info('ch3ck server running at post 5000...')
})

module.exports = {
    app,
    server
}

