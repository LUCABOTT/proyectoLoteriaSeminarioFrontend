# Guía de Mock API - Sistema de Lotería

## ⚠️ IMPORTANTE: Datos en Memoria

Este proyecto actualmente **NO** utiliza una API real. Todos los datos se almacenan en la **memoria del navegador** y se perderán al recargar la página.

## 🔧 Funcionamiento

### Base de Datos Mock

**`src/services/api.js`** - Autenticación
- **mockDB.users**: Array de usuarios registrados y activados
- **mockDB.pendingActivations**: Map de activaciones pendientes

**`src/services/lotteryApi.js`** - Sistema de Loterías
- **mockLotteryDB.lotteries**: Array de loterías disponibles
- **mockLotteryDB.purchases**: Array de tickets comprados
- **mockLotteryDB.results**: Array de resultados de sorteos

### Loterías Disponibles

#### 1. **La Diaria**
- **Tipo:** Sorteo diario
- **Premio:** L. 250,000
- **Precio del ticket:** L. 20
- **Formato:** 4 dígitos (0-9)
- **Hora de sorteo:** 18:00
- **Frecuencia:** Todos los días

#### 2. **Pega 3**
- **Tipo:** Sorteo semanal
- **Premio:** L. 500,000
- **Precio del ticket:** L. 10
- **Formato:** 3 dígitos (0-9)
- **Hora de sorteo:** 20:00
- **Frecuencia:** Miércoles y Sábados

#### 3. **Loto HN**
- **Tipo:** Sorteo semanal
- **Premio:** L. 3,000,000
- **Precio del ticket:** L. 50
- **Formato:** 6 números (1-45)
- **Hora de sorteo:** 21:00
- **Frecuencia:** Domingos

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
4. **Serás redirigido automáticamente a /sorteos**

### Paso 4: Ver Sorteos Disponibles

1. La página principal (/) cuando estés autenticado muestra `/sorteos`
2. Verás las 3 loterías disponibles:
   - **La Diaria** - Sorteo diario a las 18:00
   - **Pega 3** - Miércoles y Sábados a las 20:00
   - **Loto HN** - Domingos a las 21:00
3. Cada tarjeta muestra:
   - Premio mayor
   - Formato de números
   - Contador regresivo al próximo sorteo
   - Precio del ticket
   - Botón de compra

### Paso 5: Comprar Tickets (Próximamente)

La funcionalidad de compra está en desarrollo. Por ahora:
- Haz clic en "Comprar"
- Verás un alert confirmando la selección
- Los datos se mostrarán en la consola

## 🐛 Debugging

### Ver Base de Datos Mock

Abrir consola del navegador y ejecutar:

```javascript
// Ver todos los usuarios registrados
getMockDB()

// Ver todas las loterías y tickets
getMockLotteryDB()
```

Esto mostrará:

**Autenticación:**
```javascript
{
  users: [...],           // Usuarios activados
  pendingActivations: Map // Activaciones pendientes
}
```

**Loterías:**
```javascript
{
  lotteries: [            // Loterías disponibles
    {
      id: "la-diaria-001",
      name: "La Diaria",
      prize: 250000,
      ticketPrice: 20,
      nextDraw: "2024-12-02T18:00:00Z"
    },
    ...
  ],
  purchases: [            // Tickets comprados
    {
      userId: "user@example.com",
      lotteryId: "la-diaria-001",
      numbers: [1, 2, 3, 4],
      ticketNumber: "TK123456789"
    },
    ...
  ],
  results: []            // Resultados de sorteos
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
