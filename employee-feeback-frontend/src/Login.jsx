import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useUser } from './UserContext'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login, isAuthLoading } = useUser()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    try {
      await login({ username: username.trim(), password })
      navigate('/')
    } catch (err) {
      setError(err.message || 'Login failed, please try again.')
    }
  }

  const isDisabled = !username.trim() || !password.trim()

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f5f5f5',
      padding: '24px',
      fontFamily: 'Helvetica Neue, Arial, sans-serif',
      color: '#333',
    }}>
      <div style={{
        width: '360px',
        background: '#f9f9f9',
        border: '1px solid #ddd',
        borderRadius: '6px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
        padding: '24px 28px 20px',
      }}>
        <h1 style={{
          margin: '0 0 18px',
          textAlign: 'center',
          fontSize: '28px',
          fontWeight: 700,
          color: '#444',
        }}>Login</h1>
        <form style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }} onSubmit={handleSubmit}>
          <input
            style={{
              width: '100%',
              padding: '12px 14px',
              border: '1px solid #c8c8c8',
              borderRadius: '4px',
              fontSize: '15px',
              outline: 'none',
              background: 'white',
            }}
            type='text'
            placeholder='Username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            style={{
              width: '100%',
              padding: '12px 14px',
              border: '1px solid #c8c8c8',
              borderRadius: '4px',
              fontSize: '15px',
              outline: 'none',
              background: 'white',
            }}
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button style={{
            padding: '12px',
            background: 'linear-gradient(#ededed, #d8d8d8)',
            border: '1px solid #c1c1c1',
            borderRadius: '4px',
            fontSize: '16px',
            fontWeight: 600,
            color: '#444',
            cursor: 'pointer',
              opacity: isAuthLoading ? 0.7 : 1,
            }} type='submit' disabled={isDisabled || isAuthLoading}>
              {isAuthLoading ? 'Logging in...' : 'Log In'}
            </button>
            {error && (
              <div style={{ color: '#c0392b', fontSize: 14, marginTop: 4 }}>
                {error}
              </div>
            )}
          </form>
          <p style={{
            margin: '14px 0 0',
            textAlign: 'center',
            fontSize: '14px',
            color: '#666',
          }}>
            Don&apos;t have an account?{' '}
            <Link style={{
              color: '#3c5a99',
              textDecoration: 'none',
            }} to='/register'>
              Sign Up
            </Link>
          </p>
        </div>
      </div>
  )
}

export default Login
