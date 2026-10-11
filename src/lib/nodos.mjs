// Las piezas del árbol, cada una con su forma (estilos en styles/ensayo.css). En Obsidian se leen igual:
//   ①…⑩ y Ⓧ → nodos: un número dentro de un círculo  (<span class="nodo">1</span>)
//   Ⅰ Ⅱ Ⅲ Ⅳ  → planos: un número romano en un recuadro (<span class="plano">I</span>)
//   ⑴…⑺      → niveles: un número entre dos rayas     (<span class="nivel">1</span>)
const NUMEROS = '①②③④⑤⑥⑦⑧⑨⑩';
const RE = /[①-⑩ⓍⅠ-Ⅳ⑴-⑺]/g;
const ROMANOS = 'ⅠⅡⅢⅣ', NIVELES = '⑴⑵⑶⑷⑸⑹⑺';
const pieza = (c) => {
  if (c === 'Ⓧ') return ['nodo', 'X'];
  if (ROMANOS.includes(c)) return ['plano', ['I', 'II', 'III', 'IV'][ROMANOS.indexOf(c)]];
  if (NIVELES.includes(c)) return ['nivel', String(NIVELES.indexOf(c) + 1)];
  return ['nodo', String(NUMEROS.indexOf(c) + 1)];
};

function recorrer(padre) {
  if (!padre.children) return;
  for (let i = 0; i < padre.children.length; i++) {
    const hijo = padre.children[i];
    if (hijo.type === 'text' && RE.test(hijo.value)) {
      RE.lastIndex = 0;
      const partes = [];
      let ultimo = 0;
      for (const m of hijo.value.matchAll(RE)) {
        if (m.index > ultimo) partes.push({ type: 'text', value: hijo.value.slice(ultimo, m.index) });
        const [clase, valor] = pieza(m[0]);
        partes.push({ type: 'emphasis', data: { hName: 'span', hProperties: { className: [clase] } }, children: [{ type: 'text', value: valor }] });
        ultimo = m.index + m[0].length;
      }
      if (ultimo < hijo.value.length) partes.push({ type: 'text', value: hijo.value.slice(ultimo) });
      padre.children.splice(i, 1, ...partes);
      i += partes.length - 1;
    } else if (hijo.type !== 'code' && hijo.type !== 'inlineCode') recorrer(hijo);
  }
}

export default function nodos() {
  return (arbol) => recorrer(arbol);
}
