import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../utils/api'
import { FORGOT_PASSWORD_ENDPOINT } from '../../utils/endpoints'
import styles from './auth.module.css'

export default function ForgotPassword() {
  const [email, setEmail]     = useState('')
  const [success, setSuccess] = useState('')
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    setError(''); setSuccess(''); setLoading(true)
    try {
      const res = await api.post(FORGOT_PASSWORD_ENDPOINT, { email })
      setSuccess(res.data.message)
    } catch (err) {
      setError(err.response?.data?.message || 'Error al enviar el correo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.formSide}>
        <div className={styles.formWrap}>
          <Link to="/" className={styles.logo}>Psicología Vélez</Link>
          <h1>¿Olvidaste tu contraseña?</h1>
          <p className={styles.subtitle}>Introduce tu email y te enviaremos un enlace para restablecerla.</p>

          {success ? (
            <div style={{ background: '#e0f5f7', borderRadius: '8px', padding: '16px', color: '#2a7a84', lineHeight: 1.6 }}>
              {success}
              <br /><br />
              <Link to="/login" style={{ fontWeight: 600, color: 'var(--color-primary)' }}>← Volver al inicio de sesión</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className="form-group">
                <label className="form-label">Correo Electrónico</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="ejemplo@correo.com" required />
              </div>
              {error && <p className="form-error">{error}</p>}
              <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={loading}>
                {loading ? 'Enviando...' : 'Enviar enlace'}
              </button>
              <p className={styles.switchText}>
                <Link to="/login">← Volver al inicio de sesión</Link>
              </p>
            </form>
          )}
        </div>
      </div>

      <div className={styles.imgSide} style={{ backgroundImage: "url('/fotos/login.webp')" }}>
        <div className={styles.imgOverlay}>
          <blockquote className={styles.quote}>
            "Cada día es una nueva oportunidad para cambiar tu vida."
            <cite>— Anónimo</cite>
          </blockquote>
        </div>
      </div>
    </div>
  )
}
