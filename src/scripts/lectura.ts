// Lectura de los ensayos:
// 1. Notas plegadas: si se toca una llamada a nota (o se llega con un #enlace), se abre el recuadro que la contiene.
// 2. El final de cada ensayo: Notas y Para seguir explorando, en la caja junto a la fecha y los temas.
// 3. Lectura continua (cuando .lectura[data-continua]): al llegar al final de un ensayo se carga el siguiente debajo,
//    y la dirección, el título de la pestaña y el menú del cuaderno siguen al ensayo que está en pantalla.

const MAX_EN_PAGINA = 4; // la carga no se detiene: cuando hay más de cuatro ensayos en la página, se descarga el más viejo (que ya quedó arriba)

// --- 1. Notas plegadas -------------------------------------------------------------------------------------------
function abrirPlegableDe(id: string) {
  const destino = document.getElementById(id);
  const plegable = destino?.closest('details');
  if (plegable && !plegable.open) plegable.open = true;
}
document.addEventListener('click', (e) => {
  const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
  if (a && a.hash) abrirPlegableDe(decodeURIComponent(a.hash.slice(1)));
});
if (location.hash) {
  abrirPlegableDe(decodeURIComponent(location.hash.slice(1)));
  document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView();
}

// --- 2. Final de cada ensayo ------------------------------------------------------------------------------------
// Las Notas y Para seguir explorando (que el sitio arma al final del texto) pasan a la caja del final, junto a la fecha y los temas.
function armarFinal(art: ParentNode) {
  const izq = art.querySelector('.fin-izq');
  if (izq) art.querySelectorAll('.prose > .plegable').forEach((p) => izq.append(p));
}
document.querySelectorAll<HTMLElement>('article.ensayo').forEach(armarFinal);

// --- 3. Lectura continua -----------------------------------------------------------------------------------------
// En el estilo «libro» no hay lectura continua: se pasa de capítulo a capítulo con el enlace del final
const lectura = document.documentElement.dataset.estilo === 'libro' ? null : document.querySelector<HTMLElement>('.lectura[data-continua]');
if (lectura) {
  const menu = document.querySelector<HTMLElement>('.menu-libro');
  let cargando = false;

  const ultimo = () => [...lectura.querySelectorAll<HTMLElement>('article.ensayo')].pop()!;

  // Los ids de las notas se repiten entre ensayos (por ejemplo, «damasio»): al ensayo cargado se le agrega un sufijo.
  function idsUnicos(art: HTMLElement, sufijo: string) {
    art.querySelectorAll<HTMLElement>('[id]').forEach((el) => (el.id = `${el.id}--${sufijo}`));
    art.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => a.setAttribute('href', `${a.getAttribute('href')}--${sufijo}`));
    art.querySelectorAll<HTMLElement>('[aria-describedby]').forEach((el) =>
      el.setAttribute('aria-describedby', `${el.getAttribute('aria-describedby')}--${sufijo}`));
  }

  async function cargarSiguiente(forzar = false) {
    const anterior = ultimo();
    const href = anterior.dataset.siguiente;
    if (cargando || !href) return;
    cargando = true;
    try {
      const html = await (await fetch(href)).text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const art = doc.querySelector<HTMLElement>('article.ensayo');
      if (!art) return;
      idsUnicos(art, String(art.dataset.numero ?? 'x'));
      // un separador entre ensayos: dos líneas y «Nuevo apunte»
      const sep = document.createElement('div');
      sep.className = 'entre-ensayos';
      // dos uves dibujadas a mano, una sobre otra, hacia abajo
      sep.innerHTML = '<svg viewBox="0 0 60 56" width="52" height="48" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 8c6 5 12 11 21 18 7-6 13-12 21-17"/><path d="M8 27c7 5 13 11 22 18 8-7 14-12 22-18"/></svg>';
      armarFinal(art);
      // el botón «Siguiente» del ensayo anterior ya no hace falta
      anterior.querySelector('.pn')?.remove();
      lectura.append(sep, document.adoptNode(art));
      observarEnsayo(art);
      observarFinal();
      descargarViejos();
      if (forzar) sep.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } finally {
      cargando = false;
    }
  }

  // Para que la página no se vuelva pesada: se quitan los ensayos más viejos, compensando el desplazamiento para que no salte
  function descargarViejos() {
    const arts = [...lectura.querySelectorAll<HTMLElement>('article.ensayo')];
    while (arts.length > MAX_EN_PAGINA) {
      const viejo = arts.shift()!;
      if (viejo.getBoundingClientRect().bottom > 0) break; // si todavía se ve, no se toca
      const sep = viejo.nextElementSibling?.classList.contains('entre-ensayos') ? viejo.nextElementSibling : null;
      // se fija la posición del ensayo siguiente antes y después de quitar el viejo, y se corrige la diferencia
      const ancla = arts[0];
      const antes = ancla.getBoundingClientRect().top;
      enPantalla.unobserve(viejo);
      viejo.remove();
      sep?.remove();
      const despues = ancla.getBoundingClientRect().top;
      if (despues !== antes) window.scrollBy(0, despues - antes);
    }
  }

  // Cuando se acerca el final del último ensayo, se carga el siguiente
  const alFinal = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && cargarSiguiente()), { rootMargin: '0px 0px 600px 0px' });
  function observarFinal() {
    alFinal.disconnect();
    const fin = ultimo().querySelector('.post-fin');
    if (fin) alFinal.observe(fin);
  }

  // El ensayo que ocupa la parte alta de la pantalla manda: dirección, título y menú
  function marcarActual(art: HTMLElement) {
    const href = art.dataset.href!;
    if (location.pathname !== href) history.replaceState(null, '', href);
    document.title = `${art.dataset.titulo} · Tengo una Teoría`;
    document.querySelectorAll<HTMLAnchorElement>('.sub-lista a').forEach((a) => {
      if (a.getAttribute('href') === href) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
    menu?.querySelectorAll<HTMLAnchorElement>('.nav-ensayos a').forEach((a) => {
      const es = a.getAttribute('href') === href;
      if (es) {
        a.setAttribute('aria-current', 'page');
        const parte = a.closest('details');
        if (parte) parte.open = true;
      } else a.removeAttribute('aria-current');
    });
  }
  const enPantalla = new IntersectionObserver(
    (es) => es.forEach((e) => e.isIntersecting && marcarActual(e.target as HTMLElement)),
    { rootMargin: '-35% 0px -60% 0px' },
  );
  function observarEnsayo(art: HTMLElement) {
    enPantalla.observe(art);
  }

  // El botón «Siguiente apunte» no cambia de página: carga el siguiente debajo
  lectura.addEventListener('click', (e) => {
    const boton = (e.target as HTMLElement).closest('.pn .next');
    if (!boton) return;
    e.preventDefault();
    cargarSiguiente(true);
  });

  lectura.querySelectorAll<HTMLElement>('article.ensayo').forEach(observarEnsayo);
  observarFinal();
}
