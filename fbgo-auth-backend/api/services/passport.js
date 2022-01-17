const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const keys = require('../config/keys')
const externalUser = require('../models/externalUsers')


/* =================== Handeling Infinite run: Start ===================  */

  
passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  externalUser.findById(id).then(user => {
    done(null, user)
  })
})
/* =================== Handeling Infinite run: End ===================  */



/* =================== Passport Strategies ===================  */

//   For Google

passport.use(new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: "/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
    console.log(profile)

    externalUser.findOne({ goID: profile.id }).then(existingUser => {
        if (existingUser) {
          console.log('The google user exists...')
          done(null, existingUser)
        } else {
          new externalUser({
            typeUser: profile.provider,
            fbID: 'not applicable',
            goID: profile.id,
            fullName: profile.displayName,
            email: profile.emails[0].value,
            phoneNumber: ''
          })
            .save()
            .then(user => {
              done(null, user)
            })
        }
    })
}))


// for Facebook
passport.use(new FacebookStrategy({
    clientID: keys.FACEBOOK_APP_ID,
    clientSecret: keys.FACEBOOK_APP_SECRET,
    callbackURL: "/auth/facebook/callback"
}, (accessToken, refreshToken, profile, done) => {
    console.log(profile)
    
    externalUser.findOne({ fbID: profile.id }).then(existingUser => {
        if (existingUser) {
          done(null, existingUser)
        } else {
          new externalUser({
            typeUser: profile.provider,
            fbID: profile.id,
            goID: 'not applicable',
            fullName: profile.displayName,
            email: 'sh3ck@facebook.com',
            phoneNUmber: ''
          })
            .save()
            .then(user => {
              done(null, user)
            })
        }
    })
}))