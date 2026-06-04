import { useState } from 'react'
import axios from 'axios'

export default function CreateUrlForm({ onRefresh }) {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setResult(null)
    setLoading(true)
    try {
      const res = await axios.post('/url/', { url })
      setResult(res.data)
      setUrl('')
      onRefresh()
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to shorten URL')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(result.shortUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-zinc-950 border border-zinc-800 p-6 relative animate-slide-up">
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-40" />
      <div className="font-mono text-xs text-zinc-600 tracking-widest uppercase mb-4 flex items-center gap-2">
        <span className="neon-text">+</span> SHORTEN URL
      </div>

      {/* ✅ fixed: flex-col on mobile, flex-row on sm+ */}
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://your-long-url.com/goes/here"
          required
          className="neon-input w-full bg-black border border-zinc-800 px-4 py-3 font-mono text-sm text-white placeholder-zinc-700 transition-all"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto bg-green-400 text-black font-mono font-bold text-sm tracking-widest uppercase px-8 py-3 hover:shadow-neon-green transition-all disabled:opacity-50 whitespace-nowrap"
        >
          {loading ? 'SHRTNNG...' : 'SHRTN →'}
        </button>
      </form>

      {error && (
        <div className="font-mono text-xs text-red-500 bg-red-500/10 border border-red-500/30 px-4 py-3 mt-3 flex items-center gap-2">
          <span>✕</span><span>{error}</span>
        </div>
      )}

      {result && (
        <div className={`mt-4 border border-green-400/30 bg-green-400/5 px-4 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${copied ? 'copy-flash' : ''}`}>
          <div>
            <div className="font-mono text-xs text-zinc-600 uppercase mb-1">Short URL Generated</div>
            <div className="font-mono text-sm neon-text break-all">{result.shortUrl}</div>
          </div>
          <button
            onClick={handleCopy}
            className="font-mono text-xs border border-green-400/40 text-green-400 hover:bg-green-400 hover:text-black transition-all px-4 py-2 whitespace-nowrap"
          >
            {copied ? '✓ COPIED' : 'COPY'}
          </button>
        </div>
      )}
    </div>
  )
}