const express = require('express')
const mongoose = require('mongoose')
const userRouter = require('./routes/user.route')
const authRouter = require('./routes/auth.route.js')
const listingRouter = require('./routes/listing.route')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const path = require('path')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware for parsing request body
app.use(express.json())

// Middleware for parsing cookies
app.use(cookieParser())

// Enable CORS
app.use(
	cors({
		origin: 'https://super-estate-client.vercel.app/',
		allowedHeaders: ['Content-Type'],
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
		credentials: true,
	})
)

// Routes
app.use('/api/user', userRouter)
app.use('/api/auth', authRouter)
app.use('/api/listing', listingRouter)

app.use(express.static(path.join(__dirname, '/client/dist')))

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, '/client/dist/index.html'))
})

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
