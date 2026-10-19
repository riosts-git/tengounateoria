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
  "Intro": "Por qué escribí esto y la pregunta de fondo.",
  "Intuición": "Cómo predice la mente: instinto, intuición e intelecto.",
  "El arco": "Las variables de una emoción y su recorrido.",
  "Emociones arquetípicas": "Las nueve emociones arquetípicas y lo que hacemos con ellas: sentimientos, estados de ánimo, géneros.",
  "El árbol de arquetipos": "El mapa que resultó de todo esto y sus lecturas: la biología, el héroe, la vida y la creación.",
};
// Orden de las partes en el índice: primero el libro, después los grupos de observaciones
export const ORDEN_PARTES = ["Intro", "Intuición", "El arco", "Emociones arquetípicas", "El árbol de arquetipos",
  "Observaciones: Intuición", "Observaciones: Emociones arquetípicas", "Observaciones: Árbol de Arquetipos", "Observaciones: Consciencia", "Observaciones: Tarot", "Observaciones: El humor", "Observaciones: Reflexiones personales"];
// Grupos de observaciones (y capítulos que se leen como observación), en orden de lectura
export const OBS_GRUPOS: Record<string, string[]> = {
  "Observaciones: Intuición": [
    "reinterpretando-a-darwin",
    "los-sesgos-el-instinto-y-la-intuicion",
    "existe-la-intuicion-femenina",
    "genero-y-polaridad",
    "intuicion-y-terapia",
    "caperucita-roja-y-la-intuicion",
    "joy-milne-y-lo-mistico",
    "intuicion-extraordinaria",
    "intuicion-y-creatividad",
    "intuicion-y-meditacion",
    "prediccion-confianza-y-aprendizaje",
    "la-atencion",
    "el-umbral-de-la-atencion",
    "el-aburrimiento",
    "quien-saca-la-basura"
  ],
  "Observaciones: Emociones arquetípicas": [
    "lista-de-emociones-arquetipicas",
    "el-amor-y-el-odio",
    "la-indiferencia",
    "objeto-y-sujeto-de-deseo",
    "enamorarse",
    "empatia",
    "adiccion",
    "ansiedad-y-depresion",
    "valiente-no-es-quien-no-tiene-miedo",
    "el-valor-y-la-valentia",
    "como-leer-una-emocion",
    "nombrar",
    "los-cuatro-humores"
  ],
  "Observaciones: Árbol de Arquetipos": [
    "los-nodos",
    "los-ejes",
    "los-planos",
    "el-fucking-nodo-5",
    "el-verde",
    "la-mujer-de-vitruvio",
    "el-trickster",
    "otras-disciplinas",
    "axis-mundi",
    "el-fruto",
    "la-serpiente",
    "el-siete",
    "el-arbol-de-la-vida",
    "el-arbol-y-el-hermetismo",
    "el-arbol-y-el-i-ching",
    "el-arbol-y-el-budismo",
    "y-jung",
    "gandalf",
    "la-pureza-arquetipica",
    "grafos-arboles-y-redes",
    "tres-veces-grande",
    "primavera-verano-otono-y-amarillo",
    "el-arbol-y-la-sociologia",
    "las-ondas-del-arco",
    "bien-y-mal",
    "no-existe-el-mal",
    "bendecir-y-maldecir",
    "la-ignorancia",
    "el-encuentro",
    "firmar-la-obra",
    "el-limite",
    "los-umbrales-sensibles",
    "el-flow",
    "los-umbrales-del-viaje"
  ],
  "Observaciones: Consciencia": [
    "la-consciencia",
    "la-escala-de-la-consciencia",
    "sujeto-y-predicado",
    "psique",
    "la-consciencia-colectiva",
    "las-consciencias-atribuidas",
    "el-anima",
    "la-intencion",
    "el-fuego-de-prometeo",
    "caos-y-cosmos"
  ],
  "Observaciones: Tarot": [
    "los-arquetipos-del-tarot",
    "la-carta-sin-nombre",
    "se-muere-dos-veces",
    "coronados-de-gloria",
    "nostalgia",
    "kleos-o-nostos",
    "alejandro-ante-la-tumba-de-aquiles"
  ],
  "Observaciones: El humor": [
    "el-humor-y-el-aprendizaje",
    "las-tres-risas"
  ],
  "Observaciones: Reflexiones personales": [
    "menos-que-un-cabalista",
    "el-tdah-desde-el-arbol",
    "mis-conclusiones",
    "acomode-el-mundo-a-la-cabala",
    "un-modelo-que-explica-todo"
  ]
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
