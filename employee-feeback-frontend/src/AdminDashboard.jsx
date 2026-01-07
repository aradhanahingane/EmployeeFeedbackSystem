import { useState, useEffect } from 'react'
import { useUser } from './UserContext'
import { getFeedbacks, deleteFeedback, getFeedbackById } from './api'
import { useNavigate } from 'react-router-dom'

function AdminDashboard() {
  const { user, token, logout } = useUser()
  const navigate = useNavigate()
  const [feedbacks, setFeedbacks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [viewingFeedback, setViewingFeedback] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    if (!user || !token) {
      navigate('/login')
      return
    }
    if (user.role !== 1) {
      navigate('/')
      return
    }
    loadFeedbacks()
  }, [user, token, navigate])

  const loadFeedbacks = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await getFeedbacks(token)
      setFeedbacks(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleView = async (id) => {
    try {
      const feedback = await getFeedbackById(token, id)
      setViewingFeedback(feedback)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) {
      return
    }

    try {
      setDeletingId(id)
      setError('')
      await deleteFeedback(token, id)
      await loadFeedbacks()
      if (viewingFeedback && viewingFeedback._id === id) {
        setViewingFeedback(null)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setDeletingId(null)
    }
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
          maxWidth: '1200px',
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
          <h1 style={{ margin: 0, fontSize: '24px', color: '#333' }}>
            Admin Feedback Dashboard
          </h1>
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

        {error && (
          <div
            style={{
              marginBottom: '16px',
              padding: '12px',
              background: '#fee',
              color: '#c33',
              borderRadius: '4px',
              fontSize: '14px',
            }}
          >
            {error}
          </div>
        )}

        {loading && feedbacks.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666' }}>Loading feedbacks...</p>
        ) : feedbacks.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666', fontStyle: 'italic' }}>
            No feedbacks available.
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                background: 'white',
              }}
            >
              <thead>
                <tr style={{ background: '#f9f9f9' }}>
                  <th
                    style={{
                      padding: '12px',
                      textAlign: 'left',
                      borderBottom: '2px solid #ddd',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#333',
                    }}
                  >
                    ID
                  </th>
                  <th
                    style={{
                      padding: '12px',
                      textAlign: 'left',
                      borderBottom: '2px solid #ddd',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#333',
                    }}
                  >
                    Feedback
                  </th>
                  <th
                    style={{
                      padding: '12px',
                      textAlign: 'left',
                      borderBottom: '2px solid #ddd',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#333',
                    }}
                  >
                    Date
                  </th>
                  <th
                    style={{
                      padding: '12px',
                      textAlign: 'left',
                      borderBottom: '2px solid #ddd',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#333',
                    }}
                  >
                    Username
                  </th>
                  <th
                    style={{
                      padding: '12px',
                      textAlign: 'left',
                      borderBottom: '2px solid #ddd',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#333',
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {feedbacks.map((fb, index) => (
                  <tr key={fb._id} style={{ borderBottom: '1px solid #eee' }}>
                    <td
                      style={{
                        padding: '12px',
                        fontSize: '14px',
                        color: '#333',
                      }}
                    >
                      {index + 1}
                    </td>
                    <td
                      style={{
                        padding: '12px',
                        fontSize: '14px',
                        color: '#333',
                        maxWidth: '400px',
                        wordBreak: 'break-word',
                      }}
                    >
                      {fb.feedback.length > 100
                        ? `${fb.feedback.substring(0, 100)}...`
                        : fb.feedback}
                    </td>
                    <td
                      style={{
                        padding: '12px',
                        fontSize: '14px',
                        color: '#333',
                      }}
                    >
                      {formatDate(fb.createdAt)}
                    </td>
                    <td
                      style={{
                        padding: '12px',
                        fontSize: '14px',
                        color: '#333',
                      }}
                    >
                      {fb.username}
                    </td>
                    <td
                      style={{
                        padding: '12px',
                        fontSize: '14px',
                      }}
                    >
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleView(fb._id)}
                          style={{
                            padding: '6px 12px',
                            background: '#e0e0e0',
                            border: '1px solid #c1c1c1',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '13px',
                          }}
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDelete(fb._id)}
                          disabled={deletingId === fb._id}
                          style={{
                            padding: '6px 12px',
                            background: deletingId === fb._id ? '#ccc' : '#e0e0e0',
                            border: '1px solid #c1c1c1',
                            borderRadius: '4px',
                            cursor: deletingId === fb._id ? 'not-allowed' : 'pointer',
                            fontSize: '13px',
                          }}
                        >
                          {deletingId === fb._id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {viewingFeedback && (
          <div
            style={{
              marginTop: '24px',
              padding: '20px',
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
                marginBottom: '12px',
              }}
            >
              <h3 style={{ margin: 0, fontSize: '18px', color: '#333' }}>Feedback Details</h3>
              <button
                onClick={() => setViewingFeedback(null)}
                style={{
                  padding: '4px 8px',
                  background: '#e0e0e0',
                  border: '1px solid #c1c1c1',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px',
                }}
              >
                Close
              </button>
            </div>
            <p style={{ margin: '8px 0', fontSize: '14px', color: '#666' }}>
              <strong>ID:</strong> {viewingFeedback._id}
            </p>
            <p style={{ margin: '8px 0', fontSize: '14px', color: '#666' }}>
              <strong>Username:</strong> {viewingFeedback.username}
            </p>
            <p style={{ margin: '8px 0', fontSize: '14px', color: '#666' }}>
              <strong>Date:</strong> {formatDate(viewingFeedback.createdAt)}
            </p>
            <p style={{ margin: '8px 0', fontSize: '14px', color: '#333' }}>
              <strong>Feedback:</strong>
            </p>
            <p
              style={{
                margin: '8px 0 0',
                padding: '12px',
                background: 'white',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                color: '#333',
                whiteSpace: 'pre-wrap',
              }}
            >
              {viewingFeedback.feedback}
            </p>
          </div>
        )}

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <button
            onClick={logout}
            style={{
              padding: '10px 20px',
              background: 'transparent',
              border: 'none',
              color: '#3c5a99',
              cursor: 'pointer',
              fontSize: '14px',
              textDecoration: 'underline',
            }}
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

