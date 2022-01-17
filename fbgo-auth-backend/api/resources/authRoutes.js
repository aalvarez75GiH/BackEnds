const express = require('express')
const passport = require('passport')
// const router = express.Router()
const keys = require('../config/keys')
let user

module.exports = (app) => {

  app.get("/", (req, res) => {
      console.log(keys.googleClientSecret)
      res.status(200).json({
          googleClientID: keys.googleClientID,
          googleClientSecret: keys.googleClientSecret
      })
  })
  
  // Obtaining current user
  
  app.get('/api/current_user', (req, res) => {
    console.log('this is current user...')
    res.send(req.user)
  })
  
  app.get('/api/logout', (req,res) => {
    req.logout()
    res.redirect('http://www.microsoft.com')
  })
  
  // Google Routes
  app.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']})  )
  
  app.get('/auth/google/callback', passport.authenticate('google'), 
  (req, res) => {
  console.log(req.user)    
  // user = req.user
  console.log('this is Google')
  res.redirect('http://localhost:3000')
  })
  
  // Google Routes
  app.get('/auth/facebook', passport.authenticate('facebook', {scope: ['public_profile', 'email']}))
  
  app.get('/auth/facebook/callback', passport.authenticate('facebook'), 
  (req, res) => {
    console.log('this is Facebook') 
    res.redirect('http://localhost:3000/profile') 
  })

} 
