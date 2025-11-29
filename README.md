# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

FRONTEND (React)
/src
│── /components
│── /context
│── /hooks
│── /pages
│── /services
│── /styles
│── App.jsx
│── main.jsx

📁 /components

Componentes reutilizables de UI:

Navbar.jsx → Barra de navegación

PublicNavbar.jsx → Navbar pública (sin sesión)

PrivateRoute.jsx → Protege rutas que requieren autenticación

Componentes pequeños reutilizables

Mantienen las páginas limpias y organizadas.

📁 /context

Manejo global del estado del usuario:

AuthContext.jsx

Guarda el usuario logueado

Guarda y valida el token

Permite cerrar sesión desde cualquier parte

Centraliza la autenticación del frontend

📁 /hooks

Aquí irán custom hooks para lógica reutilizable como:

useAuth()

useFetch()

useForm()

(Se crean solo si los necesitas.)

📁 /pages

Pantallas completas del sistema:

Home.jsx

Login.jsx

Register.jsx

ActivarCuenta.jsx

ReactivarCuenta.jsx

Dashboard.jsx (ruta privada)

Cada página representa una sección completa del sitio.

📁 /services

Aquí están las funciones que consumen el backend:

api.js → Configuración base de Axios

authService.js → login, registro, activación, etc.

Ejemplo:

axios.post("/auth/login", data);


Mantiene separada la lógica de API.

📁 /styles

Carpeta donde se coloca todo el CSS:

Navbar.css

PublicNavbar.css

Forms.css

Global.css

Otros estilos personalizados

Organiza el diseño y evita CSS dentro de componentes.