import { Link } from 'react-router-dom'
import styles from './footer.module.css'

const socials = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/psicologiavelez',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <circle cx="12" cy="12" r="4"/>
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/psicologiavelez',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
      </svg>
    ),
  },
  {
    label: 'Twitter / X',
    href: 'https://x.com/psicologiavelez',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
]

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>

        {/* IZQUIERDA: marca + copyright + links */}
        <div className={styles.left}>
          <span className={styles.logo}>Psicología Vélez</span>
          <p className={styles.copy}>© 2026 Psicología Vélez. Serenidad y Crecimiento.</p>
          <nav className={styles.navLinks}>
            <Link to="/nosotros">Nosotros</Link>
            <Link to="/contacto">Contacto</Link>
          </nav>
        </div>

        {/* DERECHA: redes sociales */}
        <div className={styles.socials}>
          {socials.map(s => (
            <a key={s.label} href={s.href} className={styles.socialBtn} aria-label={s.label} target="_blank" rel="noreferrer">
              {s.icon}
            </a>
          ))}
        </div>

      </div>
    </footer>
  )
}
