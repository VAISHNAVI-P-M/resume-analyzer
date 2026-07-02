const express = require('express')
const cors = require('cors')
require('dotenv').config()

const authRoutes = require('./routes/auth')
const analyzeRoutes = require('./routes/analyze')
const historyRoutes = require('./routes/history')
const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://prepiq.vercel.app',
    /\.vercel\.app$/
  ],
  credentials: true
}))
app.use(express.json())

// Routes
app.use('/auth', authRoutes)
app.use('/api/analyze', analyzeRoutes)
app.use('/api/history', historyRoutes)
// Test route
app.get('/ping', (req, res) => {
  res.json({ message: 'Server is running!' })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})