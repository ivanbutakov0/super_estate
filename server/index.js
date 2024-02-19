const express = require('express')
const app = express()
const mongoose = require('mongoose')
const userRouter = require('./routes/user.route')
const authRouter = require('./routes/auth.route.js')
require('dotenv').config()

const PORT = process.env.PORT || 3000

// Middleware for parsing request body
app.use(express.json())

app.use('/api/user', userRouter)
app.use('/api/auth', authRouter)

app.listen(PORT, () => {
	console.log(`Server is running on port http://localhost:${PORT}`)
})

mongoose
	.connect(process.env.MONGODB_URL)
	.then(() => console.log('Connected!'))
	.catch(err => console.log(err))
