const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const { Login } = require('./db/db')
const { authMiddleware } = require('./middleware/auth')
const authRoutes = require('./routes/auth')
const feedbackRoutes = require('./routes/feedback')

const PORT = process.env.PORT || 3000
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/login'

// Connect to MongoDB
mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((err) => {
    console.error('Mongo connection error:', err)
  })

const app = express()

app.use(cors())
app.use(express.json())


app.use('/auth', authRoutes)
app.use('/feedback', feedbackRoutes)

// Current user profile
app.get('/users/me', authMiddleware, async (req, res) => {
  try {
    const user = await Login.findById(req.user.id).select('username role')
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json({
      username: user.username,
      role: user.role,
    })
  } catch (err) {
    console.error('Profile error:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'employee-feedback-api' })
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})