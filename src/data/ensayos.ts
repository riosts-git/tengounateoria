// Los mismos ensayos, colores y títulos que el HTML de trabajo (contenido/ensayos/index.html).
// «capitulos»: títulos de los capítulos previstos; los que tienen .md en src/content/capitulos se pueden leer.
export const ROMANO = ['', 'I', 'II', 'III', 'IV', 'V', 'VI'];

export type Ensayo = { id: string; n: number; title: string; tint: string; acc: string; capitulos: string[] };

export const ENSAYOS: Ensayo[] = [
  {
    id: 'intuicion', n: 1, title: 'Intuición', tint: '#F2FDBF', acc: '#F2FDBF',
    capitulos: ['Mi obsesión por las palabras', 'Intuición', 'De la corazonada a la intuición', '¿Cómo saber lo que no sé?', 'Intuición y sesgo', 'Reflexiones', 'Bibliografía y Notas'],
  },
  { id: 'emociones', n: 2, title: 'Emociones Arquetípicas', tint: '#EABCB6', acc: '#EABCB6', capitulos: [] },
  { id: 'arbol', n: 3, title: 'Árbol de Arquetipos', tint: '#f3e7c9', acc: '#F3E7C9', capitulos: [] },
  { id: 'colectiva', n: 4, title: 'Consciencia Colectiva', tint: '#DCD3F0', acc: '#DCD3F0', capitulos: [] },
  { id: 'tarot', n: 5, title: 'Los Arquetipos del Tarot', tint: '#F4D3E3', acc: '#F4D3E3', capitulos: [] },
  { id: 'afuera', n: 6, title: 'Cosas que quedaron afuera', tint: '#CFE9DD', acc: '#CFE9DD', capitulos: [] },
];

export const etiqueta = (e: Ensayo) => `Ensayo ${ROMANO[e.n]} · ${e.title}`;

export const slug = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
