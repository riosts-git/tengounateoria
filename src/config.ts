export const SITE = {
  title: 'Tengo una Teoría',
  tagline: 'Apuntes sobre arquetipos, intuición, emociones, símbolos, mitología, neurociencia y arte',
  description: 'Ensayos sobre intuición, arquetipos, emociones y consciencia.',
  author: 'Selene Rios', // cámbialo: aparece en los datos estructurados (SEO)
  substack: 'https://substack.com/@tengounateoria',
};
// Cada categoría es una moleskine en la home. Para sumar una: agrégala aquí y dale color en global.css ([data-c="..."])
export const CATS = ['Apuntes sobre la Intuición', 'Emociones Arquetípicas', 'El árbol de Arquetipos'] as const;
export const slugify = (s: string) =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
// URL respetando el "base" (necesario en GitHub Pages)
export const u = (p = '') => `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${p.replace(/^\//, '')}`;
