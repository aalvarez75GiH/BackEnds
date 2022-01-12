const express = require('express')
const mongoose = require('mongoose')
let  cookieSession = require('cookie-session')
const passport = require('passport')
const cors = require('cors')

const port = 5000
const keys = require("./api/config/keys")
const authRoute = require('./api/resources/authRoutes')
const passportStrategies = require('./api/services/passport')

const app = express()
app.use(cors())
// ===================== DB Connection
const connectionParams={
    useNewUrlParser: true,
    useUnifiedTopology: true 
}

mongoose.connect(keys.mongoURI, connectionParams)
.then( () => {
    console.log('Connected to database ')
})
.catch( (err) => {
    console.error(`Error connecting to the database. \n${err}`);
})


/* ================ Creating Cookie Key and link with Passport JS: Start ================  */
app.use(cookieSession({
    maxAge: 30 * 86400 * 1000,
    keys: [keys.cookieKey]
}))


app.use(passport.initialize())
app.use(passport.session())


// ================== server app intialization
app.use('/auth', authRoute)

app.listen(port, ()=> {
    console.log("Server running at port: ", port)
})




