// Papelitos: la anotación manuscrita va debajo de la palabra rodeada, salvo que la palabra esté en la primera línea
// de la cita; en ese caso va arriba (y el nombre del autor pasa al pie de la hoja para dejarle lugar).
function ubicar() {
  document.querySelectorAll<HTMLElement>('.papelito').forEach((p) => {
    const cita = p.querySelector<HTMLElement>('.pap-cita');
    const palabra = p.querySelector<HTMLElement>('.circulo');
    if (!cita || !palabra) return;
    const linea = parseFloat(getComputedStyle(cita).lineHeight) || 40;
    const arriba = palabra.getBoundingClientRect().top - cita.getBoundingClientRect().top < linea * 0.8 && cita.offsetHeight > linea * 1.5;
    p.classList.toggle('nota-arriba', arriba);
  });
}
ubicar();
window.addEventListener('resize', ubicar);
document.fonts?.ready.then(ubicar);
