# Contract: Frontend Pages & Component Interfaces

**Branch**: `001-coctelera-brutalist-db` | **Date**: 2026-06-06

---

## Static Pages Generated

| Route | File | Build method | Count |
|-------|------|-------------|-------|
| `/` | `src/pages/index.astro` | Static | 1 |
| `/cocktails/[slug]` | `src/pages/cocktails/[slug].astro` | `getStaticPaths()` | N (one per cocktail) |
| `/404` | `src/pages/404.astro` | Static | 1 |

---

## Page Props Interfaces

### Index page (gallery)

```typescript
// Props passed to index.astro from build-time data fetch
interface IndexProps {
  cocktails: CocktailSummary[];  // all published cocktails
  totalCount: number;
  bases: string[];               // unique values for filter chips
  categories: string[];
  countries: string[];
  temperatures: string[];
}
```

### Detail page

```typescript
// getStaticPaths return value
interface DetailStaticPath {
  params: { slug: string };
  props: {
    cocktail: Cocktail;         // full cocktail data
    prevCocktail?: { slug: string; name: string };
    nextCocktail?: { slug: string; name: string };
  };
}
```

---

## Component Interfaces

### `CocktailCard.astro`

```typescript
interface Props {
  cocktail: CocktailSummary;
  showAbv?: boolean;  // default: true
}
```

Renders: colored panel (tone_color) with glass SVG or image, ABV badge, category badge, name, base spirit, metachips (copa, temperature, country, difficulty).

### `GlassIllustration.astro`

```typescript
interface Props {
  glassType: 'rocks' | 'highball' | 'coupe' | 'martini' | 'hurricane' | 'wine' | 'shot';
  toneColor: string;   // CSS color for liquid fill
  garnish?: string;    // 'orange' | 'lime' | 'cherry' | 'mint' | 'lemon'
}
```

Renders inline SVG with brutalist style (thick stroke, flat liquid color).

### `MetaStrip.astro`

```typescript
interface Props {
  abv: number;
  preparationTime: number;
  difficulty: string;
  temperature: string;
  country: string;
  glassLabel: string;
}
```

Renders 3×2 grid with dark background.

### `FilterBar` (Alpine.js component, inline in index.astro)

Client-side data shape (inlined as JSON in `<script type="application/json" id="cocktail-data">`):

```typescript
interface FilterBarData {
  cocktails: CocktailSummary[];
  bases: string[];
  categories: string[];
  countries: string[];
  temperatures: string[];
}
```

Alpine.js x-data exposes:
- `query: string` — search text
- `activeBase: string` — selected base spirit filter
- `activeCategory: string` — selected category filter
- `activeCountry: string` — selected country filter
- `activeTemp: string` — selected temperature filter
- `sortBy: 'nombre' | 'abv-desc' | 'abv-asc'`
- `filterMode: 'plegable' | 'menus' | 'completo'`
- `panelOpen: boolean` — for plegable mode
- `filtered: CocktailSummary[]` — computed filtered+sorted list
- `clearAll()` — resets all filters

---

## Client-Side State (localStorage)

| Key | Type | Description |
|-----|------|-------------|
| `coctelera.palette` | string | Selected palette ID (e.g. `cobalto`) |
| `coctelera.filters` | JSON string | `{ base, category, country, temp, sort, filterMode }` |

---

## Environment Variables

| Variable | Used by | Description |
|----------|---------|-------------|
| `DIRECTUS_URL` | Astro build, import script | Full URL of Directus instance |
| `DIRECTUS_TOKEN` | Astro build, import script | Directus admin static token |
| `PUBLIC_DIRECTUS_URL` | Optional client-side | Not needed for SSG (all data embedded) |
