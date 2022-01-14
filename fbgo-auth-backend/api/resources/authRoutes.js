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

// Obtaining current user

router.get('/current_user', (req, res) => {
  console.log('this is current user...')
  console.log('this is the request: ', req)
  res.status(200).json(req.user)
})

router.get('/logout', (req,res) => {
  req.logout()
  res.redirect('http://www.microsoft.com')
})

// Google Routes
router.get('/google', passport.authenticate('google', {scope: ['profile', 'email']})  )

router.get('/google/callback', passport.authenticate('google'), (req, res) => {  
console.log('this is Google')
res.redirect('http://localhost:3000/profile')
})

// Google Routes
router.get('/facebook', passport.authenticate('facebook', {scope: ['public_profile', 'email']}))

router.get('/facebook/callback', passport.authenticate('facebook'), (req, res) => {
  console.log('this is Facebook') 
  res.redirect('http://localhost:3000/profile') 
})



module.exports = router
