const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const JwtStrategy = require('passport-jwt').Strategy
const LocalStrategy = require('passport-local').Strategy
const ExtractJwt = require("passport-jwt").ExtractJwt
// const PassportJWT = require('passport-jwt')
const User = require('../models/user')
const bcrypt = require('bcryptjs')

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = process.env.JWT_SECRET


passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
  try {
    const user = await User.findOne({ email })
    if (!user) {
      return done(null, false, { message: 'Incorrect email.' })
    }
    const isMatch = bcrypt.compare(password, user.password)
    if (!isMatch) {
      return done(null, false, { message: 'Incorrect password.' })
    }
    return done(null, user)
  } catch (err) {
    return done(err)
  }
}))


passport.use(
  new JwtStrategy(opts, async (payload, done) => {
    try {
      const user = await User.findOne({ _id: payload.id })
      if (user) {
        done(null, user)  // User found, return that user
      } else {
        done(null, false)  // No user found
      }
    } catch (err) {
      done(err, false)  // An error occurred
    }
  })
)

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.API_URL}/auth/google/callback`
},
  async (accessToken, refreshToken, profile, done) => {
    try {
      // console.log('profile:', profile)
      const user = await User.findOne({ googleId: profile.id })
      if (user) {
        return done(null, user)
      } else {
        const newUser = await User.create({
          googleId: profile.id,
          email: profile.emails[0].value,
          username: profile.displayName,
          avatar: profile.photos[0].value,
          isNewUser: true,
          isGoogle: true
        })
        return done(null, newUser)
      }

    } catch (err) {
      return done(err)
    }
  }
))


passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id)
    done(null, user)
  } catch (err) {
    done(err)
  }
})

module.exports = passport