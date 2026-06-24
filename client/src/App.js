import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Upload from './pages/Upload'
import Results from './pages/Results'
import ProtectedRoute from './components/ProtectedRoute'
import History from './pages/History'


function App() {
  return (
    <BrowserRouter>
      <Routes>
       
        <Route path="/history" element={
        <ProtectedRoute><History /></ProtectedRoute>
        } />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/upload" element={
          <ProtectedRoute><Upload /></ProtectedRoute>
        } />
        <Route path="/results" element={
          <ProtectedRoute><Results /></ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App