# Guía de Mock API - Sistema de Lotería

## ⚠️ IMPORTANTE: Datos en Memoria

Este proyecto actualmente **NO** utiliza una API real. Todos los datos se almacenan en la **memoria del navegador** y se perderán al recargar la página.

## 🔧 Funcionamiento

### Base de Datos Mock (`src/services/api.js`)

El archivo `api.js` simula un backend completo con:

- **mockDB.users**: Array de usuarios registrados y activados
- **mockDB.pendingActivations**: Map de activaciones pendientes

### Servicios Disponibles

#### 1. **Registro de Usuario** (`/auth/register`)

```javascript
// Campos requeridos
{
  email: string,
  password: string,
  firstName: string,
  secondName: string (opcional),
  lastName: string,
  secondLastName: string (opcional),
  dni: string (13 dígitos),
  phone: string (8 dígitos),
  birthDate: string (YYYY-MM-DD)
}
```

**Flujo:**
1. Usuario completa formulario de registro
2. Sistema valida que email y DNI no existan
3. Genera un PIN de 6 dígitos
4. **Muestra el PIN en la consola del navegador** (F12)
5. Guarda datos en `pendingActivations`

**Validaciones:**
- Email único
- DNI único (13 dígitos)
- Edad mínima: 18 años
- Contraseña mínima: 8 caracteres

#### 2. **Activación de Cuenta** (`/auth/confirmarCuenta`)

```javascript
// Datos requeridos
{
  email: string,
  pin: string (6 dígitos)
}
```

**Flujo:**
1. Usuario ingresa email y PIN
2. Sistema verifica que el PIN coincida
3. Mueve usuario de `pendingActivations` a `users`
4. Marca cuenta como activa

#### 3. **Login** (`/auth/login`)

```javascript
// Credenciales
{
  useremail: string,
  userpswd: string
}
```

**Flujo:**
1. Usuario ingresa email y contraseña
2. Sistema verifica credenciales y que cuenta esté activa
3. Genera token mock (Base64)
4. Devuelve token y datos del usuario
5. Guarda en localStorage y AuthContext

## 📋 Cómo Usar el Sistema

### Paso 1: Registrarse

1. Ir a `/register`
2. Completar el formulario
3. Hacer clic en "Crear cuenta"
4. **ABRIR LA CONSOLA DEL NAVEGADOR (F12)**
5. Buscar mensaje: `[MOCK API] Activation PIN for email@example.com: 123456`
6. **Copiar el PIN de 6 dígitos**

### Paso 2: Activar Cuenta

1. Ir a `/confirmarCuenta`
2. Ingresar el email usado en el registro
3. Ingresar el PIN copiado de la consola
4. Hacer clic en "Confirmar Cuenta"
5. Serás redirigido al login

### Paso 3: Iniciar Sesión

1. Ir a `/login`
2. Ingresar email y contraseña
3. Hacer clic en "Iniciar sesión"
4. Serás redirigido al Dashboard

### Paso 4: Ver Dashboard

1. Dashboard muestra información del usuario logueado
2. Botón de "Cerrar Sesión" disponible

## 🐛 Debugging

### Ver Base de Datos Mock

Abrir consola del navegador y ejecutar:

```javascript
// Ver todos los usuarios registrados
getMockDB()
```

Esto mostrará:
```javascript
{
  users: [...],           // Usuarios activados
  pendingActivations: Map // Activaciones pendientes
}
```

### Ejemplo de Usuario en Memoria

```javascript
{
  id: 1,
  email: "juan@example.com",
  password: "12345678",
  firstName: "Juan",
  secondName: "Carlos",
  lastName: "Pérez",
  secondLastName: "García",
  dni: "0801199012345",
  phone: "98765432",
  birthDate: "2000-01-15",
  isActive: true,
  createdAt: 1234567890
}
```

## ⚙️ Limitaciones

1. **Datos se pierden al recargar**: La base de datos está en memoria RAM
2. **No hay persistencia**: No se guarda en localStorage ni IndexedDB
3. **PIN en consola**: El PIN se muestra en consola (no es seguro)
4. **Sin validación de email real**: No se envían correos
5. **Token simple**: El token es solo Base64, no JWT real

## 🔄 Migración a API Real

Cuando tengas el backend listo:

1. Reemplazar `src/services/api.js`:
```javascript
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001/api",
});

export default api;
```

2. Los servicios en `authService.js` ya están preparados
3. No necesitas cambiar las páginas ni componentes
4. El AuthContext funcionará igual

## 📝 Notas

- El delay de 800ms simula latencia de red
- Los errores se lanzan en el mismo formato que una API real
- Puedes crear múltiples usuarios para probar
- Los tokens mock expiran en 24 horas (simulado)
