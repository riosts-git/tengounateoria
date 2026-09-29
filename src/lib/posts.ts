import { getCollection } from 'astro:content';
import { CATS, u } from '../config';

export async function getPosts() {
  const list = await getCollection('ensayos', ({ data }) => !data.draft);
  return list
    .map((e) => ({ id: e.id, ...e.data, href: u(`ensayos/${e.id}/`) }))
    .sort((a, b) => +b.date - +a.date);
}

// Orden de lectura dentro de una categoría: primero «orden», después la fecha.
export const byOrden = (a: { orden?: number; date: Date }, b: { orden?: number; date: Date }) =>
  (a.orden ?? Infinity) - (b.orden ?? Infinity) || +a.date - +b.date;

// Una entrada por categoría, en el orden de CATS, con sus ensayos ordenados.
export async function getPostsByCat() {
  const posts = await getPosts();
  return CATS.map((name) => ({ name, posts: posts.filter((p) => p.categoria === name).sort(byOrden) }));
}
