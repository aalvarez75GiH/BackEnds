const express = require('express')
const CLIENT_URL = "http://localhost:3000/"
const passport = require('passport')
const { OAuth2Client } = require('google-auth-library')
const exUsersRouter = express.Router()
const extUserController = require('./extUsers.controller')
const logger = require('../../../utils/logger')

REACT_APP_GOOGLE_CLIENT_ID = '257358209041-oje195aop7ppkokdlmdf33676hdl2dbk.apps.googleusercontent.com'
const client = new OAuth2Client(REACT_APP_GOOGLE_CLIENT_ID)

const users = []

const upsert = (array, item) => {
    const i = array.findIndex((_item) => _item.email === item.email)
    if (i > -1) array[i] = item
    else array.push(item)
}

exUsersRouter.post('/google', async(req,res) => {
  let foundUser

  const { token } = req.body
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: REACT_APP_GOOGLE_CLIENT_ID,
  })

  const newExtUser = {
    fullName: ticket.getPayload().name,
    email: ticket.getPayload().email,
    goID: ticket.getPayload().sub,
    typeUser:'Google',
    phoneNumber:''
  }

  foundUser = await extUserController.findUser(newExtUser.email)
    if (foundUser){
      logger.info(`User with email ${newExtUser.email} already registered...`)
      res.status(409).send(`${newExtUser.fullName}`)
      return
    }

    console.log(ticket.getPayload().name)
    await extUserController.createExtUser(newExtUser)
    logger.info(`User with email [${newExtUser.email}] has been created...`)
    // upsert(users, { name, email, picture })
    res.status(201).json(newExtUser)
})  


  
module.exports = exUsersRouter