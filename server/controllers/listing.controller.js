const Listing = require('../models/listing.model')
const { errorHandler } = require('../utils/error')

const getListings = async (req, res, next) => {
	try {
		const limit = parseInt(req.query.limit) || 9
		const startIndex = parseInt(req.query.startIndex) || 0
		const searchTerm = req.query.searchTerm || ''
		const sort = req.query.sort || 'createdAt'
		const order = req.query.order || 'desc'
		let { offer, furnished, parking, type } = req.query

		if (offer === 'false' || offer === undefined) {
			offer = { $in: [true, false] }
		}

		if (furnished === 'false' || furnished === undefined) {
			furnished = { $in: [true, false] }
		}

		if (parking === 'false' || parking === undefined) {
			parking = { $in: [true, false] }
		}

		if (type === 'all' || type === undefined) {
			type = { $in: ['rent', 'sell'] }
		}

		const listings = await Listing.find({
			name: { $regex: searchTerm, $options: 'i' },
			offer,
			furnished,
			parking,
			type,
		})
			.sort({ [sort]: order })
			.skip(startIndex)
			.limit(limit)
		if (!listings) {
			return next(errorHandler(404, 'Listings not found!'))
		}
		res.status(200).json({ success: true, data: listings })
	} catch (error) {
		next(error)
	}
}

const getListing = async (req, res, next) => {
	try {
		const listing = await Listing.findById(req.params.id)
		if (!listing) {
			return next(errorHandler(404, 'Listing not found!'))
		}
		res.status(200).json({ success: true, data: listing })
	} catch (error) {
		next(error)
	}
}

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

module.exports.getListing = getListing
module.exports.getListings = getListings
module.exports.createListing = createListing
module.exports.deleteListing = deleteListing
module.exports.updateListing = updateListing
