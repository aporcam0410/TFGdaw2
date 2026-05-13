import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { usuariosApi } from '../../utils/api'
import styles from './perfil.module.css'

export default function Perfil() {
  const { usuario, updateUsuario } = useAuth()
  const [form, setForm] = useState({
    nombre: usuario?.nombre ?? '',
    apellidos: usuario?.apellidos ?? '',
    telefono: usuario?.telefono ?? '',
    fecha_nacimiento: usuario?.fecha_nacimiento ?? '',
  })
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      const res = await usuariosApi.update(usuario.id, form)
      updateUsuario(res.data)
      setSuccess('Perfil actualizado correctamente.')
    } catch {
      setError('No se pudo actualizar el perfil.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroAvatar}>
            <div className={styles.avatar}>
              {usuario?.nombre?.charAt(0)?.toUpperCase() ?? 'U'}
            </div>
            <div>
              <h1>{usuario?.nombre} {usuario?.apellidos}</h1>
              <p>{usuario?.email}</p>
              {usuario?.is_admin && <span className="badge badge-accent">Administrador</span>}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className={styles.grid}>

            <div className={`card ${styles.formCard}`}>
              <h2>Datos personales</h2>
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.row}>
                  <div className="form-group">
                    <label className="form-label">Nombre</label>
                    <input type="text" name="nombre" value={form.nombre} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Apellidos</label>
                    <input type="text" name="apellidos" value={form.apellidos} onChange={handleChange} />
                  </div>
                </div>
                <div className={styles.row}>
                  <div className="form-group">
                    <label className="form-label">Teléfono</label>
                    <input type="tel" name="telefono" value={form.telefono} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Fecha de nacimiento</label>
                    <input type="date" name="fecha_nacimiento" value={form.fecha_nacimiento} onChange={handleChange} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Correo electrónico</label>
                  <input type="email" value={usuario?.email ?? ''} disabled />
                </div>
                {success && <p className={styles.successMsg}>{success}</p>}
                {error && <p className="form-error">{error}</p>}
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Guardando...' : 'Guardar cambios'}
                </button>
              </form>
            </div>

            <div className={`card ${styles.infoCard}`}>
              <h2>Información de la cuenta</h2>
              <ul className={styles.infoList}>
                <li>
                  <span className={styles.infoLabel}>Miembro desde</span>
                  <span>{usuario?.fecha_registro?.split('T')[0] ?? '—'}</span>
                </li>
                <li>
                  <span className={styles.infoLabel}>Rol</span>
                  <span>{usuario?.is_admin ? 'Administrador' : 'Paciente'}</span>
                </li>
                <li>
                  <span className={styles.infoLabel}>Email</span>
                  <span>{usuario?.email}</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}
