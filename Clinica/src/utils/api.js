import axios from 'axios'
import {
  LOGIN_ENDPOINT, REGISTER_ENDPOINT, LOGOUT_ENDPOINT, ME_ENDPOINT,
  USUARIOS_INDEX_ENDPOINT, USUARIOS_SHOW_ENDPOINT, USUARIOS_STORE_ENDPOINT, USUARIOS_UPDATE_ENDPOINT, USUARIOS_DELETE_ENDPOINT,
  PSICOLOGOS_INDEX_ENDPOINT, PSICOLOGOS_SHOW_ENDPOINT, PSICOLOGOS_STORE_ENDPOINT, PSICOLOGOS_UPDATE_ENDPOINT, PSICOLOGOS_DELETE_ENDPOINT,
  SERVICIOS_INDEX_ENDPOINT, SERVICIOS_SHOW_ENDPOINT, SERVICIOS_STORE_ENDPOINT, SERVICIOS_UPDATE_ENDPOINT, SERVICIOS_DELETE_ENDPOINT,
  CITAS_INDEX_ENDPOINT, CITAS_SHOW_ENDPOINT, CITAS_STORE_ENDPOINT, CITAS_UPDATE_ENDPOINT, CITAS_DELETE_ENDPOINT,
  MODALIDADES_ENDPOINT, ESTADOS_CITA_ENDPOINT, DISPONIBILIDAD_ENDPOINT, CONTACTO_ENDPOINT,
} from './endpoints'

const api = axios.create({
  baseURL: '/',
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

// Auth
export const authApi = {
  login:    (data) => api.post(LOGIN_ENDPOINT, data),
  register: (data) => api.post(REGISTER_ENDPOINT, data),
  logout:   ()     => api.post(LOGOUT_ENDPOINT),
  me:       ()     => api.get(ME_ENDPOINT),
  updateMe: (data) => api.put(ME_ENDPOINT, data),
}

// Servicios
export const serviciosApi = {
  getAll:  ()         => api.get(SERVICIOS_INDEX_ENDPOINT),
  getOne:  (id)       => api.get(SERVICIOS_SHOW_ENDPOINT(id)),
  create:  (data)     => api.post(SERVICIOS_STORE_ENDPOINT, data),
  update:  (id, data) => api.put(SERVICIOS_UPDATE_ENDPOINT(id), data),
  delete:  (id)       => api.delete(SERVICIOS_DELETE_ENDPOINT(id)),
}

// Psicólogos
const toPsicologoFD = (data, method = null) => {
  const fd = new FormData()
  if (method) fd.append('_method', method)
  for (const [k, v] of Object.entries(data)) {
    if (k === 'servicios_ids') {
      (v ?? []).forEach(id => fd.append('servicios[]', id))
    } else if (k === 'fotoFile') {
      if (v) fd.append('foto', v)
    } else if (k === 'servicios' || k === 'foto' || k === 'id_psicologo') {
      // servicios objetos se mandan via servicios_ids; foto ruta y id no se mandan
    } else if (v !== null && v !== undefined) {
      fd.append(k, v)
    }
  }
  return fd
}

export const psicologosApi = {
  getAll:  ()         => api.get(PSICOLOGOS_INDEX_ENDPOINT),
  getOne:  (id)       => api.get(PSICOLOGOS_SHOW_ENDPOINT(id)),
  create:  (data)     => api.post(PSICOLOGOS_STORE_ENDPOINT, toPsicologoFD(data)),
  update:  (id, data) => api.post(PSICOLOGOS_UPDATE_ENDPOINT(id), toPsicologoFD(data, 'PUT')),
  delete:  (id)       => api.delete(PSICOLOGOS_DELETE_ENDPOINT(id)),
}

// Usuarios
export const usuariosApi = {
  getAll:  ()         => api.get(USUARIOS_INDEX_ENDPOINT),
  getOne:  (id)       => api.get(USUARIOS_SHOW_ENDPOINT(id)),
  create:  (data)     => api.post(USUARIOS_STORE_ENDPOINT, data),
  update:  (id, data) => api.put(USUARIOS_UPDATE_ENDPOINT(id), data),
  delete:  (id)       => api.delete(USUARIOS_DELETE_ENDPOINT(id)),
}

// Citas
export const citasApi = {
  getAll:  ()         => api.get(CITAS_INDEX_ENDPOINT),
  getOne:  (id)       => api.get(CITAS_SHOW_ENDPOINT(id)),
  create:  (data)     => api.post(CITAS_STORE_ENDPOINT, data),
  update:  (id, data) => api.put(CITAS_UPDATE_ENDPOINT(id), data),
  delete:  (id)       => api.delete(CITAS_DELETE_ENDPOINT(id)),
}

// Otros
export const modalidadesApi    = { getAll: () => api.get(MODALIDADES_ENDPOINT) }
export const estadosCitaApi    = { getAll: () => api.get(ESTADOS_CITA_ENDPOINT) }
export const disponibilidadApi = { getSlots: (fecha, id_servicio) => api.get(DISPONIBILIDAD_ENDPOINT, { params: { fecha, id_servicio } }) }
export const contactoApi       = { send: (data) => api.post(CONTACTO_ENDPOINT, data) }
