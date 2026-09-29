import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import cajasFinales from './src/lib/cajas-finales.mjs';

// GitHub Pages: https://riosts-git.github.io/tengounateoria/
// Si más adelante usas dominio propio: site: 'https://tudominio.com' y borra la línea "base".
export default defineConfig({
  site: 'https://riosts-git.github.io',
  base: '/tengounateoria',
  trailingSlash: 'always',
  integrations: [sitemap()],
  markdown: {
    remarkRehype: { footnoteLabel: 'Notas', footnoteBackLabel: 'Volver al texto' },
    rehypePlugins: [cajasFinales], // Notas y «Para seguir explorando» en recuadros al final
  },
});
