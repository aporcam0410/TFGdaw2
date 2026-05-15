import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { authApi, usuariosApi } from '../../utils/api'
import styles from './perfil.module.css'

const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

const formatFecha = (dateStr) => {
  if (!dateStr) return '—'
  const d = new Date(dateStr + 'T00:00:00')
  return `${String(d.getDate()).padStart(2,'0')} de ${MESES[d.getMonth()]}, ${d.getFullYear()}`
}

const formatMiembro = (dateStr) => {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T00:00:00')
  return `Miembro desde ${MESES[d.getMonth()]} ${d.getFullYear()}`
}

export default function Perfil() {
  const { usuario, updateUsuario, logout } = useAuth()
  const navigate = useNavigate()

  const [editando, setEditando] = useState(false)
  const [form, setForm] = useState({
    nombre:           usuario?.nombre           ?? '',
    apellidos:        usuario?.apellidos         ?? '',
    telefono:         usuario?.telefono          ?? '',
    fecha_nacimiento: usuario?.fecha_nacimiento  ?? '',
  })
  const [success, setSuccess]   = useState('')
  const [error,   setError]     = useState('')
  const [loading, setLoading]   = useState(false)

  const [cambiarPass, setCambiarPass] = useState(false)
  const [passForm, setPassForm]       = useState({ password: '', password_confirm: '' })
  const [passError, setPassError]     = useState('')
  const [passSaving, setPassSaving]   = useState(false)
  const [copied, setCopied]           = useState(false)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setError(''); setSuccess(''); setLoading(true)
    try {
      const res = await authApi.updateMe(form)
      updateUsuario(res.data)
      setSuccess('Perfil actualizado correctamente.')
      setEditando(false)
    } catch {
      setError('No se pudo actualizar el perfil.')
    } finally {
      setLoading(false)
    }
  }

  const handlePassSave = async () => {
    if (passForm.password !== passForm.password_confirm) { setPassError('Las contraseñas no coinciden.'); return }
    if (passForm.password.length < 6) { setPassError('Mínimo 6 caracteres.'); return }
    setPassError(''); setPassSaving(true)
    try {
      await authApi.updateMe({ password: passForm.password })
      setCambiarPass(false)
      setPassForm({ password: '', password_confirm: '' })
    } catch {
      setPassError('Error al cambiar la contraseña.')
    } finally {
      setPassSaving(false)
    }
  }

  const handleLogout = async () => {
    try { await authApi.logout() } catch {}
    logout()
    navigate('/login')
  }

  const copyEmail = () => {
    navigator.clipboard.writeText(usuario?.email ?? '')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const cancelEdit = () => {
    setForm({ nombre: usuario?.nombre ?? '', apellidos: usuario?.apellidos ?? '', telefono: usuario?.telefono ?? '', fecha_nacimiento: usuario?.fecha_nacimiento ?? '' })
    setError(''); setSuccess(''); setEditando(false)
  }

  return (
    <div className={styles.page}>

      {/* HERO CARD */}
      <div className="container">
        <div className={`card ${styles.heroCard}`}>
          <h1 className={styles.heroNombre}>{usuario?.nombre} {usuario?.apellidos}</h1>
          <p className={styles.heroSub}>{formatMiembro(usuario?.fecha_registro)}</p>
          <div className={styles.heroBtns}>
            <button className={`btn btn-primary ${styles.btnEdit}`} onClick={() => { setEditando(e => !e); setSuccess(''); setError('') }}>
              ✏️ {editando ? 'Cancelar edición' : 'Editar Perfil'}
            </button>
            <button className={`btn ${styles.btnLogout}`} onClick={handleLogout}>
              ↗ Cerrar Sesión
            </button>
          </div>
          {success && <p className={styles.successMsg}>{success}</p>}
        </div>
      </div>

      {/* GRID */}
      <div className="container">
        <div className={styles.grid}>

          {/* IZQUIERDA — INFORMACIÓN PERSONAL */}
          <div className={`card ${styles.infoCard}`}>
            <h2 className={styles.cardTitle}><span>📄</span> Información Personal</h2>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className="form-group">
                <label className="form-label">Nombre</label>
                {editando
                  ? <input name="nombre" value={form.nombre} onChange={handleChange} required />
                  : <div className={styles.field}>{usuario?.nombre} {usuario?.apellidos}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Rol de Usuario</label>
                <div className={styles.field}>{usuario?.is_admin ? 'Administrador' : 'Paciente'}</div>
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <div className={styles.fieldRow}>
                  <div className={`${styles.field} ${styles.fieldFlex}`}>{usuario?.email}</div>
                  <button type="button" className={styles.copyBtn} onClick={copyEmail} title="Copiar email">
                    {copied ? '✓' : '⧉'}
                  </button>
                </div>
              </div>

              <div className={styles.row}>
                <div className="form-group">
                  <label className="form-label">Teléfono</label>
                  {editando
                    ? <input name="telefono" value={form.telefono} onChange={handleChange} />
                    : <div className={styles.field}>{usuario?.telefono || '—'}</div>}
                </div>
                <div className="form-group">
                  <label className="form-label">Fecha de Nacimiento</label>
                  {editando
                    ? <input type="date" name="fecha_nacimiento" value={form.fecha_nacimiento} onChange={handleChange} />
                    : <div className={styles.field}>{formatFecha(usuario?.fecha_nacimiento)}</div>}
                </div>
              </div>

              {editando && (
                <div className={styles.editActions}>
                  {error && <p className="form-error">{error}</p>}
                  <div style={{display:'flex', gap:'10px'}}>
                    <button type="button" className="btn btn-outline" onClick={cancelEdit}>Cancelar</button>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? 'Guardando...' : 'Guardar cambios'}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* DERECHA — CUENTA */}
          <div className={`card ${styles.cuentaCard}`}>
            <h2 className={styles.cardTitle}><span>🔒</span> Cuenta</h2>

            <div className="form-group">
              <label className="form-label">Contraseña</label>
              {cambiarPass ? (
                <div className={styles.passForm}>
                  <input type="password" placeholder="Nueva contraseña" value={passForm.password}
                    onChange={e => setPassForm(f => ({ ...f, password: e.target.value }))} />
                  <input type="password" placeholder="Repetir contraseña" value={passForm.password_confirm}
                    onChange={e => setPassForm(f => ({ ...f, password_confirm: e.target.value }))} />
                  {passError && <p className="form-error">{passError}</p>}
                  <div style={{display:'flex', gap:'8px'}}>
                    <button type="button" className="btn btn-outline" style={{flex:1}} onClick={() => { setCambiarPass(false); setPassError('') }}>Cancelar</button>
                    <button type="button" className="btn btn-primary" style={{flex:1}} onClick={handlePassSave} disabled={passSaving}>
                      {passSaving ? 'Guardando...' : 'Guardar'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className={styles.fieldRow}>
                  <div className={`${styles.field} ${styles.fieldFlex}`}>••••••••</div>
                  <button type="button" className={styles.changeBtn} onClick={() => setCambiarPass(true)}>Cambiar</button>
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Fecha de Registro</label>
              <div className={styles.field}>
                <span className={styles.fieldIcon}>📅</span>
                {formatFecha(usuario?.fecha_registro)}
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  )
}
