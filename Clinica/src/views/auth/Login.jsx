import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import styles from './auth.module.css'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const resetOk = searchParams.get('reset') === 'ok'

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const usuario = await login(form.email, form.password)
      navigate(usuario.is_admin ? '/admin' : '/')
    } catch {
      setError('Correo o contraseña incorrectos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.formSide}>
        <div className={styles.formWrap}>
          <Link to="/" className={styles.logo}>Psicología Vélez</Link>
          <h1>Bienvenido de nuevo</h1>
          <p className={styles.subtitle}>Inicia sesión para continuar tu proceso de bienestar y crecimiento personal.</p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className="form-group">
              <label className="form-label">Correo Electrónico</label>
              <input type="email" name="email" value={form.email} onChange={handleChange}
                placeholder="ejemplo@correo.com" required />
            </div>
            <div className="form-group">
              <div className={styles.passLabel}>
                <label className="form-label">Contraseña</label>
                <Link to="/forgot-password" className={styles.forgot}>¿Olvidaste tu contraseña?</Link>
              </div>
              <input type="password" name="password" value={form.password} onChange={handleChange}
                placeholder="••••••••" required />
            </div>

            {resetOk && <p style={{color:'var(--color-accent-dark)',background:'#e0f5f7',borderRadius:'6px',padding:'10px 14px',fontSize:'0.9rem'}}>Contraseña restablecida. Ya puedes iniciar sesión.</p>}
            {error && <p className="form-error">{error}</p>}

            <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={loading}>
              {loading ? 'Iniciando...' : 'Iniciar Sesión'}
            </button>
          </form>

          <p className={styles.switchText}>
            ¿No tienes una cuenta? <Link to="/register">Registrarse</Link>
          </p>
        </div>
      </div>

      <div className={styles.imgSide} style={{ backgroundImage: "url('/fotos/login.webp')" }}>
        <div className={styles.imgOverlay}>
          <blockquote className={styles.quote}>
            "La curiosa paradoja es que cuando me acepto tal como soy, entonces puedo cambiar."
            <cite>— Carl Rogers</cite>
          </blockquote>
        </div>
      </div>
    </div>
  )
}
