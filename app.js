const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const config = require('./utils/config')
const blogRouter = require('./controllers/blogroute')


mongoose.set('strictQuery', false)

mongoose.connect(config.URI)
    .then(() => {
        console.log('connected to mongoDB')
    })
    .catch((error) => {
        console.log(`error connecting to mongoDB => ${error.message}`)
    })

app.use(cors())
app.use(express.json())
app.use('/api/blogs', blogRouter)

module.exports = app
