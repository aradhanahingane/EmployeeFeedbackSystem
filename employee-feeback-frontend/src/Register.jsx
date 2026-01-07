import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from './UserContext'

function Register() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'employee',
  })
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { register, isAuthLoading } = useUser()

  const handleChange = (key) => (event) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    if (form.password !== form.confirmPassword) {
      alert('Passwords must match')
      return
    }
    try {
        let newRole = 0;
        if(form.role == 'employee') {
            newRole = 0;
        } else {
            newRole = 1
        }
      await register({
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
        role: newRole,
      })
      navigate('/')
    } catch (err) {
      setError(err.message || 'Registration failed, please try again.')
    }
  }

  const isDisabled =
    !form.username.trim() ||
    !form.email.trim() ||
    !form.password.trim() ||
    !form.confirmPassword.trim()

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
        width: '380px',
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
        }}>Register</h1>
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
            value={form.username}
            onChange={handleChange('username')}
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
            type='email'
            placeholder='Email'
            value={form.email}
            onChange={handleChange('email')}
          />
          <select style={{
            width: '100%',
            padding: '12px 14px',
            border: '1px solid #c8c8c8',
            borderRadius: '4px',
            fontSize: '15px',
            background: 'white',
          }} value={form.role} onChange={handleChange('role')}>
            <option value='employee'>Employee</option>
            <option value='admin'>Admin</option>
          </select>
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
            value={form.password}
            onChange={handleChange('password')}
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
            placeholder='Confirm Password'
            value={form.confirmPassword}
            onChange={handleChange('confirmPassword')}
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
            {isAuthLoading ? 'Signing Up...' : 'Sign Up'}
          </button>
          {error && (
            <div style={{ color: '#c0392b', fontSize: 14 }}>
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
          Already have an account?{' '}
          <Link style={{
            color: '#3c5a99',
            textDecoration: 'none',
          }} to='/login'>
            Log In
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register
