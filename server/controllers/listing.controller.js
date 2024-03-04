const Listing = require('../models/listing.model')
const { errorHandler } = require('../utils/error')

const createListing = async (req, res, next) => {
	try {
		const listing = await Listing.create(req.body)
		return res.status(201).json({ success: true, data: listing })
	} catch (error) {
		next(error)
	}
}

const deleteListing = async (req, res, next) => {
	const listing = await Listing.findById(req.params.id)
	if (!listing) {
		return next(errorHandler(404, 'Listing not found!'))
	}

	if (req.user.id !== listing.userRef) {
		return next(errorHandler(401, 'You can only delete your own listings!'))
	}
	try {
		const deletedListing = await Listing.findByIdAndDelete(req.params.id)
		console.log(deletedListing)
		res.status(200).json({ success: true, data: deletedListing })
	} catch (error) {
		next(error)
	}
}

const updateListing = async (req, res, next) => {
	const listing = await Listing.findById(req.params.id)
	if (!listing) {
		return next(errorHandler(404, 'Listing not found!'))
	}

	if (req.user.id !== listing.userRef) {
		return next(errorHandler(401, 'You can only update your own listings!'))
	}
	try {
		const updatedListing = await Listing.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ new: true }
		)
		res.status(200).json({ success: true, data: updatedListing })
	} catch (error) {
		next(error)
	}
}

module.exports.createListing = createListing
module.exports.deleteListing = deleteListing
module.exports.updateListing = updateListing
