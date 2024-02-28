const express = require('express')
const { createListing } = require('../controllers/listing.controller')
const verifyToken = require('../utils/verifyUser')

const router = express.Router()

router.use(verifyToken).route('/create').post(createListing)

module.exports = router
