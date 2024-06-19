const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: String,
  googleId: String,
  isNewUser: {
    type: Boolean,
    required: true
  },
  isGoogle: Boolean,
  username: String,
  avatar: String,
}, {
  timestamps: true
})

module.exports = mongoose.model('User', userSchema)