const mongoose = require('mongoose')
const availablitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  days: {
    type: [String],
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  timezone: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Availability', availablitySchema)