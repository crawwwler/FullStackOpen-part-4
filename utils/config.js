require('dotenv').config()


const PORT = process.env.PORT
const URI = process.env.NODE_ENV === 'test' ?
    process.env.TESTDB_URI : process.env.DB_URI

module.exports = {
    PORT,
    URI
}