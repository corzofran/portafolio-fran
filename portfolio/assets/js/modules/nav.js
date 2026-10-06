/** Navegación: menú móvil, cierre con Esc y enlace activo por sección visible. */
(function (app) {
  'use strict';

  function initMobileMenu(navLinks) {
    var toggle = document.getElementById('menuToggle');
    var menu = document.getElementById('navLinks');
    if (!toggle || !menu) return;

    function setOpen(isOpen) {
      menu.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
    }

    toggle.addEventListener('click', function () {
      setOpen(!menu.classList.contains('open'));
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && menu.classList.contains('open')) {
        setOpen(false);
        toggle.focus();
      }
    });

    navLinks.forEach(function (link) {
      link.addEventListener('click', function () { setOpen(false); });
    });
  }

  function initActiveLink(navLinks) {
    var sections = document.querySelectorAll('section[id]');
    if (!('IntersectionObserver' in window) || !sections.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.getAttribute('id');
        navLinks.forEach(function (link) {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      });
    }, { root: null, rootMargin: '-20% 0px -70% 0px', threshold: 0 });

    sections.forEach(function (section) { observer.observe(section); });
  }

  function init() {
    var navLinks = document.querySelectorAll('.nav-link');
    initMobileMenu(navLinks);
    initActiveLink(navLinks);
  }

  app.modules.nav = { init: init };
})(window.Portfolio);
