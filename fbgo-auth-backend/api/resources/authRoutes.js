const express = require('express')
const passport = require('passport')
const router = express.Router()
const keys = require('../config/keys')



router.get("/", (req, res) => {
    console.log(keys.googleClientSecret)
    res.status(200).json({
        googleClientID: keys.googleClientID,
        googleClientSecret: keys.googleClientSecret
    })
})

// Google Routes
router.get('/google', passport.authenticate('google', {scope: ['profile', 'email']})  )

router.get('/google/callback', passport.authenticate('google'), (req, res) => {
//   res.redirect('/profile')  
console.log('this is Google')
res.redirect('http://developers.google.com')
})

// Google Routes
router.get('/facebook', passport.authenticate('facebook', {scope: ['public_profile', 'email']}))

router.get('/facebook/callback', passport.authenticate('facebook'), (req, res) => {
  res.redirect('http://www.zdnet.com') 
//   console.log('this is Facebook') 
})

module.exports = router
