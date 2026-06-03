import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signup } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signup(name, email, password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black grid-bg flex items-center justify-center px-4">
      <div className="fixed top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-green-400 opacity-30" />
      <div className="fixed top-0 right-0 w-32 h-32 border-r-2 border-t-2 border-green-400 opacity-30" />
      <div className="fixed bottom-0 left-0 w-32 h-32 border-l-2 border-b-2 border-green-400 opacity-30" />
      <div className="fixed bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-green-400 opacity-30" />

      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-10">
          <div className="font-mono text-5xl font-bold neon-text tracking-widest animate-flicker">
            SnapLink
          </div>
          <div className="font-mono text-zinc-600 text-xs tracking-[0.3em] mt-2 uppercase">
            URL Shortener System
          </div>
        </div>

        <div className="bg-zinc-950 border border-zinc-800 p-8 relative">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-60" />
          <div className="font-mono text-zinc-500 text-xs tracking-widest uppercase mb-6 flex items-center gap-2">
            <span className="neon-text">▶</span>
            <span>AUTH / REGISTER</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="font-mono text-xs text-zinc-500 tracking-widest uppercase block mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
                className="neon-input w-full bg-black border border-zinc-800 px-4 py-3 font-mono text-sm text-white placeholder-zinc-700 transition-all"
              />
            </div>
            <div>
              <label className="font-mono text-xs text-zinc-500 tracking-widest uppercase block mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                required
                className="neon-input w-full bg-black border border-zinc-800 px-4 py-3 font-mono text-sm text-white placeholder-zinc-700 transition-all"
              />
            </div>
            <div>
              <label className="font-mono text-xs text-zinc-500 tracking-widest uppercase block mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="neon-input w-full bg-black border border-zinc-800 px-4 py-3 font-mono text-sm text-white placeholder-zinc-700 transition-all"
              />
            </div>

            {error && (
              <div className="font-mono text-xs text-red-500 bg-red-500/10 border border-red-500/30 px-4 py-3 flex items-center gap-2">
                <span>✕</span><span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-400 text-black font-mono font-bold text-sm tracking-widest uppercase py-3 hover:shadow-neon-green transition-all disabled:opacity-50"
            >
              {loading ? 'CREATING...' : '[ REGISTER ]'}
            </button>
          </form>

          <div className="mt-6 text-center font-mono text-xs text-zinc-600">
            Already have an account?{' '}
            <Link to="/login" className="text-green-400 hover:underline">LOGIN</Link>
          </div>
        </div>
      </div>
    </div>
  )
}