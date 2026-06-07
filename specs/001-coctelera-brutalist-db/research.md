# Research: Coctelera — Base de Datos Brutalista de Cócteles

**Branch**: `001-coctelera-brutalist-db` | **Date**: 2026-06-06

---

## 1. Frontend: Astro SSG con filtros de cliente

**Decision**: Astro 4.x con output `static`, islands de Alpine.js para la interactividad de filtros.

**Rationale**:
- Astro genera HTML estático en build time con `getStaticPaths()` para las páginas de detalle.
- Alpine.js (~15KB gzip) es suficiente para la lógica de filtros/búsqueda sin añadir React al bundle de producción.
- Los datos de cócteles se incrustan como un `<script type="application/json">` en el HTML para que Alpine los lea en cliente sin llamadas de red.
- Alternativa rechazada: Next.js SSG — añade overhead de React en cliente y complejidad de routing innecesaria para un sitio de contenido puro.

**Implementation pattern**:
```
// src/pages/index.astro → genera el HTML con datos incrustados
// src/pages/cocktails/[slug].astro → genera una página por cóctel (getStaticPaths)
// src/components/FilterBar.astro + Alpine.js x-data → filtros en cliente
```

---

## 2. Backend: Directus en Railway con PostgreSQL

**Decision**: Directus 11.x sobre PostgreSQL 16 provisionado por Railway. Imagen oficial de Docker `directus/directus`.

**Rationale**:
- Directus ofrece API REST y GraphQL out-of-the-box, panel de administración para gestión de contenido, y soporte de archivos (imágenes).
- Railway provisiona PostgreSQL y lo conecta mediante variable `DATABASE_URL` automáticamente.
- La autenticación del build frontend usa un token estático de Directus (admin token) guardado como variable de entorno en Railway.
- Alternativa rechazada: Contentful / Strapi — Contentful tiene costo mensual; Strapi requiere más configuración de base de datos.

**Variables de entorno requeridas (Directus)**:
```
KEY=<uuid>
SECRET=<random-string>
DATABASE_URL=postgresql://...  # provisioned by Railway
ADMIN_EMAIL=admin@coctelera.app
ADMIN_PASSWORD=<secure>
PUBLIC_URL=https://directus.railway.app
CORS_ENABLED=true
CORS_ORIGIN=true
```

---

## 3. Importación de datos: bar-assistant/data

**Decision**: Script TypeScript (`scripts/import-data.ts`) ejecutado con `tsx` que:
1. Hace fetch de la API de GitHub para listar cócteles en `data/cocktails/`.
2. Por cada cóctel, descarga `data.json` y las imágenes.
3. Normaliza campos (nombre → español donde aplique, mapea glass_type, calcula tone_color).
4. Sube imágenes a Directus Files API.
5. Crea registros en la colección `cocktails` vía API REST de Directus.

**Field mapping (bar-assistant → Directus)**:
```
_id         → slug
name        → name
description → description
abv         → abv
instructions → instructions (split por párrafo en pasos[])
glass       → glass_type (normalized: Lowball→rocks, Highball→highball, etc.)
tags        → tags (json)
garnish     → garnish
ingredients[].amount + units → ingredients M2M
images[].uri → Directus Files upload
```

**Datos no en bar-assistant** (se añaden manualmente o con defaults):
- `category`: inferido de los tags (Negroni tag → Clásico, Tropical tag → Tropical, etc.)
- `country`: inferido del `source` URL o del nombre del cóctel cuando es conocido
- `temperature`: inferido de `glass` + `tags` (Frozen si hay tag "Frozen")
- `difficulty`: "Fácil" por defecto; "Medio" si tiene >5 pasos
- `tone_color`: mapeo por licor base (gin→blue, rum→teal, tequila→green, etc.)

---

## 4. Rebuild automático: Directus webhook → Railway Deploy Hook

**Decision**: Directus flow (automatización) que dispara un HTTP POST al deploy hook de Railway cuando se crea/actualiza/elimina un cóctel.

**Setup**:
1. En Railway, en el servicio del frontend Astro, obtener la URL del Deploy Hook.
2. En Directus → Settings → Flows → crear flow con trigger "Action" (items.create, items.update, items.delete en colección `cocktails`).
3. El flow hace HTTP POST al deploy hook de Railway.

**Alternativa considerada**: GitHub Actions en push al repo → Railway deploy. Rechazada porque los cambios de contenido en Directus no generan commits de Git.

---

## 5. Imágenes: Directus Files con URL pública

**Decision**: Las imágenes se sirven directamente desde la URL pública de Directus Files (`/assets/<file-uuid>`).

**En Astro build-time**: Se obtiene la URL completa `${DIRECTUS_URL}/assets/${image_id}` y se incrusta en el HTML estático como `<img src="...">`.

**Optimización**: Se usa el parámetro de transformación de Directus (`?width=800&format=webp`) para servir imágenes optimizadas sin procesamiento en el servidor Astro.

---

## 6. Despliegue en Railway: dos servicios

**Decision**: Un proyecto Railway con dos servicios:
1. **`directus`**: imagen Docker `directus/directus:latest`, PostgreSQL como database plugin.
2. **`frontend`**: servicio Node.js que hace `npm run build` (Astro) y sirve el output con `npx serve dist/`.

**Railway configuration**:
```toml
# railway.toml (frontend service)
[build]
command = "npm run build"
[deploy]
startCommand = "npx serve dist -l 3000"
healthcheckPath = "/"
```

**Variables de entorno (frontend service)**:
```
DIRECTUS_URL=https://directus-coctelera.up.railway.app
DIRECTUS_TOKEN=<admin-token>
```

---

## 7. Estructura de repositorio

**Decision**: Monorepo con dos directorios principales en la raíz:

```
coctelera/
├── frontend/          ← Astro project
├── scripts/           ← import-data.ts y utilidades
├── specs/             ← Spec Kit artifacts
└── railway.toml       ← configuración del servicio frontend
```

El servicio Directus en Railway se configura directamente en Railway sin código en el repositorio (usa imagen Docker oficial).

---

## 8. Paleta de colores y diseño brutalista

**Decision**: Variables CSS customizadas en `:root` que Alpine.js o un script inline reescribe al cambiar paleta. Las 20 paletas se incrustan como constante JS en el HTML.

**Persistencia**: `localStorage.setItem('coctelera.palette', paletteId)` — leído en `<script>` inline en `<head>` para evitar FOUC (flash of unstyled content).

**Anti-FOUC pattern**:
```html
<script>
  // En <head>, antes de cualquier CSS
  const pal = window.__PALETTES__[localStorage.getItem('coctelera.palette') || 'cobalto'];
  if (pal) applyPalette(pal);
</script>
```
