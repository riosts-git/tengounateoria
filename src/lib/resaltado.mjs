// ==texto== → <mark>texto</mark>: el resaltado de Obsidian, que en el sitio se ve como un trazo de marcador
// (el estilo está en styles/ensayo.css, «.prose mark»). Puede contener negritas, cursivas o notas adentro:
// busca la apertura y el cierre entre los hermanos de un mismo párrafo.
const MARCA = '==';

function procesar(padre) {
  if (!padre.children) return;
  for (const h of padre.children) if (h.type !== 'code' && h.type !== 'inlineCode') procesar(h);
  const ch = padre.children;
  let i = 0;
  while (i < ch.length) {
    const n = ch[i];
    const p = n.type === 'text' ? n.value.indexOf(MARCA) : -1;
    if (p < 0) { i++; continue; }
    // el cierre puede estar en el mismo texto o en un texto hermano posterior
    let j = i;
    let q = n.value.indexOf(MARCA, p + 2);
    if (q < 0) {
      for (j = i + 1; j < ch.length; j++) {
        if (ch[j].type === 'text' && (q = ch[j].value.indexOf(MARCA)) >= 0) break;
      }
    }
    if (j >= ch.length || q < 0) { i++; continue; }
    const antes = n.value.slice(0, p);
    let dentro, despues;
    if (j === i) {
      dentro = [{ type: 'text', value: n.value.slice(p + 2, q) }];
      despues = n.value.slice(q + 2);
    } else {
      dentro = [{ type: 'text', value: n.value.slice(p + 2) }, ...ch.slice(i + 1, j), { type: 'text', value: ch[j].value.slice(0, q) }];
      despues = ch[j].value.slice(q + 2);
    }
    dentro = dentro.filter((x) => !(x.type === 'text' && x.value === ''));
    const nuevos = [];
    if (antes) nuevos.push({ type: 'text', value: antes });
    nuevos.push({ type: 'emphasis', data: { hName: 'mark' }, children: dentro });
    if (despues) nuevos.push({ type: 'text', value: despues });
    ch.splice(i, j - i + 1, ...nuevos);
    i += despues ? nuevos.length - 1 : nuevos.length;
  }
}

export default function resaltado() {
  return (arbol) => procesar(arbol);
}
