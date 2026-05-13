import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './protectedRoute.module.css'

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { usuario, loading } = useAuth()

  if (loading) return <div className={styles.loading}>Cargando...</div>
  if (!usuario) return <Navigate to="/login" replace />
  if (adminOnly && !usuario.is_admin) return <Navigate to="/" replace />

  return children
}
