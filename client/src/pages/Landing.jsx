import { useNavigate } from 'react-router-dom'

function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-6 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-blue-600">PrepIQ</span>
          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-medium">AI</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/login')}
            className="text-sm font-medium text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            Login
          </button>
          <button
            onClick={() => navigate('/register')}
            className="text-sm font-medium text-white bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Get Started Free
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-8 pt-20 pb-16 text-center">
        <div className="inline-block bg-blue-50 text-blue-600 text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
          AI-Powered Interview Prep
        </div>
        <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
          Know exactly how ready<br />you are for your interview
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10">
          Upload your resume, paste the job description, and PrepIQ's AI agent analyzes your fit, rewrites weak bullet points, and generates tailored interview questions — in under 30 seconds.
        </p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => navigate('/register')}
            className="bg-blue-600 text-white font-semibold px-8 py-3 rounded-xl hover:bg-blue-700 transition text-sm"
          >
            Analyze My Resume →
          </button>
          <button
            onClick={() => navigate('/login')}
            className="text-gray-600 font-medium px-8 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition text-sm"
          >
            Login
          </button>
        </div>
      </div>

      {/* How it works */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-8">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-12">
            How PrepIQ works
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            {[
              { step: '01', title: 'Upload Resume', desc: 'Drop your resume PDF — PrepIQ reads and understands your skills and experience' },
              { step: '02', title: 'Paste Job Description', desc: 'Copy the JD from any job portal — Naukri, LinkedIn, company website' },
              { step: '03', title: 'AI Analyzes', desc: 'Our 4-step AI agent compares your profile against the role requirements' },
              { step: '04', title: 'Get Prep Report', desc: 'See your match score, talking points, rewrites, and 13 interview questions' },
            ].map((item) => (
              <div key={item.step} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="text-3xl font-bold text-blue-100 mb-3">{item.step}</div>
                <h3 className="font-semibold text-gray-800 mb-2 text-sm">{item.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* What you get */}
      <div className="max-w-4xl mx-auto px-8 py-16">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-12">
          Everything you need for last-minute prep
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[
            { icon: '🎯', title: 'Match Score', desc: 'Instantly see how well your resume fits the role — 0 to 100%' },
            { icon: '💪', title: 'Top Strengths', desc: 'Know exactly which skills to lead with in your interview' },
            { icon: '⚠️', title: 'Interview Focus Areas', desc: 'Spot your gaps and get ready-to-say sentences to address them' },
            { icon: '🗣️', title: 'Project Talking Points', desc: 'Spoken narratives for your projects — rehearse and walk in confident' },
            { icon: '✍️', title: 'Resume Rewrites', desc: 'AI rewrites your weak bullet points to be more impactful' },
            { icon: '❓', title: '13 Interview Questions', desc: 'Tailored to your resume + the specific JD you applied for' },
          ].map((item) => (
            <div key={item.title} className="flex gap-4 p-5 rounded-2xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition">
              <span className="text-2xl">{item.icon}</span>
              <div>
                <h3 className="font-semibold text-gray-800 text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Who is it for */}
      <div className="bg-blue-600 py-16">
        <div className="max-w-3xl mx-auto px-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Built for students under placement pressure
          </h2>
          <p className="text-blue-100 text-sm mb-8 leading-relaxed">
            You got the drive announcement at 9 PM. Interview is tomorrow at 11 AM. PrepIQ gives you a focused, personalized prep plan in 30 seconds — not a list of 50 skills to learn overnight.
          </p>
          <button
            onClick={() => navigate('/register')}
            className="bg-white text-blue-600 font-semibold px-8 py-3 rounded-xl hover:bg-blue-50 transition text-sm"
          >
            Start Preparing Now — It's Free
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="py-8 text-center border-t border-gray-100">
        <p className="text-sm text-gray-400">
          PrepIQ — AI-powered interview prep for placement students
        </p>
      </div>

    </div>
  )
}

export default Landing