const express = require('express')
const router = express.Router()
const Notification = require('../models/notification')
const passport = require('passport')
const user = require('../models/user')
// @desc    Get all messages
// @route   GET /api/messages
// @access  Private
router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const messages = await Notification.find({ user: req.user._id })
    res.status(200).json({ success: true, messages: messages })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' })
  }
})

//@desc Create a new message
//@route POST /api/messages
//@access Public
router.post('/', async (req, res) => {
  try {
    const { message, title, userId } = req.body
    const newMessage = await Notification.create({ message, title, user: userId })
    if (!newMessage) return res.status(400).json({ success: false, message: 'Something went wrong' })
    res.status(201).json({ success: true, message: newMessage })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: 'Server Error' })
  }
})

module.exports = router