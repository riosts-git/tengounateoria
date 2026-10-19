// Sincroniza el libro: convierte los tableros del canvas «Libro con dibujos» (carpeta canvas/) en los capítulos de la web.
// El canvas es la única fuente: estos .md se regeneran y no se editan a mano.
// Uso: node scripts/sincronizar.mjs   (antes, Claude baja la última versión del canvas a canvas/project/)
import fs from 'node:fs';
import path from 'node:path';

const RAIZ = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1')), '..');
const CANVAS = path.join(RAIZ, 'canvas/project');
const DESTINO = path.join(RAIZ, 'contenido/ensayos/1 Tengo una teoría');
const HOY = new Date().toISOString().slice(0, 10);
// URLs que ya existían y conviene conservar
const SLUG_FIJO = { 1: 'tengo-una-teoria', 3: 'la-intuicion' };

const texto = (h) => h.replace(/<br\s*\/?>/g, ' ').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
const slug = (t) => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const yaml = (t) => JSON.stringify(t);

// Orden de lectura: los tableros de la página 1, de izquierda a derecha
const cv = JSON.parse(fs.readFileSync(path.join(CANVAS, 'canvas.json'), 'utf8'));
const tableros = Object.entries(cv.boards).filter(([, b]) => !b.page || b.page === 'page-1').sort((a, b) => a[1].x - b[1].x).map(([k]) => k);

// Notas al pie: todas las definiciones del canvas, por id
const notas = {};
for (const f of fs.readdirSync(CANVAS).filter((f) => f.endsWith('.dc.html'))) {
  const s = fs.readFileSync(path.join(CANVAS, f), 'utf8');
  for (const m of s.matchAll(/<li id="user-content-fn-([^"]+)">([\s\S]*?)<\/li>/g))
    notas[m[1]] = m[2].replace(/<a [^>]*data-footnote-backref[^>]*>[\s\S]*?<\/a>/g, '').replace(/<\/?p>/g, ' ').replace(/\s+/g, ' ').trim();
}

// Dibujos: la letra manuscrita del canvas (Claire Hand) se llama «Mano» en la web
const dibujo = (svg) => svg.replace(/'Claire Hand'/g, "'Mano'").replace(/\n\s*/g, ' ');

const bloque = (html) => html.replace(/\n\s*/g, ' ').trim();

function convertirFila(fila, usadas) {
  const izq = (fila.match(/<div class="izq">([\s\S]*?)<\/div><div class="der">/) || [, ''])[1];
  let der = (fila.match(/<div class="der">([\s\S]*)<\/div><\/section>\s*$/) || [, ''])[1];
  const out = [];
  // Columna izquierda: cada dibujo va al margen; las notas tipo anotador, también
  for (const m of izq.matchAll(/<svg[\s\S]*?<\/svg>/g)) out.push(`<aside class="al-margen dibujo">${dibujo(m[0])}</aside>`);
  for (const m of izq.matchAll(/<div class="anotador">[\s\S]*?<\/table><\/div>|<div class="anotador">[\s\S]*?<\/div>/g)) out.push(`<aside class="al-margen">${bloque(m[0])}</aside>`);
  // Columna derecha: texto
  der = der.replace(/<span class="id">[^<]*<\/span>/g, '').replace(/<p class="epigrafe">[\s\S]*?<\/p>/g, '')
    .replace(/<sup class="nota-pendiente"[^>]*><\/sup>/g, '')
    .replace(/<sup><a href="#user-content-fn-([^"]+)"[^>]*>[^<]*<\/a><\/sup>/g, (m, id) => (notas[id] ? (usadas.add(id), `[^${id}]`) : ''));
  for (const m of der.matchAll(/<h[234][^>]*>([\s\S]*?)<\/h[234]>|<p(?: [^>]*)?>([\s\S]*?)<\/p>|<(ul|ol|table|blockquote|div)[\s\S]*?<\/\3>/g)) {
    if (m[1] !== undefined) out.push(`### ${texto(m[1])}`);
    else if (m[2] !== undefined) { const p = bloque(m[2]); if (p) out.push(p); }
    else out.push(bloque(m[0]));
  }
  return out;
}

// Borra lo generado antes (marcado con «generado: canvas») para que no queden capítulos viejos
for (const f of fs.readdirSync(DESTINO).filter((f) => f.endsWith('.md'))) {
  if (/^generado: canvas$/m.test(fs.readFileSync(path.join(DESTINO, f), 'utf8'))) fs.unlinkSync(path.join(DESTINO, f));
}

let seccion = null, escritos = 0;
for (const t of tableros) {
  const s = fs.readFileSync(path.join(CANVAS, t), 'utf8');
  const sec = s.match(/<section class="portada-seccion">(?:<p class="sec-label">([^<]*)<\/p>)?<h2>([^<]*)<\/h2>(?:<p class="anticipo">([^<]*)<\/p>)?<\/section>/);
  const cap = s.match(/<section class="portada-cap"><p class="cap-label">Capítulo (\d+)<\/p><h2>([^<]*)<\/h2><\/section>/);
  if (sec) seccion = { etiqueta: sec[1] || '', titulo: sec[2], anticipo: sec[3] };
  if (!cap && !(sec && /conclusi/i.test(sec[2]))) continue; // la frase de apertura y la bibliografía se mantienen a mano
  const num = cap ? Number(cap[1]) : 99;
  const titulo = cap ? cap[2] : sec[2];
  const usadas = new Set();
  const cuerpo = [];
  for (const fila of s.match(/<section class="fila">[\s\S]*?<\/section>/g) || []) cuerpo.push(...convertirFila(fila, usadas));
  if (usadas.size) cuerpo.push(...[...usadas].map((id) => `[^${id}]: ${notas[id]}`));
  const primero = texto(cuerpo.find((l) => !l.startsWith('<') && !l.startsWith('#')) || titulo);
  const fm = ['---', `title: ${yaml(titulo)}`, `description: ${yaml(primero.slice(0, 157) + (primero.length > 157 ? '…' : ''))}`,
    `date: ${HOY}`, `actualizado: ${HOY}`, `parte: ${yaml(seccion?.titulo || 'Intro')}`, 'sinTitulo: true'];
  if (sec) fm.push('seccion:', `  etiqueta: ${yaml(seccion.etiqueta)}`, `  titulo: ${yaml(seccion.titulo)}`, ...(seccion.anticipo ? [`  anticipo: ${yaml(seccion.anticipo)}`] : []));
  if (cap) fm.push('capitulo:', `  numero: ${num}`, `  titulo: ${yaml(titulo)}`);
  fm.push(`tags: [${yaml(seccion?.titulo || 'Intro')}]`, 'draft: false', 'generado: canvas', '---', '');
  const nombre = `${String(cap ? (num === 1 ? 1 : num + 1) : 19).padStart(2, '0')}-${SLUG_FIJO[num] || slug(titulo)}.md`;
  fs.writeFileSync(path.join(DESTINO, nombre), fm.join('\n') + '\n' + cuerpo.join('\n\n') + '\n');
  escritos++;
}
console.log(`Sincronizados ${escritos} capítulos en «${path.relative(RAIZ, DESTINO)}».`);

// --- Observaciones: los tableros de la página 2, en orden de x, a «2 Observaciones» ------------------
const OBS = path.join(RAIZ, 'contenido/ensayos/2 Observaciones');
fs.mkdirSync(OBS, { recursive: true });
for (const f of fs.readdirSync(OBS).filter((f) => f.endsWith('.md'))) {
  if (/^generado: canvas$/m.test(fs.readFileSync(path.join(OBS, f), 'utf8'))) fs.unlinkSync(path.join(OBS, f));
}
const obs = Object.entries(cv.boards).filter(([, b]) => b.page && b.page !== 'page-1').sort((a, b) => a[1].x - b[1].x);
let n = 0;
for (const [t, b] of obs) {
  const s = fs.readFileSync(path.join(CANVAS, t), 'utf8');
  const h2 = s.match(/<section class="portada-(?:seccion|cap)">[\s\S]*?<h2>([\s\S]*?)<\/h2>/);
  const titulo = h2 ? texto(h2[1]) : b.title.split(' · ').pop();
  const tema = (b.title.match(/^Observaciones · \d+ · (.+)$/) || [])[1];
  const usadas = new Set();
  const cuerpo = [];
  for (const fila of s.match(/<section class="fila">[\s\S]*?<\/section>/g) || []) {
    if (/<h4>Objetivo<\/h4>/.test(fila)) continue; // el objetivo es una nota de trabajo
    cuerpo.push(...convertirFila(fila, usadas));
  }
  if (usadas.size) cuerpo.push(...[...usadas].map((id) => `[^${id}]: ${notas[id]}`));
  // las notas para la autora ([✎ …]) no se publican
  const limpio = cuerpo.map((l) => l.replace(/\s*\[✎[^\]]*\]/g, '')).filter((l) => l.trim());
  if (!limpio.length) continue;
  n++;
  const primero = texto(limpio.find((l) => !l.startsWith('<') && !l.startsWith('#')) || titulo);
  const fm = ['---', `title: ${yaml(tema || titulo)}`, `description: ${yaml(primero.slice(0, 157) + (primero.length > 157 ? '…' : ''))}`,
    `date: ${HOY}`, `actualizado: ${HOY}`, `parte: ${yaml(tema ? 'Por tema' : 'El árbol y otras disciplinas')}`, `tags: [${yaml(tema || 'Árbol de arquetipos')}]`,
    'draft: false', 'generado: canvas', '---', ''];
  fs.writeFileSync(path.join(OBS, `${String(n).padStart(2, '0')}-${slug(tema || titulo)}.md`), fm.join('\n') + '\n' + limpio.join('\n\n') + '\n');
}
console.log(`Sincronizadas ${n} observaciones en «${path.relative(RAIZ, OBS)}».`);
