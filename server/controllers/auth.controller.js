const User = require('../models/user.model')
const bcryptjs = require('bcryptjs')
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const { errorHandler } = require('../utils/error')

const signup = async (req, res, next) => {
	try {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return next(errorHandler(400, errors.array()[0].msg))
		}

		const { username, email, password } = req.body

		const candidate = await User.findOne({ email })
		if (candidate) {
			return next(errorHandler(400, 'User already exists!'))
		}

		const hashedPassword = bcryptjs.hashSync(password, 7)
		await User.create({ username, email, password: hashedPassword })

		res
			.status(201)
			.json({ success: true, message: 'User created successfully!' })
	} catch (error) {
		next(error)
	}
}

const signin = async (req, res, next) => {
	try {
		const { email, password } = req.body
		const user = await User.findOne({ email })
		if (!user) {
			return next(errorHandler(404, 'User not found!'))
		}
		const validPassword = bcryptjs.compareSync(password, user.password)
		if (!validPassword) {
			return next(errorHandler(400, 'Wrong password!'))
		}
		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
			expiresIn: '24h',
		})
		const { password: pass, ...rest } = user._doc
		res.cookie('access_token', token, {
			httpOnly: true,
		})

		res.status(200).json({
			success: true,
			data: rest,
		})
	} catch (error) {
		next(error)
	}
}

module.exports.signup = signup
module.exports.signin = signin
