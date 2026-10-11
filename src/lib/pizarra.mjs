// Plugin de rehype: convierte los callouts de Obsidian «> [!pizarra]» en una hoja de papel (.pizarra).
// En Obsidian se ven como un recuadro; en el sitio, como una ficha centrada con letra manuscrita.
// Variantes de papel: > [!pizarra|gris]
// Lo que va después de [!pizarra] en la misma línea es el título de la hoja (opcional):
//   > [!pizarra] Modelos de tres niveles
//   > | | Primer nivel | … |

const MARCA = /^\s*\[!pizarra(?:\|([a-z-]+))?\][+-]?\s*/i; // [!pizarra] o [!pizarra|gris]: la variante es otro papel
const esElemento = (n, tag) => n && n.type === 'element' && n.tagName === tag;

function primerTexto(n) {
  if (!n) return null;
  if (n.type === 'text') return n;
  for (const h of n.children || []) {
    const t = primerTexto(h);
    if (t) return t;
  }
  return null;
}

// Ficha de definición: «> [!definicion] Término», en la línea siguiente el origen de la palabra (opcional)
// y, en el párrafo siguiente, la definición. Variantes de posición: [!definicion|invertida], [!definicion|derecha].
const DEF = /^\s*\[!definicion(?:\|([a-z-]+))?\][+-]?\s*/i;
const el = (tagName, className, children) => ({ type: 'element', tagName, properties: { className: [className] }, children });

function definicion(bq, p, t) {
  const variante = t.value.match(DEF)[1];
  t.value = t.value.replace(DEF, '');
  const corte = t.value.indexOf('\n');
  const termino = (corte < 0 ? t.value : t.value.slice(0, corte)).trim();
  t.value = corte < 0 ? '' : t.value.slice(corte + 1);
  const origen = p.children.filter((c) => !(c.type === 'text' && !c.value.trim()));
  const resto = bq.children.filter((c) => c !== p && !(c.type === 'text' && !c.value.trim()));
  bq.tagName = 'aside';
  bq.properties = { className: ['definicion', ...(variante ? ['definicion-' + variante.toLowerCase()] : [])] };
  bq.children = [
    el('span', 'def-k', [{ type: 'text', value: 'Definición' }]),
    el('div', 'def-termino', [el('div', 'def-t', [{ type: 'text', value: termino }]), ...(origen.length ? [el('div', 'def-e', origen)] : [])]),
    el('div', 'def-d', resto),
  ];
}

function recorrer(nodo) {
  for (const hijo of nodo.children || []) {
    if (esElemento(hijo, 'blockquote')) {
      const p0 = (hijo.children || []).find((c) => c.type === 'element');
      const t0 = primerTexto(p0);
      if (esElemento(p0, 'p') && t0 && DEF.test(t0.value)) { definicion(hijo, p0, t0); continue; }
      const p = (hijo.children || []).find((c) => c.type === 'element');
      const t = primerTexto(p);
      if (esElemento(p, 'p') && t && MARCA.test(t.value)) {
        const variante = t.value.match(MARCA)[1];
        t.value = t.value.replace(MARCA, '');
        // el resto de la primera línea (si hay) es el título; lo que sigue en el mismo párrafo, contenido
        const titulo = t.value.split('\n')[0].trim();
        t.value = t.value.slice(t.value.indexOf('\n') + 1 || t.value.length);
        const restoVacio = !(p.children || []).some((c) => (c.type === 'text' ? c.value.trim() : true));
        hijo.tagName = 'figure';
        hijo.properties = { className: ['pizarra', ...(variante ? ['pizarra-' + variante.toLowerCase()] : [])] };
        const i = hijo.children.indexOf(p);
        if (restoVacio) hijo.children.splice(i, 1);
        if (titulo) hijo.children.splice(i, 0, { type: 'element', tagName: 'figcaption', properties: {}, children: [{ type: 'text', value: titulo }] });
        continue;
      }
    }
    recorrer(hijo);
  }
}

// En las tablas, las columnas cortas (nombres, números, palabras sueltas) llevan la clase «corto» y se escriben a mano.
// Se decide por columna: si una sola celda de la columna es larga, toda la columna va en letra normal.
const textoDe = (n) => (n.type === 'text' ? n.value : (n.children || []).map(textoDe).join(''));
const buscar = (n, tag, out = []) => {
  for (const h of n.children || []) { if (esElemento(h, tag)) out.push(h); else buscar(h, tag, out); }
  return out;
};
function marcarCortas(nodo) {
  for (const tabla of buscar(nodo, 'table')) {
    const filas = buscar(tabla, 'tr').map((tr) => (tr.children || []).filter((c) => esElemento(c, 'td')));
    const columnas = Math.max(0, ...filas.map((f) => f.length));
    for (let c = 0; c < columnas; c++) {
      const celdas = filas.map((f) => f[c]).filter(Boolean);
      if (!celdas.every((td) => textoDe(td).trim().length <= 24)) continue;
      for (const td of celdas) td.properties = { ...td.properties, className: [...[].concat(td.properties?.className || []), 'corto'] };
    }
  }
}

export default function pizarra() {
  return (tree) => { recorrer(tree); marcarCortas(tree); };
}
