/** Cliente de la API RESTful v1 (fetch + promesas). */
(function (app) {
  'use strict';

  function request(path, options) {
    var url = app.config.apiBaseUrl + path;
    var settings = Object.assign({ method: 'GET', headers: { Accept: 'application/json' } }, options);

    return fetch(url, settings).then(function (response) {
      if (!response.ok) {
        throw new Error('HTTP ' + response.status + ' en ' + url);
      }
      return response.status === 204 ? null : response.json();
    });
  }

  app.modules.api = {
    get: function (path) { return request(path); },
    post: function (path, body) {
      return request(path, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(body) });
    },
    put: function (path, body) {
      return request(path, { method: 'PUT', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(body) });
    },
    remove: function (path) { return request(path, { method: 'DELETE' }); },
  };
})(window.Portfolio);
