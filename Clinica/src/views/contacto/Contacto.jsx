import { useState } from 'react'
import { contactoApi } from '../../utils/api'
import styles from './contacto.module.css'

const INFO = [
  { icon: '📍', label: 'Dirección',  value: 'Calle Bienestar 24, 29001 Málaga' },
  { icon: '📞', label: 'Teléfono',   value: '+34 952 123 456' },
  { icon: '✉️', label: 'Email',      value: 'info@psicologiavelez.es' },
  { icon: '🕐', label: 'Horario',    value: 'Lun–Vie 9:00–20:00 · Sáb 9:00–14:00' },
]

export default function Contacto() {
  const [form,    setForm]    = useState({ nombre: '', email: '', asunto: '', mensaje: '' })
  const [sent,    setSent]    = useState(false)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await contactoApi.send(form)
      setSent(true)
      setForm({ nombre: '', email: '', asunto: '', mensaje: '' })
    } catch {
      setError('No se pudo enviar el mensaje. Inténtalo de nuevo más tarde.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>

      <section className={styles.hero}>
        <div className="container">
          <span className={styles.badge}>Contacto</span>
          <h1>Estamos aquí para ti</h1>
          <p>No dudes en ponerte en contacto con nosotros. Respondemos en menos de 24 horas.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className={styles.grid}>

            <div className={styles.infoCol}>
              <h2>Información de contacto</h2>
              <p>Si tienes alguna pregunta sobre nuestros servicios o quieres reservar una primera consulta, estamos disponibles para ayudarte.</p>
              <div className={styles.infoList}>
                {INFO.map(item => (
                  <div key={item.label} className={styles.infoItem}>
                    <span className={styles.infoIcon}>{item.icon}</span>
                    <div>
                      <p className={styles.infoLabel}>{item.label}</p>
                      <p className={styles.infoValue}>{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={`card ${styles.formCard}`}>
              <h2>Envíanos un mensaje</h2>
              {sent ? (
                <div className={styles.success}>
                  <span>✅</span>
                  <p>Mensaje enviado correctamente. Nos pondremos en contacto contigo pronto.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className={styles.form}>
                  <div className={styles.row}>
                    <div className="form-group">
                      <label className="form-label">Nombre</label>
                      <input type="text" name="nombre" value={form.nombre} onChange={handleChange}
                        placeholder="Tu nombre" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input type="email" name="email" value={form.email} onChange={handleChange}
                        placeholder="tu@email.com" required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Asunto</label>
                    <input type="text" name="asunto" value={form.asunto} onChange={handleChange}
                      placeholder="¿En qué podemos ayudarte?" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Mensaje</label>
                    <textarea name="mensaje" value={form.mensaje} onChange={handleChange}
                      placeholder="Cuéntanos tu situación..." rows={5} required />
                  </div>
                  {error && <p className="form-error">{error}</p>}
                  <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                    {loading ? 'Enviando...' : 'Enviar mensaje'}
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>

    </div>
  )
}
