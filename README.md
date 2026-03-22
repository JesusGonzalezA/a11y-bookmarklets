# Accessibility Bookmarklets for Humans & AI Agents

> Bookmarklets de accesibilidad que funcionan en dos modos: **visual** (para auditores humanos) y **datos estructurados** (JSON para agentes IA).

## Concepto

Los bookmarklets tradicionales de accesibilidad solo añaden overlays visuales a la página. Este proyecto los amplía para que **también devuelvan datos JSON estructurados**, permitiendo que agentes IA (vía Playwright) puedan ejecutarlos y razonar sobre los resultados.

```
┌─────────────────────────────────────────────────────┐
│                  Página web                          │
│                                                      │
│   [Bookmarklet ejecutado]                            │
│     │                                                │
│     ├──► Visual: overlays, recuadros, etiquetas      │  ← Humano ve esto
│     │                                                │
│     └──► JSON: { issues: [...], summary: {...} }     │  ← Agente IA usa esto
│                                                      │
└─────────────────────────────────────────────────────┘
```

## Estructura del proyecto

```
packages/
├── core/           → Tipos compartidos, utilidades DOM, reporter
├── build-tools/    → Compilador TS → bookmarklet (esbuild)
├── bookmarklets/   → Bookmarklets individuales
│   ├── headings/   → Verificar estructura de headings
│   ├── landmarks/  → Zonas semánticas (nav, main, footer...)
│   ├── tab-order/  → Orden de tabulación
│   └── images/     → Alt text de imágenes
└── website/        → Web para descargar bookmarklets
skill/              → Definición de skill para skills.sh
```

## Bookmarklets disponibles

### Estructura y contenido

| Bookmarklet | Qué comprueba | WCAG |
|-------------|---------------|------|
| **Headings** | Estructura de encabezados (niveles, saltos, orden) | 1.3.1, 2.4.6 |
| **Landmarks** | Regiones semánticas (nav, main, aside, footer) | 1.3.1, 2.4.1 |
| **Tab Order** | Orden de tabulación y elementos focusables | 2.4.3, 2.1.1 |
| **Images** | Alt text, imágenes decorativas, figcaption | 1.1.1 |

### Preferencias del usuario (CSS Media Queries)

Verifican si la página respeta las preferencias del sistema operativo del usuario. Diferenciador clave: no existen equivalentes en herramientas de accesibilidad tradicionales.

| Bookmarklet | Qué comprueba | WCAG |
|-------------|---------------|------|
| **Dark Mode** | Soporte de `prefers-color-scheme`, meta tag y CSS `color-scheme` | 1.4.3, 1.4.6, 1.4.11 |
| **Reduced Motion** | Fallbacks de `prefers-reduced-motion`, animaciones y transiciones CSS | 2.3.3, 2.3.1 |
| **Inverted Colors** | Soporte de `inverted-colors`, compensación en imágenes y media | 1.4.1, 1.4.3 |
| **Reduced Transparency** | Soporte de `prefers-reduced-transparency`, elementos semi-transparentes | 1.4.11 |
| **Forced Colors** | Soporte de `forced-colors` y `prefers-contrast`, High Contrast Mode | 1.4.11, 1.4.3 |

### Video y media

| Bookmarklet | Qué comprueba | WCAG |
|-------------|---------------|------|
| **Video Controls** | Controles nativos y custom en `<video>` y `<audio>`, roles ARIA, accesibilidad por teclado | 1.2.1, 2.1.1, 4.1.2 |
| **Autoplay** | Autoplay con audio, estado muted, controles de pausa/volumen | 1.4.2 |
| **Captions** | Tracks de subtítulos/captions, validación src/srclang, videos embebidos | 1.2.2, 1.2.4 |
| **Audio Description** | Tracks de audiodescripción, links a versiones alternativas | 1.2.3, 1.2.5 |

### Meta tags y configuración

| Bookmarklet | Qué comprueba | WCAG |
|-------------|---------------|------|
| **Viewport & Zoom** | Meta viewport: user-scalable, maximum-scale, reflow responsive | 1.4.4, 1.4.10 |
| **Language** | Atributo lang en HTML, validación BCP 47, idioma de partes | 3.1.1, 3.1.2 |
| **Page Title** | Presencia y descriptividad del título, longitud, similitud con h1 | 2.4.2 |
| **Meta Tags** | Charset, description, color-scheme, theme-color, http-equiv refresh | 2.4.2, 3.2.5, 1.4.10 |

### Formularios

| Bookmarklet | Qué comprueba | WCAG |
|-------------|---------------|------|
| **Form Labels** | Nombres accesibles: label, aria-label, aria-labelledby, title, placeholder | 1.3.1, 3.3.2, 4.1.2 |
| **Autocomplete** | Atributos autocomplete en campos de identidad/financieros, tokens WHATWG | 1.3.5 |
| **Form Errors** | Manejo de errores: aria-invalid, aria-errormessage, regiones alert | 3.3.1, 3.3.3 |
| **Grouped Fields** | Uso de fieldset/legend, grupos de radio y checkbox | 1.3.1, 3.3.2 |

### Links, botones y navegación

| Bookmarklet | Qué comprueba | WCAG |
|-------------|---------------|------|
| **Links** | Links vacíos/genéricos, faux links, nombres accesibles, validez de anchors | 2.4.4, 4.1.2 |
| **Buttons** | Nombres accesibles, faux buttons, cumplimiento label-in-name | 4.1.2, 2.5.3 |
| **Skip Links** | Presencia de skip navigation, validez del target, posición como primer focusable | 2.4.1 |
| **New Window Links** | Detección de target=_blank, aviso al usuario, rel=noopener | 3.2.5 |

### Contenido y semántica

| Bookmarklet | Qué comprueba | WCAG |
|-------------|---------------|------|
| **ARIA** | Validez de roles ARIA, propiedades requeridas, referencias ID rotas, roles redundantes | 4.1.2, 1.3.1 |
| **Hidden Content** | aria-hidden, display:none, visibility:hidden, sr-only, opacity:0 | 1.3.2, 4.1.2 |
| **Live Regions** | aria-live, roles implícitos live, aria-relevant, aria-atomic | 4.1.3 |
| **Color Contrast** | Ratios de contraste de texto, umbrales AA/AAA, detección de texto grande | 1.4.3, 1.4.6 |
| **Text Spacing** | Resiliencia al espaciado WCAG 1.4.12, detección overflow:hidden | 1.4.12 |
| **Touch Targets** | Tamaño de elementos interactivos, mínimos 24×24 AA / 44×44 AAA | 2.5.8, 2.5.5 |

### Herramientas externas

| Bookmarklet | Qué comprueba | WCAG |
|-------------|---------------|------|
| **Axe Core** | Escaneo completo con axe-core: violations, incomplete checks, best practices | 4.1.2, 1.1.1, 1.3.1, 2.4.4, 3.1.1, 1.4.3 |

### Ideas avanzadas / Wild Card

| Bookmarklet | Qué comprueba | WCAG |
|-------------|---------------|------|
| **Reading Order** | Orden DOM vs orden visual, CSS order, posicionamiento absoluto, Kendall tau | 1.3.2, 2.4.3 |
| **A11y Snapshot** | Snapshot JSON completo: headings, landmarks, imágenes, forms, links, ARIA, media, stats | 1.1.1, 1.3.1, 2.4.1, 2.4.2, 2.4.4, 3.1.1, 4.1.2 |
| **Cognitive Load** | Animaciones infinitas, autoplay, modals, carruseles, CTAs, densidad de texto | 2.2.2, 2.3.1 |
| **Print Styles** | @media print, contenido oculto, URLs de links, imágenes de fondo, navegación | 1.1.1, 1.3.2 |

## Uso

### Como humano (bookmarklet en el navegador)

1. Visita la [web del proyecto](/) y arrastra el bookmarklet a tu barra de favoritos
2. Navega a la página que quieras auditar
3. Haz clic en el bookmarklet
4. Verás overlays visuales sobre los elementos relevantes

### Como agente IA (vía Playwright)

```javascript
// Desde Playwright browser_evaluate
const result = await page.evaluate(() => {
  // El bookmarklet inyecta window.__a11y y devuelve datos
  return window.__a11y.headings.audit();
});
```

## Desarrollo

```bash
npm install
npm run build
npm run test
npm run dev          # Website local
```

## Licencia

MIT
