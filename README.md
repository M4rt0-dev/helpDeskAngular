# HelpDesk Angular

Aplicacion web de gestion de incidencias (help desk) construida con Angular 21. Incluye autenticacion por roles, flujo completo de tickets, notificaciones internas y controles de seguridad inspirados en OWASP.

## Tabla de contenidos

1. [Resumen](#resumen)
2. [Caracteristicas clave](#caracteristicas-clave)
3. [Stack tecnologico](#stack-tecnologico)
4. [Inicio rapido](#inicio-rapido)
5. [Scripts disponibles](#scripts-disponibles)
6. [Usuarios demo](#usuarios-demo)
7. [Arquitectura del proyecto](#arquitectura-del-proyecto)
8. [Roles y permisos](#roles-y-permisos)
9. [Seguridad implementada](#seguridad-implementada)
10. [Persistencia y almacenamiento](#persistencia-y-almacenamiento)
11. [Checklist de pruebas manuales](#checklist-de-pruebas-manuales)
12. [Troubleshooting](#troubleshooting)
13. [Roadmap recomendado](#roadmap-recomendado)
14. [Contribuir](#contribuir)
15. [Documentacion adicional](#documentacion-adicional)

## Resumen

El sistema permite operar un flujo de soporte interno con tres roles:

- Usuario final: crea tickets y da seguimiento.
- Tecnico: toma tickets, comenta y cambia estado.
- Administrador: controla configuraciones, asignaciones y usuarios internos.

El proyecto esta orientado a demostracion funcional local y usa almacenamiento en navegador para simplificar despliegue y pruebas.

## Caracteristicas clave

- Login con sesion persistente y expiracion.
- Gestion de tickets con estados y prioridades.
- Asignacion de tickets a tecnicos.
- Historial de actividades y comentarios por ticket.
- Panel de notificaciones por usuario.
- Panel de configuracion para categorias y prioridades.
- Logs de seguridad con auditoria basica.
- Sanitizacion de entradas y proteccion XSS con DOMPurify.
- Rate limiting de intentos de login.

## Stack tecnologico

- Angular 21
- TypeScript 5.9
- Angular Signals (estado reactivo)
- Lucide Angular (iconos)
- DOMPurify (sanitizacion)
- Tailwind CSS (estilos)

Dependencias y scripts en:

- [package.json](package.json)
- [angular.json](angular.json)

## Inicio rapido

### Requisitos

- Node.js 18 o superior
- npm 11 o superior

### Instalacion

```bash
npm install
```

### Ejecucion en desarrollo

```bash
npm start
```

Aplicacion local:

```text
http://localhost:4200
```

## Scripts disponibles

```bash
npm start      # servidor de desarrollo
npm run build  # compilacion de produccion
npm run watch  # build en modo watch (dev)
npm test       # pruebas unitarias
```

## Usuarios demo

Puedes iniciar sesion con estos usuarios de prueba:

- admin / admin123
- tecnico / tecnico123
- tecnico2 / tecnico123
- tecnico3 / tecnico123
- usuario / usuario123
- maria / maria123
- pedro / pedro123

Fuente de datos demo:

- [src/app/mock-data.ts](src/app/mock-data.ts)

## Arquitectura del proyecto

Estructura principal:

```text
src/
	app/
		app.ts                # componente raiz con estado y logica central
		app.html              # layout principal
		app.config.ts         # providers e iconos
		app.models.ts         # tipos e interfaces
		app.routes.ts         # rutas (actualmente sin rutas funcionales)
		mock-data.ts          # usuarios, categorias, prioridades, tickets demo
		security.ts           # utilidades de seguridad
		components/           # componentes presentacionales y modales
```

Patron aplicado:

- Componente contenedor inteligente en app.ts.
- Componentes UI orientados a inputs/outputs.
- Signals y computed para estado derivado.
- ChangeDetectionStrategy.OnPush para optimizacion.

Archivo clave de logica:

- [src/app/app.ts](src/app/app.ts)

## Roles y permisos

| Accion | admin | tecnico | usuario |
|---|---|---|---|
| Ver todos los tickets | Si | No | No |
| Ver tickets propios | Si | Si | Si |
| Tomar ticket sin asignar | Si | Si | No |
| Asignar tecnico | Si | No | No |
| Cambiar estado | Si | Si (si asignado) | No |
| Comentar ticket | Si | Si | Si |
| Gestionar categorias/prioridades | Si | No | No |
| Ver logs de seguridad | Si | No | No |

## Seguridad implementada

El proyecto incluye controles de seguridad en cliente para escenario demo:

- Hash de contraseñas con Web Crypto API (SHA-256).
- Sanitizacion de HTML y texto para minimizar XSS.
- Validaciones de username/password.
- Rate limiting de login (maximo intentos por ventana).
- Sesiones con expiracion.
- Logging de eventos de seguridad.

Implementacion principal:

- [src/app/security.ts](src/app/security.ts)

Nota importante:

- Esto no reemplaza seguridad server-side. Para produccion se requiere backend con autenticacion robusta (bcrypt/argon2 + sal), controles de acceso de servidor y almacenamiento persistente seguro.

## Persistencia y almacenamiento

La app usa localStorage. Claves principales:

- helpdesk_users
- helpdesk_user
- helpdesk_categories
- helpdesk_priorities
- helpdesk_notifications_<username>
- helpdesk_security_logs

Nota:

- Los tickets parten de datos mock y no se persisten de forma completa tras recarga en el flujo actual.

## Checklist de pruebas manuales

Antes de publicar cambios:

1. Verificar login con admin, tecnico y usuario.
2. Verificar bloqueo por intentos de login fallidos.
3. Crear ticket y validar notificaciones.
4. Tomar ticket con tecnico y validar asignacion.
5. Cambiar estado y validar trazabilidad.
6. Agregar comentario con HTML y validar sanitizacion.
7. Crear tecnico/admin desde cuenta admin.
8. Modificar categorias/prioridades y validar persistencia.
9. Cerrar sesion y validar limpieza de estado.
10. Recargar y comprobar restauracion de sesion valida.

## Troubleshooting

### La app no inicia

```bash
npm install
npm start
```

Si continua fallando, reinstala dependencias:

```bash
rm -rf node_modules package-lock.json
npm install
npm start
```

En PowerShell:

```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm install
npm start
```

### No puedes iniciar sesion

- Revisa si se activo rate limit por intentos fallidos.
- Limpia estado local en desarrollo con localStorage.clear() y recarga.

### Notificaciones no visibles

- Verifica sesion activa.
- Verifica existencia de helpdesk_notifications_<username> en localStorage.

## Roadmap recomendado

Mejoras de alto impacto para evolucionar el proyecto:

1. Backend API para tickets, usuarios y notificaciones.
2. Persistencia real de tickets y auditoria en servidor.
3. Migracion a rutas Angular con guards por rol.
4. CI con tests automaticos y chequeos de calidad.
5. Hardening de seguridad para entorno productivo.

## Contribuir

Flujo recomendado:

1. Crear rama desde main.
2. Implementar cambio y pruebas.
3. Ejecutar build local.
4. Actualizar README y/o DOCUMENTACION cuando cambie comportamiento.
5. Abrir PR con descripcion funcional y tecnica.

Formato sugerido de commit:

```text
tipo(scope): descripcion breve
```

Ejemplos:

- feat(tickets): agregar filtro por fecha
- fix(auth): corregir validacion de sesion
- docs(readme): mejorar guia de instalacion

## Documentacion adicional

Para detalle funcional y tecnico completo:

- [DOCUMENTACION.md](DOCUMENTACION.md)

Archivos de referencia rapida:

- [src/app/app.ts](src/app/app.ts)
- [src/app/security.ts](src/app/security.ts)
- [src/app/app.models.ts](src/app/app.models.ts)
- [src/app/components](src/app/components)
