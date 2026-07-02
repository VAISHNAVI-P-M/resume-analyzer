import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Results() {
  const [result, setResult] = useState(null)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const data = localStorage.getItem('analysisResult')
    if (!data) {
      navigate('/upload')
      return
    }
    const parsed = JSON.parse(data)
if (!parsed.result) {
  navigate('/upload')
  return
}
setResult(parsed.result)
if (parsed.alreadySaved) {
  setSaved(true)   // hide the button by marking it as already saved
}
  }, [navigate])

  const handleSave = async () => {
    setSaving(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/history/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          jobTitle: 'Job Analysis', // we'll make this dynamic later
          result: result
        })
      })

      await response.json()
        if (response.ok) {
          setSaved(true)
        }
    } catch (err) {
      console.error('Save failed:', err)
    }
    setSaving(false)
  }

  if (!result) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Loading...</p>
    </div>
  )

  const getScoreColor = (score) => {
    if (score >= 70) return 'text-green-600'
    if (score >= 40) return 'text-amber-500'
    return 'text-red-500'
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-6 flex justify-between items-center">
  
  {/* Smaller title */}
  <h1 className="text-3xl font-bold text-blue-800 ml-5">
    PrepIQ
  </h1>

  {/* Move buttons slightly left */}
  <div className="flex items-center gap-4 mr-8">
    
    {!saved && (
      <button
        onClick={handleSave}
        disabled={saving}
        className="text-base font-medium text-white bg-blue-600 px-6 py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
      >
        {saving ? 'Saving...' : 'Save to History'}
      </button>
    )}

    <button
      onClick={() => navigate('/upload')}
      className="text-base font-medium text-blue-600 border border-blue-200 px-6 py-2.5 rounded-lg hover:bg-blue-50 transition"
    >
      ← New Analysis
    </button>

  </div>
</nav>

      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* 1. Match Score */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-6 text-center">
          <p className="text-sm text-gray-500 mb-2">Match Score</p>
          <p className={`text-6xl font-bold ${getScoreColor(result.matchScore)}`}>
            {result.matchScore}%
          </p>
          <p className="text-gray-400 text-sm mt-2">
            {result.matchScore >= 70
              ? 'Strong match for this role'
              : result.matchScore >= 40
                ? 'Moderate match — some gaps to fill'
                : 'Significant gaps — focus on your strengths below'}
          </p>
        </div>

        {/* 2. Top Strengths */}
        {(result.topStrengths || []).length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-green-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-1">
              💪 Top Strengths
            </h2>
            <p className="text-xs text-gray-400 mb-4">Lead with these in your interview</p>
            <div className="flex flex-wrap gap-2">
              {result.topStrengths.map((skill, i) => (
                <span key={i} className="bg-green-100 text-green-800 font-medium text-sm px-4 py-1.5 rounded-full">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 3. Interview Focus Areas */}
        {(result.interviewFocusAreas || []).length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-amber-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-1">
              🎯 Interview Focus Areas
            </h2>
            <p className="text-xs text-gray-400 mb-4">What to mentally prepare in the next 24 hours</p>
            <div className="space-y-4">
              {result.interviewFocusAreas.map((item, i) => (
                <div key={i} className="border border-amber-100 bg-amber-50 rounded-xl p-4">
                  <p className="font-medium text-gray-800 text-sm mb-2">⚠ {item.gap}</p>
                  <p className="text-sm text-gray-600 italic">"{item.howToAnswer}"</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Project Talking Points */}
        {(result.projectTalkingPoints || []).length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-blue-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-1">
              🗣 Project Talking Points
            </h2>
            <p className="text-xs text-gray-400 mb-4">Rehearse these out loud before your interview</p>
            <div className="space-y-4">
              {result.projectTalkingPoints.map((item, i) => (
                <div key={i} className="border border-blue-100 bg-blue-50 rounded-xl p-4">
                  <p className="font-semibold text-gray-800 text-sm mb-2">{item.project}</p>
                  <p className="text-sm text-gray-700">{item.talkingPoint}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. Suggested Rewrites */}
        {(result.rewrites || []).length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              ✍ Suggested Rewrites
            </h2>
            <div className="space-y-4">
              {result.rewrites.map((item, i) => (
                <div key={i} className="border border-gray-100 rounded-xl p-4">
                  <p className="text-xs text-red-400 font-medium mb-1">BEFORE</p>
                  <p className="text-sm text-gray-500 mb-3">{item.before}</p>
                  <p className="text-xs text-green-500 font-medium mb-1">AFTER</p>
                  <p className="text-sm text-gray-800">{item.after}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. Interview Questions */}
        {(result.interviewQuestions || []).length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              ❓ Likely Interview Questions
            </h2>
            <div className="space-y-3">
              {result.interviewQuestions.map((q, i) => (
                <div key={i} className="flex gap-3">
                  <span className="text-blue-500 font-semibold text-sm">{i + 1}.</span>
                  <p className="text-sm text-gray-700">{q}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. Matched/Missing Skills — de-prioritized, collapsed by default */}
        <details className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <summary className="text-lg font-semibold text-gray-800 cursor-pointer">
            📋 Full Skills Breakdown (optional)
          </summary>
          <div className="mt-4">
            {(result.matchedSkills || []).length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-600 mb-2">Matched Skills</p>
                <div className="flex flex-wrap gap-2">
                  {result.matchedSkills.map((skill, i) => (
                    <span key={i} className="bg-green-50 text-green-700 text-xs px-3 py-1 rounded-full border border-green-200">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {(result.missingSkills || []).length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Skills to Develop (long-term)</p>
                <div className="space-y-2">
                  {result.missingSkills.map((item, i) => (
                    <div key={i} className="text-xs text-gray-500">
                      <span className="font-medium text-gray-700">{item.skill}</span> — {item.resource}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </details>

      </div>
    </div>
  )
}

export default Results