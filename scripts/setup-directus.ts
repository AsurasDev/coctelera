/**
 * Creates Directus collections for Coctelera.
 * Run: DIRECTUS_URL=http://localhost:8055 DIRECTUS_TOKEN=<token> npx tsx scripts/setup-directus.ts
 */

const DIRECTUS_URL = process.env.DIRECTUS_URL ?? 'http://localhost:8055';
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN ?? '';

if (!DIRECTUS_TOKEN) {
  console.error('[setup] Error: DIRECTUS_TOKEN env var is required');
  process.exit(1);
}

const headers = {
  Authorization: `Bearer ${DIRECTUS_TOKEN}`,
  'Content-Type': 'application/json',
};

async function request(method: string, path: string, body?: unknown) {
  const res = await fetch(`${DIRECTUS_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${method} ${path} → ${res.status}: ${text}`);
  }
  return res.json();
}

async function createCollection(name: string, fields: unknown[]) {
  try {
    await request('POST', '/collections', {
      collection: name,
      meta: { icon: 'local_bar', color: '#2563eb' },
      schema: { name },
      fields,
    });
    console.log(`[setup] ✓ Created collection: ${name}`);
  } catch (e: any) {
    if (e.message?.includes('already exists') || e.message?.includes('UNIQUE')) {
      console.log(`[setup] ~ Collection already exists: ${name}`);
    } else {
      throw e;
    }
  }
}

const cocktailsFields = [
  { field: 'id', type: 'uuid', meta: { hidden: true, readonly: true }, schema: { is_primary_key: true, has_auto_increment: false } },
  { field: 'status', type: 'string', meta: { width: 'half', options: { choices: [{ text: 'Published', value: 'published' }, { text: 'Draft', value: 'draft' }, { text: 'Archived', value: 'archived' }] }, interface: 'select-dropdown' }, schema: { default_value: 'draft', is_nullable: false } },
  { field: 'date_created', type: 'timestamp', meta: { special: ['date-created'], readonly: true, hidden: true } },
  { field: 'date_updated', type: 'timestamp', meta: { special: ['date-updated'], readonly: true, hidden: true } },
  { field: 'slug', type: 'string', meta: { interface: 'input', width: 'half', required: true }, schema: { is_unique: true, is_nullable: false } },
  { field: 'name', type: 'string', meta: { interface: 'input', width: 'half', required: true }, schema: { is_nullable: false } },
  { field: 'description', type: 'text', meta: { interface: 'input-multiline' } },
  { field: 'base_spirit', type: 'string', meta: { interface: 'input', width: 'half' } },
  { field: 'category', type: 'string', meta: { interface: 'select-dropdown', width: 'half', options: { choices: [{ text: 'Clásico', value: 'Clásico' }, { text: 'Tropical', value: 'Tropical' }, { text: 'Refrescante', value: 'Refrescante' }, { text: 'Moderno', value: 'Moderno' }, { text: 'Aperitivo', value: 'Aperitivo' }, { text: 'Sour', value: 'Sour' }] } } },
  { field: 'country', type: 'string', meta: { interface: 'input', width: 'half' } },
  { field: 'temperature', type: 'string', meta: { interface: 'select-dropdown', width: 'half', options: { choices: [{ text: 'Con hielo', value: 'Con hielo' }, { text: 'Sin hielo', value: 'Sin hielo' }, { text: 'Frozen', value: 'Frozen' }] } } },
  { field: 'abv', type: 'decimal', meta: { interface: 'input', width: 'half' }, schema: { numeric_precision: 5, numeric_scale: 2 } },
  { field: 'preparation_time', type: 'integer', meta: { interface: 'input', width: 'half' } },
  { field: 'difficulty', type: 'string', meta: { interface: 'select-dropdown', width: 'half', options: { choices: [{ text: 'Fácil', value: 'Fácil' }, { text: 'Medio', value: 'Medio' }, { text: 'Difícil', value: 'Difícil' }] } } },
  { field: 'glass_type', type: 'string', meta: { interface: 'select-dropdown', width: 'half', options: { choices: [{ text: 'Rocks', value: 'rocks' }, { text: 'Highball', value: 'highball' }, { text: 'Coupe', value: 'coupe' }, { text: 'Martini', value: 'martini' }, { text: 'Hurricane', value: 'hurricane' }, { text: 'Wine/Balloon', value: 'wine' }, { text: 'Shot', value: 'shot' }] } } },
  { field: 'glass_label', type: 'string', meta: { interface: 'input', width: 'half' } },
  { field: 'garnish', type: 'string', meta: { interface: 'input', width: 'half' } },
  { field: 'tone_color', type: 'string', meta: { interface: 'select-dropdown', width: 'half', options: { choices: [{ text: 'Blue', value: 'blue' }, { text: 'Teal', value: 'teal' }, { text: 'Green', value: 'green' }, { text: 'Violet', value: 'violet' }, { text: 'Orange', value: 'orange' }, { text: 'Red', value: 'red' }, { text: 'Emerald', value: 'emerald' }, { text: 'Amber', value: 'amber' }] } } },
  { field: 'instructions', type: 'text', meta: { interface: 'input-multiline' } },
  { field: 'tags', type: 'json', meta: { interface: 'tags' } },
  { field: 'source', type: 'string', meta: { interface: 'input' } },
];

const ingredientsFields = [
  { field: 'id', type: 'integer', meta: { hidden: true, readonly: true }, schema: { is_primary_key: true, has_auto_increment: true } },
  { field: 'cocktail_id', type: 'uuid', meta: { hidden: true }, schema: { is_nullable: false } },
  { field: 'name', type: 'string', meta: { interface: 'input', width: 'half', required: true }, schema: { is_nullable: false } },
  { field: 'amount', type: 'string', meta: { interface: 'input', width: 'half' } },
  { field: 'sort', type: 'integer', meta: { interface: 'input', width: 'half' }, schema: { default_value: 1 } },
  { field: 'optional', type: 'boolean', meta: { interface: 'boolean', width: 'half' }, schema: { default_value: false } },
  { field: 'note', type: 'string', meta: { interface: 'input' } },
];

const stepsFields = [
  { field: 'id', type: 'integer', meta: { hidden: true, readonly: true }, schema: { is_primary_key: true, has_auto_increment: true } },
  { field: 'cocktail_id', type: 'uuid', meta: { hidden: true }, schema: { is_nullable: false } },
  { field: 'step_number', type: 'integer', meta: { interface: 'input', width: 'half', required: true }, schema: { is_nullable: false } },
  { field: 'instruction', type: 'text', meta: { interface: 'input-multiline', required: true }, schema: { is_nullable: false } },
];

async function main() {
  console.log(`[setup] Connecting to Directus at ${DIRECTUS_URL}`);

  // Verify connection
  const info = await request('GET', '/server/info');
  console.log(`[setup] Directus version: ${info.data?.version ?? 'unknown'}`);

  await createCollection('cocktails', cocktailsFields);
  await createCollection('cocktail_ingredients', ingredientsFields);
  await createCollection('cocktail_steps', stepsFields);

  // Add relations
  const relations = [
    {
      collection: 'cocktail_ingredients',
      field: 'cocktail_id',
      related_collection: 'cocktails',
      meta: { many_collection: 'cocktail_ingredients', many_field: 'cocktail_id', one_collection: 'cocktails' },
      schema: { on_delete: 'CASCADE' },
    },
    {
      collection: 'cocktail_steps',
      field: 'cocktail_id',
      related_collection: 'cocktails',
      meta: { many_collection: 'cocktail_steps', many_field: 'cocktail_id', one_collection: 'cocktails' },
      schema: { on_delete: 'CASCADE' },
    },
  ];

  for (const rel of relations) {
    try {
      await request('POST', '/relations', rel);
      console.log(`[setup] ✓ Created relation: ${rel.collection}.${rel.field} → ${rel.related_collection}`);
    } catch (e: any) {
      if (e.message?.includes('already exists') || e.message?.includes('UNIQUE') || e.message?.includes('duplicate')) {
        console.log(`[setup] ~ Relation already exists: ${rel.collection}.${rel.field}`);
      } else {
        console.warn(`[setup] Warning creating relation: ${e.message}`);
      }
    }
  }

  console.log('[setup] ✓ Directus schema setup complete');
}

main().catch((e) => {
  console.error('[setup] Error:', e.message);
  process.exit(1);
});
