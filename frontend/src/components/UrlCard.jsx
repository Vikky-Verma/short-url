import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function UrlCard({ url, index, showOwner, onDelete }) {
  const [copied, setCopied] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const navigate = useNavigate()
  const shortUrl = `http://localhost:8001/url/${url.shortId}`

  const handleCopy = (e) => {
    e.stopPropagation()
    navigator.clipboard.writeText(shortUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDelete = async (e) => {
    e.stopPropagation()
    if (!confirm('Delete this short URL?')) return
    setDeleting(true)
    try {
      await axios.delete(`/url/${url.shortId}`)
      onDelete(url._id)
    } catch (err) {
      alert('Failed to delete')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className={`border border-zinc-900 hover:border-zinc-700 bg-zinc-950 p-4 transition-all duration-200 group animate-fade-in ${copied ? 'copy-flash' : ''}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <span className="font-mono text-xs text-zinc-700">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="font-mono text-sm font-bold neon-text">
              /{url.shortId}
            </span>
            <span className="font-mono text-xs text-zinc-700">
              {new Date(url.createdAt).toLocaleDateString('en', {
                day: '2-digit', month: 'short', year: 'numeric'
              }).toUpperCase()}
            </span>

            {showOwner && url.createdBy?.name && (
              <span className="font-mono text-xs bg-zinc-900 text-zinc-400 border border-zinc-800 px-2 py-0.5">
                👤 {url.createdBy.name}
              </span>
            )}
            {showOwner && url.createdBy?.email && (
              <span className="font-mono text-xs text-zinc-600">
                {url.createdBy.email}
              </span>
            )}
          </div>

          <div className="font-mono text-xs text-zinc-500 truncate max-w-md">
            {url.redirectUrl}
          </div>
          <div className="font-mono text-xs text-zinc-700 mt-1">{shortUrl}</div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <div className="font-mono text-xl font-bold neon-text">
              {url.visitHistory?.length || 0}
            </div>
            <div className="font-mono text-xs text-zinc-700">CLICKS</div>
          </div>

          <button
            onClick={handleCopy}
            className="font-mono text-xs border border-zinc-800 text-zinc-600 hover:text-green-400 hover:border-green-400/40 transition-all px-3 py-2"
          >
            {copied ? '✓' : 'COPY'}
          </button>

          <button
            onClick={() => navigate(`/analytics/${url.shortId}`)}
            className="font-mono text-xs border border-zinc-800 text-zinc-600 hover:text-cyan-400 hover:border-cyan-400/40 transition-all px-3 py-2"
          >
            STATS →
          </button>

          {/* Delete button */}
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="font-mono text-xs border border-zinc-800 text-zinc-600 hover:text-red-500 hover:border-red-500/40 transition-all px-3 py-2 disabled:opacity-50"
          >
            {deleting ? '...' : 'DEL'}
          </button>
        </div>
      </div>
    </div>
  )
}