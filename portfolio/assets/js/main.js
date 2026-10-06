/** Punto de entrada: inicializa cada módulo. */
(function (app) {
  'use strict';

  Object.keys(app.modules).forEach(function (name) {
    var mod = app.modules[name];
    if (typeof mod.init === 'function') mod.init();
  });
})(window.Portfolio);
