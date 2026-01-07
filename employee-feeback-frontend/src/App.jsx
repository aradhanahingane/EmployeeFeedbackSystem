import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { UserProvider } from './UserContext'
import Login from './Login'
import Register from './Register'
import Home from './Home'
import './App.css'

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  )
}

export default App
