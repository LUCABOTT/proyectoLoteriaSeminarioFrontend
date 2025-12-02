# Componentes UI y Layouts

Este documento describe los componentes UI reutilizables y layouts creados para mantener un diseño uniforme en toda la aplicación.

## Componentes UI

Todos los componentes UI se encuentran en `src/components/ui/` y se pueden importar desde el índice:

```javascript
import { Button, Input, Card, Alert, Badge, Spinner, Modal } from "../components/ui";
```

### Button

Componente de botón reutilizable con diferentes variantes y tamaños.

**Props:**

- `variant`: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'google' (default: 'primary')
- `size`: 'sm' | 'md' | 'lg' | 'xl' (default: 'md')
- `isLoading`: boolean (default: false) - Muestra un spinner de carga
- `disabled`: boolean (default: false)
- `className`: string - Clases CSS adicionales
- Acepta todas las props nativas de `<button>`

**Ejemplos:**

```jsx
<Button variant="primary" size="lg">Comprar ahora</Button>
<Button variant="secondary" onClick={handleClick}>Cancelar</Button>
<Button variant="danger" isLoading={loading}>Eliminar</Button>
```

### Input

Componente de campo de entrada con label, error y helper text.

**Props:**

- `label`: string - Etiqueta del campo
- `error`: string - Mensaje de error
- `helperText`: string - Texto de ayuda
- `containerClassName`: string - Clases para el contenedor
- `className`: string - Clases adicionales para el input
- Acepta todas las props nativas de `<input>`

**Ejemplo:**

```jsx
<Input
  id="email"
  type="email"
  label="Correo electrónico"
  placeholder="usuario@correo.com"
  required
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={emailError}
/>
```

### Card

Componentes de tarjeta para agrupar contenido.

**Componentes:**

- `Card` - Contenedor principal
- `CardHeader` - Encabezado de la tarjeta
- `CardBody` - Cuerpo de la tarjeta
- `CardFooter` - Pie de la tarjeta

**Props de Card:**

- `hover`: boolean (default: false) - Efecto hover
- `className`: string - Clases adicionales

**Ejemplo:**

```jsx
<Card hover className="p-6">
  <CardHeader>
    <h3>Título</h3>
  </CardHeader>
  <CardBody>Contenido de la tarjeta</CardBody>
  <CardFooter>
    <Button>Acción</Button>
  </CardFooter>
</Card>
```

### Alert

Componente para mostrar mensajes de alerta.

**Props:**

- `variant`: 'success' | 'error' | 'warning' | 'info' (default: 'info')
- `className`: string - Clases adicionales

**Ejemplo:**

```jsx
<Alert variant="success">¡Operación exitosa!</Alert>
<Alert variant="error">Ocurrió un error</Alert>
```

### Badge

Componente para etiquetas y badges.

**Props:**

- `variant`: 'default' | 'primary' | 'success' | 'danger' | 'warning' | 'info' (default: 'default')
- `className`: string - Clases adicionales

**Ejemplo:**

```jsx
<Badge variant="primary">Activo</Badge>
<Badge variant="success">Completado</Badge>
```

### Spinner

Componente de indicador de carga.

**Props:**

- `size`: 'sm' | 'md' | 'lg' | 'xl' (default: 'md')
- `center`: boolean (default: false) - Centra el spinner con padding
- `className`: string - Clases adicionales

**Ejemplo:**

```jsx
<Spinner center size="xl" />
<Spinner size="sm" />
```

### Modal

Componentes de modal para diálogos.

**Componentes:**

- `Modal` - Contenedor principal
- `ModalHeader` - Encabezado con botón de cerrar
- `ModalBody` - Cuerpo del modal
- `ModalFooter` - Pie del modal

**Props de Modal:**

- `isOpen`: boolean - Controla la visibilidad
- `onClose`: function - Función al cerrar
- `size`: 'sm' | 'md' | 'lg' | 'xl' (default: 'md')
- `className`: string - Clases adicionales

**Ejemplo:**

```jsx
<Modal isOpen={showModal} onClose={() => setShowModal(false)} size="lg">
  <ModalHeader onClose={() => setShowModal(false)}>
    <h2>Título del Modal</h2>
  </ModalHeader>
  <ModalBody>Contenido del modal</ModalBody>
  <ModalFooter>
    <Button onClick={() => setShowModal(false)}>Cerrar</Button>
  </ModalFooter>
</Modal>
```

## Layouts

Los layouts se encuentran en `src/layouts/`.

### AuthLayout

Layout para páginas de autenticación (Login, Register).

**Props:**

- `children`: ReactNode - Contenido principal
- `side`: 'left' | 'right' (default: 'left') - Posición del contenido decorativo
- `title`: string - Título de la página
- `subtitle`: string - Subtítulo de la página
- `sideContent`: ReactNode - Contenido del lado decorativo

**Ejemplo:**

```jsx
<AuthLayout
  side="right"
  title="Bienvenido de vuelta"
  subtitle="Ingresa tus credenciales"
  sideContent={
    <AuthSideContent
      icon={Ticket}
      title="Tu suerte te espera"
      description="Accede a tu cuenta y participa en sorteos"
    />
  }
>
  {/* Formulario de login */}
</AuthLayout>
```

### AuthSideContent

Componente auxiliar para el contenido decorativo del AuthLayout.

**Props:**

- `icon`: LucideIcon - Ícono a mostrar
- `title`: string - Título
- `description`: string - Descripción
- `stats`: Array<{value: string, label: string}> - Estadísticas a mostrar

### MainLayout

Layout para páginas autenticadas con navbar y footer.

**Props:**

- `children`: ReactNode - Contenido principal
- `showFooter`: boolean (default: true) - Mostrar footer

**Ejemplo:**

```jsx
<MainLayout showFooter={false}>{/* Contenido de la página */}</MainLayout>
```

## Colores del Sistema

El sistema utiliza una paleta de colores consistente:

### Principales

- **Amber (Primario)**: `amber-400` - Botones primarios, acentos
- **Zinc (Fondo)**: `zinc-950`, `zinc-900`, `zinc-800` - Fondos y superficies

### Semánticos

- **Success**: `green-400/500` - Mensajes de éxito
- **Error**: `red-400/500` - Mensajes de error
- **Warning**: `yellow-400/500` - Advertencias
- **Info**: `blue-400/500` - Información

### Texto

- **Principal**: `zinc-100` - Texto principal
- **Secundario**: `zinc-300/400` - Texto secundario
- **Deshabilitado**: `zinc-500/600` - Texto deshabilitado

## Mejores Prácticas

1. **Consistencia**: Usa siempre los componentes UI en lugar de crear elementos HTML directamente.

2. **Variantes**: Utiliza las variantes apropiadas para cada contexto:

   - `primary` para acciones principales
   - `secondary` para acciones secundarias
   - `danger` para acciones destructivas
   - `outline` para acciones terciarias

3. **Tamaños**: Mantén consistencia en los tamaños:

   - `sm` para elementos compactos
   - `md` para uso general
   - `lg` para elementos destacados
   - `xl` para CTAs principales

4. **Accesibilidad**:

   - Siempre proporciona labels en los inputs
   - Usa mensajes de error descriptivos
   - Mantén contraste adecuado

5. **Responsive**: Los componentes ya son responsive, pero asegúrate de usarlos dentro de contenedores apropiados.

## Migración de Código Existente

Si tienes código que usa elementos HTML directos, migra a los componentes UI:

**Antes:**

```jsx
<button className="px-4 py-3 bg-amber-400 text-zinc-950 hover:bg-amber-300">Click me</button>
```

**Después:**

```jsx
<Button variant="primary" size="md">
  Click me
</Button>
```

**Antes:**

```jsx
<div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3">Error message</div>
```

**Después:**

```jsx
<Alert variant="error">Error message</Alert>
```
