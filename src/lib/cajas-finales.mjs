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

    // «Observaciones para construir»: el párrafo en negrita y la lista que lo sigue (y el separador que los precedía)
    let obs = null;
    const o = hijos.findIndex((n) => esElemento(n, 'p') && texto(n).trim() === 'Observaciones para construir');
    if (o >= 0) {
      const l = hijos.findIndex((n, k) => k > o && esElemento(n, 'ul'));
      let desde = o;
      let j = o - 1;
      while (j >= 0 && hijos[j].type === 'text' && !hijos[j].value.trim()) j--;
      if (esElemento(hijos[j], 'hr')) desde = j;
      const lista = l >= 0 ? hijos[l] : null;
      hijos.splice(desde, (l >= 0 ? l : o) - desde + 1);
      if (lista) obs = { type: 'element', tagName: 'section', properties: { className: ['caja', 'observaciones'] },
        children: [{ type: 'element', tagName: 'h2', properties: {}, children: [{ type: 'text', value: 'Observaciones' }] }, lista] };
    }

    // Una sola señal al final: un renglón con una flecha que despliega las notas y las observaciones
    const cajas = [notas, obs, explorar].filter(Boolean);
    if (cajas.length) {
      const nombre = notas && (obs || explorar) ? 'Notas y observaciones' : notas ? 'Notas' : obs ? 'Observaciones' : 'Para seguir explorando';
      hijos.push(plegable(nombre, cajas));
    }
  };
}


function plegable(nombre, cajas) {
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
        ],
      },
      ...cajas,
    ],
  };
}
