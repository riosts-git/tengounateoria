// Plugin de rehype: al final de cada ensayo agrupa las notas al pie y la sección
// «Para seguir explorando» en dos recuadros (.caja), en ese orden: primero Notas, después Para seguir explorando.

const texto = (n) => (n.type === 'text' ? n.value : (n.children || []).map(texto).join(''));
const esElemento = (n, tag) => n && n.type === 'element' && n.tagName === tag;
const clases = (n) => [].concat(n.properties?.className || []);

export default function cajasFinales() {
  return (tree) => {
    const hijos = tree.children;

    // «Para seguir explorando»: el h2 y todo lo que sigue, hasta las notas (si las hay)
    let explorar = null;
    const i = hijos.findIndex((n) => esElemento(n, 'h2') && texto(n).trim() === 'Para seguir explorando');
    if (i >= 0) {
      let desde = i;
      let j = i - 1;
      while (j >= 0 && hijos[j].type === 'text' && !hijos[j].value.trim()) j--;
      if (esElemento(hijos[j], 'hr')) desde = j; // el separador que lo precedía sobra
      let hasta = hijos.length;
      for (let k = i + 1; k < hijos.length; k++) {
        if (esElemento(hijos[k], 'section')) { hasta = k; break; }
      }
      explorar = {
        type: 'element',
        tagName: 'section',
        properties: { className: ['caja', 'explorar'] },
        children: hijos.slice(i, hasta),
      };
      hijos.splice(desde, hasta - desde);
    }

    // Notas al pie
    let notas = null;
    const f = hijos.findIndex((n) => esElemento(n, 'section') && clases(n).includes('footnotes'));
    if (f >= 0) {
      notas = hijos.splice(f, 1)[0];
      notas.properties.className = [...clases(notas), 'caja'];
    }

    // Cada recuadro va plegado: un renglón con su nombre y cuántas entradas tiene, que se despliega al tocarlo
    if (notas) hijos.push(plegable('Notas', notas));
    if (explorar) hijos.push(plegable('Para seguir explorando', explorar));
  };
}

const contarItems = (n) => (n.type === 'element' && n.tagName === 'li' ? 1 : 0) + (n.children || []).reduce((s, h) => s + contarItems(h), 0);

function plegable(nombre, caja) {
  const n = contarItems(caja);
  return {
    type: 'element',
    tagName: 'details',
    properties: { className: ['plegable'] },
    children: [
      {
        type: 'element',
        tagName: 'summary',
        properties: {},
        children: [
          { type: 'element', tagName: 'span', properties: { className: ['plegable-t'] }, children: [{ type: 'text', value: nombre }] },
          ...(n ? [{ type: 'element', tagName: 'span', properties: { className: ['plegable-n'] }, children: [{ type: 'text', value: `(${n})` }] }] : []),
        ],
      },
      caja,
    ],
  };
}
