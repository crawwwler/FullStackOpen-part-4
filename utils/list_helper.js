const ldsh = require('lodash')


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


module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}