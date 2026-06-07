# Quickstart Validation Guide: Coctelera

**Branch**: `001-coctelera-brutalist-db` | **Date**: 2026-06-06

---

## Prerequisites

- Node.js 20+, npm 10+
- Docker (for Directus local) or access to a Railway Directus instance
- `gh` CLI (for bar-assistant data import)
- Railway CLI (for deployment)

---

## 1. Directus Backend — Local Setup

```bash
# Start Directus locally with Docker
cd backend/
docker compose up -d

# Wait ~15s for Directus to initialize, then:
# Admin panel: http://localhost:8055
# Login: admin@coctelera.app / password from .env
```

**Expected**: Directus admin panel loads, collections `cocktails`, `cocktail_ingredients`, `cocktail_steps` visible in Data Model.

---

## 2. Import Bar-Assistant Data

```bash
# From repo root
DIRECTUS_URL=http://localhost:8055 \
DIRECTUS_TOKEN=<your-admin-token> \
npx tsx scripts/import-data.ts

# Expected output:
# [import] Fetching cocktails from bar-assistant/data...
# [import] Found 213 cocktails
# [import] Importing negroni... OK
# [import] Importing mojito... OK
# ...
# [import] Done: 213 cocktails imported, 0 errors
```

**Verification**: In Directus admin → Collections → cocktails: should show 200+ records with status=published.

---

## 3. Frontend — Build & Preview

```bash
# Set env vars
cp frontend/.env.example frontend/.env
# Edit frontend/.env:
# DIRECTUS_URL=http://localhost:8055
# DIRECTUS_TOKEN=<token>

cd frontend/
npm install
npm run build

# Expected: Astro build output
# ✓ Built in Xs
# dist/index.html
# dist/cocktails/negroni/index.html
# dist/cocktails/mojito/index.html
# ... (one page per cocktail)

npm run preview  # serves dist/ locally
```

**Open**: http://localhost:4321

---

## 4. Validation Scenarios

### 4.1 Gallery loads all cocktails

- [ ] Open http://localhost:4321
- [ ] Header shows "Coctelera" + count badge (e.g. "213 recetas en la barra")
- [ ] Grid displays cocktail cards with glass illustrations
- [ ] Each card shows: name, base spirit, glass type, temperature chip, country chip

### 4.2 Search works

- [ ] Type "negroni" in search box → only Negroni card visible
- [ ] Type "ron" → only rum-based cocktails visible
- [ ] Clear search → all cocktails visible again

### 4.3 Filters work

- [ ] Click "Ginebra" filter chip → only gin cocktails show
- [ ] With Ginebra active, click "Con hielo" temperature → combined filter works
- [ ] Click "Limpiar filtros" → all cocktails return
- [ ] Result count updates in real time

### 4.4 Detail page

- [ ] Click any cocktail card → navigates to `/cocktails/[slug]`
- [ ] Page shows: visual panel with illustration/image, large title, description
- [ ] Metastrip shows all 6 cells: ABV%, time, difficulty, temperature, country, glass
- [ ] Ingredients list: each row has amount in mono + ingredient name
- [ ] Steps list: numbered squares with tone color
- [ ] Prev/Next navigation buttons work; first cocktail has disabled Prev

### 4.5 No client-side API calls

- [ ] Open DevTools → Network tab
- [ ] Navigate throughout site (gallery + multiple detail pages)
- [ ] Filter: Type "XHR/Fetch" — zero requests to Directus URL should appear

### 4.6 Palette selector

- [ ] Open palette selector
- [ ] Select "Carbón" — site turns dark immediately
- [ ] Reload page — dark palette persists
- [ ] Select "Cobalto" — returns to default warm palette

### 4.7 Static 404

- [ ] Navigate to `/cocktails/nonexistent` → 404 page loads (not a blank/error page)

---

## 5. Railway Deployment Verification

```bash
# Deploy backend (Directus) — done once via Railway dashboard
# Then deploy frontend:
railway login
railway link  # link to coctelera project
railway up    # triggers build + deploy

# Expected Railway build log:
# npm run build
# ✓ Built X pages in Xs
```

**Open**: https://coctelera.up.railway.app (or custom domain)
- [ ] All validation scenarios from §4 pass on production URL
- [ ] Images load from Directus Files CDN URL (no broken images)

---

## 6. Rebuild Webhook Test

In Directus admin → add a new cocktail (status: published) → save.

**Expected within 30s**: Railway shows a new deployment triggered. After deploy completes, the new cocktail appears in the gallery.

---

## Reference Artifacts

- Data model: [data-model.md](./data-model.md)
- API contracts: [contracts/directus-api.md](./contracts/directus-api.md)
- Page contracts: [contracts/frontend-pages.md](./contracts/frontend-pages.md)
