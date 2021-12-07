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
const port = process.env.PORT || 5000


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

const url = `mongodb+srv://sh3ckAdmin:Nm74sc84Cs97lc.@cluster0.ztfck.mongodb.net/landingSh3ckDB?retryWrites=true&w=majority`;

const connectionParams={
    useNewUrlParser: true,
    useUnifiedTopology: true 
}
mongoose.connect(url,connectionParams)
    .then( () => {
        console.log('Connected to database ')
    })
    .catch( (err) => {
        console.error(`Error connecting to the database. \n${err}`);
    })

// mongoose.connect('mongodb://localhost:27017/sh3ch')
// mongoose.connection.on('error', () => {
//     logger.error('Connection with DB failed...')
//     process.exit(1)
// })
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


const server = app.listen(port, () => {
    logger.info('ch3ck server running at post 5000...')
})

module.exports = {
    app,
    server
}

