import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function History() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('token')
      fetch(`${process.env.REACT_APP_API_URL}/api/history`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      if (response.ok) {
        setHistory(data.history)
      }
    } catch (err) {
      console.error('Failed to fetch history:', err)
    }
    setLoading(false)
  }

  // When user clicks a past analysis, load it into Results page
 const viewAnalysis = (item) => {
  localStorage.setItem('analysisResult', JSON.stringify({
    success: true,
    result: item.result_data,
    alreadySaved: true   // flag: this came from history, already saved
  }))
  navigate('/results')
}

  const getScoreColor = (score) => {
    if (score >= 70) return 'text-green-600 bg-green-50'
    if (score >= 40) return 'text-amber-600 bg-amber-50'
    return 'text-red-600 bg-red-50'
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
  <button
    onClick={() => navigate('/upload')}
    className="text-sm font-medium text-blue-600 border border-blue-200 px-4 py-1.5 rounded-lg hover:bg-blue-50 transition"
  >
    ← Back
  </button>
  <h1 className="text-lg font-bold text-blue-600">PrepIQ</h1>
  <button
    onClick={() => navigate('/upload')}
    className="text-sm font-medium text-white bg-blue-600 px-4 py-1.5 rounded-lg hover:bg-blue-700 transition"
  >
    + New Analysis
  </button>
</nav>
      <div className="max-w-3xl mx-auto px-6 py-10">

        <h2 className="text-2xl font-bold text-gray-800 mb-1">
          Your Analysis History
        </h2>
        <p className="text-gray-500 text-sm mb-8">
          Past resume analyses you've saved
        </p>

        {loading && (
          <p className="text-gray-400 text-sm">Loading...</p>
        )}

        {!loading && history.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
            <p className="text-gray-500 text-sm mb-4">No saved analyses yet</p>
            <button
              onClick={() => navigate('/upload')}
              className="text-blue-600 text-sm font-medium hover:underline"
            >
              Analyze your first resume →
            </button>
          </div>
        )}

        <div className="space-y-3">
          {history.map((item) => (
            <div
              key={item.id}
              onClick={() => viewAnalysis(item)}
              className="bg-white rounded-xl border border-gray-200 p-5 cursor-pointer hover:border-blue-300 hover:shadow-sm transition flex items-center justify-between"
            >
              <div>
                <p className="font-medium text-gray-800 text-sm">{item.job_title}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(item.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'short', year: 'numeric'
                   
                  })}
                </p>
              </div>
              <span className={`text-sm font-bold px-3 py-1 rounded-full ${getScoreColor(item.match_score)}`}>
                {item.match_score}%
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default History