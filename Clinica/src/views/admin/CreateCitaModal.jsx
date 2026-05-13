import { useEffect, useState } from 'react'
import { citasApi, serviciosApi, modalidadesApi, disponibilidadApi, estadosCitaApi, usuariosApi } from '../../utils/api'
import ncStyles from '../citas/nuevaCita.module.css'
import styles from './admin.module.css'

const DIAS = ['L', 'M', 'X', 'J', 'V', 'S', 'D']
const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
const MODALIDAD_ICONS = { 'Presencial': '👤', 'Online': '🖥️', 'Hibrida': '📞', 'Telefónica': '📞' }

function buildCalendar(year, month) {
  const first = new Date(year, month, 1)
  const last  = new Date(year, month + 1, 0)
  const startDow = (first.getDay() + 6) % 7
  const days = []
  for (let i = 0; i < startDow; i++) days.push(null)
  for (let d = 1; d <= last.getDate(); d++) days.push(d)
  return days
}

export default function CreateCitaModal({ onClose, onSaved }) {
  const today = new Date(); today.setHours(0, 0, 0, 0)

  const [year,  setYear]  = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [dia,   setDia]   = useState(null)
  const [hora,  setHora]  = useState(null)

  const [usuarios,     setUsuarios]     = useState([])
  const [servicios,    setServicios]    = useState([])
  const [modalidades,  setModalidades]  = useState([])
  const [estados,      setEstados]      = useState([])
  const [slots,        setSlots]        = useState([])
  const [loadingSlots, setLoadingSlots] = useState(false)

  const [idUsuario,     setIdUsuario]    = useState('')
  const [idServicio,    setIdServicio]   = useState('')
  const [idModalidad,   setIdModalidad]  = useState('')
  const [idEstado,      setIdEstado]     = useState('')
  const [psicAsignado,  setPsic]         = useState(null)
  const [observaciones, setObs]          = useState('')
  const [precioFinal,   setPrecio]       = useState('')

  const [error,  setError]  = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    usuariosApi.getAll().then(r => setUsuarios(r.data.filter(u => !u.is_admin))).catch(() => {})
    serviciosApi.getAll().then(r => setServicios(r.data)).catch(() => {})
    modalidadesApi.getAll().then(r => setModalidades(r.data)).catch(() => {})
    estadosCitaApi.getAll().then(r => setEstados(r.data)).catch(() => {})
  }, [])

  useEffect(() => {
    if (!dia || !idServicio) { setSlots([]); setPsic(null); setHora(null); return }
    const f = `${year}-${String(month + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`
    setLoadingSlots(true)
    setHora(null); setPsic(null)
    disponibilidadApi.getSlots(f, idServicio)
      .then(r => setSlots(r.data))
      .catch(() => setSlots([]))
      .finally(() => setLoadingSlots(false))
  }, [dia, idServicio, year, month])

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1) } else setMonth(m => m - 1); setDia(null); setHora(null) }
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1) } else setMonth(m => m + 1); setDia(null); setHora(null) }

  const isPast = d => {
    if (!d) return true
    const s = new Date(year, month, d); s.setHours(0, 0, 0, 0)
    return s <= today
  }

  const handleGuardar = async () => {
    if (!idUsuario)   { setError('Selecciona un paciente.'); return }
    if (!idServicio)  { setError('Selecciona un servicio.'); return }
    if (!idModalidad) { setError('Selecciona una modalidad.'); return }
    if (!dia || !hora){ setError('Selecciona fecha y hora.'); return }
    setError(''); setSaving(true)
    try {
      await citasApi.create({
        id_usuario:    Number(idUsuario),
        id_servicio:   Number(idServicio),
        id_modalidad:  Number(idModalidad),
        fecha:         `${year}-${String(month + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`,
        hora,
        observaciones: observaciones || null,
        precio_final:  precioFinal !== '' ? Number(precioFinal) : undefined,
        id_estado:     idEstado ? Number(idEstado) : undefined,
      })
      onSaved()
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear la cita.')
    } finally {
      setSaving(false)
    }
  }

  const servicioSel  = servicios.find(s => String(s.id_servicio)  === String(idServicio))
  const modalidadSel = modalidades.find(m => String(m.id_modalidad) === String(idModalidad))
  const dias = buildCalendar(year, month)

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.editBox} onClick={e => e.stopPropagation()}>

        <div className={styles.editHeader}>
          <h2>Nueva Cita</h2>
          <button className={styles.editClose} onClick={onClose}>✕</button>
        </div>

        <div className={ncStyles.reservaGrid}>

          {/* IZQUIERDA: CALENDARIO */}
          <div className={ncStyles.calPanel}>
            <h3 className={ncStyles.panelTitle}>📅 Selecciona una Fecha</h3>

            <div className={ncStyles.calNav}>
              <button className={ncStyles.calArrow} onClick={prevMonth}>‹</button>
              <span className={ncStyles.calMonth}>{MESES[month]} {year}</span>
              <button className={ncStyles.calArrow} onClick={nextMonth}>›</button>
            </div>

            <div className={ncStyles.calGrid}>
              {DIAS.map(d => <span key={d} className={ncStyles.calDow}>{d}</span>)}
              {dias.map((d, i) => (
                <button key={i} disabled={!d || isPast(d)}
                  className={[
                    ncStyles.calDay,
                    !d        ? ncStyles.calEmpty    : '',
                    isPast(d) && d ? ncStyles.calPast : '',
                    dia === d ? ncStyles.calSelected : '',
                  ].join(' ')}
                  onClick={() => { if (d && !isPast(d)) { setDia(d); setHora(null) } }}>
                  {d}
                </button>
              ))}
            </div>

            {dia && (
              <div className={ncStyles.slotsSection}>
                <p className={ncStyles.slotsTitle}>⏱ Horas disponibles</p>
                {!idServicio ? (
                  <p className={ncStyles.slotsEmpty}>Selecciona primero un servicio</p>
                ) : loadingSlots ? (
                  <p className={ncStyles.slotsEmpty}>Cargando...</p>
                ) : slots.length === 0 ? (
                  <p className={ncStyles.slotsEmpty}>No hay horas disponibles para este día</p>
                ) : (
                  <div className={ncStyles.slotsGrid}>
                    {slots.map(s => (
                      <button key={s.hora}
                        className={`${ncStyles.slotBtn} ${hora === s.hora?.slice(0, 5) ? ncStyles.slotBtnActive : ''}`}
                        onClick={() => { setHora(s.hora?.slice(0, 5)); setPsic({ nombre: s.nombre_psicologo, especialidad: s.especialidad, id_psicologo: s.id_psicologo }) }}>
                        {s.hora?.slice(0, 5)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* DERECHA: DETALLES */}
          <div className={ncStyles.detPanel}>
            <h3 className={ncStyles.panelTitle}>✏️ Detalles</h3>
            <div className={ncStyles.detBody}>

              <div className="form-group">
                <label className="form-label">Paciente</label>
                <select value={idUsuario} onChange={e => setIdUsuario(e.target.value)}>
                  <option value="">Selecciona un paciente</option>
                  {usuarios.map(u => (
                    <option key={u.id} value={u.id}>{u.nombre} {u.apellidos} — {u.email}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Estado inicial</label>
                <select value={idEstado} onChange={e => setIdEstado(e.target.value)}>
                  <option value="">Por defecto (Confirmada)</option>
                  {estados.map(e => (
                    <option key={e.id_estado} value={e.id_estado}>{e.nombre_estado}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Servicio</label>
                <select value={idServicio} onChange={e => { setIdServicio(e.target.value); setDia(null); setHora(null) }}>
                  <option value="">Selecciona un servicio</option>
                  {servicios.map(s => (
                    <option key={s.id_servicio} value={s.id_servicio}>{s.nombre_servicio}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Modalidad</label>
                <div className={ncStyles.modalBtns}>
                  {modalidades.map(m => (
                    <button key={m.id_modalidad} type="button"
                      className={`${ncStyles.modalBtn} ${idModalidad === String(m.id_modalidad) ? ncStyles.modalBtnActive : ''}`}
                      onClick={() => setIdModalidad(String(m.id_modalidad))}>
                      <span className={ncStyles.modalBtnIcon}>{MODALIDAD_ICONS[m.nombre_modalidad] ?? '📍'}</span>
                      <span>{m.nombre_modalidad}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Psicólogo asignado</label>
                <div className={ncStyles.psicBox}>
                  {psicAsignado ? (
                    <>
                      <div className={ncStyles.psicAvatar}>{psicAsignado.nombre?.charAt(0)}</div>
                      <div className={ncStyles.psicInfo}>
                        <p className={ncStyles.psicNombre}>{psicAsignado.nombre}</p>
                        <p className={ncStyles.psicEsp}>{psicAsignado.especialidad}</p>
                      </div>
                      <span className={ncStyles.psicCheck}>✓</span>
                    </>
                  ) : (
                    <p className={ncStyles.psicEmpty}>Se asignará al elegir fecha y hora</p>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Precio final (€)</label>
                <input type="number" value={precioFinal} onChange={e => setPrecio(e.target.value)} min="0"
                  placeholder={servicioSel ? `${servicioSel.precio}€ (del servicio)` : ''} />
              </div>

              <div className="form-group">
                <label className="form-label">Observaciones</label>
                <textarea value={observaciones} onChange={e => setObs(e.target.value)} rows={3}
                  placeholder="Notas sobre la sesión..." />
              </div>

              {idServicio && idModalidad && dia && hora && (
                <div className={ncStyles.resumen}>
                  <span>ℹ️</span>
                  <p>
                    <strong>Resumen:</strong><br />
                    {servicioSel?.nombre_servicio} {modalidadSel?.nombre_modalidad?.toLowerCase()}
                    {psicAsignado ? ` con ${psicAsignado.nombre}` : ''}.{' '}
                    {MESES[month]} {dia} a las {hora}.
                    {servicioSel ? ` · ${precioFinal || servicioSel.precio}€` : ''}
                  </p>
                </div>
              )}

              {error && <p className="form-error">{error}</p>}

              <div className={styles.modalActions} style={{ marginTop: 0 }}>
                <button type="button" className="btn btn-outline" onClick={onClose}>Cancelar</button>
                <button type="button" className="btn btn-primary" onClick={handleGuardar} disabled={saving}>
                  {saving ? 'Creando...' : 'Crear cita'}
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
