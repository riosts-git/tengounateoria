import rss from '@astrojs/rss';
import { SITE } from '../config';
import { getPosts } from '../lib/posts';

export async function GET(context) {
  const posts = await getPosts();
  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site,
    items: posts.map((p) => ({ title: p.title, pubDate: p.date, description: p.description, link: p.href })),
  });
}
