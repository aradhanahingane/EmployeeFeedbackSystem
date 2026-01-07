import { useState, useEffect } from 'react'
import { useUser } from './UserContext'
import { createFeedback, getFeedbacks, updateFeedback } from './api'
import { useNavigate } from 'react-router-dom'

function Feedback() {
  const { user, token, logout } = useUser()
  const navigate = useNavigate()
  const [mode, setMode] = useState('add') // 'add' or 'edit'
  const [feedbackText, setFeedbackText] = useState('')
  const [feedbacks, setFeedbacks] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user || !token) {
      navigate('/login')
      return
    }
    // Convert role to number for comparison
    const userRole = Number(user.role)
    if (userRole !== 0) {
      navigate('/')
      return
    }
    loadFeedbacks()
  }, [user, token, navigate])

  const loadFeedbacks = async () => {
    try {
      setLoading(true)
      const data = await getFeedbacks(token)
      setFeedbacks(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!feedbackText.trim()) {
      setError('Please enter feedback text')
      return
    }

    try {
      setLoading(true)
      setError('')
      if (mode === 'edit' && editingId) {
        await updateFeedback(token, editingId, feedbackText)
      } else {
        await createFeedback(token, feedbackText)
      }
      setFeedbackText('')
      setMode('add')
      setEditingId(null)
      await loadFeedbacks()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (feedback) => {
    setMode('edit')
    setFeedbackText(feedback.feedback)
    setEditingId(feedback._id)
  }

  const handleCancelEdit = () => {
    setMode('add')
    setFeedbackText('')
    setEditingId(null)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toISOString().split('T')[0]
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f5f5f5',
        padding: '24px',
        fontFamily: 'Helvetica Neue, Arial, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          background: 'white',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
          }}
        >
          <h1 style={{ margin: 0, fontSize: '24px', color: '#333' }}>Feedback</h1>
          <button
            onClick={logout}
            style={{
              padding: '8px 16px',
              background: 'linear-gradient(#ededed, #d8d8d8)',
              border: '1px solid #c1c1c1',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            Log Out
          </button>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
          <button
            onClick={() => {
              setMode('add')
              handleCancelEdit()
            }}
            style={{
              padding: '10px 20px',
              background: mode === 'add' ? '#444' : '#e0e0e0',
              color: mode === 'add' ? 'white' : '#333',
              border: mode === 'add' ? '1px solid #333' : '1px solid #c1c1c1',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: mode === 'add' ? 600 : 400,
            }}
          >
            Add Feedback
          </button>
          <button
            onClick={() => {
              if (mode === 'edit') handleCancelEdit()
            }}
            style={{
              padding: '10px 20px',
              background: mode === 'edit' ? '#444' : '#e0e0e0',
              color: mode === 'edit' ? 'white' : '#333',
              border: mode === 'edit' ? '1px solid #333' : '1px solid #c1c1c1',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: mode === 'edit' ? 600 : 400,
            }}
          >
            Edit Feedback
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label
            style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: 600,
              color: '#333',
            }}
          >
            Your Feedback:
          </label>
          <textarea
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            placeholder="Write your feedback here..."
            style={{
              width: '100%',
              minHeight: '150px',
              padding: '12px',
              border: '1px solid #c8c8c8',
              borderRadius: '4px',
              fontSize: '15px',
              fontFamily: 'inherit',
              resize: 'vertical',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          {error && (
            <div
              style={{
                marginTop: '12px',
                padding: '10px',
                background: '#fee',
                color: '#c33',
                borderRadius: '4px',
                fontSize: '14px',
              }}
            >
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading || !feedbackText.trim()}
            style={{
              marginTop: '16px',
              padding: '12px 24px',
              background: loading
                ? '#ccc'
                : 'linear-gradient(#ededed, #d8d8d8)',
              border: '1px solid #c1c1c1',
              borderRadius: '4px',
              fontSize: '16px',
              fontWeight: 600,
              color: '#444',
              cursor: loading ? 'not-allowed' : 'pointer',
              width: '100%',
            }}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>

        <div style={{ marginTop: '32px' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '16px', color: '#333' }}>
            Your Previous Feedbacks
          </h2>
          {feedbacks.length === 0 ? (
            <p style={{ color: '#666', fontStyle: 'italic' }}>No feedbacks submitted yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {feedbacks.map((fb) => (
                <div
                  key={fb._id}
                  style={{
                    padding: '16px',
                    background: '#f9f9f9',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '8px',
                    }}
                  >
                    <div>
                      <p
                        style={{
                          margin: 0,
                          fontSize: '14px',
                          color: '#666',
                          marginBottom: '4px',
                        }}
                      >
                        Date: {formatDate(fb.createdAt)}
                      </p>
                      <p style={{ margin: 0, fontSize: '15px', color: '#333' }}>
                        {fb.feedback}
                      </p>
                    </div>
                    <button
                      onClick={() => handleEdit(fb)}
                      style={{
                        padding: '6px 12px',
                        background: '#e0e0e0',
                        border: '1px solid #c1c1c1',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '13px',
                      }}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Feedback

