const express = require('express')
const multer = require('multer')
const pdfParse = require('pdf-parse')
console.log(pdfParse)
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router()

// multer setup — store file in memory (not on disk)
// memoryStorage means the file is held as a Buffer in RAM
// A Buffer is just raw binary data — like the PDF's bytes
const storage = multer.memoryStorage()
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    // Only allow PDF files
    if (file.mimetype === 'application/pdf') {
      cb(null, true)
    } else {
      cb(new Error('Only PDF files allowed'))
    }
  }
})

// POST /api/analyze
// authMiddleware runs first — checks JWT token
// upload.single('resume') runs second — processes the file
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
    // req.file.buffer contains the raw PDF bytes
    const pdfData = await pdfParse(req.file.buffer)
    const resumeText = pdfData.text

    // Check we actually got text
    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({ error: 'Could not extract text from PDF. Make sure it is not a scanned image.' })
    }

    // For now — just return the extracted text to confirm it works
    // We will replace this with the AI agent in Phase 3
    res.json({
  success: true,
  message: 'PDF parsed successfully',
  resumeTextPreview: resumeText,
  resumeLength: resumeText.length,
  jobDescriptionLength: jobDescription.length
})
  } catch (err) {
    console.error('Analyze error:', err)
    res.status(500).json({ error: 'Something went wrong. Please try again.' })
  }
})

module.exports = router