import { Routes, Route, Navigate } from 'react-router-dom'
import RootLayout from './views/RootLayout'
import ProtectedRoute from './views/ProtectedRoute'
import Home from './views/home/Home'
import Login from './views/auth/Login'
import Register from './views/auth/Register'
import ForgotPassword from './views/auth/ForgotPassword'
import ResetPassword from './views/auth/ResetPassword'
import Psicologos from './views/psicologos/Psicologos'
import Nosotros from './views/nosotros/Nosotros'
import Contacto from './views/contacto/Contacto'
import Citas from './views/citas/Citas'
import NuevaCita from './views/citas/NuevaCita'
import Perfil from './views/perfil/Perfil'
import Admin from './views/admin/Admin'

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/psicologos" element={<Psicologos />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/contacto" element={<Contacto />} />

        <Route path="/citas" element={
          <ProtectedRoute><Citas /></ProtectedRoute>
        } />
        <Route path="/citas/nueva" element={
          <ProtectedRoute><NuevaCita /></ProtectedRoute>
        } />
        <Route path="/perfil" element={
          <ProtectedRoute><Perfil /></ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute adminOnly><Admin /></ProtectedRoute>
        } />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
