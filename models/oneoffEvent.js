const mongoose = require('mongoose')

const oneoffEventSchema = new mongoose.Schema({
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
  start: String,
  end: String,
  date: String,
  timezone: String,
  variant: {
    type: String,
    default: 'oneoff'
  },
})

module.exports = mongoose.model('OneoffEvent', oneoffEventSchema)