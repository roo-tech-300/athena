import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/Public/LandingPage'
import Login from './pages/Public/Login'
import SignUp from './pages/Public/SignUp'
import Portal from './pages/Private/Portal'
import GrantPage from './pages/Private/Grants/grantPage'

import { ToastProvider } from './components/ui/Toast'
import { AuthProvider } from './useContext/context'
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'
import NotFound from './pages/Public/NotFound'

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />

            <Route element={<PublicRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
            </Route>

            {/* Private Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/portal" element={<Portal />} />
              <Route path="/grant/:id" element={<GrantPage />} />
            </Route>

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </ToastProvider>
    </AuthProvider>
  )
}

export default App
