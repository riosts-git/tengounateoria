export const SITE = {
  title: 'Tengo una Teoría',
  tagline: 'Apuntes sobre arquetipos, intuición, emociones, símbolos, mitología, neurociencia y arte',
  description: 'Ensayos, libros e imágenes sobre intuición, emociones arquetípicas, el árbol de arquetipos y consciencia.',
  author: 'Selene Rios', // cámbialo: aparece en los datos estructurados (SEO)
};
export const CATS = ['Apuntes sobre la Intuición', 'Emociones Arquetípicas', 'El Árbol de Arquetipos', 'Apuntes sobre la Consciencia', 'Apuntes varios'] as const;
export const DIR = { ensayo: 'ensayos', libro: 'libros', foto: 'fotos' } as const;
export const slugify = (s: string) =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
// URL respetando el "base" (necesario en GitHub Pages)
export const u = (p = '') => `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${p.replace(/^\//, '')}`;
