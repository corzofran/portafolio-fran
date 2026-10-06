# Contrato de la API

| Campo     | Valor |
|-----------|-------|
| Tipo      | RESTful (cliente-servidor, stateless, cacheable, interfaz uniforme, sistema por capas) |
| Protocolo | HTTP/HTTPS (en producción, detrás de HTTPS) |
| Versión   | 1 |
| URI base  | `/api/v1` |
| Formato   | `application/json` (UTF-8) |

## Recurso: `projects`

URI: `/api/v1/projects`

| Método | URI | Body-request | Respuesta | Códigos HTTP |
|--------|-----|--------------|-----------|--------------|
| GET    | `/projects`     | —    | Arreglo de proyectos | 200 |
| GET    | `/projects/:id` | —    | Proyecto | 200, 404 |
| POST   | `/projects`     | JSON | Proyecto creado + header `Location` | 201, 400, 415, 422 |
| PUT    | `/projects/:id` | JSON | Proyecto actualizado | 200, 400, 404, 415, 422 |
| DELETE | `/projects/:id` | —    | Sin contenido | 204, 404 |

### Body-request (POST / PUT)

```json
{
  "layout": "medium",
  "tag": "SaaS / Web",
  "nombre": "Runners SaaS",
  "descripcion": "Plataforma web para equipos de atletismo.",
  "tecnologias": ["Next.js", "Express"],
  "caracteristicas": [],
  "url": null
}
```

- `layout` (obligatorio): `featured`, `medium`, `small` o `github`
- `nombre`, `descripcion` (obligatorios): texto
- `tecnologias`, `caracteristicas`: arreglos de texto
- `url`: `null` o URL que empiece con `http(s)://`

### Headers

- Request: `Content-Type: application/json` (POST/PUT), `Accept: application/json`
- Response: `Content-Type: application/json; charset=utf-8`, `X-API-Version: 1`, `Location` (en 201), CORS habilitado

### Errores

```json
{ "error": { "status": 422, "message": "Datos inválidos", "details": ["nombre es obligatorio (string)"] } }
```

## Ejemplos

```bash
curl http://localhost:3000/api/v1/projects
curl -X POST http://localhost:3000/api/v1/projects \
  -H "Content-Type: application/json" \
  -d '{"layout":"small","nombre":"Nuevo","descripcion":"Demo","tecnologias":["Node"]}'
curl -X DELETE http://localhost:3000/api/v1/projects/7
```
