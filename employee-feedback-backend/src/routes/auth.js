const express = require('express')
const bcrypt = require('bcryptjs')
const { Login } = require('../db/db')
const { generateToken } = require('../utils/jwt')

const router = express.Router()

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email and password are required' })
    }

    const existingUser = await Login.findOne({ $or: [{ email }, { username }] })
    if (existingUser) {
      return res.status(409).json({ message: 'User with this email or username already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await Login.create({
      username,
      email,
      password: hashedPassword,
      role: typeof role === 'number' ? role : 0,
    })

    const token = generateToken(user)

    res.status(201).json({
      token,
      user: {
        username: user.username,
        role: user.role,
      },
    })
  } catch (err) {
    console.error('Register error:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' })
    }

    const user = await Login.findOne({ username })
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password' })
    }

    const token = generateToken(user)

    res.json({
      token,
      user: {
        username: user.username,
        role: user.role,
      },
    })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
})

module.exports = router

