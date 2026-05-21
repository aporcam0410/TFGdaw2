# Documentación Técnica — Psicología Vélez

## 1. Vídeo demostrativo

- [Ver vídeo del proyecto](#)

---

## 2. Enlaces del proyecto

- [Prototipo en Figma](https://www.figma.com/design/gj30SYNzh5wc5rFCnxZOe6/Proyecto-TFG-Psicologia?node-id=0-1&p=f&t=yxRlc2NeaNwKi69n-0)
- [Aplicación desplegada — psicologiavelez.vercel.app](https://psicologiavelez.vercel.app)

---

## 3. Documentación técnica

### 3.1. Librerías y tecnologías usadas

#### Frontend

| Tecnología | Versión | Uso |
|---|---|---|
| React | 18.3 | Librería principal para construir la interfaz de usuario mediante componentes |
| Vite | 5.4 | Bundler y servidor de desarrollo. Gestiona también las variables de entorno (`VITE_API_BASE_URL`) |
| React Router DOM | 6.28 | Gestión del enrutamiento SPA: rutas públicas, rutas protegidas por autenticación y rutas exclusivas de administrador |
| Axios | 1.7 | Cliente HTTP para realizar todas las peticiones a la API de Laravel. Configurado con una instancia global que incluye interceptores de petición y respuesta |
| CSS Modules | — | Estilos encapsulados por componente, evitando colisiones de clases entre vistas |

#### Backend

| Tecnología | Versión | Uso |
|---|---|---|
| Laravel | 12 | Framework principal del backend. Gestiona el enrutamiento de la API, validaciones, modelos y lógica de negocio |
| Eloquent ORM | — | Mapeo objeto-relacional para interactuar con la base de datos MySQL mediante modelos PHP |
| Laravel Sanctum | — | Sistema de autenticación basado en tokens Bearer para proteger los endpoints de la API |
| Symfony Mailer | — | Envío de correos electrónicos a través de SMTP Gmail, usado en el formulario de contacto y en la recuperación de contraseña |
| MySQL (Aurora RDS) | — | Base de datos relacional alojada en AWS Aurora RDS |

---

### 3.2. Escalabilidad y reusabilidad

**Centralización de endpoints (frontend)**
Todos los endpoints de la API están definidos en un único fichero `src/utils/endpoints.js`. La URL base se lee de la variable de entorno `VITE_API_BASE_URL`, por lo que si mañana cambia el dominio del backend el cambio es en un único lugar.

**Instancia global de Axios con interceptores (frontend)**
Se creó una instancia única de Axios en `src/utils/api.js` con los interceptores configurados. El interceptor de petición añade automáticamente el token Bearer a todas las llamadas autenticadas sin necesidad de hacerlo manualmente en cada componente. El interceptor de respuesta detecta errores 401 y redirige automáticamente al login.

**Módulos de API por recurso (frontend)**
Dentro de `api.js` cada recurso (psicólogos, citas, usuarios, servicios…) tiene su propio objeto exportado (`psicologosApi`, `citasApi`…). Para añadir un nuevo recurso basta con añadir un nuevo objeto siguiendo el mismo patrón sin tocar el resto del código.

**ProtectedRoute reutilizable (frontend)**
El componente `ProtectedRoute` acepta una prop `adminOnly` que permite proteger rutas tanto por autenticación como por rol de administrador, reutilizando el mismo componente para ambos casos.

**Controladores RESTful (backend)**
Cada recurso tiene su propio controlador con los métodos estándar (`index`, `show`, `store`, `update`, `destroy`). Añadir un nuevo recurso a la API implica crear un modelo, una migración y un controlador siguiendo la misma estructura sin modificar el código existente.

---

### 3.3. Arquitectura de ficheros

#### Frontend (`clinica/src/`)

```
src/
├── App.jsx                  # Definición de todas las rutas de la aplicación
├── main.jsx                 # Punto de entrada, monta el router y el contexto de autenticación
├── components/
│   ├── header/Header.jsx    # Barra de navegación principal
│   └── footer/Footer.jsx    # Pie de página
├── context/
│   └── AuthContext.jsx      # Contexto global de autenticación (usuario, token, login, logout)
├── utils/
│   ├── endpoints.js         # Centralización de todas las URLs de la API
│   └── api.js               # Instancia de Axios con interceptores y módulos de API por recurso
└── views/
    ├── RootLayout.jsx        # Layout raíz con Header y Footer
    ├── ProtectedRoute.jsx    # Guardia de rutas privadas y de administrador
    ├── home/Home.jsx
    ├── nosotros/Nosotros.jsx
    ├── psicologos/Psicologos.jsx
    ├── contacto/Contacto.jsx
    ├── auth/
    │   ├── Login.jsx
    │   ├── Register.jsx
    │   ├── ForgotPassword.jsx
    │   └── ResetPassword.jsx
    ├── citas/
    │   ├── Citas.jsx         # Historial de citas del usuario
    │   └── NuevaCita.jsx     # Formulario de reserva de cita
    ├── perfil/Perfil.jsx
    └── admin/
        ├── Admin.jsx          # Panel de administración con CRUD completo
        ├── CreateCitaModal.jsx
        └── EditCitaModal.jsx
```

#### Backend (`Laravel/`)

```
Laravel/
├── routes/
│   └── api.php              # Todas las rutas de la API REST
├── app/
│   ├── Http/Controllers/Api/
│   │   ├── AuthController.php          # Login, registro, logout, me, recuperación de contraseña
│   │   ├── PsicologoController.php     # CRUD de psicólogos + subida de foto en base64
│   │   ├── ServicioController.php      # CRUD de servicios
│   │   ├── UsuarioController.php       # CRUD de usuarios
│   │   ├── CitaController.php          # CRUD de citas
│   │   ├── DisponibilidadController.php # Cálculo de franjas horarias disponibles
│   │   ├── ModalidadController.php     # Listado de modalidades (presencial/online)
│   │   └── ContactoController.php      # Envío de formulario de contacto por email
│   ├── Models/
│   │   ├── Usuario.php
│   │   ├── Psicologo.php
│   │   ├── Servicio.php
│   │   ├── Cita.php
│   │   ├── EstadoCita.php
│   │   ├── Modalidad.php
│   │   └── Rol.php
│   └── Notifications/
│       └── ResetPasswordNotification.php  # Notificación de restablecimiento de contraseña en español
├── config/
│   └── cors.php             # Configuración de CORS para permitir peticiones desde Vercel
└── lang/es/                 # Traducciones al español de mensajes de validación y autenticación
```

---

### 3.4. Funcionalidades a reseñar

#### Centralización de endpoints (frontend)
Todos los endpoints se definen en `src/utils/endpoints.js` usando una `API_BASE_URL` que se lee de la variable de entorno `VITE_API_BASE_URL`. En local apunta a `http://localhost:8000/api` y en Vercel apunta a `/api` (que el proxy de Vercel redirige a EC2). De esta forma ningún componente tiene URLs hardcodeadas.

#### Persistencia del token (frontend)
El token de autenticación devuelto por Laravel Sanctum al hacer login se almacena en `localStorage`. Al iniciar la aplicación, `AuthContext` recupera el token del `localStorage` para restaurar la sesión automáticamente sin necesidad de volver a hacer login.

#### Fetching data con Axios y async/await (frontend + backend)
Todas las peticiones HTTP se realizan con Axios mediante `async/await`. La instancia de Axios tiene configurado un interceptor de petición que añade automáticamente la cabecera `Authorization: Bearer <token>` en todas las llamadas cuando el usuario está autenticado. Las rutas públicas (psicólogos, servicios, disponibilidad) no requieren token y funcionan sin él; las rutas privadas (citas, perfil, panel admin) están protegidas en el backend con el middleware `auth:sanctum`.

#### Autenticación con Laravel Sanctum (frontend + backend)
En el backend se usa Laravel Sanctum para emitir tokens de API. Al hacer login, el backend crea un token personal y lo devuelve en la respuesta. El frontend lo almacena en `localStorage` y lo envía en la cabecera de cada petición privada. Al hacer logout, el backend invalida el token en base de datos.

#### Gestión de imágenes de psicólogos (backend)
Las fotos de los psicólogos se almacenan directamente en el servidor EC2, en el directorio `public/fotos/`. La ruta relativa (`/fotos/nombre_archivo.webp`) se guarda en la base de datos. Dado que el frontend está en Vercel (HTTPS) y el backend en EC2 (HTTP), las imágenes dinámicas también se sirven a través del proxy de Vercel (`/fotos/*` → EC2), evitando el bloqueo de mixed content del navegador.

#### Subida de fotos en base64 (frontend + backend)
El proxy de Vercel no es compatible con peticiones `multipart/form-data`. Para solucionar esto, cuando el administrador sube una foto de un psicólogo, el frontend convierte el fichero a base64 con `FileReader` y lo envía como campo JSON (`foto_base64`). El backend decodifica el base64, valida el formato (solo PNG y WebP, máximo 2 MB) y guarda el fichero en disco.

#### Recuperación de contraseña por email (frontend + backend)
El flujo completo de recuperación de contraseña funciona de extremo a extremo. El frontend envía el email al endpoint `/api/forgot-password`. Laravel genera un token, lo almacena en `password_reset_tokens` y envía un correo con un enlace que apunta al frontend de Vercel (`/reset-password?token=...&email=...`). El usuario accede a esa URL en React, introduce la nueva contraseña y el frontend llama a `/api/reset-password` para validar el token y actualizar la contraseña.

#### Proxy Vercel para mixed content (despliegue)
La aplicación frontend se sirve desde Vercel sobre HTTPS, pero el backend Laravel está en EC2 sobre HTTP. Los navegadores bloquean peticiones HTTP desde páginas HTTPS (mixed content). La solución implementada es configurar `vercel.json` con reglas de rewrite que actúan como proxy: `/api/*` y `/fotos/*` se redirigen internamente a EC2, por lo que el navegador solo ve peticiones HTTPS a Vercel.

---

## 5. Mejoras y propuestas para versiones futuras

- **Notificaciones por email al reservar una cita**: enviar un correo de confirmación al cliente con los detalles de la cita reservada.
- **Panel de estadísticas para el administrador**: gráficas con el número de citas por psicólogo, por servicio o por mes.
- **Sistema de valoraciones**: permitir a los clientes puntuar y dejar reseñas sobre los psicólogos tras cada cita.
- **Chat en tiempo real**: implementar un sistema de mensajería entre cliente y psicólogo usando WebSockets (Laravel Broadcasting + Pusher).
- **Subida de imágenes a la nube**: migrar el almacenamiento de fotos de psicólogos a un servicio cloud como AWS S3 para mayor escalabilidad y no depender del almacenamiento local del servidor.
- **App móvil**: desarrollar una versión móvil con React Native reutilizando la API de Laravel existente.
- **Cancelación de citas con aviso previo**: permitir al cliente cancelar una cita con un límite de tiempo mínimo y notificar al psicólogo por email.

---

## 6. Bibliografía

- [Documentación de Laravel](https://laravel.com/docs)
- [Documentación de Laravel Sanctum](https://laravel.com/docs/sanctum)
- [Documentación de React](https://react.dev)
- [Documentación de React Router](https://reactrouter.com/en/main)
- [Documentación de Axios](https://axios-http.com/docs/intro)
- [Documentación de Vite](https://vitejs.dev/guide)
- [Documentación de Vercel](https://vercel.com/docs)
- [Documentación de AWS EC2](https://docs.aws.amazon.com/ec2)
- [Documentación de Docker](https://docs.docker.com)
- [Documentación de Nginx](https://nginx.org/en/docs)
