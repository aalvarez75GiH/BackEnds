const express = require('express')
const bodyParser = require('body-parser')
const logger = require('./utils/logger')
const morgan = require('morgan')
const cors = require('cors')
// const path = require('path')

const countersRouter = require('./api/resources/counters/counters.routes')
const intUsersRouter = require('./api/resources/interestedUsers/interestedUsers.routes')
const usersRouter = require('./api/resources/users/users.routes')

const app = express()
// app.use(express.static(path.join('../../FrontEnds/landingsh3ck/','build')))
app.use(bodyParser.json())
app.use(cors())
app.use(morgan('short', {
    stream: {
        write: message => logger.info(message.trim())
    }
}))

app.use('/api/counters', countersRouter)
app.use('/api/interestedUsers', intUsersRouter)
app.use('/api/users', usersRouter)

app.get('/', (req,res)=> {
    res.send('sh3ck has born today...')
})

// app.get('*', (req,res)=>{
//     res.sendFile(path.join('../../FrontEnds/landingsh3ck'+'/build/index.html'))
// })

app.listen(5000, () => {
    logger.info('ch3ck server running at post 5000...')
})

