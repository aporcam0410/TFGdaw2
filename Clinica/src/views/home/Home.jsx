import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { psicologosApi, serviciosApi } from '../../utils/api'
import styles from './home.module.css'

const SERVICIO_ICONS = ['🌊', '☀️', '💼', '💚', '👫', '🧠', '🕊️', '💙']
const SLIDES = ['/fotos/carrousel1.webp', '/fotos/carrousel2.webp', '/fotos/carrousel3.webp']

export default function Home() {
  const [psicologos,    setPsicologos]    = useState([])
  const [especialidades, setEspecialidades] = useState([])
  const [slide, setSlide] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % SLIDES.length), 4000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    psicologosApi.getAll().then(r => setPsicologos(r.data.slice(-3))).catch(() => {})
    serviciosApi.getAll().then(r => {
      const lista = r.data.slice(-6)
      setEspecialidades(lista.map((s, i) => ({
        icon:   SERVICIO_ICONS[i % SERVICIO_ICONS.length],
        titulo: s.nombre_servicio,
        desc:   s.descripcion ?? '',
      })))
    }).catch(() => {})
  }, [])

  return (
    <div className={styles.page}>

      {/* HERO */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroInner}>
            <div className={styles.heroText}>
              <h1>Tu camino hacia la <span className={styles.accent}>serenidad</span> comienza aquí.</h1>
              <p>En Psicología Vélez, acompañamos tu proceso de crecimiento personal con un enfoque humano, profesional y profundamente calmante. Encuentra el equilibrio que buscas en un entorno seguro.</p>
              <div className={styles.heroBtns}>
                <Link to="/citas" className="btn btn-primary">Reservar cita</Link>
                <Link to="/psicologos" className="btn btn-outline">Ver Especialistas</Link>
              </div>
            </div>
            <div className={styles.heroImg}>
              <div className={styles.carousel}>
                {SLIDES.map((src, i) => (
                  <img key={i} src={src} alt="" className={`${styles.carouselImg} ${i === slide ? styles.carouselActive : ''}`} />
                ))}
                <div className={styles.carouselDots}>
                  {SLIDES.map((_, i) => (
                    <button key={i} className={`${styles.dot} ${i === slide ? styles.dotActive : ''}`} onClick={() => setSlide(i)} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MISIÓN */}
      <section className={styles.mision}>
        <div className="container">
          <div className={styles.misionInner}>
            <span className={styles.badge}>Nuestra Misión</span>
            <h2>Claridad Mental y Bienestar Emocional</h2>
            <p>Creemos que cada individuo posee la capacidad inherente de florecer. Nuestra práctica se basa en proporcionar las herramientas necesarias para navegar las tormentas de la vida, transformando el estrés en fortaleza y la ansiedad en paz interior.</p>
          </div>
        </div>
      </section>

      {/* ESPECIALIDADES */}
      <section className={`${styles.especialidades} section`}>
        <div className="container">
          <h2 className="section-title">Especialidades</h2>
          <p className="section-subtitle">Tratamientos personalizados para tu crecimiento.</p>
          <div className={styles.especGrid}>
            {especialidades.map((e, i) => (
              <div key={i} className={`card ${styles.especCard}`}>
                <span className={styles.especIcon}>{e.icon}</span>
                <h3>{e.titulo}</h3>
                <p>{e.desc}</p>
                <Link to="/citas" className={styles.especLink}>Saber más →</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PSICÓLOGOS */}
      {psicologos.length > 0 && (
        <section className={`section ${styles.psicSection}`}>
          <div className="container">
            <div className={styles.psicHeader}>
              <div>
                <h2 className="section-title">Nuestros Psicólogos</h2>
                <p className="section-subtitle">Profesionales comprometidos con tu bienestar integral.</p>
              </div>
              <Link to="/psicologos" className="btn btn-outline">Ver todos</Link>
            </div>
            <div className="grid-3">
              {psicologos.map(p => (
                <div key={p.id_psicologo} className={`card ${styles.psicCard}`}>
                  {p.foto
                    ? <img src={p.foto} alt={p.nombre} className={styles.psicPhoto} />
                    : <div className={styles.psicPhoto} />}
                  <div className={styles.psicInfo}>
                    <h3>{p.nombre}</h3>
                    {p.especialidad && <span className="badge badge-accent">{p.especialidad}</span>}
                    {p.descripcion && <p>{p.descripcion}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className={styles.cta}>
        <div className="container">
          <div className={styles.ctaBox}>
            <h2>¿Listo para comenzar tu proceso de cambio?</h2>
            <p>Agenda hoy mismo tu primera sesión informativa y descubre cómo podemos ayudarte a encontrar la paz que mereces.</p>
            <Link to="/citas" className="btn btn-primary">Reservar cita ahora</Link>
          </div>
        </div>
      </section>

    </div>
  )
}
