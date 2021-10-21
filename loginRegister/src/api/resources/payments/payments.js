const express = require('express')
const passport = require('passport')
const jwtAuthorization = passport.authenticate('jwt', { session: false })


const router = express.Router()

router.get('/payments', jwtAuthorization , (req,res)=> {
    res.send(' i am payments')
})

module.exports = router