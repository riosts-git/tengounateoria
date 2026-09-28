import { getCollection } from 'astro:content';
import { u } from '../config';

export async function getPosts() {
  const list = await getCollection('ensayos', ({ data }) => !data.draft);
  return list
    .map((e) => ({ id: e.id, ...e.data, href: u(`ensayos/${e.id}/`) }))
    .sort((a, b) => +b.date - +a.date);
}
