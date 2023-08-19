const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const api = supertest(app) //superagent object
const helper = require('../utils/list_helper')


mongoose.set('bufferTimeoutMS', 30000)


describe('http get tests', () => {
    // first initializing the DB
    beforeEach(async () => {
        await Blog.deleteMany({})

        const blogModels = helper.initialBlogs.map(b => new Blog(b))
        const blogPromises = blogModels.map(m => m.save())
        await Promise.all(blogPromises)
    }, 100000)

    test('data returned as json', async () => {
        const result = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(result.body).toHaveLength(6)
    })

    test('blogs have id property', async () => {
        const result = await api
            .get('/api/blogs')

        expect(result.body[0].id).toBeDefined()

    })

    test('posting a new blog', async () => {
        const nuNote = {
            title: "full stack open",
            author: "mooc fi",
            url: "https://mooc.fi/",
            likes: 4
        }

        await api
            .post('/api/blogs')
            .send(nuNote)
            .expect(201)
            .expect("Content-Type", /application\/json/)

        const dataAtDB = await helper.inDB()
        const titles = dataAtDB.map(b => b.title)
        expect(dataAtDB).toHaveLength(helper.initialBlogs.length + 1)
        expect(titles).toContain('full stack open')
    })

    test('blog without likes will have 0 likes', async () => {
        const nuNote = {
            title: "moby dick",
            author: "herman melwill",
            url: "http://mobydick.com"
        }

        const result = await api
            .post('/api/blogs')
            .send(nuNote)
            .expect(201)
            .expect("Content-Type", /application\/json/)

        expect(result.body.likes).toBe(0)

    })

    test('blog without title return error', async () => {
        const nuBlog = {
            likes: 0
        }

        await api
            .post('/api/blogs')
            .send(nuBlog)
            .expect(400)

    })
})


afterAll(async () => {
    await mongoose.connection.close()
})