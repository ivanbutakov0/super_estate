const bcryptjs = require('bcryptjs')
const User = require('../models/user.model')
const Listing = require('../models/listing.model')
const { errorHandler } = require('../utils/error')

const sayHello = (req, res) => {
	res.json({
		message: 'Hello World!',
	})
}

const updateUser = async (req, res, next) => {
	const { username, email, avatar } = req.body

	if (req.user.id !== req.params.id) {
		return next(errorHandler(403, 'You can only update your own profile!'))
	}

	try {
		if (req.body.password) {
			req.body.password = bcryptjs.hashSync(req.body.password, 7)
		}

		const updatedUser = await User.findByIdAndUpdate(
			req.params.id,
			{
				$set: {
					username,
					email,
					password: req.body.password,
					avatar,
				},
			},
			{ new: true }
		)

		const { password, ...rest } = updatedUser._doc
		res.status(200).json({
			success: true,
			message: 'User updated successfully!',
			data: rest,
		})
	} catch (error) {
		next(error)
	}
}

const deleteUser = async (req, res, next) => {
	if (req.user.id !== req.params.id) {
		return next(errorHandler(403, 'You can only delete your own profile!'))
	}

	try {
		await User.findByIdAndDelete(req.params.id)

		res.clearCookie('access_token')
		res.status(200).json({
			success: true,
			message: 'User has been deleted successfully!',
		})
	} catch (error) {
		next(error)
	}
}

const getUserListings = async (req, res, next) => {
	if (req.user.id !== req.params.id) {
		return next(errorHandler(403, 'You can only view your own listings!'))
	}

	try {
		const listings = await Listing.find({ userRef: req.params.id })
		res.status(200).json({
			success: true,
			data: listings,
		})
	} catch (error) {
		next(error)
	}
}

module.exports.sayHello = sayHello
module.exports.updateUser = updateUser
module.exports.deleteUser = deleteUser
module.exports.getUserListings = getUserListings
