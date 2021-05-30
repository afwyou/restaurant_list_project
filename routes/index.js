const express = require('express')
const router = express.Router()
const home = require('./modules/home')
const restaurants = require('./modules/restaurants')
const users = require('./modules/users')
const { authenticator } = require('../middleware/auth')


router.use('/users', users)
//需要經過使用者驗證的路由，安插middleware  authenticator
router.use('/restaurants', authenticator, restaurants)
router.use('/', authenticator, home)
module.exports = router
