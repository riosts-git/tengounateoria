import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import cajasFinales from './src/lib/cajas-finales.mjs';
import pizarra from './src/lib/pizarra.mjs';
import resaltado from './src/lib/resaltado.mjs';
import nodos from './src/lib/nodos.mjs';

// GitHub Pages: https://riosts-git.github.io/tengounateoria/
// Si más adelante usas dominio propio: site: 'https://tudominio.com' y borra la línea "base".
export default defineConfig({
  site: 'https://riosts-git.github.io',
  base: '/tengounateoria',
  trailingSlash: 'always',
  integrations: [sitemap()],
  // Obsidian guarda su configuración dentro de contenido/ensayos: el servidor local no debe vigilarla
  vite: { server: { watch: { ignored: ['**/.obsidian/**'] } } },
  markdown: {
    syntaxHighlight: false, // los bloques de código son esquemas en texto, no código: sin colores ni fondo oscuro
    remarkPlugins: [resaltado, nodos], // ==texto== como trazo de marcador; ①…⑩ y Ⓧ como nodos del árbol
    remarkRehype: { footnoteLabel: 'Notas', footnoteBackLabel: 'Volver al texto' },
    rehypePlugins: [pizarra, cajasFinales], // «> [!pizarra]» como hoja de papel; Notas y «Para seguir explorando» en recuadros al final
  },
});
