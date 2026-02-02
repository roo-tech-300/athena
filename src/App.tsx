import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/Public/LandingPage'
import Login from './pages/Public/Login'
import SignUp from './pages/Public/SignUp'
import Portal from './pages/Private/Portal'
import GrantPage from './pages/Private/Grants/grantPage'

import { ToastProvider } from './components/ui/Toast'

function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/portal" element={<Portal />} />
          <Route path="/grant/:id" element={<GrantPage />} />
        </Routes>
      </Router>
    </ToastProvider>
  )
}

export default App
