const express = require('express')
const app = express()
const mongoose = require('mongoose')
require('dotenv').config()

const PORT = process.env.PORT || 3000

app.get('/', (req, res) => {
	res.send('Hello, world!')
})

app.listen(PORT, () => {
	console.log(`Server is running on port http://localhost:${PORT}`)
})

mongoose
	.connect(process.env.MONGODB_URL)
	.then(() => console.log('Connected!'))
	.catch(err => console.log(err))
