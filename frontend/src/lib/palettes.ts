export interface Palette {
  id: string;
  label: string;
  bg: string;
  bgAlt: string;
  surface: string;
  ink: string;
  inverse: string;
  muted: string;
  primary: string;
  primaryFg: string;
  warn: string;
  swatch: [string, string, string]; // [accent, bg, ink]
}

export const PALETTES: Palette[] = [
  { id: 'cobalto',    label: 'Cobalto',    bg: '#f4f1e6', bgAlt: '#e9e5d6', surface: '#ffffff', ink: '#0f0f0f', inverse: '#faf9f7', muted: '#5c5c5c', primary: '#2563eb', primaryFg: '#ffffff', warn: '#f5c518', swatch: ['#2563eb', '#f4f1e6', '#0f0f0f'] },
  { id: 'pomelo',     label: 'Pomelo',     bg: '#fdeae2', bgAlt: '#f6ddd2', surface: '#fffdfb', ink: '#2a120c', inverse: '#fff6f1', muted: '#8a5648', primary: '#e8472b', primaryFg: '#ffffff', warn: '#ffc93c', swatch: ['#e8472b', '#fdeae2', '#2a120c'] },
  { id: 'menta',      label: 'Menta',      bg: '#e6f2ea', bgAlt: '#d8e9de', surface: '#ffffff', ink: '#0b2118', inverse: '#f2faf5', muted: '#426152', primary: '#0f9d58', primaryFg: '#ffffff', warn: '#f4e04d', swatch: ['#0f9d58', '#e6f2ea', '#0b2118'] },
  { id: 'uva',        label: 'Uva',        bg: '#eee9fb', bgAlt: '#e2dbf4', surface: '#ffffff', ink: '#1b1033', inverse: '#f6f3ff', muted: '#5a4d79', primary: '#6d28d9', primaryFg: '#ffffff', warn: '#ffd84d', swatch: ['#6d28d9', '#eee9fb', '#1b1033'] },
  { id: 'arena',      label: 'Arena',      bg: '#f3ead9', bgAlt: '#e8dcc6', surface: '#fffaf0', ink: '#241a0e', inverse: '#fdf6ea', muted: '#6f5d44', primary: '#0e7c86', primaryFg: '#ffffff', warn: '#e9b949', swatch: ['#0e7c86', '#f3ead9', '#241a0e'] },
  { id: 'carbon',     label: 'Carbón',     bg: '#18171c', bgAlt: '#242229', surface: '#242229', ink: '#f1ede1', inverse: '#18171c', muted: '#9a958a', primary: '#ffd166', primaryFg: '#18171c', warn: '#e23b6d', swatch: ['#ffd166', '#18171c', '#f1ede1'] },
  { id: 'chicle',     label: 'Chicle',     bg: '#ffe9f3', bgAlt: '#ffd7e8', surface: '#fffafc', ink: '#2b0d1c', inverse: '#fff3f8', muted: '#8a4866', primary: '#e0218a', primaryFg: '#ffffff', warn: '#ffd23f', swatch: ['#e0218a', '#ffe9f3', '#2b0d1c'] },
  { id: 'cielo',      label: 'Cielo',      bg: '#e4f0fb', bgAlt: '#d2e6f7', surface: '#ffffff', ink: '#0a1d33', inverse: '#f1f8ff', muted: '#3f5972', primary: '#ff6b35', primaryFg: '#ffffff', warn: '#ffcf33', swatch: ['#ff6b35', '#e4f0fb', '#0a1d33'] },
  { id: 'limon',      label: 'Limón',      bg: '#fcf6d8', bgAlt: '#f6edc0', surface: '#fffdf2', ink: '#1f1d08', inverse: '#fffce8', muted: '#6b6320', primary: '#d4163c', primaryFg: '#ffffff', warn: '#c2e02f', swatch: ['#d4163c', '#fcf6d8', '#1f1d08'] },
  { id: 'oxido',      label: 'Óxido',      bg: '#f7e8df', bgAlt: '#efd9cb', surface: '#fffaf6', ink: '#2a160d', inverse: '#fdf4ee', muted: '#7d5444', primary: '#c2410c', primaryFg: '#ffffff', warn: '#f0b429', swatch: ['#c2410c', '#f7e8df', '#2a160d'] },
  { id: 'pizarra',    label: 'Pizarra',    bg: '#e8ebef', bgAlt: '#d7dce3', surface: '#ffffff', ink: '#11151c', inverse: '#f3f5f8', muted: '#4f5864', primary: '#d6336c', primaryFg: '#ffffff', warn: '#f2c14e', swatch: ['#d6336c', '#e8ebef', '#11151c'] },
  { id: 'medianoche', label: 'Medianoche', bg: '#0e1726', bgAlt: '#16233a', surface: '#16233a', ink: '#e7eefb', inverse: '#0e1726', muted: '#8aa0bf', primary: '#38bdf8', primaryFg: '#0e1726', warn: '#fb7185', swatch: ['#38bdf8', '#0e1726', '#e7eefb'] },
  { id: 'cereza',     label: 'Cereza',     bg: '#fbe4e6', bgAlt: '#f5cdd1', surface: '#fffafb', ink: '#2a0a10', inverse: '#fff4f5', muted: '#8a4750', primary: '#b10f2e', primaryFg: '#ffffff', warn: '#f4b740', swatch: ['#b10f2e', '#fbe4e6', '#2a0a10'] },
  { id: 'mostaza',    label: 'Mostaza',    bg: '#f6e7bf', bgAlt: '#eed9a3', surface: '#fffcf2', ink: '#211a08', inverse: '#fdf7e6', muted: '#6e5d2e', primary: '#1d6f6f', primaryFg: '#ffffff', warn: '#e8a13a', swatch: ['#1d6f6f', '#f6e7bf', '#211a08'] },
  { id: 'oliva',      label: 'Oliva',      bg: '#eaecd9', bgAlt: '#dde0c2', surface: '#fcfdf4', ink: '#1c1f0c', inverse: '#f6f7ea', muted: '#5b6038', primary: '#b5460f', primaryFg: '#ffffff', warn: '#c5ca4f', swatch: ['#b5460f', '#eaecd9', '#1c1f0c'] },
  { id: 'coral',      label: 'Coral',      bg: '#ffeae3', bgAlt: '#ffd6c9', surface: '#fffbf9', ink: '#2c130c', inverse: '#fff4ef', muted: '#8c5546', primary: '#ff5a5f', primaryFg: '#ffffff', warn: '#ffc24b', swatch: ['#ff5a5f', '#ffeae3', '#2c130c'] },
  { id: 'hielo',      label: 'Hielo',      bg: '#e9f4f6', bgAlt: '#d6ebef', surface: '#ffffff', ink: '#06212b', inverse: '#f1fafb', muted: '#3f6470', primary: '#0e7490', primaryFg: '#ffffff', warn: '#f2c14e', swatch: ['#0e7490', '#e9f4f6', '#06212b'] },
  { id: 'selva',      label: 'Selva',      bg: '#0d1f17', bgAlt: '#163024', surface: '#163024', ink: '#e7f3ea', inverse: '#0d1f17', muted: '#8aa899', primary: '#4ade80', primaryFg: '#0d1f17', warn: '#f43f5e', swatch: ['#4ade80', '#0d1f17', '#e7f3ea'] },
  { id: 'espresso',   label: 'Espresso',   bg: '#1c1410', bgAlt: '#2a1f18', surface: '#2a1f18', ink: '#f1e6d8', inverse: '#1c1410', muted: '#a8907c', primary: '#e8a04b', primaryFg: '#1c1410', warn: '#d9536b', swatch: ['#e8a04b', '#1c1410', '#f1e6d8'] },
  { id: 'indigo',     label: 'Índigo',     bg: '#14132b', bgAlt: '#1f1e40', surface: '#1f1e40', ink: '#e8e7fb', inverse: '#14132b', muted: '#9290c4', primary: '#818cf8', primaryFg: '#14132b', warn: '#f472b6', swatch: ['#818cf8', '#14132b', '#e8e7fb'] },
];

export const DEFAULT_PALETTE_ID = 'cobalto';

export function findPalette(id: string): Palette {
  return PALETTES.find((p) => p.id === id) ?? PALETTES[0];
}

export function paletteToVars(p: Palette): Record<string, string> {
  return {
    '--sm-color-bg':         p.bg,
    '--sm-color-bg-alt':     p.bgAlt,
    '--sm-color-surface':    p.surface,
    '--sm-ink':              p.ink,
    '--sm-color-fg-inverse': p.inverse,
    '--sm-color-fg-muted':   p.muted,
    '--sm-color-primary':    p.primary,
    '--sm-color-primary-fg': p.primaryFg,
    '--sm-color-warn':       p.warn,
  };
}
