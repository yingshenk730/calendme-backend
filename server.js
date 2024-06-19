require("dotenv").config()

const express = require('express')
const session = require('express-session')
const passport = require('./config/passport')
const cors = require('cors')
const connectDB = require('./config/db')
const authRoutes = require('./routes/auth')
const userUrlRoutes = require('./routes/userUrl')
const userEventRoutes = require('./routes/userEvent')
const userAvailabilityRoutes = require('./routes/userAvailability')
const userMeetingRoutes = require('./routes/userMeeting')
const oneoffEventRoutes = require('./routes/oneoffEvent')
const notificationRoutes = require('./routes/notification')

const app = express()

// connect to database
connectDB()
// middleware
app.use(cors())
app.use(express.json())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true
}))

// passport middleware
app.use(passport.initialize())
app.use(passport.session())

app.use('/auth', authRoutes)
app.use('/user-url', userUrlRoutes)
app.use('/user-availability', userAvailabilityRoutes)
app.use('/user-event', userEventRoutes)
app.use('/user-meeting', userMeetingRoutes)
app.use('/one-off', oneoffEventRoutes)
app.use('/notification', notificationRoutes)

app.get('/', (req, res) => {
  res.send('Hello World!')
})
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
})