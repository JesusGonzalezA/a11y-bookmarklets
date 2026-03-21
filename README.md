# Accessibility Bookmarklets for Humans & AI Agents

> Bookmarklets de accesibilidad que funcionan en dos modos: **visual** (para auditores humanos) y **datos estructurados** (JSON para agentes IA).

## Concepto

Los bookmarklets tradicionales de accesibilidad solo añaden overlays visuales a la página. Este proyecto los amplía para que **también devuelvan datos JSON estructurados**, permitiendo que agentes IA (vía MCP + Playwright) puedan ejecutarlos y razonar sobre los resultados.

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
├── mcp-server/     → Servidor MCP para agentes IA
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

## Uso

### Como humano (bookmarklet en el navegador)

1. Visita la [web del proyecto](/) y arrastra el bookmarklet a tu barra de favoritos
2. Navega a la página que quieras auditar
3. Haz clic en el bookmarklet
4. Verás overlays visuales sobre los elementos relevantes

### Como agente IA (vía MCP)

```json
{
  "mcpServers": {
    "a11y-bookmarklets": {
      "command": "npx",
      "args": ["@bookmarklets-a11y/mcp-server"]
    }
  }
}
```

El agente puede usar los tools del servidor MCP para ejecutar auditorías y recibir resultados JSON.

### Programáticamente (browser_evaluate)

```javascript
// Desde Playwright MCP browser_evaluate
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
