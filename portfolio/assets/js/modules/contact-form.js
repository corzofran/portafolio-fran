/** Formulario de contacto: abre WhatsApp con el mensaje prellenado. */
(function (app) {
  'use strict';

  function buildWhatsappUrl(name, message) {
    var text = 'Hola Francisco, soy ' + name + '. ' + message;
    return 'https://wa.me/' + app.config.whatsappNumber + '?text=' + encodeURIComponent(text);
  }

  function init() {
    var form = document.getElementById('whatsappForm');
    if (!form) return;

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var name = document.getElementById('nameInput').value.trim();
      var message = document.getElementById('messageInput').value.trim();
      if (!name || !message) return;

      window.open(buildWhatsappUrl(name, message), '_blank', 'noopener');
    });
  }

  app.modules.contactForm = { init: init };
})(window.Portfolio);
