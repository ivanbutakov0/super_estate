const User = require('../models/user.model')
const bcryptjs = require('bcryptjs')
const { validationResult } = require('express-validator')

const signup = async (req, res, next) => {
	try {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			console.log(errors)
			return res
				.status(400)
				.json({ success: false, message: errors.array()[0].msg })
		}

		const { username, email, password } = req.body

		const candidate = await User.findOne({ email })
		if (candidate) {
			return res
				.status(400)
				.json({ success: false, message: 'User already exists!' })
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

module.exports.signup = signup
