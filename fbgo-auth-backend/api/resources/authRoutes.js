const express = require('express')
const passport = require('passport')
const router = express.Router()
const keys = require('../config/standard')



router.get("/", (req, res) => {
    res.status(200).send('this is authRoutes...')
})

// Google Routes
router.get('/google', passport.authenticate('google', {scope: ['profile', 'email']})  )

router.get('/google/callback', passport.authenticate('google'), (req, res) => {
//   res.redirect('/profile')  
console.log('this is Google')
})

// Google Routes
router.get('/facebook', passport.authenticate('facebook', {scope: ['public_profile', 'email']}))

router.get('/facebook/callback', passport.authenticate('facebook'), (req, res) => {
//   res.redirect('/profile') 
  console.log('this is Facebook') 
})

module.exports = router
