# Documentación Completa — HelpDesk Angular

## Índice

1. [Descripción General](#1-descripción-general)
2. [Tecnologías y Dependencias](#2-tecnologías-y-dependencias)
3. [Arquitectura del Proyecto](#3-arquitectura-del-proyecto)
4. [Modelos de Datos](#4-modelos-de-datos)
5. [Sistema de Roles y Permisos](#5-sistema-de-roles-y-permisos)
6. [Módulo de Seguridad](#6-módulo-de-seguridad)
7. [Componente Raíz — App](#7-componente-raíz--app)
8. [Componentes de la UI](#8-componentes-de-la-ui)
9. [Persistencia de Datos](#9-persistencia-de-datos)
10. [Configuración de la Aplicación](#10-configuración-de-la-aplicación)
11. [Datos Iniciales (Mock Data)](#11-datos-iniciales-mock-data)
12. [Flujos de Usuario](#12-flujos-de-usuario)
13. [Cómo Ejecutar el Proyecto](#13-cómo-ejecutar-el-proyecto)
14. [Troubleshooting](#14-troubleshooting)
15. [Checklist de QA Manual](#15-checklist-de-qa-manual)
16. [Convenciones para Contribuir](#16-convenciones-para-contribuir)
17. [Limitaciones Actuales y Deuda Técnica](#17-limitaciones-actuales-y-deuda-técnica)
18. [FAQ Técnica](#18-faq-técnica)
19. [Glosario](#19-glosario)

---

## 1. Descripción General

**HelpDesk Angular** es una aplicación web de gestión de tickets de soporte técnico (help desk) desarrollada con Angular. Permite a usuarios, técnicos y administradores gestionar incidencias de TI dentro de una organización de forma organizada y segura.

### Funcionalidades principales

- Autenticación con sesión persistente y expiración automática
- Creación y seguimiento de tickets de soporte
- Sistema de estados, prioridades y categorías configurables
- Asignación de tickets a técnicos
- Comentarios y registro de actividad por ticket
- Panel de notificaciones en tiempo real (dentro de la sesión)
- Panel de configuración (solo para administradores)
- Visor de logs de seguridad
- Registro de nuevos usuarios y técnicos
- Medidas de seguridad OWASP Top 10

---

## 2. Tecnologías y Dependencias

| Paquete | Versión | Uso |
|---|---|---|
| Angular (`@angular/core`, `common`, `forms`, `router`) | ^21.2.0 | Framework principal |
| TypeScript | ~5.9.2 | Lenguaje |
| `lucide-angular` | ^1.0.0 | Iconografía SVG |
| `dompurify` | ^3.4.0 | Sanitización HTML (protección XSS) |
| `rxjs` | ~7.8.0 | Programación reactiva |
| Tailwind CSS (via `@tailwindcss/postcss`) | ^4.2.2 | Estilos utilitarios |
| `vitest` | ^4.0.8 | Testing |

### Scripts disponibles

```bash
npm start       # Inicia el servidor de desarrollo (ng serve)
npm run build   # Compila para producción (ng build)
npm test        # Corre los tests (ng test)
npm run watch   # Build en modo watch (desarrollo)
```

---

## 3. Arquitectura del Proyecto

```
src/
├── main.ts                        # Punto de entrada; bootstrapApplication
├── index.html                     # HTML base
├── styles.css                     # Estilos globales
└── app/
    ├── app.ts                     # Componente raíz (toda la lógica de negocio)
    ├── app.html                   # Template principal
    ├── app.css                    # Estilos del layout principal
    ├── app.config.ts              # Configuración de la aplicación (providers, íconos)
    ├── app.routes.ts              # Definición de rutas (actualmente vacía — SPA sin rutas)
    ├── app.models.ts              # Interfaces y tipos TypeScript
    ├── app.spec.ts                # Tests del componente raíz
    ├── mock-data.ts               # Datos iniciales precargados
    ├── security.ts                # Módulo de seguridad OWASP
    └── components/
        ├── login/                 # Formulario de inicio de sesión
        ├── register-modal/        # Registro de usuarios (rol: usuario)
        ├── new-ticket-modal/      # Crear nuevo ticket
        ├── ticket-card/           # Tarjeta resumen de ticket en lista
        ├── ticket-detail-modal/   # Modal con detalles completos del ticket
        ├── stat-card/             # Tarjeta de estadística del dashboard
        ├── notifications-panel/   # Panel lateral de notificaciones
        ├── configuration-panel/   # Panel de configuración (admin)
        ├── security-logs/         # Visor de logs de auditoría de seguridad
        ├── security-warning/      # Banner de advertencias de seguridad
        ├── create-technician-modal/ # Crear técnico (solo admin)
        └── create-admin-modal/    # Crear administrador (solo admin)
```

### Patrón de diseño

La aplicación sigue un patrón **"Smart Component + Dumb Components"**:

- `app.ts` es el único componente "inteligente" — contiene todo el estado de la aplicación usando **Angular Signals** y expone event handlers a los componentes hijos.
- Todos los demás componentes son "presentacionales" — reciben datos por `input()` y emiten eventos por `output()`.
- No se usa `NgModules`; todos los componentes son **standalone**.
- `ChangeDetectionStrategy.OnPush` está activado en todos los componentes para optimizar la detección de cambios.

---

## 4. Modelos de Datos

Definidos en [src/app/app.models.ts](src/app/app.models.ts).

### `TicketStatus`
```ts
type TicketStatus = "nuevo" | "en-proceso" | "resuelto" | "cerrado";
```

### `TicketPriority`
```ts
type TicketPriority = "baja" | "media" | "alta" | "critica";
```

### `TicketType`
```ts
interface TicketType {
  id: string;            // Identificador único (ej. "TKT-2847")
  title: string;         // Título corto del problema
  description: string;   // Descripción detallada
  status: TicketStatus;
  priority: TicketPriority;
  category: string;      // ID de categoría (ej. "hardware", "software")
  assignedTo?: string;   // Username del técnico asignado (opcional)
  createdBy: string;     // Username del creador
  createdAt: string;     // Timestamp de creación (formato legible)
  updatedAt: string;     // Timestamp de última modificación
  comments: TicketComment[];
  activities: TicketActivity[];
}
```

### `TicketComment`
```ts
interface TicketComment {
  id: string;
  author: string;      // Username del autor
  authorRole: string;  // Rol del autor
  message: string;     // Texto del comentario (sanitizado con DOMPurify)
  timestamp: string;
}
```

### `TicketActivity`
Registra automáticamente cada acción sobre el ticket.
```ts
interface TicketActivity {
  id: string;
  type: "created" | "status_changed" | "assigned" | "comment";
  author?: string;
  authorRole?: string;
  message?: string;
  oldValue?: string;   // Valor anterior (para cambios de estado/asignación)
  newValue?: string;   // Valor nuevo
  timestamp: string;
}
```

### `User`
```ts
interface User {
  username: string;
  name: string;
  role: "admin" | "tecnico" | "usuario";
  password?: string;           // Hash SHA-256 (64 hex chars) o texto plano en datos legacy
  sessionToken?: string;       // Token generado al autenticarse
  sessionTimestamp?: number;   // Timestamp Unix del inicio de sesión
}
```

### `Notification`
```ts
interface Notification {
  id: string;
  type: string;        // "assignment", "comment", "status_change", "ticket_created"
  title: string;
  message: string;
  ticketId?: string;   // Permite navegar al ticket desde la notificación
  timestamp: string;
  read: boolean;
}
```

---

## 5. Sistema de Roles y Permisos

### Roles disponibles

| Rol | Descripción |
|---|---|
| `admin` | Acceso total. Gestiona usuarios, configuración, ve todos los tickets y logs |
| `tecnico` | Ve sus tickets asignados y tickets sin asignar. Puede tomar tickets y cambiar su estado |
| `usuario` | Solo ve sus propios tickets abiertos (no cerrados). Puede crear tickets y agregar comentarios |

### Vistas por rol

| Vista | admin | tecnico | usuario |
|---|---|---|---|
| Dashboard con estadísticas | ✅ | ✅ | ❌ (va directo a tickets) |
| Lista de tickets | ✅ (todos) | ✅ (propios + sin asignar) | ✅ (solo los suyos, no cerrados) |
| Crear ticket | ✅ | ✅ | ✅ |
| Tomar ticket sin asignar | ✅ | ✅ | ❌ |
| Cambiar estado del ticket | ✅ | ✅ (solo si está asignado) | ❌ |
| Asignar ticket a técnico | ✅ | ❌ | ❌ |
| Agregar comentario | ✅ | ✅ | ✅ (si el ticket no está cerrado) |
| Panel de Configuración | ✅ | ❌ | ❌ |
| Crear técnico / admin | ✅ | ❌ | ❌ |
| Ver logs de seguridad | ✅ | ❌ | ❌ |

### Jerarquía de roles (`hasPermission`)

```
admin (3) > tecnico (2) > usuario (1)
```

---

## 6. Módulo de Seguridad

Archivo: [src/app/security.ts](src/app/security.ts)

Implementa las medidas de seguridad del estándar **OWASP Top 10 2025**. Todas sus funciones son puras o exportadas y pueden usarse desde cualquier componente.

### A01 — Broken Access Control

#### `hasPermission(userRole, requiredRole): boolean`
Verifica si un rol tiene nivel suficiente para realizar una acción.
```ts
hasPermission('admin', 'tecnico') // true
hasPermission('usuario', 'tecnico') // false
```

#### `generateSessionToken(): string`
Genera un token de 64 caracteres hexadecimales criptográficamente aleatorio usando `crypto.getRandomValues`.

---

### A02 — Cryptographic Failures

#### `hashPassword(password: string): Promise<string>`
Hashea una contraseña con **SHA-256** usando la Web Crypto API. Devuelve el hash como string hexadecimal de 64 caracteres.

#### `verifyPassword(password: string, hash: string): Promise<boolean>`
Compara una contraseña en texto plano contra un hash SHA-256.

> **Migración automática:** Si un usuario inicia sesión con contraseña en texto plano (datos iniciales), el sistema la hashea automáticamente y actualiza localStorage.

---

### A03 — Injection (XSS)

#### `sanitizeHTML(dirty: string): string`
Usa **DOMPurify** para limpiar HTML. Solo permite las etiquetas: `b`, `i`, `em`, `strong`, `a`, `p`, `br` y el atributo `href`. Se usa al guardar comentarios.

#### `sanitizeInput(input: string): string`
Limpia texto plano: elimina `<>`, bloquea `javascript:` URLs y event handlers (`onClick=`, etc.).

#### `validateUsername(username: string): boolean`
Permite solo `/^[a-z0-9_-]{3,20}$/` — sin espacios ni caracteres especiales.

#### `validateEmail(email: string): boolean`
Valida formato básico de email.

---

### A04 — Insecure Design

#### `validatePasswordStrength(password: string): { valid, score, issues }`
Valida la fortaleza de contraseñas según los criterios:

| Criterio | Puntos |
|---|---|
| 8+ caracteres | +1 |
| 12+ caracteres | +1 |
| Al menos una mayúscula | +1 |
| Al menos una minúscula | +1 |
| Al menos un número | +1 |
| Al menos un carácter especial | +1 |

Devuelve `valid: true` solo si no hay ningún issue.

---

### A05 — Security Misconfiguration

#### `validateSecurityConfig(): { valid, issues }`
Verificaciones al arrancar la app:
- La app debe correr en HTTPS fuera de `localhost`
- La Web Crypto API debe estar disponible
- `localStorage` debe estar accesible

---

### A07 — Identification and Authentication Failures

#### `checkRateLimit(identifier, maxAttempts, windowMs): { allowed, remainingAttempts, blockedUntil }`
Rate limiting en memoria para prevenir ataques de fuerza bruta en el login:
- Máximo **5 intentos** fallidos
- Ventana de **15 minutos** (900,000 ms)
- Al superar el límite, bloquea el usuario por 15 minutos adicionales

#### `resetRateLimit(identifier: string): void`
Limpia el contador de intentos (se llama al autenticarse con éxito).

#### `isSessionExpired(sessionTimestamp: number, maxAgeMs?: number): boolean`
Verifica si una sesión ha superado el tiempo máximo. Por defecto, **8 horas** (28,800,000 ms).

---

### A08 — Software and Data Integrity Failures

#### `generateChecksum(data: string): Promise<string>`
Genera un hash SHA-256 de un string de datos para verificar integridad.

#### `verifyIntegrity(data: string, expectedChecksum: string): Promise<boolean>`
Compara el checksum generado contra uno esperado.

---

### A09 — Security Logging and Monitoring

#### `logSecurityEvent(log: Omit<SecurityLog, 'timestamp'>): void`
Registra eventos de seguridad en `localStorage` bajo la clave `helpdesk_security_logs`.

- Mantiene un máximo de **1000 entradas** (las más antiguas se descartan)
- Los eventos `critical` y `error` también se imprimen en `console.error`
- Los eventos `warning` se imprimen en `console.warn`

**Interfaz `SecurityLog`:**
```ts
interface SecurityLog {
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'critical';
  event: string;
  user?: string;
  ip?: string;
  details?: Record<string, unknown>;
}
```

**Eventos registrados en la app:**

| Evento | Nivel | Descripción |
|---|---|---|
| `security_config_issues` | warning | Problemas de configuración al arrancar |
| `login_attempt_empty_fields` | warning | Intento de login con campos vacíos |
| `login_rate_limit_exceeded` | warning | Demasiados intentos de login |
| `login_failed_user_not_found` | warning | Usuario no existe |
| `login_failed_invalid_password` | warning | Contraseña incorrecta |
| `login_success` | info | Login exitoso |
| `password_migrated_to_hash` | info | Contraseña migrada a hash SHA-256 |
| `login_error` | error | Error inesperado durante el login |
| `register_username_invalid` | warning | Username inválido en registro |
| `register_username_taken` | warning | Username ya en uso |
| `register_password_weak` | warning | Contraseña débil en registro |
| `register_success` | info | Registro exitoso |
| `technician_created` | info | Técnico creado por admin |
| `admin_created` | info | Admin creado por admin |

---

## 7. Componente Raíz — App

Archivo: [src/app/app.ts](src/app/app.ts)

Este componente centraliza **todo el estado de la aplicación** y todos los **event handlers**. No usa servicios externos — toda la lógica reside aquí usando Angular Signals.

### Estado (signals)

| Signal | Tipo | Descripción |
|---|---|---|
| `currentUser` | `signal<User \| null>` | Usuario autenticado actualmente |
| `validUsers` | `signal<User[]>` | Lista completa de usuarios del sistema |
| `tickets` | `signal<TicketType[]>` | Lista completa de tickets |
| `categories` | `signal<CategoryItem[]>` | Categorías disponibles |
| `priorities` | `signal<PriorityItem[]>` | Prioridades disponibles |
| `notifications` | `signal<Notification[]>` | Notificaciones del usuario actual |
| `securityIssues` | `signal<string[]>` | Problemas de seguridad detectados |
| `activeView` | `signal<'dashboard' \| 'tickets' \| 'config' \| 'logs'>` | Vista activa |
| `isNewTicketOpen` | `signal<boolean>` | Controla modal de nuevo ticket |
| `isCreateTechnicianOpen` | `signal<boolean>` | Controla modal de crear técnico |
| `isCreateAdminOpen` | `signal<boolean>` | Controla modal de crear admin |
| `isRegisterOpen` | `signal<boolean>` | Controla modal de registro |
| `isNotificationsOpen` | `signal<boolean>` | Controla panel de notificaciones |
| `selectedTicket` | `signal<TicketType \| null>` | Ticket seleccionado para el modal de detalle |
| `searchQuery` | `signal<string>` | Texto de búsqueda en tickets |
| `statusFilter` | `signal<TicketStatus \| 'all'>` | Filtro por estado |
| `priorityFilter` | `signal<TicketPriority \| 'all'>` | Filtro por prioridad |
| `quickFilter` | `signal<'all' \| 'unassigned' \| 'urgent' \| 'mine'>` | Filtro rápido |

### Estado derivado (computed)

| Computed | Descripción |
|---|---|
| `visibleTickets` | Filtra tickets según el rol del usuario. `usuario` solo ve los suyos no cerrados; `tecnico` ve los suyos y los sin asignar; `admin` ve todos |
| `stats` | Calcula totales de tickets: `total`, `nuevo`, `enProceso`, `resuelto`, `criticos` |
| `filteredTickets` | Aplica búsqueda por texto, filtro de estado, prioridad y filtro rápido sobre `visibleTickets` |
| `unreadNotificationsCount` | Cuenta de notificaciones sin leer |
| `technicians` | Lista de usuarios con rol `tecnico` |

### Ciclo de vida — `ngOnInit`

1. Valida la configuración de seguridad (`validateSecurityConfig`)
2. Carga usuarios desde `localStorage` o inicializa con `initialUsers`
3. Carga categorías desde `localStorage` o usa las predeterminadas
4. Carga prioridades desde `localStorage` o usa las predeterminadas
5. Intenta restaurar la sesión guardada en `localStorage`:
   - Si la sesión expiró (>8 horas), la descarta y pide volver a iniciar sesión
   - Si la sesión es válida, restaura el usuario y sus notificaciones

### Handlers de autenticación

#### `submitLogin(credentials, loginComponent)`
Puente entre el componente `Login` y `handleLogin`. Pasa el resultado de vuelta al componente para mostrar el error inline.

#### `handleLogin(credentials): Promise<boolean>`
Flujo completo de autenticación:
1. Valida que los campos no estén vacíos
2. Sanitiza el username
3. Verifica rate limiting (máx. 5 intentos / 15 min)
4. Busca el usuario en `validUsers`
5. Verifica la contraseña (SHA-256 si tiene 64 chars, texto plano + migración automática si no)
6. Si el login falla, registra el evento de seguridad
7. Si tiene éxito: genera sesión, guarda en `localStorage`, carga notificaciones, redirige a la vista por defecto del rol

#### `handleLogout()`
Limpia todo el estado: usuario actual, notificaciones, tickets seleccionados, modales abiertos, filtros. Elimina `helpdesk_user` de `localStorage`.

### Handlers de usuarios

#### `handleCreateTechnician(data)` / `handleCreateAdmin(data)`
Solo ejecutables por `admin`. Flujo:
1. Sanitiza y valida username
2. Valida fortaleza de contraseña
3. Verifica que el username no esté en uso
4. Hashea la contraseña con SHA-256
5. Agrega el nuevo usuario a `validUsers` y persiste en `localStorage`
6. Registra el evento en los logs de seguridad

#### `handleRegister(data)`
Registro de usuarios con rol `usuario`. Mismo flujo de validación y hashing que la creación de técnicos/admins.

### Handlers de tickets

#### `handleCreateTicket(ticketData)`
Solo si hay usuario autenticado:
1. Sanitiza el título y la descripción
2. Genera un ID correlativo (`TKT-XXXX`)
3. Crea la actividad inicial de tipo `created`
4. Agrega el ticket al array de tickets
5. Envía notificaciones a todos los admins y técnicos

#### `handleTakeTicket(ticketId)`
Permite a un técnico o admin asignarse un ticket sin asignar:
1. Verifica que el ticket no esté ya asignado
2. Asigna el ticket al usuario actual
3. Crea la actividad de tipo `assigned`
4. Notifica al creador del ticket

#### `handleUpdateStatus(ticketId, newStatus)`
Cambia el estado de un ticket:
1. Verifica permisos (admin o técnico asignado)
2. Crea la actividad de tipo `status_changed` con el valor anterior y el nuevo
3. Actualiza el ticket en el array y en `selectedTicket` si está abierto el modal
4. Notifica al creador si es distinto al usuario que cambia el estado

#### `handleAddComment(ticketId, message)`
Agrega un comentario a un ticket (no cerrado):
1. Sanitiza el mensaje con `sanitizeHTML` (DOMPurify)
2. Crea la entidad `TicketComment` y la actividad `comment`
3. Actualiza el ticket en el array y en `selectedTicket`
4. Notifica a todos los involucrados (creador, técnico asignado) excepto al autor del comentario

#### `handleAssignTicket(ticketId, technicianUsername)`
Solo ejecutable por `admin`:
1. Actualiza el campo `assignedTo` del ticket
2. Crea la actividad de tipo `assigned`
3. Notifica al técnico asignado

### Handlers de configuración

#### `handleUpdateCategories(categories)` / `handleUpdatePriorities(priorities)`
Actualiza las categorías/prioridades en el signal y persiste en `localStorage` bajo `helpdesk_categories` / `helpdesk_priorities`.

### Sistema de notificaciones

#### `addNotification(username, notification)`
Agrega una notificación al usuario especificado en `localStorage` (bajo `helpdesk_notifications_<username>`). Si es el usuario actual, también actualiza el signal `notifications`.

#### `handleMarkNotificationAsRead(id)` / `handleMarkAllAsRead()`
Marca una o todas las notificaciones como leídas. Persiste el cambio en `localStorage`.

---

## 8. Componentes de la UI

Todos los componentes están en [src/app/components/](src/app/components/) y son standalone con `ChangeDetectionStrategy.OnPush`.

---

### `Login` — `app-login`

Archivo: [src/app/components/login/login.ts](src/app/components/login/login.ts)

Formulario de inicio de sesión.

**Outputs:**
- `onLogin` — emite `{ username, password }` al `app.ts` para procesarlo
- `onOpenRegister` — emite `void` para abrir el modal de registro

**Método público: `handleLoginResult(success: boolean)`**
Llamado desde `app.ts` después de procesar el login. Si `success` es `false`, muestra el error y limpia la contraseña.

---

### `RegisterModal` — `app-register-modal`

Archivo: [src/app/components/register-modal/register-modal.ts](src/app/components/register-modal/register-modal.ts)

Modal de auto-registro de usuarios finales (rol `usuario`).

**Inputs:** `isOpen`

**Outputs:** `onClose`, `onSubmit` (emite `{ username, password, name }`)

**Validación reactiva de contraseña** (computed):
- Mínimo 8 caracteres
- Al menos una mayúscula y una minúscula
- Al menos un número
- Al menos un carácter especial (`-_.@`)

El botón de envío se deshabilita hasta que todos los criterios se cumplan.

---

### `CreateTechnicianModal` — `app-create-technician-modal`

Archivo: [src/app/components/create-technician-modal/create-technician-modal.ts](src/app/components/create-technician-modal/create-technician-modal.ts)

Modal para que el administrador cree nuevos técnicos. Misma lógica de validación de contraseña que `RegisterModal`.

**Inputs:** `isOpen`

**Outputs:** `onClose`, `onSubmit`

---

### `CreateAdminModal` — `app-create-admin-modal`

Archivo: [src/app/components/create-admin-modal/create-admin-modal.ts](src/app/components/create-admin-modal/create-admin-modal.ts)

Idéntico a `CreateTechnicianModal` pero para crear administradores.

---

### `StatCard` — `app-stat-card`

Archivo: [src/app/components/stat-card/stat-card.ts](src/app/components/stat-card/stat-card.ts)

Tarjeta de estadística para el dashboard.

**Inputs:**
- `title` — Etiqueta de la estadística
- `value` — Valor numérico o texto
- `change` — Texto de variación opcional (ej. "+5%")
- `icon` — Nombre del ícono de Lucide
- `color` — Clase CSS de color de fondo (ej. `bg-primary`)

---

### `TicketCard` — `app-ticket-card`

Archivo: [src/app/components/ticket-card/ticket-card.ts](src/app/components/ticket-card/ticket-card.ts)

Tarjeta de resumen de un ticket en la lista.

**Inputs:**
- `ticket` (requerido) — El ticket a mostrar
- `currentUserRole` (requerido) — Rol del usuario actual
- `allUsers` — Lista de todos los usuarios (para resolver nombres)
- `categories` — Lista de categorías (para resolver etiquetas)

**Outputs:**
- `onClick` — El usuario hizo clic en la tarjeta (para abrir el detalle)
- `onTakeTicket` — El técnico/admin quiere tomar el ticket

**Métodos auxiliares:**
- `getPriorityColor(priority)` — Devuelve clases CSS de Tailwind para el badge de prioridad
- `getStatusColor(status)` — Devuelve clases CSS de Tailwind para el badge de estado
- `getTechnicianName(username?)` — Resuelve el nombre del técnico o devuelve "Sin asignar"
- `getCategoryLabel(categoryId)` — Resuelve la etiqueta de la categoría
- `showTakeButton()` — Devuelve `true` si el ticket no tiene asignado y el rol puede tomarlo

---

### `TicketDetailModal` — `app-ticket-detail-modal`

Archivo: [src/app/components/ticket-detail-modal/ticket-detail-modal.ts](src/app/components/ticket-detail-modal/ticket-detail-modal.ts)

Modal con la vista completa de un ticket: detalles, actividad, comentarios y controles de acción.

**Inputs:**
- `isOpen`, `ticket`, `currentUser`, `technicians` (lista de técnicos para asignar), `allUsers`

**Outputs:**
- `onClose`
- `onUpdateStatus` — emite el nuevo estado
- `onAddComment` — emite el texto del comentario
- `onAssignTicket` — emite el username del técnico a asignar

**Métodos de permisos:**
- `canEditStatus()` — `true` si es admin, o técnico asignado al ticket
- `canAssign()` — `true` solo si es admin
- `canComment()` — `true` si el ticket no está cerrado

---

### `NewTicketModal` — `app-new-ticket-modal`

Archivo: [src/app/components/new-ticket-modal/new-ticket-modal.ts](src/app/components/new-ticket-modal/new-ticket-modal.ts)

Modal para crear un nuevo ticket.

**Inputs:** `isOpen`, `categories`, `priorities`

**Outputs:** `onClose`, `onSubmit` (emite el objeto ticket con `title`, `description`, `category`, `priority`)

Resetea el formulario automáticamente al enviar.

---

### `NotificationsPanel` — `app-notifications-panel`

Archivo: [src/app/components/notifications-panel/notifications-panel.ts](src/app/components/notifications-panel/notifications-panel.ts)

Panel lateral de notificaciones del usuario actual.

**Inputs:** `isOpen`, `notifications`

**Outputs:**
- `onClose`
- `onMarkAsRead` — emite el `id` de la notificación
- `onMarkAllAsRead`
- `onOpenTicket` — emite el `ticketId` para navegar al ticket; también cierra el panel

**Tipos de notificación** e íconos asociados:
- `assignment` → `user-plus`
- `comment` → `message-square`
- `status_change` → `alert-circle`
- Default → `bell`

---

### `ConfigurationPanel` — `app-configuration-panel`

Archivo: [src/app/components/configuration-panel/configuration-panel.ts](src/app/components/configuration-panel/configuration-panel.ts)

Panel de administración para gestionar categorías y prioridades de tickets.

**Inputs:** `categories`, `priorities`

**Outputs:** `onUpdateCategories`, `onUpdatePriorities`

**Operaciones de categorías:**
- Agregar: requiere `id`, `name` y `label`. El `id` debe ser único.
- Eliminar: pide confirmación. Los tickets existentes **no se ven afectados**.

**Operaciones de prioridades:**
- Agregar: requiere `id`, `name`, `label` y `color` (hex). El `id` debe ser único.
- Eliminar: pide confirmación. Los tickets existentes **no se ven afectados**.

El campo `id` de categorías se normaliza automáticamente: minúsculas y espacios reemplazados por `-`.

---

### `SecurityLogs` — `app-security-logs`

Archivo: [src/app/components/security-logs/security-logs.ts](src/app/components/security-logs/security-logs.ts)

Visor de logs de auditoría de seguridad (solo accesible para admin).

Lee los logs directamente de `localStorage['helpdesk_security_logs']` al inicializarse (`ngOnInit`).

**Propiedades:**
- `logs` — Array de logs ordenados del más reciente al más antiguo
- `filter` — Filtro activo: `'all' | 'info' | 'warning' | 'error' | 'critical'`

**Métodos auxiliares:**
- `getIcon(level)` — Devuelve el ícono de Lucide según el nivel
- `getLevelColor(level)` — Devuelve las clases CSS de Tailwind para el badge del nivel
- `getLogCount(level)` — Cuenta los logs por nivel
- `formatTimestamp(timestamp)` — Formatea la fecha en español (`es-ES`)

---

### `SecurityWarningComponent` — `app-security-warning`

Archivo: [src/app/components/security-warning/security-warning.ts](src/app/components/security-warning/security-warning.ts)

Banner de advertencias que aparece si `validateSecurityConfig()` detecta problemas (ej. sin HTTPS en producción).

**Inputs:** `issues` — Array de strings con las advertencias

---

## 9. Persistencia de Datos

La aplicación usa **`localStorage`** como única capa de persistencia. No tiene backend.

| Clave | Contenido | Cuándo se escribe |
|---|---|---|
| `helpdesk_users` | `User[]` (con contraseñas hasheadas) | Al inicializar, al crear usuarios, al migrar contraseñas |
| `helpdesk_user` | `User` (sesión activa, sin contraseña) | Al hacer login / logout |
| `helpdesk_categories` | `CategoryItem[]` | Al actualizar categorías desde el panel de config |
| `helpdesk_priorities` | `PriorityItem[]` | Al actualizar prioridades desde el panel de config |
| `helpdesk_notifications_<username>` | `Notification[]` | Al recibir o leer notificaciones |
| `helpdesk_security_logs` | `SecurityLog[]` (máx. 1000) | En cada evento de seguridad |

> **Nota:** Los tickets **no se persisten** en `localStorage`. Al recargar la página, se restauran los datos del `mock-data.ts`. Esto es intencional para el entorno de demostración.

---

## 10. Configuración de la Aplicación

Archivo: [src/app/app.config.ts](src/app/app.config.ts)

```ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    importProvidersFrom(
      LucideAngularModule.pick({ /* íconos seleccionados */ })
    )
  ]
};
```

Los íconos de Lucide se registran de forma selectiva (tree-shaking) para optimizar el bundle:

`Activity`, `AlertCircle`, `AlertTriangle`, `Bell`, `Calendar`, `CheckCircle`, `CircleCheckBig`, `Clock`, `FileText`, `Filter`, `LayoutDashboard`, `LogIn`, `LogOut`, `MessageSquare`, `Plus`, `Search`, `Send`, `Settings`, `Shield`, `Tag`, `Ticket`, `Trash2`, `TrendingUp`, `User`, `UserPlus`, `X`

**Rutas:** El archivo `app.routes.ts` actualmente define un array de rutas vacío — la navegación entre vistas (dashboard, tickets, config, logs) se gestiona con el signal `activeView` en el componente raíz, sin usar el router de Angular.

---

## 11. Datos Iniciales (Mock Data)

Archivo: [src/app/mock-data.ts](src/app/mock-data.ts)

### Usuarios predeterminados

| Username | Contraseña | Nombre | Rol |
|---|---|---|---|
| `admin` | `admin123` | Administrador | admin |
| `tecnico` | `tecnico123` | Carlos Mendez | tecnico |
| `tecnico2` | `tecnico123` | Ana Torres | tecnico |
| `tecnico3` | `tecnico123` | Miguel Ruiz | tecnico |
| `usuario` | `usuario123` | Juan Pérez | usuario |
| `maria` | `maria123` | María García | usuario |
| `pedro` | `pedro123` | Pedro Martínez | usuario |

> Al iniciar sesión por primera vez, las contraseñas en texto plano se migran automáticamente a hash SHA-256.

### Categorías predeterminadas

| ID | Nombre |
|---|---|
| `hardware` | Hardware |
| `software` | Software |
| `red` | Red |
| `acceso` | Acceso |

### Prioridades predeterminadas

| ID | Nombre | Color |
|---|---|---|
| `baja` | Baja | `#10b981` (verde) |
| `media` | Media | `#f59e0b` (amarillo) |
| `alta` | Alta | `#f97316` (naranja) |
| `critica` | Crítica | `#ef4444` (rojo) |

### Tickets de ejemplo

Se incluyen 7+ tickets de ejemplo con distintos estados, prioridades y categorías, con comentarios y actividades ya registradas:

| ID | Título | Estado | Prioridad |
|---|---|---|---|
| TKT-2847 | Fallo en servidor de correo Exchange | en-proceso | critica |
| TKT-2846 | Solicitud de acceso a carpeta compartida | en-proceso | baja |
| TKT-2845 | Instalación de AutoCAD 2026 | nuevo | media |
| TKT-2844 | Teclado inalámbrico sin batería | resuelto | baja |
| TKT-2843 | VPN corporativa no conecta desde casa | en-proceso | alta |
| TKT-2842 | Actualización de RAM en workstation | nuevo | media |
| TKT-2841 | Error en sistema de punto de venta | en-proceso | critica |

---

## 12. Flujos de Usuario

### Flujo: Usuario final crea un ticket

1. El usuario inicia sesión con sus credenciales
2. El sistema lo lleva directamente a la vista de **Tickets** (no al dashboard)
3. El usuario hace clic en **"Nuevo Ticket"**
4. Completa el formulario: título, descripción, categoría y prioridad
5. Al enviar, el ticket se crea con estado `nuevo` y sin asignar
6. Todos los admins y técnicos reciben una notificación

### Flujo: Técnico toma y resuelve un ticket

1. El técnico inicia sesión y ve el dashboard y su lista de tickets
2. Ve los tickets sin asignar disponibles con el botón **"Tomar"**
3. Al tomar el ticket, queda asignado a él; el creador recibe una notificación
4. El técnico abre el modal de detalle del ticket
5. Agrega comentarios mientras trabaja
6. Cambia el estado a `en-proceso` y luego a `resuelto`
7. En cada cambio de estado, el creador recibe una notificación

### Flujo: Administrador gestiona usuarios

1. El admin inicia sesión y tiene acceso al menú completo
2. Puede abrir **"Crear Técnico"** o **"Crear Admin"** desde la barra de navegación
3. Completa el formulario con username, nombre y contraseña (con criterios de seguridad)
4. El nuevo usuario queda disponible para iniciar sesión

### Flujo: Restauración de sesión

1. El usuario recarga la página
2. `ngOnInit` detecta `helpdesk_user` en `localStorage`
3. Verifica que el `sessionTimestamp` no tenga más de 8 horas
4. Verifica que `username`, `role` y `sessionToken` existan
5. Si todo es válido, restaura la sesión sin pedir credenciales de nuevo
6. Si la sesión expiró, la elimina y muestra el formulario de login con una alerta

---

## 13. Cómo Ejecutar el Proyecto

### Requisitos previos

- Node.js 18+
- npm 11+

### Instalación

```bash
cd helpDeskAngular
npm install
```

### Desarrollo

```bash
npm start
# La app queda disponible en http://localhost:4200
```

### Compilación para producción

```bash
npm run build
# Los archivos compilados se generan en dist/
```

### Tests

```bash
npm test
```

### Primeros pasos al abrir la app

1. Navega a `http://localhost:4200`
2. Inicia sesión con cualquier usuario de los datos iniciales (ver sección 11)
3. Recomendado: inicia como `admin` / `admin123` para ver todas las funcionalidades

---

## 14. Troubleshooting

### 14.1 La app no levanta en `npm start`

Síntomas:
- Error de dependencias
- Puerto ocupado
- Fallo de compilación TypeScript

Pasos recomendados:

```bash
rm -rf node_modules package-lock.json
npm install
npm start
```

En Windows PowerShell:

```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm install
npm start
```

Si el puerto 4200 está ocupado:

```bash
npm start -- --port 4300
```

---

### 14.2 No puedo iniciar sesión aunque el usuario existe

Posibles causas:
- El usuario quedó bloqueado por rate limit (5 intentos fallidos)
- Contraseña migrada a hash y se está usando credencial incorrecta
- Datos de `localStorage` inconsistentes

Solución rápida para desarrollo:
1. Abrir DevTools
2. Ejecutar `localStorage.clear()`
3. Recargar la app
4. Iniciar con usuarios de [src/app/mock-data.ts](src/app/mock-data.ts)

---

### 14.3 No aparecen notificaciones

Verificar:
1. Que exista sesión (`helpdesk_user`)
2. Que la clave `helpdesk_notifications_<username>` se esté escribiendo
3. Que el panel de notificaciones esté abierto

Nota: las notificaciones están ligadas al usuario autenticado y se guardan por username.

---

### 14.4 El estado/permisos no coinciden con lo esperado

Validar en orden:
1. Rol del usuario autenticado (`currentUser.role`)
2. Ticket asignado o no (`assignedTo`)
3. Reglas de `visibleTickets` y `canEditStatus`

Referencias:
- [src/app/app.ts](src/app/app.ts)
- [src/app/components/ticket-detail-modal/ticket-detail-modal.ts](src/app/components/ticket-detail-modal/ticket-detail-modal.ts)

---

## 15. Checklist de QA Manual

Checklist recomendado antes de merge/release:

1. Login con `admin`, `tecnico`, `usuario` (flujo feliz y credenciales inválidas)
2. Verificar bloqueo por rate limit tras 5 intentos inválidos
3. Crear ticket y confirmar notificación a técnicos/admins
4. Tomar ticket desde técnico y validar asignación
5. Cambiar estado del ticket y validar notificación al creador
6. Agregar comentario con contenido HTML y validar sanitización
7. Crear usuario técnico y admin desde panel admin
8. Actualizar categorías/prioridades y verificar persistencia
9. Cerrar sesión y verificar limpieza de estado
10. Recargar página y validar restauración de sesión no expirada
11. Forzar expiración de sesión y validar logout automático
12. Revisar visor de seguridad con eventos generados

Comando de compilación final:

```bash
npm run build
```

---

## 16. Convenciones para Contribuir

### 16.1 Convenciones de código

- Mantener componentes pequeños y con una sola responsabilidad
- Preferir `signal`/`computed` para estado local y derivado
- Mantener `ChangeDetectionStrategy.OnPush`
- Evitar introducir `any`; usar tipos explícitos o `unknown`
- Sanitizar cualquier input del usuario que se persista o renderice

### 16.2 Convenciones de commits (recomendadas)

Formato sugerido:

```text
tipo(scope): descripción corta
```

Ejemplos:
- `feat(tickets): agregar filtro por fecha de creación`
- `fix(auth): corregir validación de expiración de sesión`
- `docs(readme): actualizar troubleshooting de notificaciones`

### 16.3 Flujo de PR sugerido

1. Crear rama desde `main`
2. Implementar cambio con tests si aplica
3. Ejecutar build local
4. Actualizar [DOCUMENTACION.md](DOCUMENTACION.md) si el comportamiento cambió
5. Abrir PR con descripción de impacto funcional

---

## 17. Limitaciones Actuales y Deuda Técnica

1. No existe backend ni base de datos; todo depende de `localStorage`
2. Los tickets se cargan desde mock y no sobreviven al refresh
3. No hay control de concurrencia entre múltiples pestañas/usuarios
4. El rate limit es en memoria de navegador (fácil de eludir limpiando sesión)
5. No hay internacionalización (i18n) formal; textos en español hardcodeados
6. Router Angular sin rutas funcionales (navegación interna por estado)
7. Cobertura de tests no documentada ni automatizada en CI

Prioridades de evolución recomendadas:
1. Backend API para usuarios/tickets/notificaciones
2. Persistencia real de tickets y auditoría server-side
3. Migración a rutas reales con guards por rol
4. Suite de tests e2e + pipeline CI

---

## 18. FAQ Técnica

### ¿Por qué no se usa backend?
Porque el proyecto está orientado a demostración funcional y prototipado rápido. `localStorage` reduce complejidad inicial.

### ¿Por qué se usa SHA-256 sin salt?
En este contexto demo se priorizó simplicidad en cliente. Para producción se requiere hashing robusto server-side (Argon2/bcrypt/scrypt + salt + pepper).

### ¿Puedo cambiar las categorías/prioridades en runtime?
Sí. El admin puede hacerlo desde configuración y quedan persistidas en `localStorage`.

### ¿Dónde se define quién puede cambiar estados?
En la lógica de permisos del componente raíz y en los checks del modal de detalle:
- [src/app/app.ts](src/app/app.ts)
- [src/app/components/ticket-detail-modal/ticket-detail-modal.ts](src/app/components/ticket-detail-modal/ticket-detail-modal.ts)

### ¿Cómo reinicio el estado a fábrica?
`localStorage.clear()` desde DevTools y recarga de página.

---

## 19. Glosario

- **Ticket:** Incidencia o solicitud creada por un usuario.
- **Asignación:** Acción de vincular un ticket a un técnico responsable.
- **Actividad:** Registro cronológico de eventos sobre un ticket.
- **Notificación:** Mensaje al usuario por eventos relevantes (asignación, comentario, estado).
- **Rate limit:** Restricción de intentos en una ventana temporal para evitar abuso.
- **OnPush:** Estrategia de detección de cambios optimizada de Angular.
- **Signal/Computed:** Primitivas reactivas de Angular para estado y valores derivados.
