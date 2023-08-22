const jwt = require('jsonwebtoken')
const User = require('../models/user')


const errorHandler = (error, request, response, next) => {
    if (process.env.NODE_ENV !== 'test') {
        console.error(error)
    }
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    } else if (error.name === 'JsonWebTokenError') {
        return response.status(401).json({ error: error.message })
    }

    next(error)
}


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown destination' })
}


const tokenExtractor = (request, response, next) => {
    const autho = request.get('authorization')
    if (autho && autho.startsWith('Bearer ')) {
        request.token = autho.replace('Bearer ', '')
    } else {
        request.token = null
    }
    next()
}

const userExtractor = async (request, response, next) => {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    const user = await User.findById(decodedToken.id)
    if (user) {
        request.user = user
    }

    next()

}

module.exports = {
    errorHandler,
    unknownEndpoint,
    tokenExtractor,
    userExtractor
}