export const SITE = {
  title: 'Tengo una Teoría',
  tagline: 'Apuntes sobre arquetipos, intuición, emociones, símbolos, mitología, neurociencia y arte',
  description: 'Apuntes sobre intuición, arquetipos, emociones y consciencia.',
  author: 'Tatiana Ríos', // aparece en los datos estructurados (SEO)
  substack: 'https://substack.com/@tengounateoria',
};
// Cada categoría es una moleskine en la home. Para sumar una: agrégala aquí y dale color en global.css ([data-c="..."])
export const CATS = ['Tengo una teoría', 'Observaciones'] as const;
// Los tres cuadernos: nombre corto para el menú superior y dirección de su página.
// continua: se lee de corrido (el enlace del cuaderno lleva al primer ensayo y los siguientes se cargan debajo).
export const LIBROS = [
  { cat: 'Tengo una teoría', corto: 'El libro', slug: 'tengo-una-teoria', continua: true },
] as const;
export const libroDe = (cat: string) => LIBROS.find((l) => l.cat === cat) as { cat: string; corto: string; slug: string; continua?: boolean } | undefined;
// Una línea que presenta cada parte de un cuaderno (se muestra en la home, bajo el nombre de la parte).
export const PARTES: Record<string, string> = {
  'La intuición': 'Por qué escribí esto, la pregunta de fondo y cómo predice la mente: instinto, intuición e intelecto.',
  'Las emociones': 'Las variables de una emoción, las nueve emociones arquetípicas, su arco y lo que hacemos con ellas.',
  'El árbol': 'El mapa que resultó de todo esto y sus lecturas: la Cábala, la biología, el héroe, la vida y la creación.',
};
// Hojas: series de micro observaciones que se leen juntas en una sola página (/hojas/<slug>/). Cada micro lleva «hoja: <slug>».
export const HOJAS: Record<string, { titulo: string; bajada: string }> = {
  'el-poder-de-las-palabras': { titulo: 'El poder de las palabras', bajada: 'Decir es hacer: augurios, conjuros, placebos, el bien y el mal.' },
  'amor-odio-e-indiferencia': { titulo: 'Amor, odio e indiferencia', bajada: 'Qué pasa cuando lo que deseamos o rechazamos es una persona.' },
  'los-umbrales': { titulo: 'Los umbrales', bajada: 'Más allá colapsan, más acá se atrofian.' },
  'las-claves': { titulo: 'Las claves del modelo', bajada: 'Lo que hay detrás de todas las observaciones.' },
  'la-consciencia': { titulo: 'La consciencia', bajada: 'Desde dónde, para quién y para cuándo predice una mente.' },
  'la-gloria-y-el-olvido': { titulo: 'La gloria y el olvido', bajada: 'Se muere dos veces: primero el cuerpo y después, cuando nadie nos recuerda.' },
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
