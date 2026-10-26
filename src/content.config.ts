import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Un archivo .md por capítulo: src/content/capitulos/<ensayo>/NN-titulo.md
// Los subtítulos son «## ...» y cada uno busca su dibujo en src/assets/svg/<ensayo>/<capitulo>_<subtitulo>.svg
const capitulos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/capitulos' }),
  schema: z.object({
    title: z.string(),
    ensayo: z.string(),
    orden: z.number(),
    prologo: z.boolean().optional(),
    epilogo: z.boolean().optional(),
  }),
});

export const collections = { capitulos };
