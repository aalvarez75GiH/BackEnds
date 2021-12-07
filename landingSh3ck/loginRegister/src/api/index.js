const express = require('express')
const registerApi = require('./resources/users/register')
const loginApi = require('./resources/users/login')
const productsApi = require('./resources/products/products')
const paymentsApi = require('./resources/payments/payments')

const router = express.Router()

router.use(registerApi)
router.use(loginApi)
router.use(productsApi)
router.use(paymentsApi)

module.exports = router