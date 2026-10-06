/** Barra de progreso de scroll con el corredor. */
(function (app) {
  'use strict';

  function init() {
    var bar = document.getElementById('progressBar');
    if (!bar) return;

    var ticking = false;

    function update() {
      var doc = document.documentElement;
      var scrollable = doc.scrollHeight - doc.clientHeight;
      var percent = scrollable > 0 ? (doc.scrollTop / scrollable) * 100 : 0;
      bar.style.width = percent + '%';
      ticking = false;
    }

    // requestAnimationFrame: como máximo una actualización por frame
    window.addEventListener('scroll', function () {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }, { passive: true });

    update();
  }

  app.modules.scrollProgress = { init: init };
})(window.Portfolio);
