const User = require('../models/user.model')
const bcryptjs = require('bcryptjs')

const signup = async (req, res) => {
	const { username, email, password } = req.body

	const hashedPassword = bcryptjs.hashSync(password, 7)

	try {
		await User.create({ username, email, password: hashedPassword })
		res.status(201).json('User created successfully!')
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
}

module.exports.signup = signup
