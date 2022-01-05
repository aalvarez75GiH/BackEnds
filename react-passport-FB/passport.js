const GoogleStrategy = require('passport-google-oauth20').Strategy
const GitHubStrategy = require('passport-github2').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const passport = require('passport')

const GOOGLE_CLIENT_ID = "893855487421-l0l6ejqncjds8145a9icsgurvsuhv37o.apps.googleusercontent.com"
const GOOGLE_CLIENT_SECRET = "8iRiBWsBWEnYNLQZFgYt_Bnt"

const GITHUB_CLIENT_ID = "7455a0b169dd6901cbbe"
const GITHUB_CLIENT_SECRET = "16dfd8b110939a411561dae9175be47acf84eec4"

const FACEBOOK_APP_ID = "314852847213593"
const FACEBOOK_APP_SECRET = "c4aa2da57550e312d8ede800dc0e73b1"

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    done(null, profile )
  }
));

passport.serializeUser((user, done) => {
    done(null, user)
})

passport.deserializeUser((user, done) => {
    done(null, user)
})

passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    done(null, profile )
  }
))

passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "/auth/facebook/callback",
    profileFields: ['id','displayName', 'email']
},
    function(accessToken, refreshToken, profile, done) {
    done(null, profile)
  }
))

