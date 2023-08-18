require('dotenv').config()

const PORT = process.env.PORT
const URI = process.env.DB_URI

module.exports = {
    PORT,
    URI
}