import { useEffect, useState } from 'react'
import { usuariosApi, psicologosApi, serviciosApi, citasApi } from '../../utils/api'
import styles from './admin.module.css'

const TABS = ['Usuarios', 'Psicólogos', 'Servicios', 'Citas']

const INITIAL_PSICOLOGO = { nombre: '', especialidad: '', email: '', telefono: '', descripcion: '' }
const INITIAL_SERVICIO  = { nombre_servicio: '', descripcion: '', precio: '', duracion_min: '' }

export default function Admin() {
  const [tab, setTab] = useState('Usuarios')
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState({})
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)

  const apis = { Usuarios: usuariosApi, 'Psicólogos': psicologosApi, Servicios: serviciosApi, Citas: citasApi }

  const load = (t = tab) => {
    setLoading(true)
    apis[t].getAll().then(r => setData(r.data)).catch(() => setData([])).finally(() => setLoading(false))
  }

  useEffect(() => { load(tab) }, [tab])

  const openCreate = () => {
    setForm(tab === 'Psicólogos' ? INITIAL_PSICOLOGO : INITIAL_SERVICIO)
    setFormError('')
    setModal('create')
  }

  const openEdit = item => {
    setForm({ ...item })
    setFormError('')
    setModal('edit')
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este registro?')) return
    try { await apis[tab].delete(id); load() } catch { alert('No se pudo eliminar.') }
  }

  const handleSave = async e => {
    e.preventDefault()
    setFormError('')
    setSaving(true)
    try {
      if (modal === 'create') await apis[tab].create(form)
      else await apis[tab].update(form.id ?? form.id_psicologo ?? form.id_servicio, form)
      setModal(null)
      load()
    } catch (err) {
      setFormError(err.response?.data?.message || 'Error al guardar.')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  const idOf = item => item.id ?? item.id_psicologo ?? item.id_servicio ?? item.id_cita

  const renderTable = () => {
    if (loading) return <div className={styles.loading}>Cargando...</div>
    if (!data.length) return <div className={styles.empty}>No hay registros.</div>

    return (
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              {tab === 'Usuarios'   && <><th>Nombre</th><th>Email</th><th>Teléfono</th><th>Fecha registro</th><th>Rol</th><th>Acciones</th></>}
              {tab === 'Psicólogos' && <><th>Nombre del profesional</th><th>Especialidad</th><th>Email</th><th>Teléfono</th><th>Acciones</th></>}
              {tab === 'Servicios'  && <><th>Servicio</th><th>Descripción</th><th>Duración</th><th>Precio</th><th>Acciones</th></>}
              {tab === 'Citas'      && <><th>Paciente</th><th>Psicólogo</th><th>Servicio</th><th>Fecha y hora</th><th>Modalidad</th><th>Estado</th><th>Precio</th><th>Acciones</th></>}
            </tr>
          </thead>
          <tbody>
            {data.map(item => (
              <tr key={idOf(item)}>
                {tab === 'Usuarios' && (<>
                  <td><div className={styles.nameCell}>{item.nombre} {item.apellidos}<span>{item.email}</span></div></td>
                  <td>{item.email}</td>
                  <td>{item.telefono ?? '—'}</td>
                  <td>{item.fecha_registro ?? '—'}</td>
                  <td><span className={`badge ${item.is_admin ? 'badge-warning' : 'badge-accent'}`}>{item.is_admin ? 'Admin' : 'Paciente'}</span></td>
                </>)}
                {tab === 'Psicólogos' && (<>
                  <td><strong>{item.nombre}</strong></td>
                  <td><span className="badge badge-accent">{item.especialidad}</span></td>
                  <td>{item.email}</td>
                  <td>{item.telefono ?? '—'}</td>
                </>)}
                {tab === 'Servicios' && (<>
                  <td><strong>{item.nombre_servicio}</strong></td>
                  <td className={styles.descCell}>{item.descripcion ?? '—'}</td>
                  <td>{item.duracion_min} min</td>
                  <td>{item.precio}€ / sesión</td>
                </>)}
                {tab === 'Citas' && (<>
                  <td><div className={styles.nameCell}>{item.usuario?.nombre ?? '—'}<span>ID #{item.id_cita}</span></div></td>
                  <td>{item.psicologo?.nombre ?? '—'}</td>
                  <td>{item.servicio?.nombre_servicio ?? '—'}</td>
                  <td>{item.fecha} {item.hora}</td>
                  <td>{item.modalidad?.nombre_modalidad ?? '—'}</td>
                  <td><span className={`badge ${
                    item.estado?.nombre_estado === 'Aprobado'   ? 'badge-success' :
                    item.estado?.nombre_estado === 'Finalizado' ? 'badge-primary' : 'badge-error'
                  }`}>{item.estado?.nombre_estado}</span></td>
                  <td>{item.precio_final}€</td>
                </>)}
                <td className={styles.actions}>
                  {tab !== 'Usuarios' && tab !== 'Citas' && (
                    <button className={`btn btn-ghost ${styles.editBtn}`} onClick={() => openEdit(item)}>Editar</button>
                  )}
                  <button className={`btn btn-ghost ${styles.deleteBtn}`} onClick={() => handleDelete(idOf(item))}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  const canCreate = tab === 'Psicólogos' || tab === 'Servicios'

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarBrand}>
          <p className={styles.brandName}>Psicología Vélez</p>
          <p className={styles.brandSub}>Panel de Administración</p>
        </div>
        <nav>
          {TABS.map(t => (
            <button key={t} className={`${styles.navItem} ${tab === t ? styles.navActive : ''}`} onClick={() => setTab(t)}>
              <span className={styles.navIcon}>
                {t === 'Usuarios' ? '👥' : t === 'Psicólogos' ? '🧑‍⚕️' : t === 'Servicios' ? '📋' : '📅'}
              </span>
              {t}
            </button>
          ))}
        </nav>
      </aside>

      <main className={styles.main}>
        <div className={styles.mainHeader}>
          <h1>Gestión de {tab}</h1>
          {canCreate && (
            <button className="btn btn-primary" onClick={openCreate}>+ Añadir {tab === 'Psicólogos' ? 'Psicólogo' : 'Servicio'}</button>
          )}
        </div>
        {renderTable()}
      </main>

      {modal && (
        <div className={styles.overlay} onClick={() => setModal(null)}>
          <div className={styles.modalBox} onClick={e => e.stopPropagation()}>
            <h2>{modal === 'create' ? 'Nuevo' : 'Editar'} {tab === 'Psicólogos' ? 'psicólogo' : 'servicio'}</h2>
            <form onSubmit={handleSave} className={styles.modalForm}>

              {tab === 'Psicólogos' && (<>
                <div className={styles.row2}>
                  <div className="form-group">
                    <label className="form-label">Nombre</label>
                    <input name="nombre" value={form.nombre ?? ''} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Especialidad</label>
                    <input name="especialidad" value={form.especialidad ?? ''} onChange={handleChange} />
                  </div>
                </div>
                <div className={styles.row2}>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input type="email" name="email" value={form.email ?? ''} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Teléfono</label>
                    <input name="telefono" value={form.telefono ?? ''} onChange={handleChange} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Descripción</label>
                  <textarea name="descripcion" value={form.descripcion ?? ''} onChange={handleChange} rows={3} />
                </div>
              </>)}

              {tab === 'Servicios' && (<>
                <div className="form-group">
                  <label className="form-label">Nombre del servicio</label>
                  <input name="nombre_servicio" value={form.nombre_servicio ?? ''} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Descripción</label>
                  <textarea name="descripcion" value={form.descripcion ?? ''} onChange={handleChange} rows={3} />
                </div>
                <div className={styles.row2}>
                  <div className="form-group">
                    <label className="form-label">Precio (€)</label>
                    <input type="number" name="precio" value={form.precio ?? ''} onChange={handleChange} min="0" step="0.01" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Duración (min)</label>
                    <input type="number" name="duracion_min" value={form.duracion_min ?? ''} onChange={handleChange} min="1" />
                  </div>
                </div>
              </>)}

              {formError && <p className="form-error">{formError}</p>}
              <div className={styles.modalActions}>
                <button type="button" className="btn btn-outline" onClick={() => setModal(null)}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
