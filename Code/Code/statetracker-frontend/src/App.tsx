import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login'
import Map from './components/Map'
import Stats from './components/Stats'
import { useState } from 'react'

interface User {
  id: number
  username: string
}

function App() {
  const [user, setUser] = useState<User | null>(null)

  return (
    <BrowserRouter>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 20 }}>
        <h1 style={{ textAlign: 'center', color: '#007bff' }}>State Tracker</h1>
        {user && <p style={{ textAlign: 'center' }}>Logged in as: <strong>{user.username}</strong></p>}
        <nav style={{ textAlign: 'center', margin: '20px 0' }}>
          <a href="/map" style={{ margin: '0 15px', color: '#007bff' }}>Map</a>
          <a href="/stats" style={{ margin: '0 15px', color: '#007bff' }}>Stats</a>
          <a href="/login" style={{ margin: '0 15px', color: '#dc3545' }}>Logout</a>
        </nav>
        <Routes>
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/map" element={user ? <Map userId={user.id} /> : <Navigate to="/login" />} />
          <Route path="/stats" element={user ? <Stats userId={user.id} /> : <Navigate to="/login" />} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App