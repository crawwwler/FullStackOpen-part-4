const errorHandler = (error, request, response, next) => {
    console.error(error)
    if (error.name === "CastError") {
        return response.status(400).send({ error: "malformatted id" })
    } else if (error.name === "ValidationError") {
        return response.status(400).send({ error: error.message })
    }

    next(error)
}


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: "unknown destination" })
}


module.exports = {
    errorHandler,
    unknownEndpoint
}