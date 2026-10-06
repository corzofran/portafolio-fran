# Portafolio · Francisco Rafael Corzo Pérez

Sitio estático (HTML + CSS + JS vanilla), sin dependencias ni paso de build.

## Estructura

```
portfolio/
├── index.html                  # Solo marcado semántico
└── assets/
    ├── css/
    │   ├── main.css            # Punto de entrada (@import en orden)
    │   ├── base/               # variables (tokens/temas), reset, accesibilidad
    │   ├── layout/             # header, section, footer
    │   ├── components/         # buttons, progress-bar, toast
    │   └── sections/           # hero, projects, stack, about, contact
    └── js/
        ├── config.js           # Configuración y datos de contacto
        ├── theme-init.js       # Aplica el tema antes del primer pintado
        ├── main.js             # Inicializa los módulos
        └── modules/            # toast, clipboard, theme, nav, scroll-progress, contact-form
```

## Cómo usarlo

- Abre `index.html` directamente en el navegador, o sírvelo con cualquier servidor estático.
- Para publicarlo: GitHub Pages, Netlify o Vercel (carpeta raíz = `portfolio/`).

## Buenas prácticas aplicadas

- Separación de responsabilidades: estructura (HTML), presentación (CSS) y comportamiento (JS).
- CSS por capas (base → layout → componentes → secciones); media queries junto a cada componente.
- Design tokens en variables CSS; sin colores ni estilos en línea.
- Sin `onclick` en línea: eventos con `data-*` y delegación.
- JS en módulos pequeños (IIFE + namespace `Portfolio`), `defer`, y datos configurables en `config.js`.
- Accesibilidad: `aria-expanded`, `aria-live`, SVG decorativos ocultos, `prefers-reduced-motion`.
- Rendimiento: scroll con `requestAnimationFrame` y listener `passive`.

## Cambiar datos

- Número de WhatsApp: `assets/js/config.js`.
- Colores y tema: `assets/css/base/variables.css`.
