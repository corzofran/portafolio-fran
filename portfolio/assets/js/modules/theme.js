/** Modo claro / oscuro con persistencia segura en localStorage. */
(function (app) {
  'use strict';

  var root = document.documentElement;

  function getInitialTheme() {
    try {
      var saved = localStorage.getItem(app.config.themeStorageKey);
      if (saved === 'light' || saved === 'dark') return saved;
    } catch (e) {
      console.warn('localStorage no accesible:', e);
    }
    return app.config.defaultTheme;
  }

  function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(app.config.themeStorageKey, theme);
    } catch (e) {
      console.warn('No se pudo guardar la preferencia de tema:', e);
    }
  }

  function init() {
    var toggle = document.getElementById('themeToggle');
    if (!toggle) return;

    setTheme(getInitialTheme());

    toggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      setTheme(next);
    });
  }

  app.modules.theme = { init: init };
})(window.Portfolio);
