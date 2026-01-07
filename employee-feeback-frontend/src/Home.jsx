import { useNavigate } from 'react-router-dom'
import { useUser } from './UserContext'
import { useEffect } from 'react'
import Feedback from './Feedback'
import AdminDashboard from './AdminDashboard'

const Home = () => {
    const navigate = useNavigate()
    const { user, token, isLoading } = useUser()

    useEffect(() => {
        if (!isLoading && (!user || !token)) {
            // User not logged in, but let them see login/register options
            return
        }
    }, [user, token, isLoading])

    if (isLoading) {
        return <div style={{ padding: 24 }}>Loading user...</div>
    }

    if (!user || !token) {
        return (
            <div style={{ padding: 24 }}>
                <h2>Welcome to Employee Feedback</h2>
                <p>Please log in or register to continue.</p>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => {
                        navigate('/login')
                    }}>Login</button>
                    <button onClick={() => {
                        navigate('/register')
                    }}>Register</button>
                </div>
            </div>
        )
    }

    // Route based on role: 0 = employee, 1 = admin
    // Convert role to number for comparison (handles both string and number)
    const userRole = Number(user.role)
    
    if (userRole === 0) {
        return <Feedback />
    } else if (userRole === 1) {
        return <AdminDashboard />
    }

    return (
        <div style={{ padding: 24 }}>
            <h2>Welcome, {user.username}</h2>
            <p>Unknown role ({user.role}). Please contact support.</p>
            <p style={{ fontSize: '12px', color: '#666' }}>Debug: role type is {typeof user.role}, value is {JSON.stringify(user.role)}</p>
        </div>
    )
}

export default Home