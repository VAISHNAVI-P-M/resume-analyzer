const express = require('express')
const multer = require('multer')
const pdfParse = require('pdf-parse')
const authMiddleware = require('../middleware/authmiddleware')
const { runAnalysisAgent } = require('../services/orchestrator')

const router = express.Router()

// multer setup — store file in memory (not on disk)
const storage = multer.memoryStorage()
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true)
    } else {
      cb(new Error('Only PDF files allowed'))
    }
  }
})

// POST /api/analyze
router.post('/', authMiddleware, upload.single('resume'), async (req, res) => {
  try {
    // Check file exists
    if (!req.file) {
      return res.status(400).json({ error: 'No resume file uploaded' })
    }

    // Check job description exists
    const { jobDescription } = req.body
    if (!jobDescription || !jobDescription.trim()) {
      return res.status(400).json({ error: 'Job description is required' })
    }

    // Parse PDF — extract text from the uploaded file
    const pdfData = await pdfParse(req.file.buffer)
    const resumeText = pdfData.text

    // Check we actually got text
    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({ error: 'Could not extract text from PDF. Make sure it is not a scanned image.' })
    }

    // Run the AI agent — this replaces the old test code
    console.log('Starting AI agent pipeline...')
    const analysisResult = await runAnalysisAgent(resumeText, jobDescription)

    res.json({
      success: true,
      message: 'Analysis complete!',
      result: analysisResult
    })

  } catch (err) {
    console.error('Analyze error:', err)
    res.status(500).json({ error: 'Something went wrong. Please try again.' })
  }
})

module.exports = router