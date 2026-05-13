<x-mail::message>
# Nuevo mensaje de contacto

Has recibido un mensaje desde el formulario de contacto de **Psicología Vélez**.

---

**Nombre:** {{ $nombreRemitente }}
**Email:** {{ $emailRemitente }}
**Asunto:** {{ $asunto }}

**Mensaje:**

{{ $mensaje }}

---

*Puedes responder directamente a este correo para contactar con {{ $nombreRemitente }}.*

Psicología Vélez
</x-mail::message>
