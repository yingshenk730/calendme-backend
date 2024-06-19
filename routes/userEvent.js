const experss = require('express')
const router = experss.Router()
const passport = require('passport')
const Event = require('../models/event')

// @desc    Get all regular events by user
// @route   GET /api/user-events/:id
// @access  Private
router.get('/user/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const events = await Event.find({ user: req.params.id })
    res.status(200).json({ success: true, events: events })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' })
  }
})

// @desc    Get all open events by userId
// @route   GET /api/user-events/search/:userId
// @access  Private
router.get('/search/:userId', async (req, res) => {
  try {
    const events = await Event.find({ user: req.params.userId, isOpen: true })
    res.status(200).json({ success: true, events: events })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' })
  }
})

// @desc    Get event by eventId
// @route   GET /api/user-events/event/:eventId
// @access  Private
router.get('/event/:eventId', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId)
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' })
    res.status(200).json({ success: true, event: event })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' })
  }
})


// @desc    Get event by eventTitle
//@route   GET /api/user-events/:eventTitle
//@access  Private
router.get('/:eventTitle', async (req, res) => {
  try {
    const eventTitle = req.params.eventTitle
    const exsitingEvent = await Event.findOne({ eventTitle })
    if (exsitingEvent) {
      res.status(200).json({ success: true, event: exsitingEvent })
    } else {
      res.status(200).json({ success: false, message: 'Event not found' })
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' })
  }
})



// @desc    Create a new user event
// @route   POST /api/user-event
// @access  Private
router.post('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const { event } = req.body
    const exsitingEvents = await Event.find({ eventName: { $regex: new RegExp('^' + event.eventName + '$', 'i') }, user: req.user._id })
    if (exsitingEvents.length > 0) {
      event.eventTitle = `${event.eventTitle}-${exsitingEvents.length}`
    }

    const newEvent = await Event.create({
      ...event,
      isOpen: true,
      user: req.user._id,
      hostname: req.user.username
    })
    res.status(201).json({ success: true, data: newEvent })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' })
  }
})

// @desc    Modify user event
// @route   PUT /api/user-events/eventId
// @access  Private
router.put('/:eventId', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const { event } = req.body
    const exsitingEvents = await Event.find({ eventName: { $regex: new RegExp('^' + event.eventName + '$', 'i') }, user: req.user._id })
    if (exsitingEvents.length > 0 && exsitingEvents[0]._id != req.params.eventId) {
      event.eventTitle = `${event.eventTitle}-${exsitingEvents.length}`
    }
    const updatedEvent = await Event.findByIdAndUpdate(req.params.eventId, {
      ...event, isOpen: true,
      user: req.user._id,
      hostname: req.user.username,
    }, { new: true })

    res.status(201).json({ success: true, data: updatedEvent })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' })
  }
})

// @desc    Update event status by eventId
// @route   PUT /api/user-events/:eventId
// @access  Private
router.put('/status/:eventId', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const { isOpen } = req.body
    const updatedEvent = await Event.findByIdAndUpdate(req.params.eventId, { isOpen }, { new: true })
    res.status(200).json({ success: true, data: updatedEvent })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' })
  }
})


// @desc    Delete event by eventId
// @route   DELETE /api/user-events/:eventId
// @access  Private
router.delete('/:eventId', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.eventId)
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' })
    res.status(200).json({ success: true, message: 'Event deleted' })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' })
  }
})

module.exports = router