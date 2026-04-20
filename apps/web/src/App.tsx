import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ConfigProvider, theme } from 'antd'
import esES from 'antd/locale/es_ES'
import { useAccessibilityStore } from './store/a11yStore'
import { useAuthStore } from './store/authStore'
import AppLayout from './components/Layout/AppLayout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Pacientes from './pages/Pacientes'
import Citas from './pages/Citas'
import Medicos from './pages/Medicos'

const fontSizeMap = { normal: 14, large: 17, xlarge: 20 }

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated())
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

export default function App() {
  const { fontSize, highContrast, reducedMotion } = useAccessibilityStore()

  // Aplicar clases al body según accesibilidad
  useEffect(() => {
    const root = document.documentElement
    root.style.fontSize = `${fontSizeMap[fontSize]}px`
    document.body.classList.toggle('high-contrast', highContrast)
    document.body.classList.toggle('reduced-motion', reducedMotion)
  }, [fontSize, highContrast, reducedMotion])

  return (
    <ConfigProvider
      locale={esES}
      theme={{
        algorithm: highContrast ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: '#1890ff',
          fontSize: fontSizeMap[fontSize],
          borderRadius: 8,
        },
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute><AppLayout /></PrivateRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard"  element={<Dashboard />} />
            <Route path="pacientes"  element={<Pacientes />} />
            <Route path="citas"      element={<Citas />} />
            <Route path="medicos"    element={<Medicos />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  )
}