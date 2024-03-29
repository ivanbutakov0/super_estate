const express = require('express')
const {
	signup,
	signin,
	google,
	signOut,
} = require('../controllers/auth.controller.js')
const { check } = require('express-validator')

const router = express.Router()

router.route('/signup').post(
	[
		check('username', 'Username is required ').notEmpty(),
		check('email', 'Email is required').notEmpty(),
		check('password', 'Password should be at least 4 characters').isLength({
			min: 4,
		}),
	],
	signup
)
router.route('/signin').post(signin)
router.route('/google').post(google)
router.route('/signout').get(signOut)

module.exports = router
