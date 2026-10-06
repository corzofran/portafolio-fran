/** Notificaciones toast. */
(function (app) {
  'use strict';

  var timerId = null;

  function show(message) {
    var toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add('show');

    clearTimeout(timerId); // evita que un toast anterior cierre el nuevo
    timerId = setTimeout(function () {
      toast.classList.remove('show');
    }, app.config.toastDurationMs);
  }

  app.modules.toast = { show: show };
})(window.Portfolio);
