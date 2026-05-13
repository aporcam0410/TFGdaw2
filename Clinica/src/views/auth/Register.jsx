import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import styles from './auth.module.css'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    nombre: '', apellidos: '', telefono: '',
    fecha_nacimiento: '', email: '', password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(form)
      navigate('/')
    } catch (err) {
      const msg = err.response?.data?.message
      setError(msg || 'Error al registrarse. Comprueba los datos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.formSide}>
        <div className={styles.formWrap}>
          <Link to="/" className={styles.logo}>Psicología Vélez</Link>
          <h1>Comienza tu viaje</h1>
          <p className={styles.subtitle}>Crea tu cuenta y da el primer paso hacia el bienestar emocional que mereces.</p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.row}>
              <div className="form-group">
                <label className="form-label">Nombre</label>
                <input type="text" name="nombre" value={form.nombre} onChange={handleChange}
                  placeholder="Ana" required />
              </div>
              <div className="form-group">
                <label className="form-label">Apellidos</label>
                <input type="text" name="apellidos" value={form.apellidos} onChange={handleChange}
                  placeholder="García López" required />
              </div>
            </div>

            <div className={styles.row}>
              <div className="form-group">
                <label className="form-label">Teléfono</label>
                <input type="tel" name="telefono" value={form.telefono} onChange={handleChange}
                  placeholder="612 345 678" />
              </div>
              <div className="form-group">
                <label className="form-label">Fecha de nacimiento</label>
                <input type="date" name="fecha_nacimiento" value={form.fecha_nacimiento} onChange={handleChange} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Correo Electrónico</label>
              <input type="email" name="email" value={form.email} onChange={handleChange}
                placeholder="ejemplo@correo.com" required />
            </div>

            <div className="form-group">
              <label className="form-label">Contraseña</label>
              <input type="password" name="password" value={form.password} onChange={handleChange}
                placeholder="Mínimo 8 caracteres" required minLength={8} />
            </div>

            {error && <p className="form-error">{error}</p>}

            <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={loading}>
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </form>

          <p className={styles.switchText}>
            ¿Ya tienes cuenta? <Link to="/login">Iniciar sesión</Link>
          </p>
        </div>
      </div>

      <div className={styles.imgSide}>
        <div className={styles.imgOverlay}>
          <blockquote className={styles.quote}>
            "El viaje de mil millas comienza con un solo paso."
            <cite>— Lao Tzu</cite>
          </blockquote>
        </div>
      </div>
    </div>
  )
}
