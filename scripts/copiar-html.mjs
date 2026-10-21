// Copia el HTML de trabajo (contenido/ensayos) a public/html para que el sitio lo publique en /html/.
// Se ejecuta solo antes de «npm run dev» y «npm run build». public/html se regenera: no se edita a mano.
import fs from 'node:fs';
import path from 'node:path';

const ORIGEN = 'contenido/ensayos';
const DESTINO = 'public/html';
const OMITIR = new Set(['.obsidian', 'figma-todos-los-svg.svg']);

fs.rmSync(DESTINO, { recursive: true, force: true });
fs.cpSync(ORIGEN, DESTINO, { recursive: true, filter: (src) => !OMITIR.has(path.basename(src)) });
console.log(`HTML copiado a ${DESTINO}`);
