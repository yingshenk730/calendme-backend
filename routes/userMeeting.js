const express = require('express')
const router = express.Router()
const Meeting = require('../models/meeting')
const passport = require('passport')

// @desc    Get all meetings
// @route   GET /api/meetings
// @access  Private
router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const meetings = await Meeting.find({ user: req.user._id })
    res.status(200).json({ success: true, meetings: meetings })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' })
  }
})

// @desc    Get all meetings by userId
// @route   GET /api/user-meeting/user/:userId
// @access  Public
router.get('/user/:userId', async (req, res) => {
  try {
    const meetings = await Meeting.find({ user: req.params.userId })
    if (!meetings) return res.status(404).json({ success: false, message: 'Meetings not found' })
    res.status(200).json({ success: true, meetings: meetings })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' })
  }
})


// @desc    Get meeting by meetingId
// @route   GET /api/user-meeting/:meetingId
// @access  Private
router.get('/:meetingId', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.meetingId)
    if (!meeting) return res.status(404).json({ success: false, message: 'Meeting not found' })
    res.status(200).json({ success: true, meeting: meeting })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' })
  }
})

// @desc    Create a new meeting
// @route   POST /api/user-meeting
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { meeting } = req.body
    const newMeeting = await Meeting.create({ ...meeting })
    if (!newMeeting) return res.status(400).json({ success: false, message: 'Something went wrong' })
    res.status(201).json({ success: true, data: newMeeting })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' })
  }
})

// @desc    Add or update meeting notes
// @route   PUT /api/user-meeting/notes/:meetingId
// @access  Private
router.put('/notes/:meetingId', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const { notes } = req.body
    const meeting = await Meeting.findByIdAndUpdate(req.params.meetingId, { $set: { notes } }, { new: true })
    if (!meeting) return res.status(404).json({ success: false, message: 'Meeting not found' })
    res.status(200).json({ success: true, meeting: meeting })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' })
  }
})

// @desc    Add or update meeting
// @route   PUT /api/user-meeting/:meetingId
// @access  Public
router.put('/:meetingId', async (req, res) => {
  try {
    const { meeting } = req.body
    console.log('meeting:', meeting)
    const updatedMeeting = await Meeting.findByIdAndUpdate(req.params.meetingId, { $set: { ...meeting } }, { new: true })
    console.log('updatedMeeting:', updatedMeeting)
    if (!updatedMeeting) return res.status(404).json({ success: false, message: 'Meeting not found' })
    res.status(200).json({ success: true, meeting: updatedMeeting })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: 'Server Error' })
  }

})

// @desc    Delete a new meeting
// @route   DELETE /api/user-meeting/:meetingId
// @access  Private
router.delete('/meeting/:meetingId', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const meeting = await Meeting.findByIdAndDelete(req.params.meetingId)
    if (!meeting) return res.status(404).json({ success: false, message: 'Meeting not found' })
    res.status(200).json({ success: true, message: 'Meeting deleted' })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' })
  }
})


module.exports = router