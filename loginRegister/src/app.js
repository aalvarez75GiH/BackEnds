const express = require('express')
const morgan = require('morgan')
const passport = require('passport')
const logger = require('../src/utils/logger')
const helmet = require('helmet')
const bodyParser = require('body-parser')
const cors = require('cors')
const api = require('./api/index')
const products = require('./api/index')
const port = process.env || 5000
const authJWT = require('./api/middleware/auth/passport')
const app = express()

// require('./api/middleware/auth/passport')


app.use(morgan('short',{
    stream:{
        write: message => logger.info(message.trim())
    }
}))

passport.use(authJWT)
app.use(passport.initialize())

app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())



app.get('/', (req,res)=> {
    res.json({
        message:'This is working...'
    })
})


app.use('/api/v1', api)



 module.exports = app