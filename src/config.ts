export const SITE = {
  title: 'Tengo una Teoría',
  tagline: 'Apuntes sobre arquetipos, intuición, emociones, símbolos, mitología, neurociencia y arte',
  description: 'Ensayos sobre intuición, arquetipos, emociones y consciencia.',
  author: 'Selene Rios', // cámbialo: aparece en los datos estructurados (SEO)
  substack: 'https://substack.com/@tengounateoria',
};
// Cada categoría es una moleskine en la home. Para sumar una: agrégala aquí y dale color en global.css ([data-c="..."])
export const CATS = ['Apuntes sobre la Intuición', 'Emociones Arquetípicas', 'El Árbol de Arquetipos'] as const;
// Una línea que presenta cada parte de un cuaderno (se muestra en la home, bajo el nombre de la parte).
export const PARTES: Record<string, string> = {
  'Las palabras y la mente': 'Qué entendemos por intuición, mente y psique, y el modelo de los tres niveles.',
  'Cómo funciona la intuición': 'El cuerpo, la emoción, la atención y la memoria: cómo se forma una corazonada.',
  '¿Podemos confiar en ella?': 'Cuándo acierta, cuándo se equivoca y cómo recuperarla.',
  'El arco': 'Qué es una emoción y el recorrido que hace cada vez que algo nos pasa.',
  'Las emociones': 'Las emociones arquetípicas y lo que hacemos con ellas: sentimientos, estados de ánimo e historias.',
  'El árbol': 'De dónde salió el árbol, qué es un arquetipo y cómo está armado el modelo.',
  'El árbol en la experiencia': 'El mismo recorrido en las emociones, la vida, la lengua, las historias, la creación y la gloria.',
  'El árbol en las tradiciones': 'La Cábala, el I Ching, el budismo y el hermetismo, leídos desde el árbol.',
  'Nodo por nodo': 'Cada nodo, mirado desde todas las lecturas a la vez.',
};
export const slugify =(s: string) =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
// Títulos con una palabra destacada: en el frontmatter se marca con *palabra* (o **palabra**).
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export const tituloHTML = (s: string) =>
  esc(s).replace(/\*\*(.+?)\*\*|\*(.+?)\*/g, (_m, a, b) => `<strong class="destacada">${a ?? b}</strong>`);
export const tituloPlano = (s: string) => s.replace(/\*\*(.+?)\*\*|\*(.+?)\*/g, (_m, a, b) => a ?? b);
// URL respetando el "base" (necesario en GitHub Pages)
export const u = (p = '') => `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${p.replace(/^\//, '')}`;
