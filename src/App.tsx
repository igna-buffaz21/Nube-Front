import './App.css'
import { Routes, Route } from 'react-router-dom'
import LoginPage from './pages/login'
import RegisterPage from './pages/register'
import Home from './pages/home'
import { ToastComponent } from './components/ui/toast' // ajusta la ruta
import { AuthProvider } from './auth/authContext'
import { ProtectedRoute } from './auth/protectedRoute'
import { Storage } from './pages/storage'


function App() {
  return (
    <>
    <AuthProvider>

      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route 
        path="/home" 
        element={
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
        } 
        />

        <Route 
        path="/storage" 
        element={
        <ProtectedRoute>
          <Storage />
        </ProtectedRoute>
        } 
        />

      </Routes>
      <ToastComponent />
      </AuthProvider>
    </>
  );
}

export default App
