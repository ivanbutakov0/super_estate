const express = require('express')
const { sayHello } = require('../controllers/user.controller.js')

const router = express.Router()

router.route('/').get(sayHello)

module.exports = router
