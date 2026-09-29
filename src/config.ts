export const SITE = {
  title: 'Tengo una Teoría',
  tagline: 'Apuntes sobre arquetipos, intuición, emociones, símbolos, mitología, neurociencia y arte',
  description: 'Ensayos sobre intuición, arquetipos, emociones y consciencia.',
  author: 'Selene Rios', // cámbialo: aparece en los datos estructurados (SEO)
  substack: 'https://substack.com/@tengounateoria',
};
// Cada categoría es una moleskine en la home. Para sumar una: agrégala aquí y dale color en global.css ([data-c="..."])
export const CATS = ['Apuntes sobre la Intuición', 'Emociones Arquetípicas', 'El Árbol de Arquetipos'] as const;
export const slugify = (s: string) =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
// Títulos con una palabra destacada: en el frontmatter se marca con *palabra* (o **palabra**).
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export const tituloHTML = (s: string) =>
  esc(s).replace(/\*\*(.+?)\*\*|\*(.+?)\*/g, (_m, a, b) => `<strong class="destacada">${a ?? b}</strong>`);
export const tituloPlano = (s: string) => s.replace(/\*\*(.+?)\*\*|\*(.+?)\*/g, (_m, a, b) => a ?? b);
// URL respetando el "base" (necesario en GitHub Pages)
export const u = (p = '') => `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${p.replace(/^\//, '')}`;
