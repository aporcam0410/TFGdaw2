import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { citasApi, serviciosApi, modalidadesApi, disponibilidadApi } from '../../utils/api'
import styles from './nuevaCita.module.css'

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

export default function NuevaCita() {
  const navigate = useNavigate()
  const today = new Date()
  const [year,  setYear]  = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [diaSeleccionado, setDia]  = useState(null)
  const [horaSeleccionada, setHora] = useState(null)

  const [servicios,   setServicios]   = useState([])
  const [modalidades, setModalidades] = useState([])
  const [slots,       setSlots]       = useState([])
  const [loadingSlots, setLoadingSlots] = useState(false)

  const [idServicio,   setIdServicio]  = useState('')
  const [idModalidad,  setIdModalidad] = useState('')
  const [psicAsignado, setPsicAsignado] = useState(null)
  const [observaciones, setObs]        = useState('')

  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    serviciosApi.getAll().then(r => setServicios(r.data)).catch(() => {})
    modalidadesApi.getAll().then(r => setModalidades(r.data)).catch(() => {})
  }, [])

  useEffect(() => {
    if (!diaSeleccionado || !idServicio) { setSlots([]); setPsicAsignado(null); setHora(null); return }
    const fecha = `${year}-${String(month+1).padStart(2,'0')}-${String(diaSeleccionado).padStart(2,'0')}`
    setLoadingSlots(true)
    setHora(null)
    setPsicAsignado(null)
    disponibilidadApi.getSlots(fecha, idServicio)
      .then(r => setSlots(r.data))
      .catch(() => setSlots([]))
      .finally(() => setLoadingSlots(false))
  }, [diaSeleccionado, idServicio, year, month])

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y=>y-1) } else setMonth(m=>m-1); setDia(null); setHora(null) }
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y=>y+1) } else setMonth(m=>m+1); setDia(null); setHora(null) }

  const isPast = d => {
    if (!d) return true
    const sel = new Date(year, month, d); sel.setHours(0,0,0,0)
    const t = new Date(); t.setHours(0,0,0,0)
    return sel <= t
  }

  const handleReservar = async () => {
    if (!idServicio || !idModalidad || !diaSeleccionado || !horaSeleccionada) {
      setError('Completa todos los campos: servicio, modalidad, fecha y hora.')
      return
    }
    setError('')
    setLoading(true)
    const fecha = `${year}-${String(month+1).padStart(2,'0')}-${String(diaSeleccionado).padStart(2,'0')}`
    try {
      await citasApi.create({ id_servicio: idServicio, id_modalidad: idModalidad, fecha, hora: horaSeleccionada, observaciones })
      navigate('/citas', { state: { success: '¡Cita reservada correctamente!' } })
    } catch (err) {
      setError(err.response?.data?.message || 'Error al reservar la cita.')
    } finally {
      setLoading(false)
    }
  }

  const servicioSel   = servicios.find(s => String(s.id_servicio)  === String(idServicio))
  const modalidadSel  = modalidades.find(m => String(m.id_modalidad) === String(idModalidad))
  const dias = buildCalendar(year, month)

  return (
    <div className={styles.page}>
      <div className="container">

        <div className={styles.topBar}>
          <div>
            <h1 className={styles.titulo}>Gestión de Citas</h1>
            <p className={styles.subtitulo}>Reserva tu próxima sesión de bienestar</p>
          </div>
        </div>

        <div className={`card ${styles.reservaCard}`}>
          <div className={styles.reservaGrid}>

            {/* IZQUIERDA: CALENDARIO */}
            <div className={styles.calPanel}>
              <h3 className={styles.panelTitle}>📅 Selecciona una Fecha</h3>

              <div className={styles.calNav}>
                <button className={styles.calArrow} onClick={prevMonth}>‹</button>
                <span className={styles.calMonth}>{MESES[month]} {year}</span>
                <button className={styles.calArrow} onClick={nextMonth}>›</button>
              </div>

              <div className={styles.calGrid}>
                {DIAS.map(d => <span key={d} className={styles.calDow}>{d}</span>)}
                {dias.map((d, i) => (
                  <button key={i} disabled={!d || isPast(d)}
                    className={[
                      styles.calDay,
                      !d ? styles.calEmpty : '',
                      isPast(d) && d ? styles.calPast : '',
                      diaSeleccionado === d ? styles.calSelected : '',
                    ].join(' ')}
                    onClick={() => { if (d && !isPast(d)) { setDia(d); setHora(null) } }}>
                    {d}
                  </button>
                ))}
              </div>

              {/* SLOTS */}
              {diaSeleccionado && (
                <div className={styles.slotsSection}>
                  <p className={styles.slotsTitle}>⏱ Horas disponibles</p>
                  {!idServicio ? (
                    <p className={styles.slotsEmpty}>Selecciona primero un servicio</p>
                  ) : loadingSlots ? (
                    <p className={styles.slotsEmpty}>Cargando...</p>
                  ) : slots.length === 0 ? (
                    <p className={styles.slotsEmpty}>No hay horas disponibles para este día</p>
                  ) : (
                    <div className={styles.slotsGrid}>
                      {slots.map(s => (
                        <button key={s.hora}
                          className={`${styles.slotBtn} ${horaSeleccionada === s.hora ? styles.slotBtnActive : ''}`}
                          onClick={() => { setHora(s.hora); setPsicAsignado({ nombre: s.nombre_psicologo, especialidad: s.especialidad, id_psicologo: s.id_psicologo }) }}>
                          {s.hora?.slice(0,5)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* DERECHA: DETALLES */}
            <div className={styles.detPanel}>
              <h3 className={styles.panelTitle}>✏️ Detalles de la Consulta</h3>

              <div className={styles.detBody}>
                <div className="form-group">
                  <label className="form-label">Servicio</label>
                  <select value={idServicio} onChange={e => setIdServicio(e.target.value)}>
                    <option value="">Selecciona un servicio</option>
                    {servicios.map(s => (
                      <option key={s.id_servicio} value={s.id_servicio}>{s.nombre_servicio}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Modalidad</label>
                  <div className={styles.modalBtns}>
                    {modalidades.map(m => (
                      <button key={m.id_modalidad} type="button"
                        className={`${styles.modalBtn} ${String(idModalidad) === String(m.id_modalidad) ? styles.modalBtnActive : ''}`}
                        onClick={() => setIdModalidad(m.id_modalidad)}>
                        <span className={styles.modalBtnIcon}>{MODALIDAD_ICONS[m.nombre_modalidad] ?? '📍'}</span>
                        <span>{m.nombre_modalidad}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Psicólogo Asignado</label>
                  <div className={styles.psicBox}>
                    {psicAsignado ? (
                      <>
                        <div className={styles.psicAvatar}>{psicAsignado.nombre.charAt(0)}</div>
                        <div className={styles.psicInfo}>
                          <p className={styles.psicNombre}>{psicAsignado.nombre}</p>
                          <p className={styles.psicEsp}>{psicAsignado.especialidad}</p>
                        </div>
                        <span className={styles.psicCheck}>✓</span>
                      </>
                    ) : (
                      <p className={styles.psicEmpty}>Se asignará al elegir fecha y hora</p>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Notas Adicionales (Opcional)</label>
                  <textarea value={observaciones} onChange={e => setObs(e.target.value)}
                    placeholder="¿Hay algo que deberíamos saber antes de tu sesión?" rows={3} />
                </div>

                {/* RESUMEN */}
                {idServicio && idModalidad && diaSeleccionado && horaSeleccionada && (
                  <div className={styles.resumen}>
                    <span>ℹ️</span>
                    <p>
                      <strong>Resumen de tu selección:</strong><br />
                      {servicioSel?.nombre_servicio} {modalidadSel?.nombre_modalidad?.toLowerCase()}
                      {psicAsignado ? ` con ${psicAsignado.nombre}` : ''}.{' '}
                      {MESES[month]} {diaSeleccionado} a las {horaSeleccionada?.slice(0,5)}.
                      {servicioSel ? ` · ${servicioSel.precio}€` : ''}
                    </p>
                  </div>
                )}

                {error && <p className="form-error">{error}</p>}

                <button className={`btn btn-primary ${styles.reservaBtn}`} onClick={handleReservar} disabled={loading}>
                  {loading ? 'Reservando...' : 'Reservar cita'}
                </button>
                <button className={styles.cancelarLink} onClick={() => navigate('/citas')}>
                  Cancelar
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* FEATURES */}
        <div className={styles.features}>
          <div className={styles.featItem}>
            <span className={styles.featIcon}>🔒</span>
            <h4>Privacidad Total</h4>
            <p>Tus datos y sesiones están protegidos bajo estricto secreto profesional.</p>
          </div>
          <div className={styles.featItem}>
            <span className={styles.featIcon}>✅</span>
            <h4>Calidad Garantizada</h4>
            <p>Todos nuestros psicólogos están colegiados y certificados.</p>
          </div>
          <div className={styles.featItem}>
            <span className={styles.featIcon}>🔄</span>
            <h4>Flexibilidad</h4>
            <p>Cancela o reprograma tu cita hasta 24 horas antes sin coste.</p>
          </div>
        </div>

      </div>
    </div>
  )
}
