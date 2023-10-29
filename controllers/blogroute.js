const router = require('express').Router()
const Blog = require('../models/blog')
const mw = require('../utils/middleware')

router.get('/', async (request, response) => {
	const blogs = await Blog.find({}).populate('user', {
		username: 1,
		name: 1,
	})
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

router.post('/', mw.userExtractor, async (request, response) => {
	const body = request.body

	const user = request.user

	const blog = new Blog({
		title: body.title,
		author: body.author,
		url: body.url,
		likes: body.likes === undefined ? 0 : body.likes,
		user: user._id,
	})

	const savedBlog = await blog.save()
	user.blogs = user.blogs.concat(savedBlog._id)
	await user.save()

	response.status(201).json(savedBlog)
})

router.post('/:id/comment', async (request, response) => {
	const { comment } = request.body
	const blog = await Blog.findById(request.params.id)
	if (!comment) {
		return response.status(404).json({ error: 'comment not found' })
	}
	blog.comments.push(comment)
	await blog.save()
	response.status(201).json(comment)
})

router.delete('/:id', mw.userExtractor, async (request, response) => {
	const user = request.user
	const blog = await Blog.findById(request.params.id)

	if (blog.user.toString() === user._id.toString()) {
		await Blog.findByIdAndDelete(request.params.id)
		response.status(204).end()
	} else {
		response.status(401).json({ error: " you're not allowed to do this" })
	}
})

router.put('/:id', async (request, response) => {
	const body = request.body
	const blog = {
		title: body.title,
		author: body.author,
		url: body.url,
		likes: body.likes,
		user: body.user._id,
	}

	const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
		new: true,
		runValidators: true,
		context: 'query',
	})
	response.json(updatedBlog)
})

module.exports = router
