// Estilo «libro»: los árboles que están dentro del texto pasan al panel fijo de la izquierda.
// En su lugar queda una marca invisible; al leer, el panel muestra el árbol de la última marca que se pasó.
// Antes de la primera marca el panel queda vacío: el árbol aparece cuando el texto lo presenta.
if (document.documentElement.dataset.estilo === 'libro') {
  const lectura = document.querySelector<HTMLElement>('.lectura');
  const panel = lectura?.querySelector<HTMLElement>('.ilus-cap');
  const prose = lectura?.querySelector<HTMLElement>('.prose');
  if (lectura && panel && prose) {
    const ARBOL = /^(Las bifurcaciones|La intensidad se divide|Mi dibujo con la forma completa)/;
    const piezas = new Set<HTMLElement>();
    prose.querySelectorAll<HTMLElement>('figure.arbol-grande, .mapitas, aside.al-margen').forEach((el) => piezas.add(el));
    // Capítulos donde todas las ilustraciones (pizarras) pasan también al panel
    const CON_PIZARRAS = ['las-emociones-arquetipicas', 'las-variables-de-una-emocion'];
    const href = lectura.querySelector<HTMLElement>('article')?.dataset.href ?? '';
    if (CON_PIZARRAS.some((id) => href.includes(`/${id}/`))) prose.querySelectorAll<HTMLElement>('figure.pizarra').forEach((el) => piezas.add(el));
    // Las tablas manuscritas (pizarras de texto) pasan al panel en todos los capítulos
    prose.querySelectorAll<HTMLElement>('figure.pizarra:not(.pizarra-limpia)').forEach((el) => piezas.add(el));
    // La fábula de la isla (Los sentimientos) va al costado, tachada y con signos de pregunta
    if (href.includes('/los-sentimientos/')) {
      const fabula = prose.querySelector<HTMLElement>('blockquote');
      if (fabula) { fabula.classList.add('fabula-tachada'); fabula.insertAdjacentHTML('beforeend', '<span class="preguntas p1">¿¿??</span><span class="preguntas p2">¿?</span><span class="preguntas p3">¿¿¿qué???</span>'); piezas.add(fabula); }
    }
    prose.querySelectorAll<SVGElement>('svg[aria-label]').forEach((svg) => {
      if (!ARBOL.test(svg.getAttribute('aria-label') ?? '')) return;
      const caja = (svg.closest('blockquote, .callout, figure, [class*="pizarra"]') as HTMLElement | null) ?? svg.parentElement;
      if (caja && prose.contains(caja)) piezas.add(caja);
    });
    const lista = [...piezas].sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
    if (!lista.length) {
      lectura.classList.add('sin-arbol');
    } else {
      panel.innerHTML = '';
      const capas: HTMLElement[] = [];
      const marcas: HTMLElement[] = [];
      lista.forEach((pieza, i) => {
        const marca = document.createElement('span');
        marca.className = 'marca-arbol';
        marca.dataset.i = String(i);
        pieza.replaceWith(marca);
        // Se conservan las clases del ensayo para que el dibujo mantenga sus estilos
        const capa = document.createElement('div');
        capa.className = 'arbol-fijo ensayo';
        const p = document.createElement('div');
        p.className = 'prose';
        p.appendChild(pieza);
        capa.appendChild(p);
        panel.appendChild(capa);
        capas.push(capa);
        marcas.push(marca);
      });
      const activar = (i: number) => capas.forEach((c, j) => c.classList.toggle('activo', j === i));
      const actual = () => {
        let i = -1;
        marcas.forEach((m, j) => { if (m.getBoundingClientRect().top < innerHeight * 0.6) i = j; });
        activar(i);
      };
      addEventListener('scroll', actual, { passive: true });
      actual();
    }
  }
}
