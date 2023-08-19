const router = require('express').Router()
const Blog = require('../models/blog')



router.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})


router.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    if (blog) {
        response.json(blog)
    } else {
        response.status(404).end()
    }
})


router.post('/', async (request, response) => {
    const body = request.body
    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes === undefined ? 0 : body.likes
    })
    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)
})


router.delete('/:id', async (request, response) => {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
})

module.exports = router