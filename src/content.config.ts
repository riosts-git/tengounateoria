import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { CATS } from './config';

const ensayos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './contenido/ensayos' }),
  schema: z.object({
    title: z.string(),
    subtitulo: z.string().optional(), // se muestra bajo el título (home y ensayo)
    date: z.coerce.date(),
    actualizado: z.coerce.date().optional(), // "Última actualización"
    version: z.coerce.string().optional(), // ej. v1
    orden: z.number().optional(), // posición dentro de su categoría (home y anterior/siguiente)
    parte: z.string().optional(), // parte del cuaderno (subtítulo en la home)
    description: z.string(), // SEO / RSS
    categoria: z.enum(CATS),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false), // true = no se publica
  }),
});

export const collections = { ensayos };
