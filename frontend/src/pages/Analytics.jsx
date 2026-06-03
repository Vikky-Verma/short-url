import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'

export default function Analytics() {
  const { shortId } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    axios.get(`/url/analytics/${shortId}`)
      .then(res => setData(res.data))
      .catch(() => navigate('/'))
      .finally(() => setLoading(false))
  }, [shortId])

  return (
    <div className="min-h-screen bg-black grid-bg">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8">

        <button
          onClick={() => navigate('/')}
          className="font-mono text-xs text-zinc-600 hover:text-green-400 transition-colors mb-6 flex items-center gap-2"
        >
          ← BACK TO DASHBOARD
        </button>

        <div className="font-mono text-xs text-zinc-600 uppercase mb-1">// ANALYTICS</div>
        <h1 className="font-display text-3xl font-bold text-white mb-8">
          Link <span className="neon-text">/{shortId}</span>
        </h1>

        {loading && (
          <div className="font-mono text-green-400 animate-pulse text-center py-12">
            LOADING...
          </div>
        )}

        {data && (
          <div className="space-y-6 animate-slide-up">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-950 border border-zinc-800 p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-green-400" />
                <div className="font-mono text-xs text-zinc-600 uppercase mb-2">Total Clicks</div>
                <div className="font-mono text-5xl font-bold neon-text">{data.totalClicks}</div>
              </div>
              <div className="bg-zinc-950 border border-zinc-800 p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-cyan-400" />
                <div className="font-mono text-xs text-zinc-600 uppercase mb-2">Short URL</div>
                <div className="font-mono text-sm text-green-400 break-all">
                  http://localhost:8001/url/{shortId}
                </div>
              </div>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 p-6">
              <div className="font-mono text-xs text-zinc-600 uppercase mb-4 flex items-center gap-2">
                <span className="neon-text">▶</span> CLICK HISTORY
              </div>
              {data.analytics.length === 0 ? (
                <div className="font-mono text-zinc-700 text-sm text-center py-8">
                  NO CLICKS YET
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {[...data.analytics].reverse().map((entry, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between border border-zinc-900 px-4 py-3 hover:border-zinc-700 transition-colors"
                    >
                      <span className="font-mono text-xs text-zinc-600">
                        #{data.analytics.length - i}
                      </span>
                      <span className="font-mono text-xs text-green-400">
                        {new Date(entry.timestamp).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  )
}