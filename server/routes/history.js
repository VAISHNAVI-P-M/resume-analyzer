const express = require('express')
const supabase = require('../supabase')
const authMiddleware = require('../middleware/authmiddleware')

const router = express.Router()

// POST /api/history/save — save an analysis result
router.post('/save', authMiddleware, async (req, res) => {
  try {
    const { jobTitle, result } = req.body
    const userId = req.user.id // comes from the JWT token, set by authMiddleware

    if (!result) {
      return res.status(400).json({ error: 'No result data provided' })
    }

    const { data, error } = await supabase
      .from('analysis_history')
      .insert([{
        user_id: userId,
        job_title: jobTitle || 'Untitled Analysis',
        match_score: result.matchScore,
        result_data: result
      }])
      .select()
      .single()

    if (error) {
      console.error('Save error:', error)
      return res.status(500).json({ error: 'Failed to save analysis' })
    }

    res.json({ success: true, message: 'Analysis saved!', saved: data })

  } catch (err) {
    console.error('History save error:', err)
    res.status(500).json({ error: 'Something went wrong' })
  }
})

// GET /api/history — fetch all saved analyses for the logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id

    const { data, error } = await supabase
      .from('analysis_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch history' })
    }

    res.json({ success: true, history: data })

  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' })
  }
})

module.exports = router