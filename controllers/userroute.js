const bcrypt = require('bcrypt')
const router = require('express').Router()
const User = require('../models/user')


router.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1, likes: 1 })
    response.json(users)
})

router.get('/:id', async(request, response) => {
    const user = await User.findById(request.params.id)
    if(user){
        response.json(user)
    } else {
        response.status(404).end()
    }
})


router.post('/', async (request, response) => {
    const { username, name, password } = request.body
    // PASSWORD SHOULD BE ATLEAST 8 CHARACTERS AND A LETTER AND A NUMBER
    if (!(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password))) {
        return response.status(400).json({ error: 'password is missing or not strong enough' })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const nuUser = new User({
        username,
        name,
        passwordHash
    })

    const savedUser = await nuUser.save()
    response.status(201).json(savedUser)
})


module.exports = router