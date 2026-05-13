import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { citasApi, serviciosApi, modalidadesApi, psicologosApi } from '../../utils/api'
import styles from './citas.module.css'

const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

const ESTADO_COLOR = {
  'Confirmada': 'badge-success',
  'Finalizada': 'badge-primary',
}

const ESTADO_LABEL = {
  'Confirmada': 'Confirmada',
  'Finalizada': 'Finalizada',
}

const MODALIDAD_ICONS = { 'Presencial': '👤', 'Online': '🖥️', 'Hibrida': '📞', 'Telefónica': '📞' }

const FILTRO_ITEMS = [
  { key: 'servicio',  label: 'Servicio',   icon: '🗂️' },
  { key: 'modalidad', label: 'Modalidad',  icon: '⊞' },
  { key: 'psicologo', label: 'Psicólogo',  icon: '👤' },
  { key: 'fecha',     label: 'Fecha',      icon: '📅' },
  { key: 'estado',    label: 'Estado',     icon: '✅' },
]

export default function Citas() {
  const location = useLocation()
  const [successMsg, setSuccessMsg] = useState(location.state?.success ?? '')
  const [citas,       setCitas]       = useState([])
  const [servicios,   setServicios]   = useState([])
  const [modalidades, setModalidades] = useState([])
  const [psicologos,  setPsicologos]  = useState([])
  const [filtroActivo, setFiltroActivo] = useState('estado')

  const [fServicio,  setFServicio]  = useState('')
  const [fModalidad, setFModalidad] = useState('')
  const [fPsicologo, setFPsicologo] = useState('')
  const [fFecha,     setFFecha]     = useState('')
  const [fEstado,    setFEstado]    = useState('')

  const [modalConfirm, setModalConfirm] = useState(null)
  const [modalAviso,   setModalAviso]   = useState(false)
  const [page,         setPage]         = useState(1)

  const PAGE_SIZE = 5

  useEffect(() => {
    citasApi.getAll().then(r => setCitas(r.data)).catch(() => {})
    serviciosApi.getAll().then(r => setServicios(r.data)).catch(() => {})
    modalidadesApi.getAll().then(r => setModalidades(r.data)).catch(() => {})
    psicologosApi.getAll().then(r => setPsicologos(r.data)).catch(() => {})
  }, [])

  const loadCitas = () => citasApi.getAll().then(r => setCitas(r.data)).catch(() => {})

  const citasFiltradas = citas.filter(c => {
    if (fServicio  && String(c.servicio?.id_servicio)  !== fServicio)  return false
    if (fModalidad && String(c.modalidad?.id_modalidad) !== fModalidad) return false
    if (fPsicologo && String(c.psicologo?.id_psicologo) !== fPsicologo) return false
    if (fFecha     && c.fecha !== fFecha)                               return false
    if (fEstado    && c.estado?.nombre_estado !== fEstado)              return false
    return true
  })

  const handleAnularClick = (cita) => {
    if (!cita.puede_anularse) { setModalAviso(true); return }
    setModalConfirm(cita)
  }

  const handleAnularConfirm = async () => {
    try { await citasApi.delete(modalConfirm.id_cita); loadCitas() }
    catch (err) { alert(err.response?.data?.message || 'No se puede anular.') }
    finally { setModalConfirm(null) }
  }

  const limpiarFiltros = () => {
    setFServicio(''); setFModalidad(''); setFPsicologo(''); setFFecha(''); setFEstado('')
    setPage(1)
  }

  const hayFiltros = fServicio || fModalidad || fPsicologo || fFecha || fEstado

  const totalPages   = Math.ceil(citasFiltradas.length / PAGE_SIZE)
  const citasPagina  = citasFiltradas.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleFiltro = (setter) => (e) => { setter(e.target.value); setPage(1) }

  return (
    <div className={styles.page}>

      {/* LAYOUT */}
      <div className="container">
        <div className={styles.layout}>

          {/* SIDEBAR FILTROS */}
          <aside className={styles.sidebar}>
            <div className={`card ${styles.filtrosCard}`}>
              <div className={styles.filtrosHeader}>
                <h3>Filtros de Búsqueda</h3>
                <p>Personaliza tu consulta</p>
              </div>
              <nav className={styles.filtrosNav}>
                {FILTRO_ITEMS.map(f => (
                  <button key={f.key}
                    className={`${styles.filtroItem} ${filtroActivo === f.key ? styles.filtroItemActive : ''}`}
                    onClick={() => setFiltroActivo(f.key)}>
                    <span className={styles.filtroIcon}>{f.icon}</span>
                    <span>{f.label}</span>
                  </button>
                ))}
              </nav>

              {/* Panel del filtro activo */}
              <div className={styles.filtroPanel}>
                {filtroActivo === 'servicio' && (
                  <select value={fServicio} onChange={handleFiltro(setFServicio)}>
                    <option value="">Todos los servicios</option>
                    {servicios.map(s => <option key={s.id_servicio} value={s.id_servicio}>{s.nombre_servicio}</option>)}
                  </select>
                )}
                {filtroActivo === 'modalidad' && (
                  <select value={fModalidad} onChange={handleFiltro(setFModalidad)}>
                    <option value="">Todas las modalidades</option>
                    {modalidades.map(m => <option key={m.id_modalidad} value={m.id_modalidad}>{m.nombre_modalidad}</option>)}
                  </select>
                )}
                {filtroActivo === 'psicologo' && (
                  <select value={fPsicologo} onChange={handleFiltro(setFPsicologo)}>
                    <option value="">Todos los psicólogos</option>
                    {psicologos.map(p => <option key={p.id_psicologo} value={p.id_psicologo}>{p.nombre}</option>)}
                  </select>
                )}
                {filtroActivo === 'fecha' && (
                  <input type="date" value={fFecha} onChange={handleFiltro(setFFecha)} />
                )}
                {filtroActivo === 'estado' && (
                  <select value={fEstado} onChange={handleFiltro(setFEstado)}>
                    <option value="">Todos los estados</option>
                    <option value="Confirmada">Confirmada</option>
                    <option value="Finalizada">Finalizada</option>
                  </select>
                )}
                {hayFiltros && (
                  <button className={styles.limpiarBtn} onClick={limpiarFiltros}>✕ Limpiar filtros</button>
                )}
              </div>
            </div>
          </aside>

          {/* CONTENIDO */}
          <main className={styles.main}>
            <div className={styles.mainHeader}>
              <div>
                <h1>Mis Citas</h1>
                <p>Gestiona tus próximas sesiones de bienestar.</p>
              </div>
              <Link to="/citas/nueva" className="btn btn-primary">
                📅 Agendar Cita
              </Link>
            </div>

            {successMsg && (
              <div className={styles.successBanner}>
                ✅ {successMsg}
                <button onClick={() => setSuccessMsg('')}>✕</button>
              </div>
            )}

            {citasFiltradas.length === 0 ? (
              <div className={`card ${styles.empty}`}>
                <span>🗓️</span>
                <p>{hayFiltros ? 'No hay citas que coincidan con los filtros.' : 'Aún no tienes citas reservadas.'}</p>
                {!hayFiltros && <Link to="/citas/nueva" className="btn btn-primary">Reservar mi primera cita</Link>}
              </div>
            ) : (
              <>
              <div className={styles.citasList}>
                {citasPagina.map(c => {
                  const partes = c.fecha?.split('-') ?? []
                  const dia  = partes[2]
                  const mes  = MESES[parseInt(partes[1]) - 1]
                  const anio = partes[0]
                  const horaFin = c.servicio?.duracion_min
                    ? (() => { const [h,m] = c.hora.split(':'); const d = new Date(0,0,0,+h,+m+c.servicio.duracion_min); return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}` })()
                    : null

                  return (
                    <div key={c.id_cita} className={`card ${styles.citaCard}`}>
                      <div className={styles.citaDateBlock}>
                        <span className={styles.citaCalIcon}>📅</span>
                        <div>
                          <p className={styles.citaFechaText}>{dia} de {mes}, {anio}</p>
                          <p className={styles.citaHoraText}>
                            {c.hora?.slice(0,5)} AM{horaFin ? ` - ${horaFin} AM` : ''}
                          </p>
                        </div>
                      </div>

                      <div className={styles.citaCols}>
                        <div className={styles.citaCol}>
                          <span className={styles.colLabel}>PSICÓLOGO</span>
                          <span className={styles.colVal}>{c.psicologo?.nombre ?? '—'}</span>
                        </div>
                        <div className={styles.citaCol}>
                          <span className={styles.colLabel}>SERVICIO</span>
                          <span className={styles.colVal}>{c.servicio?.nombre_servicio ?? '—'}</span>
                        </div>
                        <div className={styles.citaCol}>
                          <span className={styles.colLabel}>MODALIDAD</span>
                          <span className={styles.colVal}>
                            {MODALIDAD_ICONS[c.modalidad?.nombre_modalidad] ?? '📍'} {c.modalidad?.nombre_modalidad ?? '—'}
                          </span>
                        </div>
                      </div>

                      <div className={styles.citaRight}>
                        <span className={`badge ${ESTADO_COLOR[c.estado?.nombre_estado] ?? 'badge-primary'}`}>
                          {ESTADO_LABEL[c.estado?.nombre_estado] ?? c.estado?.nombre_estado}
                        </span>
                        {c.estado?.nombre_estado === 'Confirmada' && (
                          <button className={styles.anularIconBtn} onClick={() => handleAnularClick(c)} title="Anular cita">✕</button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              {totalPages > 1 && (
                <div className={styles.pagination}>
                  <span className={styles.pageInfo}>
                    {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, citasFiltradas.length)} de {citasFiltradas.length} citas
                  </span>
                  <div className={styles.pageNums}>
                    <button className={styles.pageBtn} disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹</button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                      <button key={n} className={`${styles.pageNum} ${n === page ? styles.pageNumActive : ''}`} onClick={() => setPage(n)}>{n}</button>
                    ))}
                    <button className={styles.pageBtn} disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>›</button>
                  </div>
                </div>
              )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* MODAL CONFIRMACIÓN ANULAR */}
      {modalConfirm && (
        <div className={styles.overlay} onClick={() => setModalConfirm(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalIcon}>🗓️</div>
            <h3 className={styles.modalTitle}>¿Anular esta cita?</h3>
            <p className={styles.modalDesc}>
              <strong>{modalConfirm.servicio?.nombre_servicio}</strong><br />
              {modalConfirm.fecha?.split('-')[2]} de {MESES[parseInt(modalConfirm.fecha?.split('-')[1])-1]} a las {modalConfirm.hora?.slice(0,5)}
            </p>
            <p className={styles.modalWarn}>Esta acción no se puede deshacer.</p>
            <div className={styles.modalActions}>
              <button className="btn btn-ghost" onClick={() => setModalConfirm(null)}>Cancelar</button>
              <button className={`btn ${styles.btnDanger}`} onClick={handleAnularConfirm}>Sí, anular cita</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL AVISO NO CANCELABLE */}
      {modalAviso && (
        <div className={styles.overlay} onClick={() => setModalAviso(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalIconWarn}>⏰</div>
            <h3 className={styles.modalTitle}>No puedes anular esta cita</h3>
            <p className={styles.modalDesc}>
              Solo se pueden anular citas con más de <strong>24 horas</strong> de antelación.
            </p>
            <p className={styles.modalDesc} style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
              Si necesitas cancelar, contacta con nosotros directamente.
            </p>
            <div className={styles.modalActions}>
              <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => setModalAviso(false)}>Entendido</button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
