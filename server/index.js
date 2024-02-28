const express = require('express')
const app = express()
const mongoose = require('mongoose')
const userRouter = require('./routes/user.route')
const authRouter = require('./routes/auth.route.js')
const listingRouter = require('./routes/listing.route')
const cors = require('cors')
const cookieParser = require('cookie-parser')
require('dotenv').config()

const PORT = process.env.PORT || 3000

// Middleware for parsing request body
app.use(express.json())

// Middleware for parsing cookies
app.use(cookieParser())

// Enable CORS
app.use(
	cors({
		origin: 'http://localhost:5173',
		allowedHeaders: ['Content-Type'],
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
		credentials: true,
	})
)

// Routes
app.use('/api/user', userRouter)
app.use('/api/auth', authRouter)
app.use('/api/listing', listingRouter)

// Error handling middleware
app.use((err, req, res, next) => {
	const statusCode = err.statusCode || 500
	const message = err.message || 'Internal Server Error'

	res.status(statusCode).json({
		success: false,
		statusCode,
		message,
	})
})

const start = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URL)

		app.listen(PORT, () => {
			console.log(`Server is running on port http://localhost:${PORT}`)
		})
	} catch (err) {
		console.log(err)
	}
}

start()
