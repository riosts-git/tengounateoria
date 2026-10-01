import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const ensayos = defineCollection({
  // Una carpeta por cuaderno («1 La Intuición/…») y un archivo numerado por ensayo («01-mi-obsesion-por-las-palabras.md»).
  // La dirección del ensayo es el nombre del archivo sin el número; el cuaderno y el orden salen de la carpeta y del número (ver lib/posts.ts).
  loader: glob({ pattern: '**/*.md', base: './contenido/ensayos', generateId: ({ entry }) => entry.split('/').pop()!.replace(/\.md$/, '').replace(/^\d+-/, '') }),
  schema: z.object({
    title: z.string(),
    subtitulo: z.string().optional(), // se muestra bajo el título (home y ensayo)
    date: z.coerce.date(),
    actualizado: z.coerce.date().optional(), // "Última actualización"
    version: z.coerce.string().optional(), // ej. v1
    parte: z.string().optional(), // parte del cuaderno (subtítulo en la home)
    description: z.string(), // SEO / RSS
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false), // true = no se publica
  }),
});

export const collections = { ensayos };
