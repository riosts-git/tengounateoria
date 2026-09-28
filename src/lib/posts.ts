import { getCollection } from 'astro:content';
import { DIR, u } from '../config';

const norm = (list: any[], tipo: 'ensayo' | 'libro' | 'foto') =>
  list.map((e) => ({ tipo, id: e.id, ...e.data, href: u(`${DIR[tipo]}/${e.id}/`) }));

export async function getPosts() {
  const pub = ({ data }: any) => !data.draft;
  const [e, l, f] = await Promise.all([getCollection('ensayos', pub), getCollection('libros', pub), getCollection('fotos', pub)]);
  return [...norm(e, 'ensayo'), ...norm(l, 'libro'), ...norm(f, 'foto')].sort((a: any, b: any) => +b.date - +a.date);
}
