import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { CATS } from './config';

const base = z.object({
  title: z.string(),
  date: z.coerce.date(),
  description: z.string(),
  categoria: z.enum(CATS),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false), // true = no se publica
});
const make = (dir: string, extra = {}) =>
  defineCollection({ loader: glob({ pattern: '**/*.md', base: `./src/content/${dir}` }), schema: base.extend(extra) });

export const collections = {
  ensayos: make('ensayos', {
    libro: z.string().optional(),
    orden: z.number().optional(),
    subtitulo: z.string().optional(),
    version: z.coerce.string().optional(), // ej. v1 → se muestra "Borrador: v1"
    actualizado: z.coerce.date().optional(), // fecha de "Última actualización"
    image: z.string().optional(),
    alt: z.string().optional(),
  }),
  libros: make('libros'),
  fotos: make('fotos', { image: z.string().optional(), alt: z.string().optional() }),
};
