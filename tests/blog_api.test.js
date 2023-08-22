const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const api = supertest(app) //superagent object
const helper = require('../utils/list_helper')
const bcrypt = require('bcrypt')


mongoose.set('bufferTimeoutMS', 30000)


describe('http blog tests', () => {
    // first initializing the DB
    beforeEach(async () => {
        await Blog.deleteMany({})

        const blogModels = helper.initialBlogs.map(b => new Blog(b))
        const blogPromises = blogModels.map(m => m.save())
        await Promise.all(blogPromises)
        console.log('% writin data done %')

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
        const token = await helper.getToken()
        const nuNote = {
            title: 'full stack open',
            author: 'mooc fi',
            url: 'https://mooc.fi/',
            likes: 4
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(nuNote)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const dataAtDB = await helper.inDB()
        const titles = dataAtDB.map(b => b.title)
        expect(dataAtDB).toHaveLength(helper.initialBlogs.length + 1)
        expect(titles).toContain('full stack open')
    }, 100000)

    test('blog without likes will have 0 likes', async () => {
        const token = await helper.getToken()
        const nuNote = {
            title: 'moby dick',
            author: 'herman melwill',
            url: 'http://mobydick.com'
        }

        const result = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(nuNote)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        expect(result.body.likes).toBe(0)

    }, 100000)

    test('blog without title/url return error', async () => {
        const token = await helper.getToken()
        const nuBlog = {
            likes: 0
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(nuBlog)
            .expect(400)

    }, 100000)

    test('unauthorized attempt to create a blog', async () => {
        const nuBlog = {
            title: 'something nice',
            author: 'someone good',
            url: 'somethingnice.com',
            likes: 0
        }

        await api
            .post('/api/blogs')
            .send(nuBlog)
            .expect(401)

    })

    // TESTS FOR DELETE WORKED BEFORE AUTHORIZATION INVOLVED 
    // AS BLOGS IN TEST MODE DONT HAVE CREATOR AND THE AUTHORIZATION
    // IS BASED ON THE USER WHO CREATE, AS IT DIDNT MENTIONED IN 
    // EXERCISES I JUST LEAVE IT AS IT WORKED
    test('testing delete', async () => {
        const blogsAtFirst = await helper.inDB()
        const blog = blogsAtFirst[0]

        await api
            .delete(`/api/blogs/${blog.id}`)
            .expect(204)

        const blogsAtEnd = await helper.inDB()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)
        const titles = blogsAtEnd.map(b => b.title)
        expect(titles).not.toContain(blog.title)
    })

    test('testing update', async () => {
        const blogsAtFirst = await helper.inDB()
        const blog = blogsAtFirst[0]
        const blogTwo = { ...blog, title: 'something else', likes: 100 }

        const result = await api
            .put(`/api/blogs/${blog.id}`)
            .send(blogTwo)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.inDB()
        expect(blogsAtEnd).toHaveLength(blogsAtFirst.length)
        const titles = blogsAtEnd.map(b => b.title)
        expect(titles).not.toContain(blog.title)
        expect(result.body.title).toBe(blogTwo.title)
        expect(result.body.likes).toBe(blogTwo.likes)
    })
})


describe('http user tests', () => {
    beforeEach(async () => {
        await User.deleteMany({})
        const passwordHash = await bcrypt.hash('Abcd123456', 10)
        const usertest = new User({ username: 'crawwwler', name: 'shahin', passwordHash })
        await usertest.save()
    }, 100000)

    test('creation test', async () => {
        const usersAtStart = await helper.usersInDB()

        const nuUser = {
            username: 'test1user',
            name: 'testone',
            password: 'AaBb001373'
        }

        const result = await api
            .post('/api/users')
            .send(nuUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDB()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
        expect(result.body.username).toBe(nuUser.username)
    })

    test('username must be unique', async () => {
        const usersAtStart = await helper.usersInDB()
        const nuUser = {
            username: 'crawwwler',
            name: 'shahin',
            password: 'Abc1234564'
        }

        await api
            .post('/api/users')
            .send(nuUser)
            .expect(400)

        const usersAtEnd = await helper.usersInDB()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('username cannot be less than 3', async () => {
        const usersAtStart = await helper.usersInDB()

        const nuUser = {
            username: 'aw',
            name: 'monkey',
            password: 'ERer00110011'
        }

        await api
            .post('/api/users')
            .send(nuUser)
            .expect(400)

        const usersAtEnd = await helper.usersInDB()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('password cannot be weak', async () => {
        const usersAtStart = await helper.usersInDB()

        const nuUser = {
            username: 'something4',
            name: 'someone good',
            password: 'aa'
        }

        await api
            .post('/api/users')
            .send(nuUser)
            .expect(400)

        const usersAtEnd = await helper.usersInDB()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
})


afterAll(async () => {
    await mongoose.connection.close()
})