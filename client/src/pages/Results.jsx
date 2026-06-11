import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Results() {
  const [result, setResult] = useState(null)
  const [showFullText, setShowFullText] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Get the analysis result we saved in localStorage
    const data = localStorage.getItem('analysisResult')
    if (!data) {
      navigate('/upload')
      return
    }
    setResult(JSON.parse(data))
  }, [navigate])

  if (!result) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Loading...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">

        <button
          onClick={() => navigate('/upload')}
          className="text-sm text-blue-500 hover:underline mb-6 block"
        >
          ← Back to Upload
        </button>

        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Analysis Result
        </h1>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4">
          <p className="text-sm text-gray-500 mb-1">Status</p>
          <p className="text-green-600 font-semibold">{result.message}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4">

  <p className="text-sm text-gray-500 mb-3">
    Extracted Resume Text
  </p>

  <div className="text-gray-700 text-sm font-mono bg-gray-50 p-3 rounded-lg whitespace-pre-wrap max-h-[400px] overflow-y-auto">

    {showFullText
      ? result.resumeTextPreview.trim()
      : result.resumeTextPreview.trim().substring(0, 1000)}

    {!showFullText && result.resumeTextPreview.length > 1000 && '...'}
  </div>

  {result.resumeTextPreview.length > 1000 && (
    <button
      onClick={() => setShowFullText(!showFullText)}
      className="mt-3 text-blue-600 hover:underline text-sm"
    >
      {showFullText ? 'Show Less ↑' : 'Show More ↓'}
    </button>
  )}

</div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-500 mb-2">Stats</p>
          <p className="text-sm text-gray-700">
            Resume text length: <span className="font-medium">{result.resumeLength} characters</span>
          </p>
          <p className="text-sm text-gray-700 mt-1">
            Job description length: <span className="font-medium">{result.jobDescriptionLength} characters</span>
          </p>
        </div>

      </div>
    </div>
  )
}

export default Results