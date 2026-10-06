/**
 * Servidor sin dependencias (Node 18+): sirve el sitio estático y la API RESTful v1.
 * Uso: node server.js   (puerto por defecto 3000, o PORT=8080 node server.js)
 */
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const DATA_FILE = path.join(ROOT, 'data', 'projects.json');
const API_PREFIX = '/api/v1';
const LAYOUTS = ['featured', 'medium', 'small', 'github'];
const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.ico': 'image/x-icon',
};

/* ---------- Persistencia ---------- */
const readProjects = () => JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
const writeProjects = (list) => fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2) + '\n');

/* ---------- Helpers HTTP ---------- */
function send(res, status, body, extraHeaders = {}) {
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'X-API-Version': '1',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Accept',
    ...extraHeaders,
  };
  res.writeHead(status, headers);
  res.end(body === undefined ? '' : JSON.stringify(body));
}
const sendError = (res, status, message) => send(res, status, { error: { status, message } });

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > 1e6) { reject(new Error('Payload demasiado grande')); req.destroy(); }
    });
    req.on('end', () => resolve(raw));
    req.on('error', reject);
  });
}

/* ---------- Validación del body-request ---------- */
function validate(body) {
  const errors = [];
  const isStr = (v) => typeof v === 'string' && v.trim().length > 0;
  const isStrArray = (v) => Array.isArray(v) && v.every((x) => typeof x === 'string');
  if (!isStr(body.nombre)) errors.push('nombre es obligatorio (string)');
  if (!isStr(body.descripcion)) errors.push('descripcion es obligatoria (string)');
  if (!LAYOUTS.includes(body.layout)) errors.push(`layout debe ser uno de: ${LAYOUTS.join(', ')}`);
  if (body.tecnologias !== undefined && !isStrArray(body.tecnologias)) errors.push('tecnologias debe ser un arreglo de strings');
  if (body.caracteristicas !== undefined && !isStrArray(body.caracteristicas)) errors.push('caracteristicas debe ser un arreglo de strings');
  if (body.url != null && !/^https?:\/\//.test(body.url)) errors.push('url debe iniciar con http:// o https://');
  return errors;
}
const clean = (b) => ({
  layout: b.layout, tag: (b.tag || '').trim(), nombre: b.nombre.trim(), descripcion: b.descripcion.trim(),
  tecnologias: b.tecnologias || [], caracteristicas: b.caracteristicas || [], url: b.url || null,
});

/* ---------- Rutas de la API ---------- */
async function handleApi(req, res, pathname) {
  if (req.method === 'OPTIONS') return send(res, 204);

  const match = pathname.slice(API_PREFIX.length).match(/^\/projects(?:\/(\d+))?\/?$/);
  if (!match) return sendError(res, 404, 'Recurso no encontrado');
  const id = match[1] ? Number(match[1]) : null;
  const list = readProjects();

  // GET /projects  |  GET /projects/:id
  if (req.method === 'GET') {
    if (id === null) return send(res, 200, list, { 'Cache-Control': 'no-cache' });
    const item = list.find((p) => p.id === id);
    return item ? send(res, 200, item) : sendError(res, 404, `Proyecto ${id} no existe`);
  }

  // POST /projects
  if (req.method === 'POST' && id === null) return upsert(req, res, list, null);
  // PUT /projects/:id
  if (req.method === 'PUT' && id !== null) return upsert(req, res, list, id);
  // DELETE /projects/:id
  if (req.method === 'DELETE' && id !== null) {
    const idx = list.findIndex((p) => p.id === id);
    if (idx === -1) return sendError(res, 404, `Proyecto ${id} no existe`);
    list.splice(idx, 1);
    writeProjects(list);
    return send(res, 204);
  }
  return sendError(res, 405, 'Método no permitido en este recurso');
}

async function upsert(req, res, list, id) {
  if (!(req.headers['content-type'] || '').includes('application/json')) {
    return sendError(res, 415, 'Content-Type debe ser application/json');
  }
  let body;
  try { body = JSON.parse(await readBody(req)); } catch { return sendError(res, 400, 'JSON inválido'); }
  const errors = validate(body);
  if (errors.length) return send(res, 422, { error: { status: 422, message: 'Datos inválidos', details: errors } });

  if (id === null) {
    const item = { id: list.reduce((m, p) => Math.max(m, p.id), 0) + 1, ...clean(body) };
    list.push(item);
    writeProjects(list);
    return send(res, 201, item, { Location: `${API_PREFIX}/projects/${item.id}` });
  }
  const idx = list.findIndex((p) => p.id === id);
  if (idx === -1) return sendError(res, 404, `Proyecto ${id} no existe`);
  list[idx] = { id, ...clean(body) };
  writeProjects(list);
  return send(res, 200, list[idx]);
}

/* ---------- Archivos estáticos ---------- */
function serveStatic(req, res, pathname) {
  const rel = pathname === '/' ? '/index.html' : decodeURIComponent(pathname);
  const file = path.normalize(path.join(ROOT, rel));
  const blocked = ['server.js', 'package.json', 'data', 'docs', 'node_modules', '.git'];
  const first = path.relative(ROOT, file).split(path.sep)[0];
  if (!file.startsWith(ROOT) || blocked.includes(first)) { res.writeHead(404); return res.end('Not found'); }
  fs.readFile(file, (err, content) => {
    if (err) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
    res.end(content);
  });
}

http.createServer(async (req, res) => {
  const { pathname } = new URL(req.url, `http://${req.headers.host}`);
  try {
    if (pathname.startsWith(API_PREFIX)) return await handleApi(req, res, pathname);
    return serveStatic(req, res, pathname);
  } catch (err) {
    console.error(err);
    return sendError(res, 500, 'Error interno del servidor');
  }
}).listen(PORT, () => console.log(`Sitio: http://localhost:${PORT}  |  API: http://localhost:${PORT}${API_PREFIX}/projects`));
