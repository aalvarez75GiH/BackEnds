const express = require('express')
const bodyParser = require('body-parser')
const logger = require('./utils/logger')
const morgan = require('morgan')

const countersRouter = require('./api/resources/counters/counters.routes')
const usersRouter = require('./api/resources/users/users.routes')
const registeredUsersRouter = require('./api/resources/registeredUsers/registeredUsers.routes')

const app = express()
app.use(bodyParser.json())
app.use(morgan('short', {
    stream: {
        write: message => logger.info(message.trim())
    }
}))

app.use('/api/counters', countersRouter)
app.use('/api/users', usersRouter)
app.use('/api/register', registeredUsersRouter)

app.get('/', (req,res)=> {
    res.send('sh3ck has born today...')
})

app.listen(3000, () => {
    logger.info('ch3ck server running at post 3000...')
    // console.log('ch3ck server running at post 3000...')
})

