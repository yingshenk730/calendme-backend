const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: String,
  title: String,
  isRead: {
    type: Boolean,
    default: false,
    required: true
  },

}, {
  timestamps: true
})

module.exports = mongoose.model('Notification', notificationSchema)
