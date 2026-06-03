import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import UrlCard from '../components/UrlCard'
import CreateUrlForm from '../components/CreateUrlForm'

export default function Dashboard() {
  const [urls, setUrls] = useState([])
  const [userStats, setUserStats] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [viewAll, setViewAll] = useState(false)
  const [activeTab, setActiveTab] = useState('links')
  const { user } = useAuth()

  const fetchUrls = async () => {
    try {
      setLoading(true)
      const endpoint = user?.role === 'ADMIN' && viewAll
        ? '/url/admin/all'
        : '/url/'
      const res = await axios.get(endpoint)
      setUrls(res.data)
    } catch (err) {
      setError('Failed to load URLs')
    } finally {
      setLoading(false)
    }
  }

  const fetchUserStats = async () => {
    try {
      const res = await axios.get('/url/admin/stats')
      setUserStats(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchUrls()
    if (user?.role === 'ADMIN') fetchUserStats()
  }, [viewAll])

  const totalClicks = urls.reduce((sum, u) => sum + (u.visitHistory?.length || 0), 0)

  // ← delete handler
  const handleDelete = (deletedId) => {
    setUrls(prev => prev.filter(u => u._id !== deletedId))
  }

  return (
    <div className="min-h-screen bg-black grid-bg">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <div className="font-mono text-xs text-zinc-600 tracking-widest uppercase mb-1">
            // DASHBOARD
          </div>
          <h1 className="font-display text-3xl font-bold text-white">
            Welcome back, <span className="neon-text">{user?.name}</span>
          </h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Links', value: urls.length },
            { label: 'Total Clicks', value: totalClicks },
            { label: 'Role', value: user?.role || 'NORMAL' },
          ].map((stat) => (
            <div key={stat.label} className="bg-zinc-950 border border-zinc-800 p-5 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-green-400 opacity-60" />
              <div className="font-mono text-xs text-zinc-600 tracking-widest uppercase mb-2">
                {stat.label}
              </div>
              <div className="font-mono text-2xl font-bold neon-text">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Create URL */}
        <CreateUrlForm onRefresh={fetchUrls} />

        {/* Admin tabs */}
        {user?.role === 'ADMIN' && (
          <div className="flex gap-3 mt-8 mb-4">
            <button
              onClick={() => setActiveTab('links')}
              className={`font-mono text-xs px-4 py-2 border transition-all ${
                activeTab === 'links'
                  ? 'border-green-400 text-green-400 bg-green-400/10'
                  : 'border-zinc-800 text-zinc-600 hover:border-zinc-600'
              }`}
            >
              🔗 LINKS
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`font-mono text-xs px-4 py-2 border transition-all ${
                activeTab === 'stats'
                  ? 'border-green-400 text-green-400 bg-green-400/10'
                  : 'border-zinc-800 text-zinc-600 hover:border-zinc-600'
              }`}
            >
              📊 USER STATS
            </button>
          </div>
        )}

        {/* User Stats Tab */}
        {user?.role === 'ADMIN' && activeTab === 'stats' && (
          <div className="bg-zinc-950 border border-zinc-800 p-6 animate-slide-up">
            <div className="font-mono text-xs text-zinc-600 uppercase mb-4 flex items-center gap-2">
              <span className="neon-text">▶</span> ALL USERS STATS
            </div>

            {userStats.length === 0 ? (
              <div className="font-mono text-zinc-700 text-sm text-center py-8">NO DATA</div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-4 gap-4 font-mono text-xs text-zinc-600 uppercase border-b border-zinc-800 pb-3">
                  <span>#</span>
                  <span>User</span>
                  <span>Total URLs</span>
                  <span>Total Clicks</span>
                </div>
                {userStats.map((stat, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-4 gap-4 border border-zinc-900 hover:border-zinc-700 px-4 py-3 transition-colors"
                  >
                    <span className="font-mono text-xs text-zinc-700">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <div className="font-mono text-sm text-white">{stat.name}</div>
                      <div className="font-mono text-xs text-zinc-600">{stat.email}</div>
                    </div>
                    <div className="font-mono text-xl font-bold neon-text">{stat.totalUrls}</div>
                    <div className="font-mono text-xl font-bold neon-text-cyan">{stat.totalClicks}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Links Tab */}
        {activeTab === 'links' && (
          <div className="mt-2">
            <div className="flex items-center justify-between mb-4">
              <div className="font-mono text-xs text-zinc-600 tracking-widest uppercase flex items-center gap-3">
                <span className="neon-text">■</span>
                <span>{viewAll ? 'ALL USERS LINKS' : 'YOUR LINKS'}</span>
              </div>

              {user?.role === 'ADMIN' && (
                <button
                  onClick={() => setViewAll(!viewAll)}
                  className={`font-mono text-xs px-4 py-2 border transition-all ${
                    viewAll
                      ? 'border-green-400 text-green-400 bg-green-400/10'
                      : 'border-zinc-700 text-zinc-500 hover:border-green-400 hover:text-green-400'
                  }`}
                >
                  {viewAll ? '👁 ALL USERS' : '👁 MY LINKS ONLY'}
                </button>
              )}
            </div>

            {loading && (
              <div className="font-mono text-green-400 text-sm animate-pulse text-center py-12">
                LOADING...
              </div>
            )}
            {error && (
              <div className="font-mono text-xs text-red-500 border border-red-500/30 px-4 py-3">
                ✕ {error}
              </div>
            )}
            {!loading && urls.length === 0 && (
              <div className="text-center py-16 border border-zinc-900">
                <div className="font-mono text-zinc-700 text-sm">NO RECORDS FOUND</div>
                <div className="font-mono text-zinc-800 text-xs mt-2">
                  Create your first short URL above
                </div>
              </div>
            )}

            <div className="space-y-3">
              {urls.map((url, i) => (
                <UrlCard
                  key={url._id}
                  url={url}
                  index={i}
                  showOwner={viewAll}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  )
}
