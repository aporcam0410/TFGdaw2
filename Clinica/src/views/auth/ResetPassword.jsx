import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import api from '../../utils/api'
import { RESET_PASSWORD_ENDPOINT } from '../../utils/endpoints'
import styles from './auth.module.css'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const token = searchParams.get('token') ?? ''
  const emailParam = searchParams.get('email') ?? ''

  const [password, setPassword]         = useState('')
  const [passwordConfirm, setConfirm]   = useState('')
  const [error, setError]               = useState('')
  const [loading, setLoading]           = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    if (password !== passwordConfirm) { setError('Las contraseñas no coinciden.'); return }
    if (password.length < 6) { setError('Mínimo 6 caracteres.'); return }
    setError(''); setLoading(true)
    try {
      await api.post(RESET_PASSWORD_ENDPOINT, { token, email: emailParam, password })
      navigate('/login?reset=ok')
    } catch (err) {
      setError(err.response?.data?.message || 'El enlace no es válido o ha expirado.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.formSide}>
        <div className={styles.formWrap}>
          <Link to="/" className={styles.logo}>Psicología Vélez</Link>
          <h1>Nueva contraseña</h1>
          <p className={styles.subtitle}>Introduce tu nueva contraseña para restablecer el acceso.</p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className="form-group">
              <label className="form-label">Nueva contraseña</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres" required minLength={6} />
            </div>
            <div className="form-group">
              <label className="form-label">Repetir contraseña</label>
              <input type="password" value={passwordConfirm} onChange={e => setConfirm(e.target.value)}
                placeholder="Repite la contraseña" required />
            </div>
            {error && <p className="form-error">{error}</p>}
            <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={loading}>
              {loading ? 'Guardando...' : 'Establecer contraseña'}
            </button>
          </form>
        </div>
      </div>

      <div className={styles.imgSide} style={{ backgroundImage: "url('/fotos/login.webp')" }}>
        <div className={styles.imgOverlay}>
          <blockquote className={styles.quote}>
            "El cambio comienza con una decisión."
            <cite>— Anónimo</cite>
          </blockquote>
        </div>
      </div>
    </div>
  )
}
