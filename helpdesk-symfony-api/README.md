# HelpDesk Symfony API (JWT + SQL + Swagger)

Servidor de datos/API para `helpDeskAngular` y `HelpDeskIonic`.

## Requisitos que cubre

- Framework de servidor: Symfony (PHP)
- Autenticacion: JWT (`lexik/jwt-authentication-bundle`)
- Base de datos relacional: MySQL (`doctrine/orm` + `DATABASE_URL`)
- Documentacion autogenerada: Swagger UI (`nelmio/api-doc-bundle`) en `/api/docs`

## Endpoints iniciales

- `POST /api/auth/login`: emite JWT usando credenciales (`email`, `password`)
- `GET /api/health`: health-check publico
- `GET /api/tickets`: ejemplo protegido con JWT
- `GET /api/docs`: Swagger UI

## Puesta en marcha

> Nota: En esta maquina no se detecto `php` ni `composer` en PATH, por eso se dejo el servidor preparado por archivos.

1. Instalar PHP 8.2+ y Composer.
2. En esta carpeta ejecutar:

```bash
composer install
php bin/console lexik:jwt:generate-keypair
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate
symfony server:start
```

3. Probar:

- Swagger: `http://127.0.0.1:8000/api/docs`
- Login JWT: `POST http://127.0.0.1:8000/api/auth/login`

## Integracion con frontends

- `helpDeskAngular` y `HelpDeskIonic` deben consumir este API mediante Bearer JWT.
- La persistencia debe centralizarse en endpoints REST del servidor con base SQL local.
