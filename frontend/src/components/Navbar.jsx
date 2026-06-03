import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="border-b border-zinc-900 bg-black/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <div
          onClick={() => navigate('/')}
          className="font-mono text-2xl font-bold neon-text tracking-widest cursor-pointer animate-flicker"
        >
          SnapLink
        </div>
        <div className="flex items-center gap-6">
          <div className="font-mono text-xs text-zinc-600 hidden sm:block">
            <span className="text-green-400">●</span> CONNECTED
          </div>
          <div className="font-mono text-xs text-zinc-400 hidden sm:block">
            {user?.email}
          </div>
          {user?.role === 'ADMIN' && (
            <span className="font-mono text-xs bg-green-400/10 text-green-400 border border-green-400/30 px-2 py-1">
              ADMIN
            </span>
          )}
          <button
            onClick={handleLogout}
            className="font-mono text-xs text-zinc-600 hover:text-red-500 transition-colors border border-zinc-800 hover:border-red-500/50 px-4 py-2"
          >
            LOGOUT
          </button>
        </div>
      </div>
    </nav>
  )
}