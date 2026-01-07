import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const api = axios.create({
  baseURL: API_URL,
})

const getErrorMessage = (error) => {
  if (error.response?.data?.message) return error.response.data.message
  if (error.response?.data?.error) return error.response.data.error
  if (error.response) {
    // Include status code for debugging
    return `Request failed with status code ${error.response.status}${error.response.status === 404 ? ' (Route not found - is the backend running?)' : ''}`
  }
  if (error.message) return error.message
  return 'Unexpected error, please try again.'
}

export async function loginUser({ username, password }) {
  try {
    const { data } = await api.post('/auth/login', { username, password })
    return data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function registerUser({ username, email, password, role }) {
  try {
    const { data } = await api.post('/auth/register', { username, email, password, role })
    return data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function fetchProfile(token) {
  try {
    const { data } = await api.get('/users/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function createFeedback(token, feedback) {
  try {
    const { data } = await api.post(
      '/feedback',
      { feedback },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    return data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function getFeedbacks(token) {
  try {
    const { data } = await api.get('/feedback', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function getFeedbackById(token, id) {
  try {
    const { data } = await api.get(`/feedback/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function updateFeedback(token, id, feedback) {
  try {
    const { data } = await api.put(
      `/feedback/${id}`,
      { feedback },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    return data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function deleteFeedback(token, id) {
  try {
    const { data } = await api.delete(`/feedback/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

