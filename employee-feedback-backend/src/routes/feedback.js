const express = require('express')
const { Login, Feedback } = require('../db/db')
const { authMiddleware, adminMiddleware } = require('../middleware/auth')

const router = express.Router()

// Create feedback (Employee only)
router.post('/', authMiddleware, async (req, res) => {
  try {
    // Ensure role is compared as number
    const userRole = Number(req.user.role)
    if (userRole !== 0) {
      return res.status(403).json({ message: 'Only employees can create feedback' })
    }

    const { feedback } = req.body
    if (!feedback || !feedback.trim()) {
      return res.status(400).json({ message: 'Feedback text is required' })
    }

    const user = await Login.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const newFeedback = await Feedback.create({
      username: user.username,
      feedback: feedback.trim(),
      loginId: user._id,
    })

    res.status(201).json({
      _id: newFeedback._id,
      username: newFeedback.username,
      feedback: newFeedback.feedback,
      createdAt: newFeedback.createdAt,
    })
  } catch (err) {
    console.error('Create feedback error:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Get feedbacks (Employee sees own, Admin sees all)
router.get('/', authMiddleware, async (req, res) => {
  try {
    let feedbacks
    if (req.user.role === 1) {
      // Admin sees all feedbacks
      feedbacks = await Feedback.find().sort({ createdAt: -1 })
    } else {
      // Employee sees only their own
      feedbacks = await Feedback.find({ loginId: req.user.id }).sort({ createdAt: -1 })
    }

    res.json(
      feedbacks.map((f) => ({
        _id: f._id,
        username: f.username,
        feedback: f.feedback,
        createdAt: f.createdAt,
      }))
    )
  } catch (err) {
    console.error('Get feedbacks error:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Get single feedback by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id)
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' })
    }

    // Employee can only view their own feedback
    if (req.user.role === 0 && feedback.loginId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' })
    }

    res.json({
      _id: feedback._id,
      username: feedback.username,
      feedback: feedback.feedback,
      createdAt: feedback.createdAt,
    })
  } catch (err) {
    console.error('Get feedback error:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Update feedback (Employee only, own feedbacks)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 0) {
      return res.status(403).json({ message: 'Only employees can edit feedback' })
    }

    const { feedback } = req.body
    if (!feedback || !feedback.trim()) {
      return res.status(400).json({ message: 'Feedback text is required' })
    }

    const existingFeedback = await Feedback.findById(req.params.id)
    if (!existingFeedback) {
      return res.status(404).json({ message: 'Feedback not found' })
    }

    // Check ownership
    if (existingFeedback.loginId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only edit your own feedback' })
    }

    existingFeedback.feedback = feedback.trim()
    await existingFeedback.save()

    res.json({
      _id: existingFeedback._id,
      username: existingFeedback.username,
      feedback: existingFeedback.feedback,
      createdAt: existingFeedback.createdAt,
    })
  } catch (err) {
    console.error('Update feedback error:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Delete feedback (Admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id)
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' })
    }

    res.json({ message: 'Feedback deleted successfully' })
  } catch (err) {
    console.error('Delete feedback error:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
})

module.exports = router

