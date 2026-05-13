import { useEffect, useState } from 'react'
import { psicologosApi } from '../../utils/api'
import styles from './psicologos.module.css'

export default function Psicologos() {
  const [psicologos, setPsicologos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    psicologosApi.getAll()
      .then(r => setPsicologos(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className="container">
          <span className={styles.badge}>Nuestro equipo</span>
          <h1>Psicólogos Especializados</h1>
          <p>Profesionales comprometidos con tu salud mental y bienestar emocional.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {loading ? (
            <div className={styles.loading}>Cargando especialistas...</div>
          ) : (
            <div className="grid-3">
              {psicologos.map(p => (
                <div key={p.id_psicologo} className={`card ${styles.card}`}>
                  {p.foto
                    ? <img src={`/fotos/${p.foto}`} alt={p.nombre} className={styles.photo} />
                    : <div className={styles.photo} />}
                  <div className={styles.info}>
                    <h3>{p.nombre}</h3>
                    {p.especialidad && <span className="badge badge-accent">{p.especialidad}</span>}
                    <p>{p.descripcion || 'Profesional dedicado al bienestar emocional de sus pacientes.'}</p>
                    {p.servicios?.length > 0 && (
                      <div className={styles.servicios}>
                        {p.servicios.map(s => (
                          <span key={s.id_servicio} className="badge badge-primary">{s.nombre_servicio}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
