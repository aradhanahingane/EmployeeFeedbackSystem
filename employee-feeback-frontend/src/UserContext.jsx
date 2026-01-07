import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { fetchProfile, loginUser, registerUser } from './api'

const TOKEN_KEY = 'efb_token'
const USER_KEY = 'efb_user'

const UserContext = createContext(null)

export function UserProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthLoading, setIsAuthLoading] = useState(false)

  // Hydrate from localStorage on first load
  useEffect(() => {
    const savedToken = localStorage.getItem(TOKEN_KEY)
    const savedUser = localStorage.getItem(USER_KEY)
    if (savedToken) setToken(savedToken)
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch {
        localStorage.removeItem(USER_KEY)
      }
    }
    if (savedToken) {
      refreshProfile(savedToken)
    } else {
      setIsLoading(false)
    }
  }, [])

  // Persist token
  useEffect(() => {
    if (token) localStorage.setItem(TOKEN_KEY, token)
    else localStorage.removeItem(TOKEN_KEY)
  }, [token])

  // Persist user
  useEffect(() => {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
    else localStorage.removeItem(USER_KEY)
  }, [user])

  const normalizeUser = (data) => {
    if (!data) return null
    const role = data.role !== undefined ? data.role : (data.user?.role !== undefined ? data.user.role : 0)
    return {
      username: data.username || data.user?.username || '',
      role: typeof role === 'number' ? role : (role === 'admin' || role === 1 ? 1 : 0),
    }
  }

  const refreshProfile = async (activeToken = token) => {
    if (!activeToken) return
    try {
      const profile = await fetchProfile(activeToken)
      setUser(normalizeUser(profile))
      setToken(activeToken)
    } catch (error) {
      console.error('Profile fetch failed:', error)
      logout()
    } finally {
      setIsLoading(false)
    }
  }

  const login = async ({ username, password }) => {
    setIsAuthLoading(true)
    try {
      const data = await loginUser({ username, password })
      const nextToken = data.token
      const nextUser = normalizeUser(data)
      if (!nextToken) throw new Error('Missing token in response')
      setUser(nextUser)
      setToken(nextToken)
      return { user: nextUser, token: nextToken }
    } catch (error) {
      throw error
    } finally {
      setIsAuthLoading(false)
    }
  }

  const register = async ({ username, email, password, role }) => {
    setIsAuthLoading(true)
    try {
      const data = await registerUser({ username, email, password, role })
      const nextToken = data.token
      const nextUser = normalizeUser(data)
      if (!nextToken) throw new Error('Missing token in response')
      setUser(nextUser)
      setToken(nextToken)
      return { user: nextUser, token: nextToken }
    } catch (error) {
      throw error
    } finally {
      setIsAuthLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
  }

  const value = useMemo(
    () => ({ user, token, isLoading, isAuthLoading, login, register, logout, refreshProfile }),
    [user, token, isLoading, isAuthLoading]
  )

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export function useUser() {
  return useContext(UserContext)
}


