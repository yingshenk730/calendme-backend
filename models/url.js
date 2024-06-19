const mongoose = require('mongoose')

const urlSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  url: {
    type: String,
    required: true,
    unique: true
  },

})

module.exports = mongoose.model('Url', urlSchema)