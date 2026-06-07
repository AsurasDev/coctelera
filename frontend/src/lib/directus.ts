const DIRECTUS_URL = import.meta.env.DIRECTUS_URL as string;
const DIRECTUS_TOKEN = import.meta.env.DIRECTUS_TOKEN as string;

if (!DIRECTUS_URL) throw new Error('DIRECTUS_URL env var is required');
if (!DIRECTUS_TOKEN) throw new Error('DIRECTUS_TOKEN env var is required');

const authHeaders = {
  Authorization: `Bearer ${DIRECTUS_TOKEN}`,
  'Content-Type': 'application/json',
};

// --- Types ---

export interface CocktailSummary {
  slug: string;
  name: string;
  base_spirit: string;
  category: string;
  country: string;
  temperature: string;
  abv: number;
  difficulty: string;
  glass_type: string;
  glass_label: string;
  garnish?: string;
  tone_color: string;
  image?: string;
  imageUrl?: string;
}

export interface CocktailIngredient {
  id: number;
  name: string;
  amount: string;
  sort: number;
  optional: boolean;
  note?: string;
}

export interface CocktailStep {
  id: number;
  step_number: number;
  instruction: string;
}

export interface Cocktail extends CocktailSummary {
  id: string;
  description: string;
  preparation_time: number;
  instructions: string;
  tags?: string[];
  source?: string;
  ingredients: CocktailIngredient[];
  steps: CocktailStep[];
}

// --- Fetch functions ---

export async function fetchAllCocktails(): Promise<Cocktail[]> {
  const fields = [
    'id', 'slug', 'name', 'description', 'base_spirit', 'category', 'country',
    'temperature', 'abv', 'preparation_time', 'difficulty', 'glass_type', 'glass_label',
    'garnish', 'tone_color', 'instructions', 'tags', 'source', 'image',
    'ingredients.id', 'ingredients.name', 'ingredients.amount', 'ingredients.sort', 'ingredients.optional', 'ingredients.note',
    'steps.id', 'steps.step_number', 'steps.instruction',
  ].join(',');

  const url = `${DIRECTUS_URL}/items/cocktails?fields=${fields}&filter[status][_eq]=published&sort=name&limit=-1`;

  const res = await fetch(url, { headers: authHeaders });
  if (!res.ok) throw new Error(`Failed to fetch cocktails: ${res.status}`);

  const json = await res.json();
  const items = (json.data ?? []) as any[];
  return items.map(normalizeCocktail);
}

export async function fetchCocktailBySlug(slug: string): Promise<Cocktail | null> {
  const fields = [
    'id', 'slug', 'name', 'description', 'base_spirit', 'category', 'country',
    'temperature', 'abv', 'preparation_time', 'difficulty', 'glass_type', 'glass_label',
    'garnish', 'tone_color', 'instructions', 'tags', 'source',
    'ingredients.id', 'ingredients.name', 'ingredients.amount', 'ingredients.sort', 'ingredients.optional', 'ingredients.note',
    'steps.id', 'steps.step_number', 'steps.instruction',
  ].join(',');

  const url = `${DIRECTUS_URL}/items/cocktails?fields=${fields}&filter[slug][_eq]=${slug}&filter[status][_eq]=published&limit=1`;

  const res = await fetch(url, { headers: authHeaders });
  if (!res.ok) return null;

  const json = await res.json();
  const item = json.data?.[0];
  return item ? normalizeCocktail(item) : null;
}

function normalizeCocktail(item: any): Cocktail {
  const ingredients: CocktailIngredient[] = (item.ingredients ?? [])
    .sort((a: any, b: any) => (a.sort ?? 0) - (b.sort ?? 0));

  const steps: CocktailStep[] = (item.steps ?? [])
    .sort((a: any, b: any) => (a.step_number ?? 0) - (b.step_number ?? 0));

  return {
    id: item.id,
    slug: item.slug,
    name: item.name,
    description: item.description ?? '',
    base_spirit: item.base_spirit ?? '',
    category: item.category ?? 'Clásico',
    country: item.country ?? '',
    temperature: item.temperature ?? 'Con hielo',
    abv: item.abv ?? 0,
    preparation_time: item.preparation_time ?? 5,
    difficulty: item.difficulty ?? 'Fácil',
    glass_type: item.glass_type ?? 'rocks',
    glass_label: item.glass_label ?? 'Vaso',
    garnish: item.garnish,
    tone_color: item.tone_color ?? 'blue',
    instructions: item.instructions ?? '',
    tags: item.tags ?? [],
    source: item.source,
    image: item.image ?? undefined,
    imageUrl: undefined,
    ingredients,
    steps,
  };
}

export function imageUrl(fileId: string, opts?: { width?: number; height?: number; fit?: string; format?: string; quality?: number }): string {
  const params = new URLSearchParams();
  if (opts?.width)   params.set('width', String(opts.width));
  if (opts?.height)  params.set('height', String(opts.height));
  if (opts?.fit)     params.set('fit', opts.fit);
  if (opts?.format)  params.set('format', opts.format);
  if (opts?.quality) params.set('quality', String(opts.quality));
  const qs = params.toString();
  return `${DIRECTUS_URL}/assets/${fileId}${qs ? '?' + qs : ''}`;
}
