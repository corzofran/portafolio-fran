/**
 * Proyectos: se consumen desde GET /api/v1/projects y se pintan con DOM seguro
 * (textContent, nunca innerHTML). Si la API no responde, queda el HTML estático.
 */
(function (app) {
  'use strict';

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function pills(items) {
    var ul = el('ul', 'tech-stack-list');
    items.forEach(function (t) { ul.appendChild(el('li', 'tech-pill', t)); });
    return ul;
  }

  function intro(p, tagClass, titleClass) {
    var box = el('div');
    if (p.tag) box.appendChild(el('span', tagClass, p.tag));
    box.appendChild(el('h3', titleClass, p.nombre));
    box.appendChild(el('p', 'project-desc', p.descripcion));
    return box;
  }

  function featureBox(items) {
    var box = el('div', 'feature-box');
    box.appendChild(el('p', 'feature-box__title', 'Características clave:'));
    var ul = el('ul', 'feature-box__list');
    items.forEach(function (t) { ul.appendChild(el('li', '', t)); });
    box.appendChild(ul);
    return box;
  }

  function card(p) {
    var article = el('article', 'bento-card bento-' + p.layout);

    if (p.layout === 'featured') {
      var main = intro(p, 'project-tag', 'project-title');
      main.appendChild(pills(p.tecnologias));
      article.appendChild(main);
      if (p.caracteristicas.length) article.appendChild(featureBox(p.caracteristicas));
    } else if (p.layout === 'medium') {
      article.appendChild(intro(p, 'project-tag', 'project-title'));
      article.appendChild(pills(p.tecnologias));
    } else if (p.layout === 'github') {
      article.appendChild(intro(p, 'project-tag project-tag--github', 'project-title'));
      if (p.url) {
        var link = el('a', 'project-link project-link--accent', 'Explorar repositorios →');
        link.href = p.url;
        link.target = '_blank';
        link.rel = 'noopener';
        article.appendChild(link);
      }
    } else {
      article.appendChild(el('h3', 'project-title project-title--sm', p.nombre));
      article.appendChild(el('p', 'project-desc', p.descripcion));
      article.appendChild(pills(p.tecnologias));
    }
    return article;
  }

  function init() {
    var grid = document.getElementById('projectsGrid');
    if (!grid) return;

    app.modules.api.get('/projects')
      .then(function (projects) {
        if (!Array.isArray(projects) || !projects.length) return;
        grid.replaceChildren.apply(grid, projects.map(card));
      })
      .catch(function (err) {
        console.info('API no disponible, se mantiene el contenido estático:', err.message);
      });
  }

  app.modules.projects = { init: init };
})(window.Portfolio);
