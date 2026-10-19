import { getCollection, type CollectionEntry } from 'astro:content';
import { CATS, u, slugify, ORDEN_PARTES, OBS_GRUPOS } from '../config';

// El cuaderno y el orden salen de dónde está el archivo: «3 El Árbol de Arquetipos/08-el-camino-del-heroe.md»
// es el ensayo 8 del tercer cuaderno. Así, mover o renumerar un archivo en Obsidian alcanza para reordenar el sitio.
export const datos = (e: CollectionEntry<'ensayos'>) => {
  const ruta = (e.filePath ?? '').replace(/\\/g, '/');
  const libro = Number(ruta.match(/ensayos\/(\d+)[^/]*\//)?.[1] ?? 0);
  const orden = Number(ruta.split('/').pop()?.match(/^(\d+)-/)?.[1] ?? 999);
  const grupo = Object.entries(OBS_GRUPOS).find(([, ids]) => ids.includes(e.id));
  const parte = grupo?.[0] ?? e.data.parte;
  return { ...e.data, parte, categoria: CATS[libro - 1] ?? 'Observaciones', orden: grupo ? grupo[1].indexOf(e.id) : orden };
};

export async function getPosts() {
  const list = await getCollection('ensayos', ({ data }) => !data.draft);
  return list
    .map((e) => ({ id: e.id, ...datos(e), href: u(`ensayos/${e.id}/`) }))
    .sort((a, b) => +b.date - +a.date);
}

// Orden de lectura dentro de un cuaderno: el número del archivo y, si coincide, la fecha.
const iParte = (p?: string) => { const i = ORDEN_PARTES.indexOf(p ?? ''); return i < 0 ? ORDEN_PARTES.length : i; };
export const byOrden = (a: { parte?: string; orden?: number; date: Date }, b: { parte?: string; orden?: number; date: Date }) =>
  iParte(a.parte) - iParte(b.parte) || (a.orden ?? Infinity) - (b.orden ?? Infinity) || +a.date - +b.date;

// Una entrada por cuaderno, en el orden de CATS, con sus ensayos ordenados.
export async function getPostsByCat() {
  const posts = await getPosts();
  return CATS.map((name) => ({ name, posts: posts.filter((p) => p.categoria === name).sort(byOrden) }));
}

export type Post = Awaited<ReturnType<typeof getPosts>>[number];

// Agrupa los ensayos de un cuaderno por parte, respetando el orden.
export const partesDe = (ps: Post[]) => ps.reduce<{ parte: string; posts: Post[] }[]>((acc, p) => {
  const nombre = p.parte ?? 'Apuntes';
  const ultimo = acc[acc.length - 1];
  if (ultimo && ultimo.parte === nombre) ultimo.posts.push(p); else acc.push({ parte: nombre, posts: [p] });
  return acc;
}, []);

// Bajada corta de un ensayo: el subtítulo o, si no hay, la descripción sin el título repetido al principio.
export const bajada = (p: { title: string; subtitulo?: string; description: string }) => {
  if (p.subtitulo) return p.subtitulo;
  const [antes, ...resto] = p.description.split(': ');
  if (!resto.length) return p.description;
  const titulo = slugify(p.title), prefijo = slugify(antes);
  if (!titulo.startsWith(prefijo) && !prefijo.startsWith(titulo.split('-')[0])) return p.description;
  const r = resto.join(': ');
  return r.charAt(0).toUpperCase() + r.slice(1);
};

// Dirección de entrada a un cuaderno: su primer ensayo si se lee de corrido; si no, su página con el índice.
export async function entradaDe(l: { cat: string; slug: string; continua?: boolean }) {
  if (l.continua) {
    const primero = (await getPostsByCat()).find((c) => c.name === l.cat)?.posts[0];
    if (primero) return primero.href;
  }
  return u(`cuadernos/${l.slug}/`);
}
