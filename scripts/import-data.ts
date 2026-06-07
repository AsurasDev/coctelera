/**
 * Imports cocktails from bar-assistant/data GitHub repo into Directus.
 * Run: DIRECTUS_URL=http://localhost:8055 DIRECTUS_TOKEN=<token> npx tsx scripts/import-data.ts
 */

const DIRECTUS_URL = process.env.DIRECTUS_URL ?? 'http://localhost:8055';
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN ?? '';
const GITHUB_API = 'https://api.github.com/repos/bar-assistant/data/contents';
const GITHUB_RAW = 'https://raw.githubusercontent.com/bar-assistant/data/main';

if (!DIRECTUS_TOKEN) {
  console.error('[import] Error: DIRECTUS_TOKEN env var is required');
  process.exit(1);
}

const headers = {
  Authorization: `Bearer ${DIRECTUS_TOKEN}`,
  'Content-Type': 'application/json',
};

// --- Field mapping helpers ---

const GLASS_MAP: Record<string, { type: string; label: string }> = {
  lowball: { type: 'rocks', label: 'Vaso bajo' },
  'old fashioned': { type: 'rocks', label: 'Vaso bajo' },
  rocks: { type: 'rocks', label: 'Vaso bajo' },
  highball: { type: 'highball', label: 'Vaso alto' },
  collins: { type: 'highball', label: 'Vaso alto' },
  coupe: { type: 'coupe', label: 'Copa coupe' },
  'champagne coupe': { type: 'coupe', label: 'Copa coupe' },
  martini: { type: 'martini', label: 'Copa de martini' },
  cocktail: { type: 'martini', label: 'Copa de martini' },
  hurricane: { type: 'hurricane', label: 'Copa hurricane' },
  'poco grande': { type: 'hurricane', label: 'Copa hurricane' },
  wine: { type: 'wine', label: 'Copa balón' },
  balloon: { type: 'wine', label: 'Copa balón' },
  copa: { type: 'wine', label: 'Copa balón' },
  shot: { type: 'shot', label: 'Vaso shot' },
  shooter: { type: 'shot', label: 'Vaso shot' },
};

const TONE_MAP: Record<string, string> = {
  gin: 'blue',
  vodka: 'violet',
  rum: 'teal',
  tequila: 'green',
  mezcal: 'green',
  whiskey: 'orange',
  whisky: 'orange',
  bourbon: 'orange',
  rye: 'orange',
  brandy: 'amber',
  cognac: 'amber',
  pisco: 'amber',
  aperol: 'red',
  campari: 'red',
  cachaça: 'emerald',
  cachaca: 'emerald',
};

const CATEGORY_TAGS: Record<string, string> = {
  negroni: 'Clásico',
  manhattan: 'Clásico',
  'old fashioned': 'Clásico',
  margarita: 'Clásico',
  daiquiri: 'Clásico',
  martini: 'Clásico',
  gimlet: 'Clásico',
  sidecar: 'Clásico',
  tropical: 'Tropical',
  tiki: 'Tropical',
  colada: 'Tropical',
  frozen: 'Tropical',
  mojito: 'Refrescante',
  spritz: 'Refrescante',
  fizz: 'Refrescante',
  cooler: 'Refrescante',
  sour: 'Sour',
  flip: 'Sour',
};

function inferCategory(name: string, tags: string[]): string {
  const nameLower = name.toLowerCase();
  for (const [key, cat] of Object.entries(CATEGORY_TAGS)) {
    if (nameLower.includes(key)) return cat;
  }
  const tagLower = tags.map((t) => t.toLowerCase());
  if (tagLower.some((t) => ['tropical', 'tiki', 'colada'].includes(t))) return 'Tropical';
  if (tagLower.some((t) => ['sour', 'flip'].includes(t))) return 'Sour';
  if (tagLower.some((t) => ['fizz', 'spritz', 'cooler', 'julep', 'swizzle'].includes(t))) return 'Refrescante';
  return 'Clásico';
}

function inferTemperature(glass: string, tags: string[]): string {
  if (tags.some((t) => t.toLowerCase() === 'frozen')) return 'Frozen';
  if (['shot', 'martini', 'coupe'].includes(glass)) return 'Sin hielo';
  return 'Con hielo';
}

function inferToneColor(ingredientNames: string[]): string {
  for (const name of ingredientNames) {
    const lower = name.toLowerCase();
    for (const [key, tone] of Object.entries(TONE_MAP)) {
      if (lower.includes(key)) return tone;
    }
  }
  return 'amber';
}

function normalizeGlass(glass: string): { type: string; label: string } {
  const lower = glass.toLowerCase();
  for (const [key, val] of Object.entries(GLASS_MAP)) {
    if (lower.includes(key)) return val;
  }
  return { type: 'rocks', label: 'Vaso bajo' };
}

function splitIntoSteps(instructions: string): string[] {
  // Split on sentence boundaries
  return instructions
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 5);
}

// --- API helpers ---

async function directusRequest(method: string, path: string, body?: unknown) {
  const res = await fetch(`${DIRECTUS_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${method} ${path} → ${res.status}: ${text.slice(0, 200)}`);
  }
  return res.json();
}

async function uploadImage(imageUrl: string, filename: string, cocktailName: string): Promise<string | null> {
  try {
    const imgRes = await fetch(imageUrl);
    if (!imgRes.ok) return null;
    const blob = await imgRes.blob();
    const form = new FormData();
    form.append('file', blob, filename);
    form.append('title', cocktailName);
    const res = await fetch(`${DIRECTUS_URL}/files`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${DIRECTUS_TOKEN}` },
      body: form,
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data?.id ?? null;
  } catch {
    return null;
  }
}

interface BarAssistantData {
  _id: string;
  name: string;
  instructions?: string;
  description?: string;
  source?: string;
  garnish?: string;
  abv?: number;
  tags?: string[];
  glass?: string;
  method?: string;
  images?: Array<{ uri: string; sort: number; copyright?: string; placeholder_hash?: string }>;
  ingredients?: Array<{ _id: string; name: string; amount?: number; units?: string; sort?: number; optional?: boolean }>;
}

async function importCocktail(slug: string): Promise<boolean> {
  try {
    // Fetch cocktail data.json
    const dataRes = await fetch(`${GITHUB_RAW}/data/cocktails/${slug}/data.json`);
    if (!dataRes.ok) return false;
    const data: BarAssistantData = await dataRes.json();

    const glass = normalizeGlass(data.glass ?? 'rocks');
    const tags = data.tags ?? [];
    const ingredientNames = (data.ingredients ?? []).map((i) => i.name);
    const category = inferCategory(data.name, tags);
    const temperature = inferTemperature(glass.type, tags);
    const toneColor = inferToneColor(ingredientNames);
    const steps = splitIntoSteps(data.instructions ?? '');

    // Check if already exists
    const existing = await directusRequest('GET', `/items/cocktails?filter[slug][_eq]=${slug}&limit=1`);
    if (existing.data?.length > 0) {
      console.log(`[import] ~ Already exists: ${data.name}`);
      return true;
    }

    // Upload primary image
    let imageFileId: string | null = null;
    if (data.images && data.images.length > 0) {
      const img = data.images.find((i) => i.sort === 1) ?? data.images[0];
      const filename = img.uri.split('/').pop() ?? `${slug}-1.jpg`;
      const imageUrl = `${GITHUB_RAW}/data/cocktails/${slug}/${filename}`;
      imageFileId = await uploadImage(imageUrl, filename, data.name);
    }

    // Create cocktail
    const cocktailRes = await directusRequest('POST', '/items/cocktails', {
      slug: data._id,
      name: data.name,
      description: data.description ?? '',
      base_spirit: ingredientNames[0] ?? '',
      category,
      country: '',
      temperature,
      abv: data.abv ?? 0,
      preparation_time: Math.max(3, steps.length + 1),
      difficulty: steps.length > 5 ? 'Medio' : 'Fácil',
      glass_type: glass.type,
      glass_label: glass.label,
      garnish: data.garnish ?? '',
      tone_color: toneColor,
      instructions: data.instructions ?? '',
      tags,
      source: data.source ?? '',
      status: 'published',
    });

    const cocktailId = cocktailRes.data?.id;
    if (!cocktailId) throw new Error('No ID returned for cocktail');

    // Create ingredients
    for (const ing of (data.ingredients ?? [])) {
      const amount = ing.amount != null
        ? `${ing.amount}${ing.units ? ' ' + ing.units : ''}`
        : '';
      await directusRequest('POST', '/items/cocktail_ingredients', {
        cocktail_id: cocktailId,
        name: ing.name,
        amount,
        sort: ing.sort ?? 1,
        optional: ing.optional ?? false,
      });
    }

    // Create steps
    for (let i = 0; i < steps.length; i++) {
      await directusRequest('POST', '/items/cocktail_steps', {
        cocktail_id: cocktailId,
        step_number: i + 1,
        instruction: steps[i],
      });
    }

    // Attach image file
    if (imageFileId) {
      await directusRequest('POST', '/files/import', {}).catch(() => null);
      // Link via directus_files junction
      try {
        await directusRequest('POST', '/items/cocktails_files', {
          cocktails_id: cocktailId,
          directus_files_id: imageFileId,
          sort: 1,
        });
      } catch {
        // Junction table may not exist; file still uploaded
      }
    }

    return true;
  } catch (e: any) {
    console.error(`[import] ✗ Error importing ${slug}: ${e.message}`);
    return false;
  }
}

async function main() {
  console.log(`[import] Connecting to Directus at ${DIRECTUS_URL}`);
  console.log('[import] Fetching cocktail list from bar-assistant/data...');

  const listRes = await fetch(`${GITHUB_API}/data/cocktails`);
  if (!listRes.ok) throw new Error(`GitHub API error: ${listRes.status}`);
  const list: Array<{ name: string; type: string }> = await listRes.json();

  const slugs = list.filter((e) => e.type === 'dir').map((e) => e.name);
  console.log(`[import] Found ${slugs.length} cocktails to import`);

  let ok = 0;
  let fail = 0;

  for (const slug of slugs) {
    process.stdout.write(`[import] Importing ${slug}... `);
    const success = await importCocktail(slug);
    if (success) {
      ok++;
      process.stdout.write('OK\n');
    } else {
      fail++;
    }
    // Small delay to avoid rate limiting
    await new Promise((r) => setTimeout(r, 100));
  }

  console.log(`\n[import] Done: ${ok} imported, ${fail} failed`);
}

main().catch((e) => {
  console.error('[import] Fatal error:', e.message);
  process.exit(1);
});
