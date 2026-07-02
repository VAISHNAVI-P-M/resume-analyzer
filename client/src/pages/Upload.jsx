import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Upload() {
  const [resumeFile, setResumeFile] = useState(null)
  const [jobDescription, setJobDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const navigate = useNavigate()

  // Called when user picks a file using the file picker
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file && file.type === 'application/pdf') {
      setResumeFile(file)
      setMessage('')
    } else {
      setMessage('Please upload a PDF file only')
    }
  }

  // Called when user drags a file over the box
  const handleDragOver = (e) => {
    e.preventDefault()
    setDragOver(true)
  }

  // Called when user leaves the drag area
  const handleDragLeave = () => {
    setDragOver(false)
  }

  // Called when user drops the file
  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type === 'application/pdf') {
      setResumeFile(file)
      setMessage('')
    } else {
      setMessage('Please upload a PDF file only')
    }
  }

  // Called when user clicks Submit
  const handleSubmit = async () => {
  if (!resumeFile) {
    setMessage('Please upload your resume PDF')
    return
  }
  if (!jobDescription.trim()) {
    setMessage('Please paste a job description')
    return
  }
  if (resumeFile.size > 5 * 1024 * 1024) {
    setMessage('PDF file is too large. Please upload a file under 5MB.')
    return
  }

  setLoading(true)
  setMessage('')

  try {
    const token = localStorage.getItem('token')
    const formData = new FormData()
    formData.append('resume', resumeFile)
    formData.append('jobDescription', jobDescription)

    const response = await fetch('http://localhost:5000/api/analyze', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    })

    const data = await response.json()

    if (response.ok) {
      localStorage.setItem('analysisResult', JSON.stringify(data))
      navigate('/results')
    } else {
      // Show specific backend error if available
      setMessage(data.error || 'Analysis failed. Please try again.')
    }
  } catch (err) {
    // This catches network errors — server down, no internet etc
    setMessage('Cannot connect to server. Please check your connection and try again.')
  }

  setLoading(false)
}

  // Get user name from localStorage to show greeting
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-6 flex justify-between items-center">
  <h1 className="text-3xl font-bold text-blue-600 ml-5">PrepIQ</h1>
  <div className="flex items-center gap-3">
  <span className="text-sm text-gray-500">Hello, {user.name}</span>
  <button
    onClick={() => navigate('/history')}
    className="text-sm font-medium text-blue-600 border border-blue-200 px-4 py-1.5 rounded-lg hover:bg-blue-50 transition"
  >
    View History
  </button>
  <button
    onClick={() => { localStorage.clear(); navigate('/login') }}
    className="text-sm font-medium text-white bg-red-500 px-4 py-1.5 rounded-lg hover:bg-red-600 transition"
  >
    Logout
  </button>
</div>
</nav>

      {/* Main content */}
      <div className="max-w-3xl mx-auto px-6 py-10">

        <h2 className="text-2xl font-bold text-gray-800 mb-1">
          Analyze Your Resume
        </h2>
        <p className="text-gray-500 text-sm mb-8">
          Upload your resume and paste a job description to get your AI-powered analysis
        </p>

        {/* PDF Upload Box */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Resume (PDF only)
          </label>

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById('fileInput').click()}
            className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition
              ${dragOver
                ? 'border-blue-500 bg-blue-50'
                : resumeFile
                  ? 'border-green-400 bg-green-50'
                  : 'border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50'
              }`}
          >
            {resumeFile ? (
              <div>
                <p className="text-green-600 font-medium text-sm">✓ {resumeFile.name}</p>
                <p className="text-gray-400 text-xs mt-1">Click to change file</p>
              </div>
            ) : (
              <div>
                <p className="text-gray-500 text-sm">
                  Drag and drop your PDF here
                </p>
                <p className="text-gray-400 text-xs mt-1">or click to browse</p>
              </div>
            )}
          </div>

          {/* Hidden file input */}
          <input
            id="fileInput"
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Job Description Box */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Description
          </label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the full job description here..."
            rows={8}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          <p className="text-xs text-gray-400 mt-1">
            {jobDescription.length} characters
          </p>
        </div>

        {/* Error message */}
        {message && (
          <p className="text-red-500 text-sm mb-4">{message}</p>
        )}

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
  <span className="flex items-center justify-center gap-2">
    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
    </svg>
    AI is analyzing — this takes 15–20 seconds...
  </span>
) : (
  'Analyze My Resume →'
)}
        </button>

        

      </div>
    </div>
  )
}

export default Upload