const express = require('express')
const {
	sayHello,
	updateUser,
	deleteUser,
	getUserListings,
} = require('../controllers/user.controller.js')
const verifyToken = require('../utils/verifyUser.js')

const router = express.Router()

router.route('/').get(sayHello)
router.use(verifyToken).route('/update/:id').put(updateUser)
router.use(verifyToken).route('/delete/:id').delete(deleteUser)
router.use(verifyToken).route('/listings/:id').get(getUserListings)

module.exports = router
