const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const keys = require('../config/keys')
const facebookUser = require('../models/facebookUsers')


/* =================== Handeling Infinite run: Start ===================  */

  
passport.serializeUser((user, done) => {
    done(null, user)
})

passport.deserializeUser((user, done) => {
    done(null, user)
})

//   For Google

passport.use(new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: "/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
    console.log(profile)
    done(null, profile)
}))

// For facebook
passport.use(new FacebookStrategy({
    clientID: keys.FACEBOOK_APP_ID,
    clientSecret: keys.FACEBOOK_APP_SECRET,
    callbackURL: "/auth/facebook/callback"
}, (accessToken, refreshToken, profile, done) => {
    console.log(profile)
    
    facebookUser.findOne({ fbID: profile.id }).then(existingUser => {
        if (existingUser) {
          done(null, existingUser)
        } else {
          // new user case
          // insert new user id
          new facebookUser({
            fbID: profile.id,
            fullName: profile.displayName,
          })
            .save()
            .then(user => {
              done(null, user)
            })
        }
      })
}))