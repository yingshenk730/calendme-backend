const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  hostname: String,
  eventName: String,
  eventTitle: String,
  locationType: String,
  locationNote: String,
  eventDuration: String,
  eventDateRange: Number,
  isOpen: Boolean,
})

module.exports = mongoose.model('Event', eventSchema)