# Ejemplos de Uso - Componentes UI

Este archivo contiene ejemplos prácticos de cómo usar los componentes UI en diferentes escenarios.

## Ejemplos de Botones

### Botones Primarios
```jsx
import { Button } from '../components/ui';

// Botón de acción principal
<Button variant="primary" size="lg" onClick={handleSubmit}>
  Confirmar compra
</Button>

// Botón con estado de carga
<Button variant="primary" isLoading={isSubmitting}>
  {isSubmitting ? 'Procesando...' : 'Enviar'}
</Button>

// Botón deshabilitado
<Button variant="primary" disabled>
  No disponible
</Button>
```

### Botones Secundarios y Outline
```jsx
// Botón secundario
<Button variant="secondary" onClick={handleCancel}>
  Cancelar
</Button>

// Botón outline para acciones terciarias
<Button variant="outline" onClick={() => window.location.href = '/help'}>
  Ayuda
</Button>
```

### Botones Especiales
```jsx
// Botón de peligro
<Button variant="danger" onClick={handleDelete}>
  Eliminar cuenta
</Button>

// Botón Google
<Button variant="google" className="w-full flex items-center justify-center gap-2">
  <GoogleIcon />
  Continuar con Google
</Button>

// Botón ghost (sutil)
<Button variant="ghost" onClick={handleDismiss}>
  Cerrar
</Button>
```

## Ejemplos de Inputs

### Input Básico
```jsx
import { Input } from '../components/ui';

<Input
  id="username"
  type="text"
  label="Nombre de usuario"
  placeholder="Ingresa tu usuario"
  value={username}
  onChange={(e) => setUsername(e.target.value)}
  required
/>
```

### Input con Error
```jsx
<Input
  id="email"
  type="email"
  label="Correo electrónico"
  placeholder="usuario@ejemplo.com"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={emailError}
  required
/>
```

### Input con Helper Text
```jsx
<Input
  id="phone"
  type="tel"
  label="Teléfono"
  placeholder="0000-0000"
  value={phone}
  onChange={(e) => setPhone(e.target.value)}
  helperText="Formato: 8 dígitos sin espacios"
/>
```

## Ejemplos de Cards

### Card Simple
```jsx
import { Card, CardBody } from '../components/ui';

<Card className="p-6">
  <h3 className="text-xl font-bold mb-2">Título</h3>
  <p className="text-zinc-400">Contenido de la tarjeta</p>
</Card>
```

### Card con Header y Footer
```jsx
import { Card, CardHeader, CardBody, CardFooter, Button } from '../components/ui';

<Card>
  <CardHeader>
    <h2 className="text-2xl font-bold">Confirmación</h2>
  </CardHeader>
  <CardBody>
    <p>¿Estás seguro de que deseas continuar?</p>
  </CardBody>
  <CardFooter className="flex gap-4">
    <Button variant="secondary" className="flex-1">Cancelar</Button>
    <Button variant="primary" className="flex-1">Confirmar</Button>
  </CardFooter>
</Card>
```

### Card con Hover
```jsx
<Card hover className="p-6 cursor-pointer" onClick={handleClick}>
  <div className="flex items-center gap-4">
    <Icon className="w-12 h-12 text-amber-400" />
    <div>
      <h3 className="font-bold">Elemento clickeable</h3>
      <p className="text-sm text-zinc-400">Click para ver más</p>
    </div>
  </div>
</Card>
```

## Ejemplos de Alerts

### Diferentes Variantes
```jsx
import { Alert } from '../components/ui';

// Success
<Alert variant="success">
  ¡Operación completada exitosamente!
</Alert>

// Error
<Alert variant="error">
  Error al procesar la solicitud. Intenta nuevamente.
</Alert>

// Warning
<Alert variant="warning">
  Tu sesión expirará en 5 minutos.
</Alert>

// Info
<Alert variant="info">
  Nuevas funcionalidades disponibles.
</Alert>
```

### Alert con Contenido Complejo
```jsx
<Alert variant="success">
  <p className="font-semibold mb-2">¡Ticket comprado!</p>
  <p className="text-sm">Número: <strong>12345</strong></p>
  <p className="text-sm">Números: 1 - 5 - 12 - 23</p>
</Alert>
```

## Ejemplos de Badges

### Badges de Estado
```jsx
import { Badge } from '../components/ui';

<Badge variant="primary">Activo</Badge>
<Badge variant="success">Completado</Badge>
<Badge variant="danger">Cancelado</Badge>
<Badge variant="warning">Pendiente</Badge>
<Badge variant="info">En proceso</Badge>
<Badge variant="default">Nuevo</Badge>
```

### Badge en Componente
```jsx
<div className="flex items-center justify-between">
  <h3>Sorteo La Diaria</h3>
  <Badge variant="warning">Cierra pronto</Badge>
</div>
```

## Ejemplos de Spinner

### Spinner de Carga
```jsx
import { Spinner } from '../components/ui';

// Centrado con padding
<Spinner center size="xl" />

// Inline pequeño
<Spinner size="sm" />

// En botón (no necesario, usa isLoading en Button)
<div className="flex items-center gap-2">
  <Spinner size="sm" />
  <span>Cargando...</span>
</div>
```

### Spinner en Contenido
```jsx
{loading ? (
  <Spinner center size="lg" />
) : (
  <div>Contenido cargado</div>
)}
```

## Ejemplos de Modal

### Modal Básico
```jsx
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from '../components/ui';

const [showModal, setShowModal] = useState(false);

<Modal isOpen={showModal} onClose={() => setShowModal(false)}>
  <ModalHeader onClose={() => setShowModal(false)}>
    <h2 className="text-2xl font-bold">Título del Modal</h2>
  </ModalHeader>
  <ModalBody>
    <p>Contenido del modal</p>
  </ModalBody>
  <ModalFooter>
    <Button variant="secondary" onClick={() => setShowModal(false)}>
      Cancelar
    </Button>
    <Button variant="primary" onClick={handleConfirm}>
      Confirmar
    </Button>
  </ModalFooter>
</Modal>
```

### Modal de Confirmación
```jsx
<Modal isOpen={showConfirm} onClose={() => setShowConfirm(false)} size="sm">
  <ModalHeader onClose={() => setShowConfirm(false)}>
    <h2 className="text-xl font-bold">¿Estás seguro?</h2>
  </ModalHeader>
  <ModalBody>
    <p className="text-zinc-400">
      Esta acción no se puede deshacer.
    </p>
  </ModalBody>
  <ModalFooter className="flex gap-4">
    <Button variant="secondary" className="flex-1" onClick={() => setShowConfirm(false)}>
      Cancelar
    </Button>
    <Button variant="danger" className="flex-1" onClick={handleDelete}>
      Eliminar
    </Button>
  </ModalFooter>
</Modal>
```

### Modal Grande con Formulario
```jsx
<Modal isOpen={showForm} onClose={() => setShowForm(false)} size="lg">
  <ModalHeader onClose={() => setShowForm(false)}>
    <h2 className="text-2xl font-bold">Editar Perfil</h2>
  </ModalHeader>
  <ModalBody>
    <form className="space-y-4">
      <Input
        label="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        label="Teléfono"
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
    </form>
  </ModalBody>
  <ModalFooter className="flex gap-4">
    <Button variant="secondary" onClick={() => setShowForm(false)}>
      Cancelar
    </Button>
    <Button variant="primary" onClick={handleSave}>
      Guardar cambios
    </Button>
  </ModalFooter>
</Modal>
```

## Combinaciones Comunes

### Formulario de Login
```jsx
import { Input, Button, Alert } from '../components/ui';

<form onSubmit={handleSubmit} className="space-y-6">
  {error && <Alert variant="error">{error}</Alert>}
  
  <Input
    id="email"
    type="email"
    label="Correo electrónico"
    placeholder="usuario@correo.com"
    required
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />
  
  <Input
    id="password"
    type="password"
    label="Contraseña"
    placeholder="••••••••"
    required
    value={password}
    onChange={(e) => setPassword(e.target.value)}
  />
  
  <Button 
    type="submit" 
    variant="primary" 
    className="w-full"
    isLoading={isLoading}
  >
    {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
  </Button>
</form>
```

### Lista de Cards Clickeables
```jsx
import { Card, Badge } from '../components/ui';

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map(item => (
    <Card key={item.id} hover className="p-6 cursor-pointer" onClick={() => handleSelect(item)}>
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-bold">{item.title}</h3>
        <Badge variant={item.status === 'active' ? 'success' : 'default'}>
          {item.status}
        </Badge>
      </div>
      <p className="text-zinc-400 text-sm">{item.description}</p>
    </Card>
  ))}
</div>
```

### Panel de Estadísticas
```jsx
import { Card } from '../components/ui';

<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
  {stats.map((stat, index) => (
    <Card key={index} className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-${stat.color}-500/10 border border-${stat.color}-500/20 flex items-center justify-center`}>
          <stat.icon className={`w-6 h-6 text-${stat.color}-400`} />
        </div>
      </div>
      <div className="text-3xl font-bold text-zinc-100 mb-1">{stat.value}</div>
      <div className="text-sm text-zinc-500">{stat.label}</div>
    </Card>
  ))}
</div>
```

## Tips y Mejores Prácticas

1. **Usa className para personalización adicional**: Los componentes aceptan `className` para agregar estilos específicos.

2. **Combina variantes apropiadamente**: 
   - Formularios: `primary` para submit, `secondary` para cancelar
   - Acciones destructivas: `danger`
   - OAuth: `google`

3. **Mantén consistencia en tamaños**:
   - Formularios: `md`
   - CTAs principales: `lg` o `xl`
   - Botones en espacios reducidos: `sm`

4. **Usa Alerts de forma temporal**: Para mensajes importantes que requieren atención.

5. **Cards para agrupar contenido relacionado**: Mantén el contenido organizado visualmente.

6. **Spinners durante operaciones asíncronas**: Siempre muestra feedback de carga al usuario.

7. **Modals para acciones importantes**: Úsalos para confirmaciones y formularios que requieren atención completa.
