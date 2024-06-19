const express = require('express')
const router = express.Router()
const Url = require('../models/url')
const passport = require('passport')

// @desc    Get url by userId
// @route   GET / api / user - url / user /: id
// @access  Public
router.get('/user/:userId', async (req, res) => {
  try {
    const url = await Url.findOne({ user: req.params.userId })
    res.status(200).json({ success: true, userUrl: url })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: 'Server Error' })
  }
})

// @desc    check url by userUrl
// @route   GET / api / user - url / user /: id
// @access  Public
router.get('/check/:userUrl', async (req, res) => {
  try {
    const url = await Url.findOne({ url: req.params.userUrl })
    if (url) {
      res.status(200).json({ success: true, userUrl: url })
    } else {
      return res.json({ success: false, message: 'Invalid url' })
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: 'Server Error' })
  }
})


// @desc    Create a new url
// @route   POST /api/user-url
// @access  Public
router.post('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const { url } = req.body
    const newUrl = await Url.create({ url, user: req.user._id })
    res.status(201).json({ success: true, data: newUrl })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: 'Server Error' })
  }
})

// @desc    Check if url exist
// @route   POST /api/user-url/check
// @access  Public
router.post('/check', async (req, res) => {
  try {
    const { url } = req.body
    if (!url) {
      return res.json({ success: false, message: 'Please provide a url' })
    }
    const exsitUrl = await Url.findOne({ url })
    if (exsitUrl) {
      return res.json({ success: false, message: 'Url already exist' })
    }
    res.status(200).json({ success: true, message: 'Url is available' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: 'Server Error' })
  }
})


router.get('/:userUrl', async (req, res) => {
  try {
    const userUrl = req.params.userUrl
    const exsitUrl = await Url.findOne({ url: userUrl })
    if (!exsitUrl) {
      return res.json({ success: false, message: 'Invalid url' })
    }
    res.status(200).json({ success: true, url: exsitUrl })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: 'Server Error' })
  }
})
module.exports = router


