import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { register, login } from '../services/api'

interface User {
  id: number
  username: string
}

interface LoginProps {
  setUser: (user: User | null) => void
}

export default function Login({ setUser }: LoginProps) {
  const [username, setUsername] = useState('user')
  const [password, setPassword] = useState('user')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // TRY LOGIN FIRST
      let res
      try {
        res = await login(username, password)
        console.log('Login success:', res.data)
      } catch (loginErr: any) {
        console.log('Login failed, trying register...')
        // ONLY register if 404 or 401
        if (loginErr.response?.status === 401 || loginErr.response?.status === 404) {
          await register(username, password)
          res = await login(username, password)
        } else {
          throw loginErr
        }
      }

      setUser(res.data)
      navigate('/map')
    } catch (err: any) {
      const msg = err.response?.data?.message || err.response?.data?.error || 'Login failed'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 300, margin: '0 auto' }}>
      <h2>Login / Register</h2>
      {error && <p style={{ color: 'red', whiteSpace: 'pre-line' }}>{error}</p>}
      {loading && <p>Logging in...</p>}
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ display: 'block', margin: '10px 0', width: '100%' }}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ display: 'block', margin: '10px 0', width: '100%' }}
        required
      />
      <button type="submit" disabled={loading} style={{ width: '100%' }}>
        {loading ? 'Loading...' : 'Submit'}
      </button>
      <p style={{ fontSize: '0.8em', marginTop: '20px' }}>
        <strong>Dev Tip:</strong> Use <code>user</code> / <code>user</code>
      </p>
    </form>
  )
}