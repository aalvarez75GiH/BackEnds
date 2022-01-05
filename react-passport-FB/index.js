const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const passport = require('passport')
const passportSetup = require('./passport')
const cookieSession = require('cookie-session')
const authRouter = require('./routes/auth')

const app = express()
const port = process.env.PORT || 5000

app.use(cookieSession({name: "session", keys: ["lama"], maxAge: 24 * 60 * 60 * 100}))

app.get('/', (req,res) => {
    res.send('facebook authentication Server')
})

app.use(passport.initialize())
app.use(passport.session())
app.use(cors({
    origin: "http://localhost:3000", 
    methods: 'GET,POST,PUT,DELETE',
    credentials:true,            //access-control-allow-credentials:true
 }))
app.use('/auth', authRouter )

const server  = app.listen(port, () => {
    console.log(`Server running at port # ${port}`)
})

