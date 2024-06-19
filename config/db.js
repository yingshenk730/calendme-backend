const mongoose = require('mongoose')

const connectDB = () => {
  try {
    mongoose.connect(
      process.env.MONGO_URL
    )
    console.log('MongoDB connected successfully')
  } catch (error) {
    console.error('Error connecting to MongoDB:', error)
    process.exit(1)
  }
}

module.exports = connectDB