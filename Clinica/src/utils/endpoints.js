export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'

// Auth
export const LOGIN_ENDPOINT              = `${API_BASE_URL}/login`
export const REGISTER_ENDPOINT           = `${API_BASE_URL}/register`
export const LOGOUT_ENDPOINT             = `${API_BASE_URL}/logout`
export const ME_ENDPOINT                 = `${API_BASE_URL}/me`
export const FORGOT_PASSWORD_ENDPOINT    = `${API_BASE_URL}/forgot-password`
export const RESET_PASSWORD_ENDPOINT     = `${API_BASE_URL}/reset-password`

// Usuarios
export const USUARIOS_INDEX_ENDPOINT     = `${API_BASE_URL}/usuarios`
export const USUARIOS_SHOW_ENDPOINT      = (id) => `${API_BASE_URL}/usuarios/${id}`
export const USUARIOS_STORE_ENDPOINT     = `${API_BASE_URL}/usuarios`
export const USUARIOS_UPDATE_ENDPOINT    = (id) => `${API_BASE_URL}/usuarios/${id}`
export const USUARIOS_DELETE_ENDPOINT    = (id) => `${API_BASE_URL}/usuarios/${id}`

// Psicólogos
export const PSICOLOGOS_INDEX_ENDPOINT   = `${API_BASE_URL}/psicologos`
export const PSICOLOGOS_SHOW_ENDPOINT    = (id) => `${API_BASE_URL}/psicologos/${id}`
export const PSICOLOGOS_STORE_ENDPOINT   = `${API_BASE_URL}/psicologos`
export const PSICOLOGOS_UPDATE_ENDPOINT  = (id) => `${API_BASE_URL}/psicologos/${id}`
export const PSICOLOGOS_DELETE_ENDPOINT  = (id) => `${API_BASE_URL}/psicologos/${id}`

// Servicios
export const SERVICIOS_INDEX_ENDPOINT    = `${API_BASE_URL}/servicios`
export const SERVICIOS_SHOW_ENDPOINT     = (id) => `${API_BASE_URL}/servicios/${id}`
export const SERVICIOS_STORE_ENDPOINT    = `${API_BASE_URL}/servicios`
export const SERVICIOS_UPDATE_ENDPOINT   = (id) => `${API_BASE_URL}/servicios/${id}`
export const SERVICIOS_DELETE_ENDPOINT   = (id) => `${API_BASE_URL}/servicios/${id}`

// Citas
export const CITAS_INDEX_ENDPOINT        = `${API_BASE_URL}/citas`
export const CITAS_SHOW_ENDPOINT         = (id) => `${API_BASE_URL}/citas/${id}`
export const CITAS_STORE_ENDPOINT        = `${API_BASE_URL}/citas`
export const CITAS_UPDATE_ENDPOINT       = (id) => `${API_BASE_URL}/citas/${id}`
export const CITAS_DELETE_ENDPOINT       = (id) => `${API_BASE_URL}/citas/${id}`

// Otros
export const MODALIDADES_ENDPOINT        = `${API_BASE_URL}/modalidades`
export const ESTADOS_CITA_ENDPOINT       = `${API_BASE_URL}/estados-cita`
export const DISPONIBILIDAD_ENDPOINT     = `${API_BASE_URL}/disponibilidad`
export const CONTACTO_ENDPOINT           = `${API_BASE_URL}/contacto`
