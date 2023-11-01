const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const config = require('./utils/config')
const blogRouter = require('./controllers/blogroute')
const userRouter = require('./controllers/userroute')
const loginRouter = require('./controllers/loginRouter')
const mw = require('./utils/middleware')

mongoose.set('strictQuery', false)

console.log('connecting to mongoDB..it might take a while')
mongoose
	.connect(config.URI)
	.then(() => {
		console.log('connected to mongoDB')
	})
	.catch((error) => {
		console.log(`error connecting to mongoDB => ${error.message}`)
	})

app.use(express.static('dist'))
app.use(cors())
app.use(express.json())
app.use(mw.tokenExtractor)
app.use('/api/blogs', blogRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)

if (process.env.NODE_ENV === 'test') {
	const testRouter = require('./controllers/testing')
	app.use('/api/testing', testRouter)
}

app.use(mw.unknownEndpoint)
app.use(mw.errorHandler)

module.exports = app
