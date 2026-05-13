import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

let _navigate = null
export function setNavigate(nav) { _navigate = nav }

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('usuario')
      if (_navigate) _navigate('/login', { replace: true })
      else window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api

const crudApi = (base) => ({
  getAll:  ()         => api.get(`/${base}`),
  getOne:  (id)       => api.get(`/${base}/${id}`),
  create:  (d)        => api.post(`/${base}`, d),
  update:  (id, d)    => api.put(`/${base}/${id}`, d),
  delete:  (id)       => api.delete(`/${base}/${id}`),
})

export const authApi = {
  login:    (data) => api.post('/login', data),
  register: (data) => api.post('/register', data),
  logout:   ()     => api.post('/logout'),
  me:       ()     => api.get('/me'),
  updateMe: (data) => api.put('/me', data),
}

export const serviciosApi   = crudApi('servicios')
export const psicologosApi  = crudApi('psicologos')
export const citasApi       = crudApi('citas')
export const usuariosApi    = crudApi('usuarios')
export const modalidadesApi     = { getAll: () => api.get('/modalidades') }
export const disponibilidadApi  = { getSlots: (fecha, id_servicio) => api.get('/disponibilidad', { params: { fecha, id_servicio } }) }
export const contactoApi        = { send: (data) => api.post('/contacto', data) }
