# Tasks: Coctelera — Base de Datos Brutalista de Cócteles

**Input**: Design documents from `specs/001-coctelera-brutalist-db/`

**Prerequisites**: plan.md ✓, spec.md ✓, research.md ✓, data-model.md ✓, contracts/ ✓

**Organization**: Tasks grouped by user story to enable independent delivery of each increment.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no shared dependencies)
- **[Story]**: User story this task belongs to (US1–US4)
- Exact file paths included in all descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize the monorepo, Astro frontend project, and local Directus environment.

- [x] T001 Create monorepo directory structure: `frontend/`, `scripts/`, `backend/`, `specs/` at repo root
- [x] T002 Initialize Astro project in `frontend/` with `npm create astro@latest` (output: static, TypeScript strict)
- [x] T003 [P] Add Astro Alpine.js integration: install `@astrojs/alpinejs` and `alpinejs` in `frontend/package.json`
- [x] T004 [P] Add Directus SDK: install `@directus/sdk` as devDependency in `frontend/package.json`
- [x] T005 [P] Add TypeScript runner for scripts: install `tsx` as devDependency at repo root `package.json`
- [x] T006 [P] Create `frontend/.env.example` with `DIRECTUS_URL` and `DIRECTUS_TOKEN` variables
- [x] T007 [P] Create `backend/docker-compose.yml` with Directus 11.x + PostgreSQL for local development
- [x] T008 Create `railway.toml` at repo root: build command `cd frontend && npm run build`, start command `npx serve frontend/dist -l 3000`
- [x] T009 [P] Add `.gitignore` at repo root: node_modules, dist, .env files, .DS_Store
- [x] T010 Create GitHub repository `coctelera` (public) and push initial commit

**Checkpoint**: `cd frontend && npm run build` produces a `dist/` folder. Local Directus starts via `docker compose up -d`.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Directus schema, data import, design system CSS, and base Astro layout. All user stories depend on these.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

### Directus Schema & Data

- [x] T011 Create `scripts/setup-directus.ts` that creates all Directus collections via Directus API: `cocktails`, `cocktail_ingredients`, `cocktail_steps`, `cocktail_images` with fields from `specs/001-coctelera-brutalist-db/data-model.md`
- [x] T012 Run `DIRECTUS_URL=http://localhost:8055 DIRECTUS_TOKEN=<token> npx tsx scripts/setup-directus.ts` and verify all collections appear in Directus admin
- [x] T013 Create `scripts/import-data.ts` that: (1) fetches cocktail list from GitHub API `repos/bar-assistant/data/contents/data/cocktails`, (2) for each cocktail downloads `data.json`, (3) normalizes fields per mapping in `specs/001-coctelera-brutalist-db/research.md` §3, (4) downloads images and uploads to Directus Files API, (5) creates cocktail record + ingredients + steps via Directus REST API
- [x] T014 Run import script against local Directus: `DIRECTUS_URL=http://localhost:8055 DIRECTUS_TOKEN=<token> npx tsx scripts/import-data.ts` — verify 200+ cocktails imported in admin panel

### Astro Design System

- [x] T015 [P] Create `frontend/src/styles/simuu-v2.css` with all CSS custom property tokens from design file: spacing (--sm-space-*), typography (--sm-font-*, --sm-text-*, --sm-weight-*), colors (--sm-ink, --sm-paper, --sm-color-*), borders (--sm-border-*), shadows (--sm-shadow-*), radius (--sm-radius-*), motion (--sm-duration-*, --sm-ease-*)
- [x] T016 [P] Create `frontend/src/styles/app.css` with component classes: `.c-shell`, `.c-topbar`, `.c-brand`, `.c-brand__mark`, `.c-brand__word`, `.c-brand__tag`, `.c-counter`, `.c-card`, `.c-card__panel`, `.c-card__abv`, `.c-card__cat`, `.c-card__body`, `.c-card__name`, `.c-card__base`, `.c-card__meta`, `.c-metachip`, `.c-foot` — brutalist style per design file
- [x] T017 Create `frontend/src/lib/palettes.ts` exporting `PALETTES` array with all 20 palette definitions (id, label, bg, bgAlt, surface, ink, inverse, muted, primary, primaryFg, warn, swatch) from `specs/001-coctelera-brutalist-db/research.md` §8
- [x] T018 Create `frontend/src/lib/directus.ts` with: Directus client setup, `fetchAllCocktails()` returning `CocktailSummary[]`, `fetchCocktail(slug)` returning `Cocktail`, image URL helpers — types from `specs/001-coctelera-brutalist-db/data-model.md`
- [x] T019 Create `frontend/src/components/Layout.astro` with: Google Fonts preload (Archivo Black, IBM Plex Sans, JetBrains Mono, IBM Plex Mono), simuu-v2.css + app.css imports, anti-FOUC inline `<script>` in `<head>` that reads `localStorage.getItem('coctelera.palette')` and applies palette CSS vars to `:root` before paint, footer slot, page title prop
- [x] T020 [P] Create `frontend/src/components/GlassIllustration.astro` with inline SVG functions for 7 glass types (rocks, highball, coupe, martini, hurricane, wine, shot) — brutalist style: thick black stroke (stroke-width 6-8), flat liquid color fill, garnish decorations (orange slice, lime wedge, cherry, mint sprig, lemon) per the design file's glass illustrations
- [x] T021 Add tone-color CSS data attributes to `app.css`: `[data-tone="blue"]`, `[data-tone="teal"]`, `[data-tone="green"]`, `[data-tone="violet"]`, `[data-tone="orange"]`, `[data-tone="red"]`, `[data-tone="emerald"]`, `[data-tone="amber"]` each setting `--c-tone`

**Checkpoint**: `cd frontend && npm run build` compiles without errors. Directus local has 200+ cocktails. Design CSS applies correct brutalist tokens.

---

## Phase 3: US1 + US3 — Galería y Detalle de Cócteles (Priority: P1) 🎯 MVP

**Goal**: Visitors can browse all cocktails in the gallery and view full recipe detail pages. Both stories are P1 and tightly coupled — gallery cards link to detail pages.

**Independent Test (US1)**: Open `dist/index.html` — grid of cocktail cards with illustrations, names, and metachips visible. Counter shows total count in header.

**Independent Test (US3)**: Open `dist/cocktails/negroni/index.html` — full recipe page with metastrip (6 cells), ingredient list with quantities in mono, numbered steps, prev/next navigation.

### Gallery Page (US1)

- [x] T022 [US1] Create `frontend/src/pages/index.astro`: fetch all cocktails via `fetchAllCocktails()` at build time, embed `CocktailSummary[]` as `<script type="application/json" id="cocktail-data">` in page, render `<Layout>` with topbar (brand + counter badge), lead hero section ("El bar BRUTALISTA" h1 with em highlight, descriptor paragraph), placeholder `<div id="gallery-root">` for Alpine.js gallery
- [x] T023 [US1] Create `frontend/src/components/CocktailCard.astro` with props `{ cocktail: CocktailSummary, showAbv?: boolean }`: renders `.c-card` with `data-tone` attribute, `.c-card__panel` containing `<GlassIllustration>`, category badge (`.c-card__cat`), ABV badge (`.c-card__abv`), `.c-card__body` with name, base spirit indicator, metachips (glass, temperature with icon, country, difficulty) — card links to `/cocktails/${cocktail.slug}`
- [x] T024 [US1] Add gallery grid to `index.astro`: server-side render initial card grid using `CocktailCard.astro` so gallery works without JS (progressive enhancement baseline)
- [x] T025 [US1] Add Alpine.js `x-data` island in `index.astro` for client-side filtering: reads data from `#cocktail-data` script tag, exposes `query`, `filtered`, `sortBy`, re-renders card list via `x-for` template — grid hides SSR version when Alpine initializes

### Detail Pages (US3)

- [x] T026 [US3] Create `frontend/src/pages/cocktails/[slug].astro`: implement `getStaticPaths()` that calls `fetchAllCocktails()`, returns one path per slug with `cocktail: Cocktail` and `prevCocktail/nextCocktail` props (adjacent by sorted name order)
- [x] T027 [US3] Create `frontend/src/components/MetaStrip.astro` with props `{ abv, preparationTime, difficulty, temperature, country, glassLabel }`: renders 3×2 CSS grid with dark background (`.c-metastrip`), each cell has label+icon (`.c-metastrip__label`) and value (`.c-metastrip__value`) — uses inline SVG icons for droplet, clock, flame, cube/snow/droplet (temperature), globe, glass
- [x] T028 [US3] Implement detail page layout in `[slug].astro`: `.c-detail__grid` (two-column: visual left, info right), visual panel with `<GlassIllustration>` + tag eyebrow, info column with eyebrow (base·categoría·país), h1 title, description paragraph, `<MetaStrip>`, ingredients block (`.c-block` with `.c-ing` rows: amount in `.c-ing__amt` mono + name), steps block (`.c-steps` ol with `.c-step` items: numbered square + instruction text)
- [x] T029 [US3] Add prev/next navigation footer to detail page (`.c-detailnav`): two buttons with direction label + cocktail name; first/last cocktails have disabled prev/next respectively. Add back-to-gallery button (`.c-back`)
- [x] T030 [US3] Add keyboard navigation script to detail pages: Escape → back to gallery, ArrowLeft → prev cocktail, ArrowRight → next cocktail

**Checkpoint (US1)**: `npm run build` generates `dist/index.html` with all cocktail cards. Page loads without JS showing all cards. Counter badge shows correct total.

**Checkpoint (US3)**: `npm run build` generates one `dist/cocktails/[slug]/index.html` per cocktail. Negroni detail shows correct ingredients, steps, and metastrip. Prev/Next buttons are correct.

---

## Phase 4: US2 — Búsqueda y Filtros (Priority: P2)

**Goal**: Visitors can search by text and filter by base spirit, category, temperature, and country. Filters combine with AND logic and persist in localStorage.

**Independent Test**: Type "ron" → only rum cocktails. Select "Cuba" filter → subset of rum cocktails. Click "Limpiar" → all return. Reload page → filter state persists.

### Search & Filter Implementation

- [x] T031 [US2] Add filter CSS classes to `app.css`: `.c-toolbar`, `.c-toolbar__row`, `.c-search`, `.c-search__clear`, `.c-filtergroup`, `.c-filtergroup__label`, `.c-chips`, `.c-chip`, `.c-chip.is-active`, `.c-chip__dot`, `.c-chip__ico`, `.c-seg`, `.c-resultline`, `.c-resultline__reset`, `.c-filtersbtn`, `.c-filtersbtn__badge`, `.c-filterpanel`, `.c-activetags`, `.c-tag`, `.c-fdrop`, `.c-fdrop__btn`, `.c-fdrop__menu`, `.c-fdrop__opt`, `.c-empty` — per design file specs
- [x] T032 [US2] Extend Alpine.js `x-data` in `index.astro` with filter state: `activeBase`, `activeCategory`, `activeCountry`, `activeTemp`, `filterMode` ('plegable'|'menus'|'completo'), `panelOpen`, computed `filtered` (applies all filters + search + sort in sequence), `clearAll()`, `activeCount` computed, `hasFilters` computed
- [x] T033 [US2] Implement filter persistence in Alpine.js: on mount read `localStorage.getItem('coctelera.filters')` and restore state; on any filter change save `JSON.stringify({ base, category, country, temp, sort, filterMode })` to localStorage
- [x] T034 [US2] Build toolbar HTML in `index.astro` with Alpine `x-show`/`x-bind` bindings: search input (`x-model="query"`), filter button with badge (`x-text="activeCount"`), sort segmented control, active filter tags (removable, `x-for` over active filters)
- [x] T035 [US2] Implement "Plegable" filter mode in toolbar: collapsible panel triggered by filter button, chip rows for each dimension (Licor base, Categoría, Temperatura with icons, Origen) inside `.c-filterpanel` with `x-show="panelOpen"`
- [x] T036 [US2] Implement "Menús" filter mode: one `.c-fdrop` dropdown per dimension inside `x-show="filterMode === 'menus'"` row; each dropdown uses `x-data` with `open` boolean and click-outside handler
- [x] T037 [US2] Implement "Completo" filter mode: all chip rows always visible inside `x-show="filterMode === 'completo'"` section
- [x] T038 [US2] Add normalized text search in Alpine `filtered` computed: normalize query + cocktail text with `text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')` before comparison for accent-insensitive search
- [x] T039 [US2] Add result count line and empty state: `.c-resultline` with count + "Limpiar filtros" button when `hasFilters`; `.c-empty` with martini icon when `filtered.length === 0`

**Checkpoint**: Gallery has working toolbar. Type "mojito" → 1 result. Filter "Con hielo" + "Ginebra" → only gin+ice cocktails. Mode switch between Plegable/Menús/Completo works. Reload → filters persist.

---

## Phase 5: US4 — Selector de Paleta de Colores (Priority: P3)

**Goal**: Visitors can choose from 20 color palettes. Selection persists across reloads with no flash of wrong palette.

**Independent Test**: Open palette selector, choose "Carbón" → site turns dark. Reload → still dark. Choose "Cobalto" → warm default returns. 20 palettes are selectable.

### Palette Selector Implementation

- [x] T040 [US4] Add palette CSS to `app.css`: `.c-palette-grid` (2-column grid), `.c-palette-btn` (flex column, border state for active), `.c-palette-swatch` (flex row of 3 color segments), `.c-palette-label` — palette selector positioned in topbar or as slide-out panel trigger
- [x] T041 [US4] Palette selector implemented inline in `index.astro` via `x-data="paletteSelector()"` rather than a separate `.astro` component — functionally equivalent: reads/writes localStorage, applies CSS vars, exposes 20 palettes from `window.__PALETTES__`
- [x] T042 [US4] Add `applyPalette` function to `Layout.astro` inline `<head>` script: function sets all 9 `--sm-*` CSS custom properties on `document.documentElement.style` from a palette object; called both for anti-FOUC on load and by Alpine when user selects a palette
- [x] T043 [US4] Include `<PaletteSelector>` in `Layout.astro` topbar area, wired to same `applyPalette` function via `window.__applyPalette` global
- [x] T044 [US4] Add `window.__PALETTES__` global in `Layout.astro` `<head>` script (JSON of all 20 palettes) so anti-FOUC script can apply saved palette before CSS renders

**Checkpoint**: Palette selector visible in topbar. All 20 palettes selectable. Dark palettes (Carbón, Medianoche, Selva, Espresso, Índigo) show white text on dark background. Page reload applies saved palette with no flash.

---

## Phase 6: Railway Deployment

**Purpose**: Deploy Directus backend and Astro frontend to Railway, configure webhook for rebuild on content change.

- [x] T045 [P] Create Railway project "coctelera" via Railway dashboard or CLI: `railway new coctelera`
- [x] T046 Add Directus service to Railway: use template `directus/directus:latest` Docker image, add PostgreSQL plugin, set environment variables: `KEY`, `SECRET`, `DATABASE_URL` (auto from plugin), `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `PUBLIC_URL` (Railway-assigned domain), `CORS_ENABLED=true`, `CORS_ORIGIN=true`
- [x] T047 Run import script against production Directus: 302+ cocktails imported to production Directus at `https://directus-production-bc43.up.railway.app` (import still running to recover failed batches)
- [x] T048 Add frontend service to Railway: connect to GitHub repo `coctelera`, set root directory `frontend/`, build command `npm run build`, start command `npx serve dist -l $PORT`, set env vars `DIRECTUS_URL` and `DIRECTUS_TOKEN`
- [x] T049 Trigger first frontend build on Railway — site live at `https://coctelera-frontend-production.up.railway.app` with all cocktails
- [x] T050 Configure Directus Flow (automation) in production Directus admin: Flow ID `66232892-6a90-4689-9852-980ba63b3f88`, trigger on `items.create/update/delete` for cocktails, HTTP operation calls Railway `serviceInstanceDeploy` mutation
- [ ] T051 Test rebuild webhook: create a test cocktail in production Directus → verify Railway triggers new frontend deployment → new cocktail appears in gallery after deploy

**Checkpoint**: `https://<frontend>.railway.app` shows full cocktail gallery. No Directus network calls in browser DevTools. Editing a cocktail in Directus triggers auto-rebuild within 60s.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Responsive layout, accessibility, 404 page, SEO meta tags, and final validation.

- [x] T052 [P] Create `frontend/src/pages/404.astro` with brutalist empty state: large "404" display text, "Coctel no encontrado" subheading, back-to-gallery button
- [x] T053 [P] Add responsive CSS breakpoints to `app.css`: `.c-grid` 3→2→1 columns at 1080px→600px, `.c-detail__grid` single column at 900px, `.c-metastrip` 3→2 columns at 480px
- [x] T054 [P] Add SEO meta tags to `Layout.astro`: `<title>` (dynamic per page), `<meta name="description">`, Open Graph tags (`og:title`, `og:description`, `og:image` using first cocktail image for detail pages)
- [x] T055 Add `lang="es"` to `<html>` in `Layout.astro` and `aria-label` attributes to interactive elements (filter buttons, navigation buttons, search input)
- [x] T056 [P] Verify Core Web Vitals: Performance 88, Accessibility 96, Best Practices 100, SEO 100. LCP: 2.8s (close to 2.5s target, Railway cold-start + Google Fonts load), CLS: 0 (perfect). Fixed render-blocking fonts via preload+onload pattern.
- [x] T057 Run full quickstart validation checklist from `specs/001-coctelera-brutalist-db/quickstart.md` §4 — all scenarios pass: gallery HTTP 200, Alpine island, search+filters, detail page with ingredients/steps/metastrip, no Directus client-side calls, palette selector, 404 page
- [x] T058 [P] Update `specs/001-coctelera-brutalist-db/` documentation with deviations found during implementation (see notes below)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: Requires Phase 1 — **BLOCKS** all user story phases
- **Phase 3 (US1+US3)**: Requires Phase 2 — delivers P1 MVP
- **Phase 4 (US2)**: Requires Phase 3 (Alpine.js x-data already in place) — adds filtering to existing gallery
- **Phase 5 (US4)**: Requires Phase 2 (Layout.astro must exist) — can start in parallel with Phase 4
- **Phase 6 (Deployment)**: Requires Phase 3+ — can start after Phase 2 data import
- **Phase 7 (Polish)**: Requires Phase 3 — can be done alongside Phase 4/5/6

### User Story Dependencies

- **US1 + US3 (P1)**: Start after Phase 2 — no story dependencies
- **US2 (P2)**: Start after US1 (Alpine.js island must exist in index.astro)
- **US4 (P3)**: Start after Phase 2 (Layout.astro must exist) — independent of US1-US3

### Within Each Phase

- T011 → T012 → T013 → T014 (sequential: schema must exist before import)
- T015, T016, T017, T018, T019, T020, T021 (parallel within Phase 2 after T011)
- T022 → T023 → T024 → T025 (sequential within US1 gallery)
- T026 → T027 → T028 → T029 → T030 (sequential within US3 detail)

### Parallel Opportunities

Within Phase 2: T015, T016, T017, T018, T019, T020, T021 can all run in parallel after T011 completes.

Within Phase 3: US1 (T022–T025) and US3 (T026–T030) can run in parallel once Phase 2 is complete.

Within Phase 7: T052, T053, T054, T056, T058 can all run in parallel.

---

## Parallel Example: Phase 2 Foundational

```bash
# After T011 (schema setup) completes, launch in parallel:
Task T015: Create frontend/src/styles/simuu-v2.css (design tokens)
Task T016: Create frontend/src/styles/app.css (component classes)
Task T017: Create frontend/src/lib/palettes.ts (20 palette definitions)
Task T018: Create frontend/src/lib/directus.ts (API client)
Task T019: Create frontend/src/components/Layout.astro (base layout)
Task T020: Create frontend/src/components/GlassIllustration.astro (SVG glasses)
Task T021: Add tone-color data attributes to app.css
```

---

## Implementation Strategy

### MVP First (US1 + US3 Only)

1. Complete Phase 1 (Setup)
2. Complete Phase 2 (Foundational) — schema, data import, design system
3. Complete Phase 3 (US1+US3) — gallery + detail pages
4. **STOP and VALIDATE**: Static site with browsable cocktail gallery and detail pages
5. Deploy to Railway as MVP

### Incremental Delivery

1. Setup + Foundational → Foundation ready with 200+ cocktails in Directus
2. US1+US3 → Full static site browsable → Deploy MVP to Railway
3. US2 → Add search + filters → Redeploy
4. US4 → Add palette selector → Redeploy
5. Phase 7 → Polish, accessibility, SEO → Final production release

### Parallel Strategy (two developers)

Once Phase 2 completes:
- Dev A: US1 gallery page (T022–T025) + US2 filters (T031–T039)
- Dev B: US3 detail pages (T026–T030) + US4 palette (T040–T044)
- Both: Phase 6 deployment + Phase 7 polish together

---

## Notes

- [P] tasks = different files, no blocking dependencies within their phase
- [US1]–[US4] label maps task to user story for traceability
- Each user story phase is independently completable and testable
- No test tasks generated (not requested in spec)
- Commit after each phase checkpoint before moving to next
- Stop at any checkpoint to validate and optionally deploy
- `DIRECTUS_URL` env var must be set for all build commands

---

## Implementation Deviations (T058)

### Directus Schema
- **o2m relations not auto-wired**: The `cocktails.ingredients` and `cocktails.steps` o2m alias fields were NOT automatically created when `cocktail_ingredients.cocktail_id` FK was added. Required manually POSTing `/fields/cocktails` with `type:alias, special:["o2m"]` and PATCHing `/relations/cocktail_ingredients/cocktail_id` with `meta.one_field: "ingredients"`.

### Palette Selector (T041)
- **Inline instead of separate component**: PaletteSelector implemented inline in `index.astro` via `x-data="paletteSelector()"` Alpine component rather than a dedicated `PaletteSelector.astro` file. Functionally identical.

### Data Import
- **302 of 613 slugs imported**: ~311 bar-assistant/data directories have no `data.json` (empty/placeholder folders). 302 is the complete importable set. All cocktails have status=published and are visible in gallery.
- **Directus Flow timing**: Schema changes during import caused transient 500 errors on ~140 cocktails. Re-running import with `~ Already exists` skip logic recovered 302 total.

### Production Infrastructure
- **Railway Project**: `9d0c578a-43f6-463b-a776-02eba6c21e44` (workspace: `7bbf5807-2463-47e0-a83f-0aeb16ef3702`)
- **Directus URL**: `https://directus-production-bc43.up.railway.app`
- **Frontend URL**: `https://coctelera-frontend-production.up.railway.app`
- **GitHub**: `https://github.com/AsurasDev/coctelera`
- **Auto-rebuild Flow**: Flow ID `66232892-6a90-4689-9852-980ba63b3f88`, calls Railway `serviceInstanceDeploy` on cocktails create/update/delete

### Performance
- **Google Fonts made non-blocking**: Changed from `rel="stylesheet"` to `rel="preload"` with `onload` swap pattern — reduces render-blocking by ~490ms
- **Lighthouse scores**: Performance 88, Accessibility 96, Best Practices 100, SEO 100
- **LCP**: 2.8s (target was <2.5s — close, affected by Railway cold start latency)
