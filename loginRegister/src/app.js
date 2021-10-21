const express = require('express')
const morgan = require('morgan')
const logger = require('../src/utils/logger')
const helmet = require('helmet')
const bodyParser = require('body-parser')
const cors = require('cors')
const api = require('./api/resources/users')
const port = process.env || 5000
const app = express()


app.use(morgan('short',{
    stream:{
        write: message => logger.info(message.trim())
    }
}))
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