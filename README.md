# Psicología Vélez

## Temática

Aplicación web para la gestión de citas de una clínica de psicología. Permite a los clientes consultar los psicólogos y servicios disponibles, reservar citas y gestionar su perfil. El administrador dispone de un panel completo para gestionar psicólogos, servicios, usuarios y citas.

## Objetivos

- Ofrecer a los clientes una plataforma donde puedan ver los psicólogos y servicios de la clínica, reservar citas y llevar un seguimiento de su historial.
- Proporcionar al administrador herramientas para gestionar de forma centralizada todos los recursos de la clínica.
- Implementar un sistema de autenticación seguro con recuperación de contraseña por correo electrónico.

## Funcionalidades

### Roles

| Rol | Descripción |
|---|---|
| **Admin** | Acceso completo: gestión de psicólogos, servicios, usuarios y citas de todos los clientes |
| **Cliente** | Puede consultar psicólogos y servicios, reservar citas, ver su historial y editar su perfil |

### Vistas

| Vista | Rol |
|---|---|
| Inicio | Pública |
| Nosotros | Pública |
| Psicólogos | Pública |
| Contacto | Pública |
| Login | Pública |
| Registro | Pública |
| Olvidar contraseña | Pública |
| Restablecer contraseña | Pública |
| Mis citas | Cliente / Admin |
| Agendar cita | Cliente / Admin |
| Perfil | Cliente / Admin |
| Panel de administración | Admin |

## Arquitectura / Tecnología

### Frontend

- **Enrutamiento:** React Router DOM 6
- **Peticiones HTTP:** Axios 1.7
- **Estilos:** CSS Modules
- **Prototipado:** Figma

### Backend

- **Framework:** Laravel 12
- **ORM:** Eloquent
- **Base de datos:** MySQL (AWS Aurora RDS)
- **Autenticación:** Laravel Sanctum (tokens de API)
- **Correo:** Symfony Mailer + SMTP Gmail (envío de enlaces de recuperación de contraseña)

### Despliegue

- **Local:** Docker (contenedores para frontend y backend)
- **Backend:** AWS EC2 — Nginx + PHP-FPM 8.4
- **Frontend:** Vercel — [psicologiavelez.vercel.app](https://psicologiavelez.vercel.app)
- **Base de datos:** AWS Aurora RDS (MySQL)

### Documentación

- [Esquema Entidad-Relación](https://github.com/aporcam0410/TFGdaw2/wiki/Modelo-Entidad-Relaci%C3%B3n)
- [Documentación técnica](https://github.com/aporcam0410/TFGdaw2/wiki/DOCUMENTACI%C3%93N-T%C3%89CNICA)
- [Bitácora del proyecto](https://github.com/aporcam0410/TFGdaw2/wiki/BIT%C3%81CORA-DEL-PROYECTO)

## Bibliografía

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

## Enlaces del proyecto

- [Diseño en Figma](https://www.figma.com/design/gj30SYNzh5wc5rFCnxZOe6/Proyecto-TFG-Psicologia?m=auto&t=yxRlc2NeaNwKi69n-6)
- [Vídeo demostrativo](#)
- [Web desplegada — psicologiavelez.vercel.app](https://psicologiavelez.vercel.app)

## Autor

Antonio Gabriel Portillo Campos
