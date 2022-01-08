const express = require('express')
const CLIENT_URL = "http://localhost:3000/"
const passport = require('passport')
const exUsersRouter = express.Router()


// router.get("/login/success", (req,res) => {
//     if (req.user){
//         res.status(200).json({
//             success: true,
//             message: "success",
//             user: req.user,
//         })
//     }
// })

exUsersRouter.get("/login/failed", (req,res) => {
    res.status(401).json({
        success: false,
        message: "failure",
    })
})

//facebook Auth 
exUsersRouter.get('/facebook', passport.authenticate('facebook', { scope: ['public_profile','email']}));

// exUsersRouter.get('/facebook/callback', passport.authenticate('facebook', {
//     successRedirect: CLIENT_URL,
//     failureRedirect: "/login/failed"
// }))

// exUsersRouter.get('/facebook/callback',
//   passport.authenticate('facebook', { failureRedirect: '/' }),
//   function(req, res) {
    // Successful authentication, redirect home.
    // res.redirect('/');
    // res.status(200).json({
        // success: true,
        // message: "success",
        // user: req.user,
    // })
//})

  exUsersRouter.get('/facebook/callback',
  passport.authenticate('facebook', { 
    failureRedirect: '/',
    successRedirect: CLIENT_URL,
}),
  function(req, res) {    
    res.status(200).json({
        user: req.user,
    })
  })
  
module.exports = exUsersRouter