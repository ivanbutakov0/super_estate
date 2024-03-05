const express = require('express')
const {
	updateUser,
	deleteUser,
	getUserListings,
	getUser,
} = require('../controllers/user.controller.js')
const verifyToken = require('../utils/verifyUser.js')

const router = express.Router()

router.use(verifyToken).route('/:id').get(getUser)
router.use(verifyToken).route('/update/:id').put(updateUser)
router.use(verifyToken).route('/delete/:id').delete(deleteUser)
router.use(verifyToken).route('/listings/:id').get(getUserListings)

module.exports = router
