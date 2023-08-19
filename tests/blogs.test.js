const helper = require('../utils/list_helper')


describe('dummy tests', () => {
    test('dummy returns one', () => {
        const blogs = []

        const result = helper.dummy(blogs)
        expect(result).toBe(1)
    })
})

describe('total likes', () => {
    test('of empty list is zero', () => {
        const blogs = []
        const result = helper.totalLikes(blogs)
        expect(result).toBe(0)
    })

    test('likes of one blog', () => {
        const listWithOneBlog = [
            {
                _id: '5a422aa71b54a676234d17f8',
                title: 'Go To Statement Considered Harmful',
                author: 'Edsger W. Dijkstra',
                url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
                likes: 5,
                __v: 0
            }
        ]

        const result = helper.totalLikes(listWithOneBlog)
        expect(result).toBe(5)
    })

    test('likes of blogs', () => {
        const blogs = helper.initialBlogs

        const result = helper.totalLikes(blogs)
        expect(result).toBe(36)
    })

})

describe('favorite blogs', () => {
    test('blog with most likes', () => {
        const blogs = helper.initialBlogs

        const fv = {
            _id: "5a422b3a1b54a676234d17f9",
            title: "Canonical string reduction",
            author: "Edsger W. Dijkstra",
            url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
            likes: 12,
            __v: 0
        }

        const result = helper.favoriteBlog(blogs)
        console.log('results returned is => ', result)
        expect(result).toEqual(fv)
    })
})

describe('author tests', () => {
    test('author with most blogs', () => {
        const blogs = helper.initialBlogs

        const at = {
            author: "Robert C. Martin",
            blogs: 3
        }

        const result = helper.mostBlogs(blogs)
        expect(result).toEqual(at)
    })

    test('author with most lieks', () => {
        const blogs = helper.initialBlogs

        const fv = {
            author: "Edsger W. Dijkstra",
            likes: 17
        }

        const result = helper.mostLikes(blogs)
        expect(result).toEqual(fv)
    })
})