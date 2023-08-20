const ldsh = require('lodash')
const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
    {
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        __v: 0
    },
    {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
        __v: 0
    },
    {
        _id: "5a422b3a1b54a676234d17f9",
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
        __v: 0
    },
    {
        _id: "5a422b891b54a676234d17fa",
        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 10,
        __v: 0
    },
    {
        _id: "5a422ba71b54a676234d17fb",
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        likes: 0,
        __v: 0
    },
    {
        _id: "5a422bc61b54a676234d17fc",
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2,
        __v: 0
    }
]


const dummy = (blogs) => {
    console.log(blogs)
    return 1
}



const totalLikes = (blogs) => {
    return blogs.reduce((sum, current) => sum + current.likes, 0)
}



const favoriteBlog = (blogs) => {
    const blogWithMostLikes = blogs.reduce((highest, current) => {
        return highest.likes > current.likes ? highest : current
    })

    return blogWithMostLikes
}


const mostBlogs = (blogs) => {
    const authorCount = ldsh.countBy(blogs, 'author')
    const maxAuthor = ldsh.maxBy(ldsh.keys(authorCount), (author) => authorCount[author])

    return {
        author: maxAuthor,
        blogs: authorCount[maxAuthor]
    }
}


const mostLikes = (blogs) => {
    const authorLikes = {}

    blogs.forEach(blog => {
        const { author, likes } = blog
        if (authorLikes[author]) {
            authorLikes[author] += likes
        } else {
            authorLikes[author] = likes
        }
    })


    const helperfun = (max, [author, likes]) => {
        return likes > max[1] ? [author, likes] : max
    }
    const [favAuthor, likeCount] = Object.entries(authorLikes).reduce(helperfun, ['', 0])


    return {
        author: favAuthor,
        likes: likeCount
    }
}


const inDB = async () => {
    const data = await Blog.find({})
    return data.map(blog => blog.toJSON())
}

const usersInDB = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}


module.exports = {
    initialBlogs,
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes,
    inDB,
    usersInDB
}