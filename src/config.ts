export const SITE = {
  title: 'Tengo una Teoría',
  tagline: 'ensayos, libros e imágenes',
  description: 'Ensayos, libros e imágenes sobre intuición, emociones arquetípicas, el árbol de arquetipos y consciencia.',
  author: 'Selene Rios', // cámbialo: aparece en los datos estructurados (SEO)
};
export const CATS = ['intuición', 'emociones arquetípicas', 'el árbol de arquetipos', 'consciencia'] as const;
export const DIR = { ensayo: 'ensayos', libro: 'libros', foto: 'fotos' } as const;
export const slugify = (s: string) =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
// URL respetando el "base" (necesario en GitHub Pages)
export const u = (p = '') => `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${p.replace(/^\//, '')}`;
