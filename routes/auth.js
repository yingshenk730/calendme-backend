const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const passport = require('passport')
const JWT_SECRET = process.env.JWT_SECRET
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const user = require('../models/user')
// @desc    Auth with JWT
// @route   POST /auth/register
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body

  try {
    const user = await User.findOne({
      email
    })
    if (user) {
      return res.status(400).json({ success: false, message: 'Email already exists' })
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    // console.log('hashedpassword:', hashedPassword)
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      isGoogle: false,
      isNewUser: true
    })
    // console.log('newUser:', newUser)
    if (!newUser) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' })
    }

    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, {
      expiresIn: '1d',
    })
    res.status(200).json({ success: true, token: token })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' })
  }
})
// @desc    Auth with JWT
// @route   POST /auth/login
router.post('/login', passport.authenticate('local', { session: false }),
  async (req, res) => {
    const token = jwt.sign({ id: req.user._id }, JWT_SECRET, {
      expiresIn: '1d',
    })
    // console.log('req.user:', req.user)
    res.json({ success: true, token: token, user: req.user })
  })


// @desc    Auth with Google
// @route   GET /auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

// @desc    Google auth callback
// @route   GET /auth/google/callback
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/failure' }),
  (req, res) => {
    const newUser = req.user
    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, {
      expiresIn: '1d',
    })
    res.redirect(`${process.env.CLIENT_URL}?token=${token}`)
  })

// @desc    Auth with JWT
// @route   POST /auth/get-user
router.get('/get-user', passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' })
    }
    res.json({ success: true, user: req.user })
  })

//@desc    Get username by userId
//@route   GET /auth/uname/:userId
//@access  Public
router.get('/uname/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
    if (!user) {
      return res.json({ success: false, message: 'User not found' })
    }
    res.json({ success: true, username: user.username })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' })
  }
})

module.exports = router