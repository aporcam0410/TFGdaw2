import { Link } from 'react-router-dom'
import styles from './nosotros.module.css'

const valores = [
  { icon: '💛', titulo: 'Empatía',         desc: 'Nos ponemos en tu lugar. Cada historia merece ser escuchada sin juicio.' },
  { icon: '🔬', titulo: 'Evidencia',        desc: 'Aplicamos técnicas respaldadas por la ciencia para resultados reales.' },
  { icon: '🔒', titulo: 'Confidencialidad', desc: 'Tu privacidad es sagrada. Todo lo que compartes queda entre nosotros.' },
  { icon: '🌱', titulo: 'Crecimiento',      desc: 'Creemos en tu capacidad innata de sanar y evolucionar.' },
]

const equipo = [
  { nombre: 'Dra. Laura Vélez', rol: 'Fundadora y Directora', especialidad: 'Psicología clínica', years: '12 años de experiencia' },
  { nombre: 'Dr. Carlos Gómez', rol: 'Psicólogo Senior',      especialidad: 'Ansiedad y estrés',  years: '8 años de experiencia' },
  { nombre: 'Dra. Ana Sánchez', rol: 'Psicóloga de Pareja',   especialidad: 'Terapia de pareja',  years: '6 años de experiencia' },
]

export default function Nosotros() {
  return (
    <div className={styles.page}>

      {/* HERO */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroInner}>
            <div>
              <span className={styles.badge}>Sobre nosotros</span>
              <h1>Un espacio de <span className={styles.accent}>confianza</span> y crecimiento</h1>
              <p>Somos un equipo de psicólogos apasionados por el bienestar humano. Fundada con la convicción de que la salud mental es un derecho, no un privilegio, Psicología Vélez ofrece un entorno cálido y profesional donde cada persona puede encontrar su camino hacia la paz interior.</p>
              <Link to="/citas" className="btn btn-primary">Reservar una sesión</Link>
            </div>
            <div className={styles.heroImg} />
          </div>
        </div>
      </section>

      {/* MISIÓN Y VISIÓN */}
      <section className={`section ${styles.misionSection}`}>
        <div className="container">
          <div className="grid-2">
            <div className={`card ${styles.misionCard}`}>
              <span className={styles.iconLg}>🎯</span>
              <h3>Nuestra Misión</h3>
              <p>Proporcionar atención psicológica de calidad, accesible y personalizada, acompañando a cada persona en su proceso de autoconocimiento y bienestar emocional con compromiso y profesionalismo.</p>
            </div>
            <div className={`card ${styles.misionCard} ${styles.misionCardAccent}`}>
              <span className={styles.iconLg}>🌟</span>
              <h3>Nuestra Visión</h3>
              <p>Ser un referente en salud mental donde cada individuo pueda desarrollar su máximo potencial, construyendo una sociedad más consciente, resiliente y emocionalmente saludable.</p>
            </div>
          </div>
        </div>
      </section>

      {/* VALORES */}
      <section className={`section ${styles.valoresSection}`}>
        <div className="container">
          <h2 className="section-title">Nuestros Valores</h2>
          <p className="section-subtitle">Los principios que guían cada sesión y cada decisión.</p>
          <div className="grid-4">
            {valores.map((v, i) => (
              <div key={i} className={`card ${styles.valorCard}`}>
                <span className={styles.valorIcon}>{v.icon}</span>
                <h4>{v.titulo}</h4>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EQUIPO */}
      <section className={`section ${styles.equipoSection}`}>
        <div className="container">
          <h2 className="section-title">Nuestro Equipo</h2>
          <p className="section-subtitle">Psicólogos colegiados con amplia experiencia clínica.</p>
          <div className="grid-3">
            {equipo.map((m, i) => (
              <div key={i} className={`card ${styles.equipoCard}`}>
                <div className={styles.equipoPhoto} />
                <div className={styles.equipoInfo}>
                  <h3>{m.nombre}</h3>
                  <span className="badge badge-accent">{m.especialidad}</span>
                  <p className={styles.equipoRol}>{m.rol}</p>
                  <p className={styles.equipoYears}>{m.years}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={`section ${styles.ctaSection}`}>
        <div className="container">
          <div className={styles.ctaBox}>
            <h2>¿Listo para conocernos?</h2>
            <p>Reserva una sesión informativa sin compromiso y descubre cómo podemos ayudarte.</p>
            <div className={styles.ctaBtns}>
              <Link to="/citas" className="btn btn-primary">Reservar cita</Link>
              <Link to="/contacto" className="btn btn-outline">Contactar</Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
