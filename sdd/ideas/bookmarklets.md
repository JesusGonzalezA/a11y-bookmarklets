# Bookmarklets de Accesibilidad — Catálogo Completo

> 31 bookmarklets organizados en 6 categorías. Cada uno es ejecutable por humanos (overlay visual) y por agentes IA (JSON estructurado). El resultado `AuditResult` sigue el contrato definido en `@bookmarklets-a11y/core`.

---

## Categoría 1: Preferencias del Usuario (CSS Media Queries)

Bookmarklets que verifican si la página respeta las preferencias del sistema operativo del usuario. Diferenciador clave: no existen equivalentes en a11y-tools.com.

---

### 1. Dark Mode Audit

- **Nombre**: `dark-mode`
- **Descripción**: Detecta si la página implementa `prefers-color-scheme`. Parsea todas las `document.styleSheets` buscando reglas `@media (prefers-color-scheme: dark)` y `@media (prefers-color-scheme: light)`. Compara `getComputedStyle` de elementos clave (body, main, headers, cards) emulando ambos esquemas mediante inyección de `color-scheme: dark` / `color-scheme: light` en `:root`. Reporta elementos sin adaptación y ratios de contraste en cada modo.
- **WCAG**: 1.4.3 Contrast (Minimum), 1.4.6 Contrast (Enhanced), 1.4.11 Non-text Contrast — el contraste puede fallar en un modo si no se adaptan los colores.
- **Herramientas para interpretación IA**:
  - **`@weaaare/mcp-a11y-color`** → `check-contrast` para validar ratios de contraste en ambos modos; `suggest-contrast-fix` para proponer correcciones; `simulate-color-blindness` para verificar CVD en cada modo.
  - **Método**: `document.styleSheets` API + `CSSStyleSheet.cssRules` para parsear `@media` rules. `window.matchMedia('(prefers-color-scheme: dark)')` para detectar preferencia activa. Inyección temporal de `<meta name="color-scheme" content="dark">` para forzar modo y comparar estilos computados.
  - **Fórmula de contraste**: WCAG 2.2 relative luminance ratio = (L1 + 0.05) / (L2 + 0.05), donde L se calcula via sRGB linearization.

---

### 2. Reduced Motion Audit

- **Nombre**: `reduced-motion`
- **Descripción**: Busca todas las animaciones y transiciones CSS activas en la página (`animation`, `transition`, `@keyframes`) y verifica si existe una regla `@media (prefers-reduced-motion: reduce)` que las desactive o minimice. Lista cada animación encontrada, su duración, y si tiene fallback. Detecta también animaciones JavaScript via `requestAnimationFrame`, `setInterval` con manipulación de estilo, y uso de Web Animations API (`element.animate()`).
- **WCAG**: 2.3.3 Animation from Interactions (AAA), 2.3.1 Three Flashes or Below Threshold (A) — las animaciones sin alternativa pueden causar vestibular disorders.
- **Herramientas para interpretación IA**:
  - **Método**: `document.styleSheets` API para parsear `@keyframes` y propiedades `animation`/`transition`. `getComputedStyle(el).animation` y `getComputedStyle(el).transition` para detectar animaciones activas. `window.matchMedia('(prefers-reduced-motion: reduce)')` para verificar preferencia.
  - **Paper**: Vestibular disorder prevalence — "Prevalence of Vestibular Disorders in the United States" (Agrawal et al., 2009, Archives of Internal Medicine). ~35% de adultos >40 años experimentan disfunción vestibular.
  - **`@weaaare/mcp-voiceover-auditor`** / **`@weaaare/mcp-virtual-screen-reader-auditor`** → para verificar que el contenido animado sea anunciado correctamente sin la animación.

---

### 3. Inverted Colors Audit

- **Nombre**: `inverted-colors`
- **Descripción**: Detecta si la página usa la media query `inverted-colors`. Busca reglas `@media (inverted-colors: inverted)` en stylesheets. Identifica elementos que se "rompen" visualmente con inversión: imágenes, videos, canvas, SVGs con colores inline, y elementos con `background-image`. Reporta cuántos elementos deberían tener `filter: invert(1)` compensatorio para mantener su apariencia original.
- **WCAG**: 1.4.1 Use of Color (A), 1.4.3 Contrast (Minimum) — la inversión de colores puede destruir contraste o significado cromático.
- **Herramientas para interpretación IA**:
  - **`@weaaare/mcp-a11y-color`** → `check-contrast` con colores invertidos; `simulate-color-blindness` para verificar que colores invertidos sean distinguibles bajo CVD.
  - **Método**: `document.styleSheets` API para buscar `@media (inverted-colors)`. `querySelectorAll('img, video, canvas, svg, [style*="background-image"]')` para identificar elementos que necesitan compensación. `getComputedStyle(el).filter` para detectar compensaciones existentes.
  - **Fórmula de inversión**: Color invertido = `rgb(255 - R, 255 - G, 255 - B)`. Recalcular luminancia relativa post-inversión usando la fórmula WCAG.

---

### 4. Reduced Transparency Audit

- **Nombre**: `reduced-transparency`
- **Descripción**: Busca elementos con `opacity < 1`, colores con canal alpha (`rgba`, `hsla`), `backdrop-filter`, y `background-color: transparent`. Verifica si existe `@media (prefers-reduced-transparency: reduce)` con fallbacks opacos. Reporta cada elemento semi-transparente y si tiene alternativa.
- **WCAG**: 1.4.11 Non-text Contrast (AA) — los elementos semi-transparentes pueden tener contraste insuficiente sobre ciertos fondos.
- **Herramientas para interpretación IA**:
  - **`@weaaare/mcp-a11y-color`** → `check-contrast` calculando el color compuesto (alpha blending) sobre el fondo real; `apca-contrast` para contraste perceptual WCAG 3.0 draft.
  - **Método**: `getComputedStyle(el).opacity`, `getComputedStyle(el).backgroundColor` para extraer valores alpha. Alpha blending: `C_result = C_fg × α + C_bg × (1 − α)`. `document.styleSheets` para buscar `@media (prefers-reduced-transparency)`.
  - **Fórmula de alpha compositing**: Porter-Duff "source over" — `α_out = α_fg + α_bg(1 − α_fg)`, `C_out = (C_fg × α_fg + C_bg × α_bg × (1 − α_fg)) / α_out`.

---

### 5. Color Contrast Mode Audit

- **Nombre**: `forced-colors`
- **Descripción**: Detecta si la página tiene reglas `@media (forced-colors: active)` y `@media (prefers-contrast: more|less|custom)`. Verifica que colores custom no desaparezcan en Windows High Contrast Mode. Identifica propiedades que se resetean en forced-colors (backgrounds, borders, box-shadows) y elementos que necesitan `-ms-high-contrast-adjust` o system colors (`Canvas`, `CanvasText`, `LinkText`, etc.).
- **WCAG**: 1.4.11 Non-text Contrast (AA), 1.4.3 Contrast (Minimum) (AA) — High Contrast Mode puede hacer invisibles elementos que dependen de colores custom.
- **Herramientas para interpretación IA**:
  - **`@weaaare/mcp-a11y-color`** → `check-contrast` con system colors; `analyze-palette-contrast` para verificar la paleta completa bajo forced-colors.
  - **Método**: `document.styleSheets` para buscar `@media (forced-colors)` y `@media (prefers-contrast)`. `window.matchMedia('(forced-colors: active)')` para detectar modo activo. Listado de CSS system colors: `Canvas`, `CanvasText`, `LinkText`, `VisitedText`, `ActiveText`, `ButtonFace`, `ButtonText`, `Field`, `FieldText`, `Highlight`, `HighlightText`, `GrayText`, `Mark`, `MarkText`.
  - **Referencia**: W3C CSS Color Adjustment Module Level 1 — `forced-color-adjust` property spec.

---

## Categoría 2: Video y Media

---

### 6. Video Controls Audit

- **Nombre**: `video-controls`
- **Descripción**: Busca todos los `<video>` y `<audio>` en la página. Verifica si tienen el atributo `controls` nativo. Si usan un player custom, inspecciona si los controles tienen roles ARIA correctos (`role="slider"` para progreso, botones con `aria-label`), si son operables por teclado (`tabindex`, event listeners de `keydown`), y si el estado está expuesto (`aria-valuenow`, `aria-pressed`).
- **WCAG**: 1.2.1 Audio-only and Video-only (A), 1.2.2 Captions (A), 2.1.1 Keyboard (A), 4.1.2 Name, Role, Value (A).
- **Herramientas para interpretación IA**:
  - **`@weaaare/mcp-voiceover-auditor`** / **`@weaaare/mcp-virtual-screen-reader-auditor`** → navegar los controles del player y verificar anuncios de roles, nombres y estados.
  - **`@weaaare/mcp-nvda-auditor`** → `nvda_perform` con navegación por forms para encontrar controles del player.
  - **Método**: `querySelectorAll('video, audio')` → verificar `.controls` property y `.hasAttribute('controls')`. Para players custom: `querySelectorAll('[class*="player"], [class*="video"], [id*="player"]')` + inspeccionar children por roles ARIA. `el.getAttribute('role')`, `el.getAttribute('aria-label')`, `el.getAttribute('tabindex')`.

---

### 7. Autoplay Audit

- **Nombre**: `autoplay`
- **Descripción**: Detecta media con autoplay: `<video autoplay>`, `<audio autoplay>`, y elementos que invocan `.play()` programáticamente. Verifica si autoplay va acompañado de `muted` (requisito de browsers). Detecta audio que dura >3 segundos sin mecanismo de pausa/stop. Comprueba si hay controles de volumen accesibles.
- **WCAG**: 1.4.2 Audio Control (A) — el audio que se reproduce automáticamente y dura >3s debe poder pausarse/pararse o controlar el volumen independientemente del volumen del sistema.
- **Herramientas para interpretación IA**:
  - **`@weaaare/mcp-virtual-screen-reader-auditor`** → `virtual_start` en la URL y verificar si se detectan anuncios de audio reproduciéndose; navegar para encontrar controles de pausa.
  - **Método**: `querySelectorAll('video[autoplay], audio[autoplay]')`. Verificar `.muted`, `.duration`, `.paused`. `MutationObserver` para detectar elementos `<video>`/`<audio>` inyectados dinámicamente. Override temporal de `HTMLMediaElement.prototype.play` para interceptar llamadas programáticas.
  - **Criterio determinista**: Autoplay + !muted + duration > 3s + no pause control visible = violation.

---

### 8. Captions Audit

- **Nombre**: `captions`
- **Descripción**: Busca todos los `<video>` y verifica si tienen elementos `<track kind="captions">` o `<track kind="subtitles">`. Valida que el `src` del track exista (no 404), que el formato sea WebVTT válido, y que el `srclang` sea coherente. Reporta videos sin tracks, tracks vacíos, y videos embebidos (iframes de YouTube/Vimeo) donde no se puede verificar.
- **WCAG**: 1.2.2 Captions (Prerecorded) (A), 1.2.4 Captions (Live) (AA).
- **Herramientas para interpretación IA**:
  - **Método**: `querySelectorAll('video')` → iterar `el.querySelectorAll('track')` y verificar `kind`, `src`, `srclang`, `label`. `fetch(track.src)` para validar que el archivo existe y tiene contenido WebVTT válido (empieza con `WEBVTT`). Para iframes: `querySelectorAll('iframe[src*="youtube"], iframe[src*="vimeo"]')` — marcar como "no verificable programáticamente".
  - **Formato WebVTT**: W3C WebVTT spec — validar header `WEBVTT`, cue timing format `HH:MM:SS.mmm --> HH:MM:SS.mmm`, y que exista al menos un cue.

---

### 9. Audio Description Audit

- **Nombre**: `audio-description`
- **Descripción**: Verifica si los videos tienen track de audiodescripción (`<track kind="descriptions">`). Detecta si hay una versión alternativa del video con audiodescripción (link adyacente). Reporta videos que podrían necesitar audiodescripción basándose en heurísticas (video sin `muted`, con duración >5s, sin `<track kind="descriptions">`).
- **WCAG**: 1.2.3 Audio Description or Media Alternative (A), 1.2.5 Audio Description (Prerecorded) (AA).
- **Herramientas para interpretación IA**:
  - **`@weaaare/mcp-virtual-screen-reader-auditor`** → navegar cerca del video para detectar links a versiones con audiodescripción ("audio described version", "AD version").
  - **Método**: `querySelectorAll('video')` → verificar `track[kind="descriptions"]`. Buscar links adyacentes con texto indicativo: regex `/audio\s*descri|described\s*version|\bAD\b.*version/i` en siblings y parent.

---

## Categoría 3: Meta Tags y Configuración de Página

---

### 10. Zoom & Viewport Audit

- **Nombre**: `viewport-zoom`
- **Descripción**: Lee `<meta name="viewport">` y analiza sus directivas. Detecta restricciones de zoom: `user-scalable=no`, `maximum-scale <= 2`, `minimum-scale = maximum-scale`. Verifica que el contenido sea legible al 200% de zoom sin pérdida de contenido o funcionalidad. Reporta el valor exacto de cada directiva y su impacto.
- **WCAG**: 1.4.4 Resize Text (AA) — el texto debe poder escalarse al 200% sin tecnología asistiva. 1.4.10 Reflow (AA) — el contenido debe reformatearse a 320px CSS sin scroll horizontal.
- **Herramientas para interpretación IA**:
  - **Método**: `document.querySelector('meta[name="viewport"]')?.content` → parsear como key-value pairs con regex `/(\w[\w-]*)=([^,\s]*)/g`. Reglas deterministas:
    - `user-scalable=no` o `user-scalable=0` → **violation** (1.4.4)
    - `maximum-scale < 2` → **violation** (1.4.4, se requiere al menos 200%)
    - `maximum-scale >= 2 && maximum-scale < 5` → **warning** (best practice es no limitar)
    - Sin meta viewport → **info** (el browser permite zoom por defecto)
  - **Referencia**: WCAG Technique F35 (Failure — viewport prevents zoom), MDN viewport meta documentation.

---

### 11. Language Audit

- **Nombre**: `language`
- **Descripción**: Verifica que `<html lang>` exista y sea un código BCP 47 válido. Extrae las primeras 1000 palabras visibles del `<body>` y aplica detección de idioma por distribución de n-gramas para comparar con el `lang` declarado. Busca elementos con atributo `lang` para verificar marcado de contenido multilingüe. Detecta `lang` vacío, `lang` inválido, y discrepancias idioma declarado vs real.
- **WCAG**: 3.1.1 Language of Page (A), 3.1.2 Language of Parts (AA).
- **Herramientas para interpretación IA**:
  - **`@weaaare/mcp-a11y-readability`** → `get-text-stats` para extraer estadísticas del texto; `analyze-readability` para verificar si las fórmulas del idioma declarado son coherentes con el texto real (si se declara `es` pero las fórmulas de español dan resultados absurdos, posible discrepancia).
  - **Método**: `document.documentElement.lang` para obtener lang declarado. Validar contra BCP 47 con regex `/^[a-z]{2,3}(-[A-Z][a-z]{3})?(-[A-Z]{2}|-[0-9]{3})?$/`. Extracción de texto: `document.body.innerText.split(/\s+/).slice(0, 1000)`.
  - **Detección de idioma por n-gramas**: Tabla de trigramas más frecuentes por idioma (ej: español → "de ", " de", "la ", " la", "ión", "ent", "que"; inglés → "the", "he ", " th", "ing", "and", " an", "ion"). Calcular cosine similarity entre distribución de trigramas del texto y perfiles de referencia. Umbral de confianza > 0.7 para reportar discrepancia.
  - **Paper**: "N-Gram-Based Text Categorization" (Cavnar & Trenkle, 1994) — método de clasificación de idiomas por frecuencia de n-gramas, precisión >99% para textos >100 palabras.
  - **Referencia**: IANA Language Subtag Registry, BCP 47 (RFC 5646).

---

### 12. Page Title Audit

- **Nombre**: `page-title`
- **Descripción**: Verifica que `<title>` exista, no esté vacío, y sea descriptivo. Detecta títulos genéricos ("Home", "Untitled", "Page", "Document", "Index", "Welcome") mediante lista de patrones. Verifica longitud (ideal 30–60 caracteres para SEO/UX). Compara con `<h1>` para coherencia. En SPAs, detecta si el título se actualiza en navegación client-side.
- **WCAG**: 2.4.2 Page Titled (A).
- **Herramientas para interpretación IA**:
  - **`@weaaare/mcp-a11y-readability`** → `get-text-stats` sobre el título para verificar complejidad; `analyze-readability` para confirmar que sea comprensible.
  - **`@weaaare/mcp-voiceover-auditor`** / **`@weaaare/mcp-virtual-screen-reader-auditor`** → verificar el anuncio del título al cargar la página.
  - **Método**: `document.title` para obtener título. Lista de genéricos: `/^(home|untitled|page|document|index|welcome|test|localhost|nueva pestaña|new tab|sin título)$/i`. Comparar con `document.querySelector('h1')?.textContent` usando Jaccard similarity de tokens. Para SPAs: `MutationObserver` en `<title>` para detectar cambios dinámicos.

---

### 13. Meta Accessibility Audit

- **Nombre**: `meta-tags`
- **Descripción**: Auditoría completa de meta tags relevantes para accesibilidad. Verifica: `<meta charset="UTF-8">` (codificación correcta de caracteres especiales), `<meta name="description">` (proporcionada a screen readers en algunos contextos), `<meta name="color-scheme">` (declaración de soporte dark/light), `<meta name="theme-color">` (coherencia con esquema de colores), `<meta http-equiv="refresh">` (redirects automáticos que desorientan), `<meta name="robots">` (no bloquea herramientas a11y).
- **WCAG**: 2.2.1 Timing Adjustable (A) — `http-equiv="refresh"` con timeout <20h viola esto. 3.2.5 Change on Request (AAA) — redirects automáticos.
- **Herramientas para interpretación IA**:
  - **`@weaaare/mcp-a11y-color`** → `get-color-info` para analizar `theme-color` y verificar coherencia con la paleta de la página.
  - **Método**: `document.querySelectorAll('meta')` → iterar y clasificar por `name`/`http-equiv`/`charset`. Reglas deterministas:
    - `http-equiv="refresh" content="N;..."` donde N > 0 y N < 72000 → **violation** (2.2.1)
    - Sin `charset` o charset != UTF-8 → **warning**
    - `color-scheme` ausente pero página usa dark mode → **warning**
  - **Referencia**: WCAG Technique F41 (Failure — meta refresh), HTML Living Standard (WHATWG) — meta element.

---

## Categoría 4: Formularios y Controles Interactivos

---

### 14. Form Labels Audit

- **Nombre**: `form-labels`
- **Descripción**: Busca todos los controles de formulario (`input`, `select`, `textarea`) y verifica su nombre accesible. Algoritmo: 1) `aria-labelledby` → resolver referencia, 2) `aria-label` directo, 3) `<label for="id">` explícito, 4) `<label>` envolvente implícito, 5) `title` attribute, 6) `placeholder` (no suficiente solo). Reporta controles sin nombre, labels vacíos, y labels solo-placeholder.
- **WCAG**: 1.3.1 Info and Relationships (A), 3.3.2 Labels or Instructions (A), 4.1.2 Name, Role, Value (A).
- **Herramientas para interpretación IA**:
  - **`@weaaare/mcp-voiceover-auditor`** / **`@weaaare/mcp-virtual-screen-reader-auditor`** → navegar por formularios (`voiceover_perform`/`virtual_perform` con tipo "forms") y verificar lo que anuncia el screen reader para cada control.
  - **`@weaaare/mcp-nvda-auditor`** → `nvda_press` con "F" para navegar por form fields y capturar anuncios.
  - **Método**: Implementar el Accessible Name Computation algorithm (W3C AccName spec). `querySelectorAll('input:not([type="hidden"]), select, textarea, [role="textbox"], [role="combobox"], [role="listbox"], [role="searchbox"]')`. Para cada elemento, recorrer la cadena de fallback y reportar la fuente del nombre. `document.querySelector('label[for="' + el.id + '"]')` para labels explícitos, `el.closest('label')` para implícitos.
  - **Referencia**: W3C Accessible Name and Description Computation 1.2 (AccName spec).

---

### 15. Autocomplete Audit

- **Nombre**: `autocomplete`
- **Descripción**: Verifica que campos de datos personales tengan atributo `autocomplete` con valores válidos. Detecta campos por: `type` (email, tel, url), `name`/`id` patterns (regex para name, email, phone, address, city, zip, cc-number, etc.), y `label` text. Valida que los valores de `autocomplete` sean tokens válidos según HTML spec (e.g., `given-name`, `family-name`, `email`, `tel`, `street-address`, etc.).
- **WCAG**: 1.3.5 Identify Input Purpose (AA).
- **Herramientas para interpretación IA**:
  - **Método**: `querySelectorAll('input, select, textarea')` → para cada uno, analizar `el.type`, `el.name`, `el.id`, `el.autocomplete`, y texto del `<label>` asociado. Mapeo de heurísticas name/id → autocomplete esperado:
    - `/first.?name|given.?name|nombre/i` → `given-name`
    - `/last.?name|family.?name|apellido/i` → `family-name`
    - `/e.?mail|correo/i` → `email`
    - `/phone|tel|teléfono/i` → `tel`
    - `/address|dirección|calle/i` → `street-address`
    - `/zip|postal|código.?postal/i` → `postal-code`
    - `/city|ciudad/i` → `address-level2`
    - `/country|país/i` → `country-name`
    - `/cc.?num|card.?num|tarjeta/i` → `cc-number`
  - **Referencia**: HTML Living Standard — autofill field names (WHATWG), lista completa de tokens `autocomplete` válidos.

---

### 16. Error Handling Audit

- **Nombre**: `form-errors`
- **Descripción**: Inspecciona el manejo de errores en formularios. Busca: `aria-invalid` en campos, `aria-errormessage` y que apunte a un ID existente con texto visible, `aria-describedby` para mensajes de error, y patterns de error visual (elementos con `role="alert"`, clases `.error`, `.invalid`, `[data-error]`). Verifica que los errores sean anunciados por screen readers (vía `aria-live` o `role="alert"`).
- **WCAG**: 3.3.1 Error Identification (A), 3.3.3 Error Suggestion (AA), 3.3.4 Error Prevention (AA).
- **Herramientas para interpretación IA**:
  - **`@weaaare/mcp-voiceover-auditor`** / **`@weaaare/mcp-virtual-screen-reader-auditor`** → hacer submit de un form vacío y verificar que los errores sean anunciados. Navegar a campos con `aria-invalid="true"` y verificar anuncio.
  - **Método**: `querySelectorAll('[aria-invalid]')` para encontrar campos marcados como inválidos. `querySelectorAll('[aria-errormessage]')` → verificar `document.getElementById(el.getAttribute('aria-errormessage'))?.textContent`. `querySelectorAll('[role="alert"], [aria-live="assertive"], [aria-live="polite"]')` para regiones de error. Verificar visibilidad con `getComputedStyle`.

---

### 17. Grouped Fields Audit

- **Nombre**: `grouped-fields`
- **Descripción**: Verifica que controles relacionados (radio buttons, checkboxes del mismo grupo) estén agrupados semánticamente. Busca: `<fieldset>` con `<legend>`, `role="group"` o `role="radiogroup"` con `aria-labelledby`/`aria-label`. Detecta radios con el mismo `name` que no están dentro de un grupo. Detecta fieldsets sin legend.
- **WCAG**: 1.3.1 Info and Relationships (A), 4.1.2 Name, Role, Value (A).
- **Herramientas para interpretación IA**:
  - **`@weaaare/mcp-virtual-screen-reader-auditor`** → navegar por form controls y verificar que los grupos sean anunciados con su nombre.
  - **Método**: `querySelectorAll('input[type="radio"]')` → agrupar por `name` → verificar que cada grupo esté dentro de `closest('fieldset, [role="radiogroup"], [role="group"]')`. Idem para `input[type="checkbox"]` con `name` compartido. `querySelectorAll('fieldset')` → verificar `el.querySelector('legend')?.textContent`. `querySelectorAll('[role="group"], [role="radiogroup"]')` → verificar `aria-label` o `aria-labelledby`.

---

## Categoría 5: Links, Botones y Navegación

---

### 18. Links Audit

- **Nombre**: `links`
- **Descripción**: Audita todos los links de la página. Detecta: links vacíos (sin texto accesible), links genéricos ("click here", "read more", "leer más", "aquí", "more", "link"), links con `href="#"` o `href="javascript:void(0)"`, links sin `href` (no focusable por teclado), y links que abren nueva ventana (`target="_blank"`) sin indicación. Calcula el nombre accesible via AccName algorithm.
- **WCAG**: 2.4.4 Link Purpose (In Context) (A), 2.4.9 Link Purpose (Link Only) (AAA).
- **Herramientas para interpretación IA**:
  - **`@weaaare/mcp-voiceover-auditor`** / **`@weaaare/mcp-virtual-screen-reader-auditor`** → navegar por links (`voiceover_perform`/`virtual_perform` con "links") y verificar que el anuncio sea descriptivo.
  - **`@weaaare/mcp-a11y-readability`** → `get-text-stats` sobre los textos de links genéricos para sugerir alternativas más descriptivas.
  - **Método**: `querySelectorAll('a, [role="link"]')`. Para cada uno, computar nombre accesible. Lista de genéricos: `/^(click here|read more|more|learn more|here|link|leer más|más|ver más|aquí|saber más|info|details|continue)$/i`. `el.target === '_blank'` → verificar si hay indicación en `aria-label`, `title`, o texto visual (ej: "(opens in new window)", icono con sr-only text).
  - **Referencia**: WCAG Technique H30 (link purpose from link text), F84 (failure — generic link text).

---

### 19. Buttons Audit

- **Nombre**: `buttons`
- **Descripción**: Audita todos los botones. Detecta: botones sin nombre accesible (icon buttons sin `aria-label`), `<div>` o `<span>` con `onclick` sin `role="button"` ni keyboard handling, botones `disabled` vs `aria-disabled` (diferencias de foco), e inconsistencias entre texto visible y `aria-label` (violación de 2.5.3). Calcula nombre accesible via AccName.
- **WCAG**: 4.1.2 Name, Role, Value (A), 2.5.3 Label in Name (A), 2.1.1 Keyboard (A).
- **Herramientas para interpretación IA**:
  - **`@weaaare/mcp-voiceover-auditor`** / **`@weaaare/mcp-virtual-screen-reader-auditor`** → navegar por botones y verificar anuncios de nombre y rol.
  - **Método**: `querySelectorAll('button, [role="button"], input[type="button"], input[type="submit"], input[type="reset"]')`. Detección de faux-buttons: `querySelectorAll('[onclick]:not(button):not(a):not([role])')`. Para 2.5.3: comparar `el.textContent.trim()` con `el.getAttribute('aria-label')` — el aria-label debe contener el texto visible como substring.
  - **Referencia**: WCAG Technique F42 (failure — emulated links/buttons), W3C AccName algorithm.

---

### 20. Skip Links Audit

- **Nombre**: `skip-links`
- **Descripción**: Verifica la existencia y funcionalidad de skip navigation links. Busca links al inicio del DOM cuyo `href` apunte a un anchor interno (`#main`, `#content`, `#main-content`). Verifica que: el target ID exista, el link sea el primer focusable de la página, sea visible al focus (no `display:none` permanente), y que el target sea focusable o tenga `tabindex="-1"`.
- **WCAG**: 2.4.1 Bypass Blocks (A).
- **Herramientas para interpretación IA**:
  - **`@weaaare/mcp-voiceover-auditor`** / **`@weaaare/mcp-virtual-screen-reader-auditor`** → Tab al primer elemento y verificar si se anuncia "Skip to content" o similar.
  - **Método**: `querySelectorAll('a[href^="#"]')` filtrado a los primeros 5 links del DOM. Verificar `document.querySelector(el.getAttribute('href'))` existe. `getComputedStyle(el)` para verificar visibilidad (puede estar oculto visualmente pero visible al foco). Heurística de texto: `/skip|saltar|ir al|jump to|go to.*(main|content|nav|contenido|principal)/i`.

---

### 21. New Window Links Audit

- **Nombre**: `new-window-links`
- **Descripción**: Detecta links con `target="_blank"` y verifica si informan al usuario que se abrirá una nueva ventana/pestaña. Busca indicación en: `aria-label` que mencione "new window/tab", texto visible con "(opens in new tab)", icono con `aria-label` descriptivo, o texto visually-hidden adjunto. Verifica también la presencia de `rel="noopener noreferrer"` por seguridad.
- **WCAG**: 3.2.5 Change on Request (AAA), advisory technique G200 (opening new windows only when best applicable), advisory technique G201 (giving advance warning).
- **Herramientas para interpretación IA**:
  - **`@weaaare/mcp-voiceover-auditor`** / **`@weaaare/mcp-virtual-screen-reader-auditor`** → navegar por links con `target="_blank"` y verificar si el anuncio incluye indicación de nueva ventana.
  - **Método**: `querySelectorAll('a[target="_blank"], a[target="_new"]')`. Para cada uno, buscar indicación en: `el.getAttribute('aria-label')`, `el.textContent`, `el.querySelector('.sr-only, .visually-hidden')?.textContent`, `el.querySelector('[aria-label]')?.getAttribute('aria-label')`, `el.getAttribute('title')`. Regex de indicación: `/new (window|tab)|nueva (ventana|pestaña)|opens? (in|a)|se abre/i`. Verificar `el.getAttribute('rel')?.includes('noopener')`.

---

## Categoría 6: Contenido y Semántica

---

### 22. ARIA Audit

- **Nombre**: `aria`
- **Descripción**: Verifica uso correcto de ARIA en la página. Detecta: roles inválidos (no en WAI-ARIA 1.2 spec), `aria-*` attributes inválidos para el rol actual, propiedades requeridas faltantes (ej: `role="slider"` sin `aria-valuenow`), ARIA redundante con HTML semántico (ej: `<button role="button">`), `aria-hidden="true"` en elementos focusables, y IDs referenciados por `aria-labelledby`/`aria-describedby`/`aria-controls` que no existen.
- **WCAG**: 4.1.2 Name, Role, Value (A), 1.3.1 Info and Relationships (A).
- **Herramientas para interpretación IA**:
  - **`@weaaare/mcp-voiceover-auditor`** / **`@weaaare/mcp-virtual-screen-reader-auditor`** → navegar la página y verificar que los roles ARIA sean anunciados correctamente.
  - **skill `aria-patterns`** (de `a11y-agents-kit`) → referencia de patrones ARIA correctos para componentes interactivos.
  - **Método**: `querySelectorAll('[role]')` → validar contra lista completa de roles WAI-ARIA 1.2. `querySelectorAll('[aria-hidden="true"]')` → verificar que no contengan focusables (`el.querySelectorAll('a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])')`). Para cada `[aria-labelledby]`, `[aria-describedby]`, `[aria-controls]`, `[aria-owns]`: verificar `document.getElementById(id)` existe por cada ID referenciado.
  - **Referencia**: WAI-ARIA 1.2 spec — role taxonomy y required properties. ARIA in HTML spec (W3C) — tabla de roles implícitos por elemento HTML.

---

### 23. Hidden Content Audit

- **Nombre**: `hidden-content`
- **Descripción**: Revela contenido oculto a AT y detecta problemas. Busca: `aria-hidden="true"` (y verifica no contenga focusables), `display: none` / `visibility: hidden` (inaccesible para todos), `clip-path: inset(100%)` / `sr-only` patterns (oculto visualmente pero accesible a AT), `hidden` attribute. Resalta visualmente cada tipo con color distinto.
- **WCAG**: 4.1.2 Name, Role, Value (A), 1.3.1 Info and Relationships (A), 1.3.2 Meaningful Sequence (A).
- **Herramientas para interpretación IA**:
  - **`@weaaare/mcp-virtual-screen-reader-auditor`** → navegar y verificar que el contenido oculto no sea anunciado (o sí, según corresponda).
  - **Método**: Para `aria-hidden`:  `querySelectorAll('[aria-hidden="true"]')` → verificar focusables internos. Para CSS hidden: iterar elementos visibles y verificar `getComputedStyle(el).display !== 'none' && getComputedStyle(el).visibility !== 'hidden'`. Para visually-hidden: detectar patterns — `position: absolute` + `clip-path: inset(100%)` + `width: 1px` + `height: 1px` + `overflow: hidden`.

---

### 24. Live Regions Audit

- **Nombre**: `live-regions`
- **Descripción**: Identifica y valida todas las live regions de la página. Busca: `aria-live="polite"`, `aria-live="assertive"`, `role="alert"`, `role="status"`, `role="log"`, `role="marquee"`, `role="timer"`. Verifica que: las live regions existan en el DOM al cargar (no inyectadas dinámicamente), tengan `aria-atomic` y `aria-relevant` configurados correctamente, y no estén vacías permanentemente.
- **WCAG**: 4.1.3 Status Messages (AA).
- **Herramientas para interpretación IA**:
  - **`@weaaare/mcp-voiceover-auditor`** → monitorear `voiceover_spoken_phrase_log` para capturar anuncios de live regions al cambiar contenido.
  - **`@weaaare/mcp-virtual-screen-reader-auditor`** → idem con `virtual_spoken_phrase_log`.
  - **Método**: `querySelectorAll('[aria-live], [role="alert"], [role="status"], [role="log"], [role="marquee"], [role="timer"]')`. Verificar contenido: `el.textContent.trim()`. Verificar `aria-atomic` (true/false). Verificar `aria-relevant` (additions, removals, text, all). `MutationObserver` para monitorear cambios en live regions y verificar que se disparen.

---

### 25. Color Contrast Audit

- **Nombre**: `color-contrast`
- **Descripción**: Calcula el ratio de contraste WCAG 2.2 entre texto y fondo para todos los elementos de texto visibles. Resuelve fondos en cadena (transparencias, gradientes, background-image). Usa la fórmula de luminancia relativa WCAG. Distingue entre texto normal (<18pt o <14pt bold) y texto grande (≥18pt o ≥14pt bold). Reporta violations AA y AAA.
- **WCAG**: 1.4.3 Contrast (Minimum) (AA) — ratio ≥ 4.5:1 normal, ≥ 3:1 large. 1.4.6 Contrast (Enhanced) (AAA) — ratio ≥ 7:1 normal, ≥ 4.5:1 large. 1.4.11 Non-text Contrast (AA) — ratio ≥ 3:1 para UI components.
- **Herramientas para interpretación IA**:
  - **`@weaaare/mcp-a11y-color`** → `check-contrast` para validar cada par fg/bg; `suggest-contrast-fix` para proponer correcciones; `apca-contrast` para contraste perceptual WCAG 3.0 borrador; `simulate-color-blindness` para verificar contraste bajo CVD.
  - **Método**: Para cada elemento de texto visible: `getComputedStyle(el).color` (foreground), resolver background ascendiendo el árbol DOM hasta encontrar un fondo opaco. `getComputedStyle(el).fontSize` y `getComputedStyle(el).fontWeight` para clasificar como normal/large.
  - **Fórmula de luminancia relativa (WCAG 2.2)**:
    - Linearizar sRGB: `C_lin = C_srgb <= 0.04045 ? C_srgb / 12.92 : ((C_srgb + 0.055) / 1.055) ^ 2.4`
    - `L = 0.2126 × R_lin + 0.7152 × G_lin + 0.0722 × B_lin`
    - `Ratio = (L_lighter + 0.05) / (L_darker + 0.05)`
  - **Fórmula APCA (WCAG 3.0 draft)**: Accessible Perceptual Contrast Algorithm — `Lc = (Y_bg^0.56 - Y_fg^0.57) × 1.14` (simplificado, la implementación completa está en `@weaaare/mcp-a11y-color`).

---

### 26. Text Spacing Audit

- **Nombre**: `text-spacing`
- **Descripción**: Inyecta temporalmente estilos de text spacing WCAG (line-height: 1.5×, paragraph spacing: 2×, letter-spacing: 0.12em, word-spacing: 0.16em) y detecta si algún contenido se pierde, trunca, o se superpone. Compara `scrollHeight` vs `clientHeight` antes/después para detectar overflow. Busca `overflow: hidden` en contenedores de texto.
- **WCAG**: 1.4.12 Text Spacing (AA).
- **Herramientas para interpretación IA**:
  - **Método**: Inyectar stylesheet temporal con las propiedades WCAG 1.4.12:
    ```
    * { line-height: 1.5 !important; }
    p { margin-bottom: 2em !important; }
    * { letter-spacing: 0.12em !important; }
    * { word-spacing: 0.16em !important; }
    ```
    Antes/después: para cada elemento con `overflow: hidden` o `overflow: auto` o `text-overflow: ellipsis`, comparar `el.scrollHeight > el.clientHeight` y `el.scrollWidth > el.clientWidth`. Reportar elementos donde el contenido se desborda post-inyección.
  - **Referencia**: WCAG Technique C36 (allowing user-specified text spacing), Understanding SC 1.4.12.

---

### 27. Touch Target Size Audit

- **Nombre**: `touch-target`
- **Descripción**: Mide el tamaño de click/touch target de todos los elementos interactivos (links, botones, inputs, selects). Usa `getBoundingClientRect()` para obtener dimensiones reales. Reporta targets menores a 24×24 CSS px (AA) y menores a 44×44 CSS px (AAA). Detecta targets demasiado cercanos (spacing < 24px entre targets adyacentes).
- **WCAG**: 2.5.8 Target Size (Minimum) (AA) — ≥ 24×24 CSS px. 2.5.5 Target Size (Enhanced) (AAA) — ≥ 44×44 CSS px.
- **Herramientas para interpretación IA**:
  - **Método**: `querySelectorAll('a, button, input, select, textarea, [role="button"], [role="link"], [role="checkbox"], [role="radio"], [role="tab"], [tabindex]:not([tabindex="-1"])')`. Para cada uno: `el.getBoundingClientRect()` → `width` y `height`. Clasificar:
    - `min(width, height) < 24` → **violation** (2.5.8 AA)
    - `min(width, height) >= 24 && min(width, height) < 44` → **warning** (2.5.5 AAA)
    - `min(width, height) >= 44` → **pass**
  - Spacing: para targets adyacentes, calcular distancia entre bounding rects. `gap = max(0, rect2.left - rect1.right)` horizontal, `max(0, rect2.top - rect1.bottom)` vertical. Si ambos < 24px → **warning**.
  - **Excepción 2.5.8**: targets inline en texto, targets con CSS equivalent ≥ 24px via padding, y targets del user agent no necesitan cumplir.

---

## Categoría 7: Ideas Avanzadas / Wild Card

---

### 28. Reading Order vs Visual Order Audit

- **Nombre**: `reading-order`
- **Descripción**: Compara el orden del DOM (reading order para AT) con el orden visual (layout order percibido por usuarios videntes). Usa `getBoundingClientRect()` para determinar posición visual y lo compara con document order. Detecta discrepancias causadas por: CSS `order` property (flexbox/grid), `position: absolute/fixed`, CSS grid areas, `float`, y `tabindex` positivos. Resalta elementos donde DOM order ≠ visual order.
- **WCAG**: 1.3.2 Meaningful Sequence (A), 2.4.3 Focus Order (A).
- **Herramientas para interpretación IA**:
  - **`@weaaare/mcp-voiceover-auditor`** / **`@weaaare/mcp-virtual-screen-reader-auditor`** → navegar secuencialmente y comparar el orden de anuncios con el visual.
  - **Método**: Para todos los content elements visibles: obtener `getBoundingClientRect()` → sort by `top` then `left` (visual order). Comparar con DOM order via `Array.from(elements)`. Calcular Kendall tau distance (τ) entre ambas secuencias como medida de desorden. τ > 0.3 → **warning**.
  - **Fórmula Kendall tau**: `τ = (concordant - discordant) / (n × (n-1) / 2)`. Valores cercanos a 1 = mismo orden, cercanos a -1 = orden invertido, 0 = sin correlación.
  - **Detección de CSS reorder**: `getComputedStyle(el).order !== '0'` (flexbox/grid), `getComputedStyle(el).position === 'absolute|fixed'` con offset significativo.

---

### 29. AI-Ready Snapshot

- **Nombre**: `a11y-snapshot`
- **Descripción**: Meta-bookmarklet que genera un snapshot JSON completo del estado de accesibilidad de la página para análisis holístico por IA. Incluye: árbol de headings, mapa de landmarks, lista de imágenes con alt text, formularios con labels, links con nombres, botones con nombres, live regions, ARIA roles, lang attributes, meta tags, media elements, y estadísticas generales (total elements, interactive elements, hidden elements, etc.). No produce overlay visual — es purely data.
- **WCAG**: Todos — es una herramienta de recopilación de datos, no una auditoría específica.
- **Herramientas para interpretación IA**:
  - **`@weaaare/mcp-a11y-color`** → `analyze-palette-contrast` con los colores extraídos del snapshot.
  - **`@weaaare/mcp-a11y-readability`** → `analyze-readability` con el texto principal extraído.
  - **`@weaaare/mcp-voiceover-auditor`** / **`@weaaare/mcp-virtual-screen-reader-auditor`** → verificar hallazgos del snapshot con navegación real de screen reader.
  - **Todos los MCP servers** → el snapshot sirve como pre-análisis que guía qué auditorías detalladas ejecutar.
  - **Método**: Combinar las funciones de auditoría de todos los demás bookmarklets en modo `data`. Generar un JSON con estructura:
    ```
    { url, timestamp, lang, title, headings[], landmarks[], images[], forms[], links[], buttons[], liveRegions[], ariaRoles[], media[], metaTags[], stats{} }
    ```

---

### 30. Cognitive Load Audit

- **Nombre**: `cognitive-load`
- **Descripción**: Estima la sobrecarga cognitiva de una página. Cuenta: animaciones simultáneas activas, media con autoplay, pop-ups/modals visibles, banners cookie/notification, elementos parpadeantes (`animation-iteration-count: infinite`), carruseles automáticos, cantidad de calls-to-action competitivos, y densidad de información (texto/área visible). Produce un "cognitive load score" basado en pesos configurables.
- **WCAG**: 2.2.2 Pause, Stop, Hide (A), 2.3.1 Three Flashes or Below Threshold (A), 3.2.5 Change on Request (AAA).
- **Herramientas para interpretación IA**:
  - **`@weaaare/mcp-a11y-readability`** → `analyze-readability` para medir complejidad del texto; `get-text-stats` para densidad de contenido.
  - **Método**: Score compuesto (0-100, menor es mejor):
    - Animaciones infinitas: +10 por cada
    - Autoplay media: +15 por cada
    - Modal/popup visible: +10 por cada
    - Carrusel automático: +10 por cada
    - Flash rate >3/s: +25 (violation directa 2.3.1)
    - CTAs competitivos (>3 botones prominentes above fold): +5 por cada extra
    - Text density > 800 words above fold: +10
  - Detección de animaciones: `document.getAnimations()` API. Flash detection: `requestAnimationFrame` loop midiendo cambios de luminosidad en áreas de >21824px² (threshold WCAG de 0.006 steradians).
  - **Paper**: "Cognitive Load Theory" (Sweller, 1988, Cognitive Science) — framework teórico para la carga cognitiva. "Measuring Cognitive Load" (Paas et al., 2003, Educational Psychologist) — métricas de medición.

---

### 31. Print Stylesheet Audit

- **Nombre**: `print-styles`
- **Descripción**: Verifica si la página tiene estilos de impresión (`@media print`). Emula print mode inyectando estilos y compara el contenido visible antes/después. Detecta: contenido que desaparece sin alternativa, navegación que no se oculta, URLs de links no revelados, fondos/imágenes que desaparecen perdiendo información, y tablas que se cortan.
- **WCAG**: No hay SC directo, pero relacionado con 1.1.1 Non-text Content (A) cuando información se pierde al imprimir, y 1.3.2 Meaningful Sequence (A).
- **Herramientas para interpretación IA**:
  - **Método**: `document.styleSheets` para buscar `@media print` rules. Comparar visibilidad de elementos antes/después de inyectar `@media print` forzado. `querySelectorAll('a[href^="http"]')` para verificar si los links imprimen su URL (via `content: " (" attr(href) ")"` en print styles). Comparar `document.body.scrollHeight` pre/post como heurística de contenido removido.

---

## Resumen por categoría

| Categoría | Bookmarklets | IDs |
|-----------|-------------|-----|
| Preferencias del usuario | 5 | 1–5 |
| Video y media | 4 | 6–9 |
| Meta tags y configuración | 4 | 10–13 |
| Formularios e interactivos | 4 | 14–17 |
| Links, botones y navegación | 4 | 18–21 |
| Contenido y semántica | 6 | 22–27 |
| Avanzados / Wild card | 4 | 28–31 |
| **Total** | **31** | |

## Herramientas MCP disponibles (a11y-agents-kit)

| Servidor MCP | Uso principal en bookmarklets |
|---|---|
| `@weaaare/mcp-a11y-color` | Contraste WCAG 2.2/APCA, simulación CVD, paletas, sugerencias de fix (#1, #3, #4, #5, #13, #25, #29) |
| `@weaaare/mcp-a11y-readability` | Estadísticas de texto, legibilidad, detección de complejidad (#11, #12, #18, #29, #30) |
| `@weaaare/mcp-voiceover-auditor` | Verificación real con VoiceOver macOS (#2, #6, #7, #12, #14, #16, #18, #19, #20, #21, #22, #24, #28, #29) |
| `@weaaare/mcp-virtual-screen-reader-auditor` | Verificación headless cross-platform (#2, #6, #7, #9, #14, #16, #17, #18, #19, #20, #21, #22, #23, #24, #28, #29) |
| `@weaaare/mcp-nvda-auditor` | Verificación con NVDA en Windows (#6, #14) |
| skill `aria-patterns` | Referencia de patrones ARIA correctos (#22) |