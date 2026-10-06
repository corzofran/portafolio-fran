/**
 * Se ejecuta en <head>, antes del primer pintado, para evitar el parpadeo
 * de tema. Debe ser pequeño y no depender de otros scripts.
 */
(function () {
  try {
    var saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') {
      document.documentElement.setAttribute('data-theme', saved);
    }
  } catch (e) {
    /* localStorage no disponible: se queda el tema por defecto */
  }
})();
