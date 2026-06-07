# Contract: Directus API — Build-Time Interface

**Branch**: `001-coctelera-brutalist-db` | **Date**: 2026-06-06

This contract defines the Directus REST API calls made by the Astro frontend during build time. No API calls are made in the user's browser.

---

## Authentication

All requests use a static admin token in the `Authorization` header:

```
Authorization: Bearer ${DIRECTUS_TOKEN}
```

---

## Endpoints Used

### GET /items/cocktails — Gallery Index

Fetches all published cocktails with summary fields for the gallery page.

**Request**:
```
GET ${DIRECTUS_URL}/items/cocktails
  ?fields=slug,name,base_spirit,category,country,temperature,abv,difficulty,glass_type,glass_label,garnish,tone_color,images.directus_files_id,images.sort
  &filter[status][_eq]=published
  &sort=name
  &limit=-1
```

**Response shape**:
```json
{
  "data": [
    {
      "slug": "negroni",
      "name": "Negroni",
      "base_spirit": "Ginebra",
      "category": "Clásico",
      "country": "Italia",
      "temperature": "Con hielo",
      "abv": 25.15,
      "difficulty": "Fácil",
      "glass_type": "rocks",
      "glass_label": "Vaso bajo",
      "garnish": "orange",
      "tone_color": "blue",
      "images": [
        { "directus_files_id": "uuid-here", "sort": 1 }
      ]
    }
  ]
}
```

---

### GET /items/cocktails/:slug — Detail Page

Fetches full cocktail data for a single detail page.

**Request**:
```
GET ${DIRECTUS_URL}/items/cocktails
  ?fields=*,ingredients.*,steps.*,images.directus_files_id,images.sort,images.copyright
  &filter[slug][_eq]=${slug}
  &filter[status][_eq]=published
  &limit=1
```

**Response shape**:
```json
{
  "data": [
    {
      "id": "uuid",
      "slug": "negroni",
      "name": "Negroni",
      "description": "Amargo, seco y elegante...",
      "base_spirit": "Ginebra",
      "category": "Clásico",
      "country": "Italia",
      "temperature": "Con hielo",
      "abv": 25.15,
      "preparation_time": 4,
      "difficulty": "Fácil",
      "glass_type": "rocks",
      "glass_label": "Vaso bajo",
      "garnish": "orange",
      "tone_color": "blue",
      "instructions": "...",
      "tags": ["IBA Cocktail", "Bitter"],
      "ingredients": [
        { "id": 1, "name": "Ginebra", "amount": "30 ml", "sort": 1, "optional": false }
      ],
      "steps": [
        { "id": 1, "step_number": 1, "instruction": "Llena un vaso bajo con hielo..." }
      ],
      "images": [
        { "directus_files_id": "uuid", "sort": 1, "copyright": "Kitchen Swagger" }
      ]
    }
  ]
}
```

---

### Image URL Construction

```
${DIRECTUS_URL}/assets/${directus_files_id}?width=800&format=webp&quality=80
```

For thumbnails (gallery cards):
```
${DIRECTUS_URL}/assets/${directus_files_id}?width=400&height=320&fit=cover&format=webp&quality=80
```

---

## Directus Admin API — Import Script

Used only by `scripts/import-data.ts`, not by the Astro build.

### POST /items/cocktails — Create cocktail
```
POST ${DIRECTUS_URL}/items/cocktails
Authorization: Bearer ${DIRECTUS_TOKEN}
Content-Type: application/json

{ ...cocktail fields... }
```

### POST /files — Upload image
```
POST ${DIRECTUS_URL}/files
Authorization: Bearer ${DIRECTUS_TOKEN}
Content-Type: multipart/form-data

file=<binary>
title=<cocktail-name>
```

### POST /items/cocktail_ingredients — Create ingredient
```
POST ${DIRECTUS_URL}/items/cocktail_ingredients
Authorization: Bearer ${DIRECTUS_TOKEN}

{ "cocktail_id": "uuid", "name": "Ginebra", "amount": "30 ml", "sort": 1 }
```

### POST /items/cocktail_steps — Create step
```
POST ${DIRECTUS_URL}/items/cocktail_steps
Authorization: Bearer ${DIRECTUS_TOKEN}

{ "cocktail_id": "uuid", "step_number": 1, "instruction": "..." }
```
