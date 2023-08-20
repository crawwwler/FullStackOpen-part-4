const router = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')



router.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user')
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
    const user = await User.find({})
    console.log("user is ==> ", user)
    //console.log("userID is ==> ", userID)
    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes === undefined ? 0 : body.likes,
        user: user[0]
    })
    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)
})


router.delete('/:id', async (request, response) => {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
})

router.put('/:id', async (request, response) => {
    const body = request.body
    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
        new: true, runValidators: true,
        context: 'query'
    })
    response.json(updatedBlog)
})

module.exports = router