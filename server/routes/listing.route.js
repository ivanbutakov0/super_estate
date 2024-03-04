const express = require('express')
const {
	createListing,
	deleteListing,
	updateListing,
} = require('../controllers/listing.controller')
const verifyToken = require('../utils/verifyUser')

const router = express.Router()

router.use(verifyToken).route('/create').post(createListing)
router.use(verifyToken).route('/delete/:id').delete(deleteListing)
router.use(verifyToken).route('/update/:id').put(updateListing)

module.exports = router
