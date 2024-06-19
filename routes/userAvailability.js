const express = require('express')
const router = express.Router()
const User = require('../models/user')
const Availability = require('../models/availability')
const passport = require('passport')

// @desc    Get user availability
// @route   GET /api/user-availability/:userId
// @access  Public
router.get('/:userId', async (req, res) => {
  try {
    const availability = await Availability.findOne({ user: req.params.userId })
    res.status(200).json({ success: true, availability: availability })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' })
  }
})

router.post('/', passport.authenticate('jwt', { session: false }), async (req, res) => {

  try {
    const { availability, timezone } = req.body
    const { days, startTime, endTime } = availability
    const newAvailability = await Availability.create({ days, startTime, endTime, timezone, user: req.user._id })
    const updatedUser = await User.findByIdAndUpdate(req.user._id, { $set: { isNewUser: false } }, { new: true })
    res.status(201).json({ success: true, data: newAvailability, user: updatedUser })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' })
  }
})

module.exports = router