# Cumplimiento de requisitos (Angular + Ionic + Symfony API)

## Requisitos solicitados

- Servidor de Datos y API: Symfony (PHP) con autenticacion JWT
- Base de Datos: motor relacional (MySQL o PostgreSQL)
- Interfaz Administrativa/Web: Angular con componentes Angular Material
- Interfaz de Campo/Movil: Ionic con Capacitor
- Documentacion: Swagger autogenerado

## Estado actual tras cambios

### 1) Servidor Symfony + JWT + SQL + Swagger

Se agrego una base de servidor en:

- `helpDeskAngular/helpdesk-symfony-api`

Incluye:

- JWT: `config/packages/security.yaml`, `config/packages/lexik_jwt_authentication.yaml`
- SQL relacional (MySQL): `config/packages/doctrine.yaml`, `.env`, `docker-compose.yml`
- Swagger autogenerado: `config/packages/nelmio_api_doc.yaml` y ruta `/api/docs`
- Endpoints ejemplo:
  - `GET /api/health`
  - `POST /api/auth/login`
  - `GET /api/tickets` (protegido por JWT)

### 2) Web Angular con Angular Material

Se agregaron dependencias Angular Material en:

- `helpDeskAngular/package.json`

Y una vista administrativa de referencia basada en Material:

- `helpDeskAngular/src/app/app.ts` (import de `MatButton`)
- `helpDeskAngular/src/app/app.html` (uso de directiva Material no intrusiva)

Importante: no se modificaron estilos existentes de la app principal.

### 3) Movil Ionic con Capacitor

Ya cumplia el requisito desde antes:

- `HelpDeskIonic/capacitor.config.ts`
- Dependencias `@capacitor/*` en `HelpDeskIonic/package.json`

### 4) Configuracion compartida para API SQL local

Los environments quedaron configurados para usar el API Symfony local (SQL) como backend principal:

- `useSymfonyApi`
- `apiBaseUrl`

Archivos:

- `helpDeskAngular/src/environments/environment.ts`
- `helpDeskAngular/src/environments/environment.prod.ts`
- `HelpDeskIonic/src/environments/environment.ts`
- `HelpDeskIonic/src/environments/environment.prod.ts`

## Nota tecnica importante

En esta maquina no hay `php` ni `composer` en PATH, por lo que el servidor Symfony quedo preparado por estructura/archivos para ejecutarse cuando se instalen esas herramientas.

Guia de arranque del servidor:

- `helpDeskAngular/helpdesk-symfony-api/README.md`
