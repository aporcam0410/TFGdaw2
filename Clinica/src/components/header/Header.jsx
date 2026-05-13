import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import styles from './header.module.css'

export default function Header() {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const close = () => setMenuOpen(false)

  const handleLogout = async () => {
    close()
    await logout()
    navigate('/login')
  }

  const navClass = ({ isActive }) => isActive ? styles.active : ''

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link to="/" className={styles.logo} onClick={close}>Psicología Vélez</Link>

        {/* NAV DESKTOP + MOBILE DROPDOWN */}
        <nav className={`${styles.nav} ${menuOpen ? styles.open : ''}`}>
          <NavLink to="/"           className={navClass} end       onClick={close}>Home</NavLink>
          <NavLink to="/citas"      className={navClass}           onClick={close}>Citas</NavLink>
          <NavLink to="/psicologos" className={navClass}           onClick={close}>Psicólogos</NavLink>
          <NavLink to="/nosotros"   className={navClass}           onClick={close}>Nosotros</NavLink>
          <NavLink to="/contacto"   className={navClass}           onClick={close}>Contacto</NavLink>

          {/* Sección de usuario solo visible en el menú móvil */}
          <div className={styles.mobileUser}>
            <div className={styles.mobileDivider} />
            {usuario ? (
              <>
                <Link to="/perfil" className={styles.mobileUserLink} onClick={close}>👤 Mi Perfil</Link>
                {usuario.is_admin && (
                  <Link to="/admin" className={styles.mobileUserLink} onClick={close}>⚙️ Panel Admin</Link>
                )}
                <button onClick={handleLogout} className={styles.mobileLogoutBtn}>Cerrar sesión</button>
              </>
            ) : (
              <Link to="/login" className={`btn btn-primary ${styles.mobileLoginBtn}`} onClick={close}>Iniciar Sesión</Link>
            )}
          </div>
        </nav>

        {/* ACCIONES DESKTOP */}
        <div className={styles.actions}>
          {usuario ? (
            <div className={styles.userMenu}>
              <Link to="/perfil" className={styles.userBtn}>
                <span className={styles.userIcon}>👤</span>
                Mi Perfil
              </Link>
              {usuario.is_admin && (
                <Link to="/admin" className={`btn btn-accent ${styles.adminBtn}`}>Admin</Link>
              )}
              <button onClick={handleLogout} className={`btn btn-ghost ${styles.logoutBtn}`}>Cerrar sesión</button>
            </div>
          ) : (
            <Link to="/login" className={`btn btn-primary ${styles.loginBtn}`}>Iniciar Sesión</Link>
          )}
        </div>

        {/* BURGER */}
        <button
          className={`${styles.burger} ${menuOpen ? styles.burgerOpen : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menú"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* OVERLAY para cerrar al pulsar fuera */}
      {menuOpen && <div className={styles.overlay} onClick={close} />}
    </header>
  )
}
