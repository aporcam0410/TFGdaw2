import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { psicologosApi } from '../../utils/api'
import styles from './nosotros.module.css'

const filosofia = [
  { icon: '🧠', titulo: 'Enfoque Humanista',      desc: 'Priorizamos el vínculo terapéutico, creando un espacio seguro donde el juicio no tiene cabida y la empatía es el motor del cambio.' },
  { icon: '🔬', titulo: 'Rigurosidad Científica',  desc: 'Integramos técnicas de vanguardia basadas en la evidencia para asegurar resultados tangibles y duraderos en tu bienestar emocional.' },
  { icon: '🌱', titulo: 'Crecimiento Integral',    desc: 'Entendemos la salud como un equilibrio entre mente, cuerpo y entorno, promoviendo hábitos que sostengan tu paz interior.' },
]

export default function Nosotros() {
  const [equipo, setEquipo] = useState([])

  useEffect(() => {
    psicologosApi.getAll().then(r => setEquipo(r.data.slice(-3))).catch(() => {})
  }, [])

  return (
    <div className={styles.page}>

      {/* HERO */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroInner}>
            <div className={styles.heroText}>
              <span className={styles.heroBadge}>Nuestra Historia</span>
              <h1>Un espacio para tu <span className={styles.accent}>serenidad</span> y crecimiento personal.</h1>
              <p>Fundada con la visión de humanizar la salud mental, Psicología Vélez nació del deseo de ofrecer un refugio de calma en un mundo acelerado. Creemos que cada individuo posee la capacidad intrínseca de sanar y prosperar cuando se le brinda el entorno adecuado.</p>
            </div>
            <div className={styles.heroImgWrap}>
              <img src="/fotos/nosotros1.webp" alt="Consulta Psicología Vélez" className={styles.heroImg} />
              <div className={styles.heroYears}>
                <span className={styles.heroYearsNum}>+10 Años</span>
                <span className={styles.heroYearsSub}>Acompañando procesos</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FILOSOFÍA */}
      <section className={`section ${styles.filosofiaSection}`}>
        <div className="container">
          <h2 className="section-title" style={{textAlign:'center'}}>Nuestra Filosofía</h2>
          <p className="section-subtitle" style={{textAlign:'center', maxWidth:'520px', margin:'0 auto 48px'}}>
            No solo tratamos síntomas; acompañamos a personas en su viaje hacia una vida más plena y consciente.
          </p>
          <div className="grid-3">
            {filosofia.map((f, i) => (
              <div key={i} className={`card ${styles.filosCard}`}>
                <div className={styles.filosIcon}>{f.icon}</div>
                <h4>{f.titulo}</h4>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ESPACIO */}
      <section className={`section ${styles.espacioSection}`}>
        <div className="container">
          <h2 className={styles.espacioTitle}>Tu Espacio de Sanación</h2>
          <p className={styles.espacioSub}>Hemos diseñado cada rincón de nuestra clínica para facilitar la introspección y el confort.</p>
          <div className={styles.galeriaGrid}>
            <div className={styles.galeriaMain}>
              <img src="/fotos/nosotros2.webp" alt="" className={styles.galeriaImg} />
            </div>
            <div className={styles.galeriaSide}>
              <div className={styles.galeriaSideTop}>
                <img src="/fotos/nosotros3.webp" alt="" className={styles.galeriaImg} />
              </div>
              <div className={styles.galeriaSideRow}>
                <div className={styles.galeriaSideCell}>
                  <img src="/fotos/nosotros4.webp" alt="" className={styles.galeriaImg} />
                </div>
                <div className={styles.galeriaSideCell}>
                  <img src="/fotos/nosotros5.webp" alt="" className={styles.galeriaImg} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ENFOQUE */}
      <section className={`section ${styles.enfoqueSection}`}>
        <div className="container">
          <div className={styles.enfoqueGrid}>
            <div>
              <h2 className={styles.enfoqueTitle}>Nuestro Enfoque Terapéutico</h2>
            </div>
            <div className={styles.enfoqueContent}>
              <p>En Psicología Vélez, entendemos que cada mente es un universo único. Por ello, no aplicamos fórmulas genéricas. Nuestra metodología se basa en una evaluación profunda y personalizada que nos permite seleccionar las herramientas más adecuadas para tu situación específica.</p>
              <p>Trabajamos desde una perspectiva integradora, combinando la Terapia Cognitivo-Conductual con enfoques de Tercera Generación como el Mindfulness y la Terapia de Aceptación y Compromiso (ACT). Esta combinación nos permite abordar tanto los síntomas inmediatos como las raíces profundas del malestar.</p>
              <blockquote className={styles.cita}>
                "La salud mental no es el destino, sino el camino que recorremos para vivir una vida con propósito y calma."
              </blockquote>
              <p>Nuestra trayectoria nos ha enseñado que el cambio real ocurre cuando el paciente se siente escuchado, validado y empoderado. En nuestras sesiones, encontrarás un aliado comprometido con tu evolución, respetando siempre tus tiempos y tu autonomía.</p>
            </div>
          </div>
        </div>
      </section>

      {/* EQUIPO */}
      {equipo.length > 0 && (
        <section className={`section ${styles.equipoSection}`}>
          <div className="container">
            <div className={styles.equipoHeader}>
              <div>
                <h2 className="section-title">Nuestro Equipo</h2>
                <p className="section-subtitle">Psicólogos colegiados con amplia experiencia clínica.</p>
              </div>
              <Link to="/psicologos" className="btn btn-outline">Ver todos</Link>
            </div>
            <div className="grid-3">
              {equipo.map(p => (
                <div key={p.id_psicologo} className={`card ${styles.equipoCard}`}>
                  {p.foto
                    ? <img src={`/fotos/${p.foto}`} alt={p.nombre} className={styles.equipoPhoto} />
                    : <div className={styles.equipoPhoto} />}
                  <div className={styles.equipoInfo}>
                    <h3>{p.nombre}</h3>
                    {p.especialidad && <span className="badge badge-accent">{p.especialidad}</span>}
                    <p>{p.descripcion || 'Profesional dedicado al bienestar emocional de sus pacientes.'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className={`section ${styles.ctaSection}`}>
        <div className="container">
          <div className={styles.ctaBox}>
            <h2>¿Listo para comenzar tu viaje?</h2>
            <p>Estamos aquí para escucharte. Reserva una primera sesión informativa y descubre cómo podemos ayudarte a recuperar tu serenidad.</p>
            <div className={styles.ctaBtns}>
              <Link to="/citas" className="btn btn-primary">Agendar Cita</Link>
              <Link to="/contacto" className="btn btn-outline">Contáctanos</Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
