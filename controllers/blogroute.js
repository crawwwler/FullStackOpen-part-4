const router = require('express').Router()
const Blog = require('../models/blog')



router.get('/', (request, response) => {
    Blog.find({}).then(result => {
        response.json(result)
    })
})

router.post('/', (request, response) => {
    const blog = new Blog(request.body)

    blog.save().then(savedNote => {
        response.status(201).json(savedNote)
    })
})


module.exports = router