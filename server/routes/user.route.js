const express = require('express')
const { sayHello, updateUser } = require('../controllers/user.controller.js')
const verifyToken = require('../utils/verifyUser.js')

const router = express.Router()

router.route('/').get(sayHello)
router.use(verifyToken).route('/update/:id').put(updateUser)

module.exports = router
