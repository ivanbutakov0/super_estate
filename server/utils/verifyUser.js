const { errorHandler } = require('./error')
const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
	const token = req.cookies.access_token

	if (!token) {
		return next(errorHandler(401, 'You are not authorized!'))
	}

	jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
		console.log(user)
		if (err) {
			console.log(err)
			return next(errorHandler(403, 'Token is not valid!'))
		}
		console.log('Token verified!')
		req.user = user
		next()
	})
}

module.exports = verifyToken
