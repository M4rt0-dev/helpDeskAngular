# Integracion Firebase para ambos HelpDesk (Angular + Ionic)

Este documento explica como dejar Firebase como backend de datos para los dos proyectos del workspace:

- `c:/Users/Mario/helpDeskAngular`
- `c:/Users/Mario/HelpDeskIonic`

## 1) Que ya quedo implementado en codigo

Se realizo la integracion para que ambos proyectos guarden y lean datos desde Firestore (con cache local para soporte offline):

- Servicio de persistencia Firebase:
  - `helpDeskAngular/src/app/firebase-helpdesk.service.ts`
  - `HelpDeskIonic/src/app/firebase-helpdesk.service.ts`
- Configuracion de entorno con placeholders Firebase:
  - `helpDeskAngular/src/environments/environment.ts`
  - `helpDeskAngular/src/environments/environment.prod.ts`
  - `HelpDeskIonic/src/environments/environment.ts`
  - `HelpDeskIonic/src/environments/environment.prod.ts`
- `app.ts` en ambos proyectos ahora:
  - Hidrata datos desde Firebase al iniciar.
  - Persiste usuarios, tickets, categorias, prioridades, notificaciones y sesion en Firebase.
  - Mantiene fallback local para robustez.
- `security.ts` en ambos proyectos sincroniza logs de seguridad a Firestore.
- `security-logs.ts` en ambos proyectos hidrata logs desde Firebase.

## 2) Crear el proyecto en Firebase Console

1. Ir a https://console.firebase.google.com
2. Crear un proyecto nuevo (o usar uno existente).
3. En "Project settings" -> "General", registrar una app Web.
4. Copiar la configuracion Firebase Web SDK:
   - `apiKey`
   - `authDomain`
   - `projectId`
   - `storageBucket`
   - `messagingSenderId`
   - `appId`

## 3) Activar Firestore Database

1. En Firebase Console -> Firestore Database.
2. Click en "Create database".
3. Elegir modo de inicio:
   - Para pruebas: `test mode`.
   - Para produccion: `production mode` (recomendado).
4. Seleccionar region (por ejemplo `us-central1` o la mas cercana a tus usuarios).

## 4) Pegar credenciales en ambos proyectos

Reemplazar los placeholders `REEMPLAZA_*` en estos archivos:

- `helpDeskAngular/src/environments/environment.ts`
- `helpDeskAngular/src/environments/environment.prod.ts`
- `HelpDeskIonic/src/environments/environment.ts`
- `HelpDeskIonic/src/environments/environment.prod.ts`

Nota: usa el mismo proyecto Firebase en ambos para que compartan exactamente la misma base de datos.

## 5) Estructura de datos que usa la app

Firestore usa la coleccion configurada en `helpdeskCollection` (por defecto `helpdesk_data`) y cada clave funcional se guarda como documento:

- `helpdesk_users`
- `helpdesk_tickets`
- `helpdesk_categories`
- `helpdesk_priorities`
- `helpdesk_user` (sesion)
- `helpdesk_security_logs`
- `helpdesk_notifications_<username>`

Cada documento guarda:

- `value`: string JSON serializado
- `updatedAt`: timestamp servidor

## 6) Reglas recomendadas de Firestore (minimas para iniciar)

En Firestore -> Rules, puedes usar temporalmente algo basico para desarrollo:

```txt
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /helpdesk_data/{docId} {
      allow read, write: if true;
    }
  }
}
```

IMPORTANTE: en produccion debes restringir por autenticacion/roles.

## 7) Endurecer seguridad en produccion

Siguiente paso recomendado:

1. Activar Firebase Authentication.
2. Cambiar reglas para permitir solo usuarios autenticados.
3. Definir una estrategia de roles (custom claims o documentos de perfil).
4. Limitar escrituras por tipo de documento (ejemplo: solo admins pueden editar ciertos datos).

## 8) Verificacion local

### Angular

```bash
cd c:/Users/Mario/helpDeskAngular
npm start
```

### Ionic

```bash
cd c:/Users/Mario/HelpDeskIonic
npm start
```

Crear/editar datos en una app y validar que se reflejen en Firestore y luego en la otra app.

## 9) Notas de compatibilidad realizadas

- Se alinearon dependencias incompatibles en `HelpDeskIonic/package.json` para evitar errores de compilacion por mezcla de Angular 20/21.
- Se instalo `firebase` en ambos proyectos.
- `helpDeskAngular/angular.json` ahora incluye `fileReplacements` para environment de produccion.

## 10) Despliegue y checklist

Antes de publicar:

1. Verificar que no queden placeholders `REEMPLAZA_*`.
2. Confirmar reglas Firestore seguras.
3. Ejecutar build de ambos proyectos.
4. Probar login, registro, tickets, notificaciones y logs de seguridad en ambos helpdesks.
