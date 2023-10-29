const mongoose = require('mongoose')
const validator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: {
			value: true,
			message: 'username must be unique',
		},
		minLength: [3, 'username must be atleast 3 characters'],
		validate: {
			validator: (username) => /^[a-zA-Z0-9_]+$/.test(username),
			message: (props) => `${props.value} is not a valid username`,
		},
	},
	name: String,
	passwordHash: String,
	blogs: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Blog',
		},
	],
})

userSchema.plugin(validator)

userSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
		delete returnedObject.passwordHash
	},
})

const User = mongoose.model('User', userSchema)

module.exports = User
