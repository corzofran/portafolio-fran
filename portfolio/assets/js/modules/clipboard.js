/**
 * Copiar al portapapeles mediante atributos declarativos:
 * <button data-copy="texto" data-copy-message="Mensaje">Copiar</button>
 */
(function (app) {
  'use strict';

  function copy(text, successMessage) {
    var toast = app.modules.toast;

    if (!navigator.clipboard) {
      toast.show('Tu navegador no permite copiar');
      return;
    }

    navigator.clipboard.writeText(text)
      .then(function () { toast.show(successMessage); })
      .catch(function () { toast.show('Error al copiar'); });
  }

  function init() {
    // Delegación de eventos: un solo listener para todos los botones
    document.addEventListener('click', function (event) {
      var button = event.target.closest('[data-copy]');
      if (!button) return;
      copy(button.dataset.copy, button.dataset.copyMessage || 'Copiado');
    });
  }

  app.modules.clipboard = { init: init };
})(window.Portfolio);
