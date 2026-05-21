import { useEffect, useState } from 'react'
import { usuariosApi, psicologosApi, serviciosApi, citasApi, estadosCitaApi, modalidadesApi } from '../../utils/api'
import EditCitaModal from './EditCitaModal'
import CreateCitaModal from './CreateCitaModal'
import styles from './admin.module.css'

const TABS = ['Usuarios', 'Psicólogos', 'Servicios', 'Citas']

const INITIAL_PSICOLOGO = { nombre: '', especialidad: '', email: '', telefono: '', descripcion: '', servicios_ids: [] }
const INITIAL_SERVICIO  = { nombre_servicio: '', descripcion: '', precio: '', duracion_min: '' }
const INITIAL_USUARIO   = { nombre: '', apellidos: '', email: '', telefono: '', fecha_nacimiento: '', id_rol: 2 }

export default function Admin() {
  const [tab, setTab] = useState('Usuarios')
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState({})
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)
  const [editCita,   setEditCita]   = useState(null)
  const [createCita, setCreateCita] = useState(false)
  const [estadosCita,    setEstadosCita]    = useState([])
  const [todosServicios, setTodosServicios] = useState([])
  const [fotoFile,       setFotoFile]       = useState(null)

  useEffect(() => {
    estadosCitaApi.getAll().then(r => setEstadosCita(r.data)).catch(() => {})
    serviciosApi.getAll().then(r => setTodosServicios(r.data)).catch(() => {})
  }, [])

  const apis = { Usuarios: usuariosApi, 'Psicólogos': psicologosApi, Servicios: serviciosApi, Citas: citasApi }

  const load = (t = tab) => {
    setLoading(true)
    apis[t].getAll().then(r => setData(r.data)).catch(() => setData([])).finally(() => setLoading(false))
  }

  useEffect(() => { load(tab) }, [tab])

  const openCreate = () => {
    setForm(tab === 'Psicólogos' ? INITIAL_PSICOLOGO : tab === 'Usuarios' ? INITIAL_USUARIO : INITIAL_SERVICIO)
    setFormError('')
    setFotoFile(null)
    setModal('create')
  }

  const openEdit = item => {
    if (tab === 'Citas') {
      setEditCita(item)
      return
    }
    let f = { ...item, password: '' }
    if (tab === 'Psicólogos') {
      f.servicios_ids = (item.servicios ?? []).map(s => s.id_servicio)
    }
    setForm(f)
    setFormError('')
    setFotoFile(null)
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
      const id = form.id ?? form.id_psicologo ?? form.id_servicio
      let payload = form
      if (tab === 'Usuarios') {
        payload = { name: form.nombre, apellidos: form.apellidos, email: form.email, telefono: form.telefono || null, fecha_nacimiento: form.fecha_nacimiento || null, id_rol: Number(form.id_rol) }
        if (form.password) payload.password = form.password
      } else if (tab === 'Psicólogos') {
        payload = { ...form }
        if (fotoFile) payload.fotoFile = fotoFile
      }
      if (modal === 'create') await apis[tab].create(payload)
      else await apis[tab].update(id, payload)
      setModal(null)
      load()
    } catch (err) {
      const errors = err.response?.data?.errors
      if (errors) {
        setFormError(Object.values(errors).flat().join(' '))
      } else {
        setFormError(err.response?.data?.message || 'Error al guardar.')
      }
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
              {tab === 'Usuarios'   && <><th>Nombre</th><th>Email</th><th>Teléfono</th><th>F. nacimiento</th><th>Fecha registro</th><th>Rol</th><th>Acciones</th></>}
              {tab === 'Psicólogos' && <><th>Nombre del profesional</th><th>Especialidad</th><th>Servicios</th><th>Email</th><th>Acciones</th></>}
              {tab === 'Servicios'  && <><th>Servicio</th><th>Descripción</th><th>Duración</th><th>Precio</th><th>Acciones</th></>}
              {tab === 'Citas'      && <><th>Paciente</th><th>Psicólogo</th><th>Servicio</th><th>Fecha y hora</th><th>Modalidad</th><th>Estado</th><th>Precio</th><th>Acciones</th></>}
            </tr>
          </thead>
          <tbody>
            {data.map(item => (
              <tr key={idOf(item)}>
                {tab === 'Usuarios' && (<>
                  <td data-label="Nombre"><div className={styles.nameCell}>{item.nombre} {item.apellidos}<span>{item.email}</span></div></td>
                  <td data-label="Email">{item.email}</td>
                  <td data-label="Teléfono">{item.telefono ?? '—'}</td>
                  <td data-label="F. nacimiento">{item.fecha_nacimiento ?? '—'}</td>
                  <td data-label="Registro">{item.fecha_registro ?? '—'}</td>
                  <td data-label="Rol"><span className={`badge ${item.is_admin ? 'badge-warning' : 'badge-accent'}`}>{item.is_admin ? 'Admin' : 'Paciente'}</span></td>
                </>)}
                {tab === 'Psicólogos' && (<>
                  <td data-label="Nombre"><strong>{item.nombre}</strong></td>
                  <td data-label="Especialidad">{item.especialidad ? <span className="badge badge-accent">{item.especialidad}</span> : '—'}</td>
                  <td data-label="Servicios">
                    {item.servicios?.length > 0
                      ? <div style={{display:'flex',flexWrap:'wrap',gap:'4px'}}>{item.servicios.map(s => <span key={s.id_servicio} className="badge badge-primary">{s.nombre_servicio}</span>)}</div>
                      : '—'}
                  </td>
                  <td data-label="Email">{item.email}</td>
                </>)}
                {tab === 'Servicios' && (<>
                  <td data-label="Servicio"><strong>{item.nombre_servicio}</strong></td>
                  <td data-label="Descripción" className={styles.descCell}>{item.descripcion ?? '—'}</td>
                  <td data-label="Duración">{item.duracion_min} min</td>
                  <td data-label="Precio">{item.precio}€ / sesión</td>
                </>)}
                {tab === 'Citas' && (<>
                  <td data-label="Paciente"><div className={styles.nameCell}>{item.usuario?.nombre ?? '—'}<span>ID #{item.id_cita}</span></div></td>
                  <td data-label="Psicólogo">{item.psicologo?.nombre ?? '—'}</td>
                  <td data-label="Servicio">{item.servicio?.nombre_servicio ?? '—'}</td>
                  <td data-label="Fecha">{item.fecha} {item.hora}</td>
                  <td data-label="Modalidad">{item.modalidad?.nombre_modalidad ?? '—'}</td>
                  <td data-label="Estado"><span className={`badge ${
                    item.estado?.nombre_estado === 'Confirmada' ? 'badge-success' : 'badge-primary'
                  }`}>{item.estado?.nombre_estado}</span></td>
                  <td data-label="Precio">{item.precio_final}€</td>
                </>)}
                <td data-label="Acciones" className={styles.actions}>
                  <button className={`btn btn-ghost ${styles.editBtn}`} onClick={() => openEdit(item)}>Editar</button>
                  <button className={`btn btn-ghost ${styles.deleteBtn}`} onClick={() => handleDelete(idOf(item))}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  const canCreate = tab !== 'Citas' || tab === 'Citas'

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
            <button className="btn btn-primary" onClick={tab === 'Citas' ? () => setCreateCita(true) : openCreate}>
              + Añadir {tab === 'Psicólogos' ? 'Psicólogo' : tab === 'Usuarios' ? 'Usuario' : tab === 'Citas' ? 'Cita' : 'Servicio'}
            </button>
          )}
        </div>
        {renderTable()}
      </main>

      {modal && (
        <div className={styles.overlay} onClick={() => { setModal(null); setFotoFile(null) }}>
          <div className={styles.modalBox} onClick={e => e.stopPropagation()}>
            <h2>{modal === 'create' ? 'Nuevo' : 'Editar'} {tab === 'Psicólogos' ? 'psicólogo' : tab === 'Servicios' ? 'servicio' : 'usuario'}</h2>
            <form onSubmit={handleSave} className={styles.modalForm}>

              {tab === 'Usuarios' && (<>
                <div className={styles.row2}>
                  <div className="form-group">
                    <label className="form-label">Nombre</label>
                    <input name="nombre" value={form.nombre ?? ''} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Apellidos</label>
                    <input name="apellidos" value={form.apellidos ?? ''} onChange={handleChange} required />
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
                <div className={styles.row2}>
                  <div className="form-group">
                    <label className="form-label">Fecha de nacimiento</label>
                    <input type="date" name="fecha_nacimiento" value={form.fecha_nacimiento ?? ''} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Rol</label>
                    <select name="id_rol" value={form.id_rol ?? 2} onChange={handleChange}>
                      <option value={2}>Paciente</option>
                      <option value={1}>Administrador</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">{modal === 'create' ? 'Contraseña' : 'Nueva contraseña (opcional)'}</label>
                  <input type="password" name="password" value={form.password ?? ''} onChange={handleChange}
                    {...(modal === 'create' ? { required: true } : {})}
                    minLength={6} placeholder="Mínimo 6 caracteres" />
                </div>
              </>)}


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
                <div className="form-group">
                  <label className="form-label">Servicios asignados</label>
                  <select
                    value=""
                    onChange={e => {
                      const id = Number(e.target.value)
                      if (id && !(form.servicios_ids ?? []).includes(id))
                        setForm(f => ({ ...f, servicios_ids: [...(f.servicios_ids ?? []), id] }))
                    }}
                  >
                    <option value="">Añadir servicio...</option>
                    {todosServicios
                      .filter(s => !(form.servicios_ids ?? []).includes(s.id_servicio))
                      .map(s => (
                        <option key={s.id_servicio} value={s.id_servicio}>{s.nombre_servicio}</option>
                      ))}
                  </select>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                    {(form.servicios_ids ?? []).map(id => {
                      const s = todosServicios.find(sv => sv.id_servicio === id)
                      return s ? (
                        <span key={id} className="badge badge-primary" style={{ cursor: 'pointer' }}
                          onClick={() => setForm(f => ({ ...f, servicios_ids: (f.servicios_ids ?? []).filter(i => i !== id) }))}>
                          {s.nombre_servicio} ✕
                        </span>
                      ) : null
                    })}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Foto</label>
                  {(fotoFile || form.foto) && (
                    <img
                      src={fotoFile ? URL.createObjectURL(fotoFile) : form.foto}
                      alt=""
                      className={styles.fotoPreview}
                    />
                  )}
                  <input type="file" accept=".png,.webp,image/png,image/webp" onChange={e => setFotoFile(e.target.files[0] ?? null)} />
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
                <button type="button" className="btn btn-outline" onClick={() => { setModal(null); setFotoFile(null) }}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editCita && (
        <EditCitaModal
          cita={editCita}
          onClose={() => setEditCita(null)}
          onSaved={() => { setEditCita(null); load() }}
        />
      )}

      {createCita && (
        <CreateCitaModal
          onClose={() => setCreateCita(false)}
          onSaved={() => { setCreateCita(false); load() }}
        />
      )}
    </div>
  )
}
