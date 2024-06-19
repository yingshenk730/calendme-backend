const mongoose = require('mongoose')

const meetingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  name: String,
  email: String,
  meetingStart: String,
  meetingEnd: String,
  meetingDate: String,
  timezone: String,
  eventName: String,
  message: String,
  notes: String,
  variant: {
    type: String,
    default: 'regular'
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Meeting', meetingSchema)