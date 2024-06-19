const express = require('express')
const router = express.Router()
const passport = require('passport')
const OneoffEvent = require('../models/oneoffEvent')
const meeting = require('../models/meeting')



// @desc    Create a new one-off event
// @route   POST /api/one-off
// @access  Private
router.post('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const { event } = req.body
    const exsitingEvents = await OneoffEvent.find({ eventName: { $regex: new RegExp('^' + event.eventName + '$', 'i') }, user: req.user._id })
    if (exsitingEvents.length > 0) {
      event.eventTitle = `${event.eventTitle}-${exsitingEvents.length}`
    }
    const newEvent = await OneoffEvent.create({
      ...event,
      user: req.user._id,
      hostname: req.user.username
    })
    if (!newEvent) return res.status(400).json({ success: false, message: 'Something went wrong' })
    res.status(201).json({ success: true, data: newEvent })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' })
  }
})


// @desc    Create a new meeting poll event
// @route   POST /api/one-off/meeting-poll
// @access  Private
router.post('/meeting-poll', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const { event } = req.body
    const exsitingEvents = await OneoffEvent.find({ eventName: { $regex: new RegExp('^' + event.eventName + '$', 'i') }, user: req.user._id })
    if (exsitingEvents.length > 0) {
      event.eventTitle = `${event.eventTitle}-${exsitingEvents.length}`
    }
    const newEvent = await OneoffEvent.create({
      ...event,
      variant: 'meetingpoll',
      user: req.user._id,
      hostname: req.user.username
    })
    if (!newEvent) return res.status(400).json({ success: false, message: 'Something went wrong' })
    res.status(201).json({ success: true, data: newEvent })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' })
  }
})

// @desc    Get one-off event by eventTitle
// @route   GET /api/one-off/:eventTitle
// @access  Public
router.get('/:eventTitle', async (req, res) => {
  try {
    const event = await OneoffEvent.findOne({ eventTitle: req.params.eventTitle })
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' })
    res.status(200).json({ success: true, data: event })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' })
  }
})

// @desc    Get event by eventId
// @route   GET /api/one-off/event/:eventId
// @access  Private
router.get('/event/:eventId', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const event = await OneoffEvent.findById(req.params.eventId)
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' })
    res.status(200).json({ success: true, event: event })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' })
  }
})

// @desc    Get all open one-off events
// @route   GET /api/one-off/search/open

router.get('/search/open', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const meetings = await meeting.find({ user: req.user._id, variant: 'oneoff' })
    const meetingEventIds = meetings.map(meeting => meeting.event.toString())

    const events = await OneoffEvent.find({ user: req.user._id })
    const openEvents = events.filter(event => !meetingEventIds.includes(event._id.toString()))
    res.status(200).json({ success: true, openOneoffEvents: openEvents })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' })
  }
}
)

module.exports = router