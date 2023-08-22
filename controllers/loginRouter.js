const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const router = require('express').Router()
const User = require('../models/user')

// POST METHOD FOR LOGIN
router.post('/', async (request, response) => {
    const { username, password } = request.body

    const user = await User.findOne({ username })
    // CHECKING IF PASSWORD IS MATCH
    //WITH BCRYPT.COMPARE METHOD
    const isPassCorrect = user === null ? false : await bcrypt.compare(password, user.passwordHash)
    // IF USER NOT FOUND OR PASSWORD INCORRECT WE RETURN 401 , UNAUTHORIZED STATUS
    if (!(user && isPassCorrect)) {

        return response.status(401).json({
            error: 'incorrect user / password'
        })
    }

    const userToken = {
        username: user.username,
        id: user._id
    }

    const token = jwt.sign(userToken, process.env.SECRET) // SECRET DEFINED IN .ENV

    response.status(200).send({ token, username: user.username, name: user.name })
})


module.exports = router
