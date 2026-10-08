# GBA Logistics — homepage design reference

Brief for implementing the approved homepage design. Read this first, then `design/Main.dc.html`.

## Scope and decisions already made

- **Single page.** Everything lives on one page. Navigation is anchor links only. No other routes.
- **Spanish only.** No language switch.
- **Email is the only contact channel:** `sales@gbalogistic.com`. No WhatsApp, phone, social media, "Página web" item, privacy page or terms page (add later if needed).
- **No backend for quotes.** The quote form composes a `mailto:` link in the visitor's own email app (see Behavior).
- Location shown: Caracas, Venezuela. Legal line: `GBA Logistics, C.A. © 2026. RIF: J-50138099-6`.
- Tagline: "Nuestro éxito se basa en tu éxito".

## About `design/Main.dc.html`

It is the source of truth for exact Spanish copy, markup structure, spacing and inline styles. It uses a custom authoring format (`<x-dc>`, `{{holes}}`, `<sc-for>`, `<sc-if>`, a `DCLogic` class) that is NOT runnable in Next.js: read it, don't import it. Image `src` values like `/_blob/<id>` map to files in `assets/` (table below).

The design was shown at 1440 (desktop), 820 (tablet) and 390 (phone) widths. Tablet and phone are the same page with responsive rules, not separate pages.

## Brand tokens (sampled from the company presentation PDF)

| Token | Value | Use |
|---|---|---|
| navy | `#203D60` | header, hero, dark sections |
| navy-deep | `#162C47` | utility bar, footer |
| navy-tile | `#2C4F7C` (hover `#355B8C`) | tiles on navy |
| blue | `#4777BB` | accents, numbers, mission block |
| blue-step | `#3A639D` | process step 3 |
| green | `#3AAE2D` | brand green, CTAs, Visión block |
| green-text | `#277D1D` | green text on LIGHT backgrounds |
| green-light | `#7FD36F` | small green text on navy |
| ink-on-green | `#0E2238` | text on green buttons |
| off-white | `#F9F9F9` | page background |
| text | `#3C3C3B` | body text |
| tint | `#EEF2F8` | light panel |
| rule | `#D5DEE6` / `#E3E8EE` | dividers |

Contrast rules: brand green `#3AAE2D` is only for large text on navy or as a fill. Small green text on light uses `#277D1D`; small green text on navy uses `#7FD36F`. Buttons on green use dark `#0E2238` text, never white.

**Font:** Montserrat (weights 300, 400, 500, 600, 700, 800; 300 italic). Headings often mix light and bold in one line, e.g. "Nuestros **Servicios**" (light + bold green).

**Shape language (important to keep):** sharp. Radius 2px on buttons, inputs, cards and panels; 4px on icon squares. No pills, no soft shadows, no cards with colored left borders. Angular diagonals via `clip-path` on photos and on the process and mission/vision blocks echo the logo's roof shape. Flat color blocks and thin rules instead of boxed cards.

## Assets (`assets/`)

| File | Was | Notes |
|---|---|---|
| `gba-logo.png` | `/_blob/3612b8ec…` | Official logo, green, transparent. Header (h 44–46px) and footer. Extracted from the company PDF, replace with the website's SVG if available |
| `mark-white.png` | `/_blob/43a150b7…` | Chevron mark, white. Corner device on navy sections |
| `mark-green.png` | `/_blob/01d0c4c4…` | Chevron mark, green. Footer |
| `hero-containers.jpg` | `/_blob/0a813ceb…` | Hero photo (right side, diagonal crop, navy gradient overlay) |
| `handshake.jpg` | `/_blob/8b6b728e…` | "¿Quiénes somos?" photo |
| `port-ship.jpg` | `/_blob/02a0f0c7…` | Logística Internacional block photo and faint contact-section background |

The photos come from the company presentation. Confirm usage rights before launch.

## Page structure (top to bottom)

1. **Utility bar:** "Caracas, Venezuela" + mailto link.
2. **Header (navy):** logo; links to `#servicios`, `#cotizar-datos`, `#proceso`, `#nosotros`, `#contacto`; green "Solicitar cotización" → `#cotizar`. On narrow widths links collapse into a "Menú" toggle (list of the same anchors + the CTA).
3. **Hero:** headline "Logística internacional que te ahorra tiempo, dinero y molestias", subtext, two CTAs, and the **quote card** (`id="cotizar"`) on the right.
4. **Benefits strip:** 4 checks ("nosotros nos encargamos de…").
5. **`#servicios`:** wide navy **Logística Internacional** block with photo and 8 tiles (Marítimo FCL, Marítimo LCL, Aéreo, Terrestre, Multimodal, Puerta a puerta, Courier, plus a green "¿No sabes cuál elegir?" CTA tile). Below it three columns: Seguro de Carga Internacional, Agenciamiento de Aduanas (5-item list), Asesoría Especializada (4-item list). All content always visible, no tabs.
6. **`#cotizar-datos`:** "¿Qué datos necesitamos para cotizar tu carga?" Six numbered "Imprescindibles", six "Nos ayudan a cotizar mejor", a mode-tabs panel ("Según el tipo de envío, añade:") and a navy "¿Listo para cotizar?" band whose button goes to `#cotizar` and opens the form's extra details.
7. **`#proceso`:** four chevron-shaped steps (navy, mid-navy, blue, green).
8. **`#nosotros`:** ¿Quiénes somos? with handshake photo (diagonal crop).
9. **Misión / Visión:** two overlapping flat blocks (blue / green) with diagonal join.
10. **Testimonials:** three placeholder blocks.
11. **`#contacto`:** "¡Contáctanos!", mailto button, "Qué datos enviar" link, Correo and Ubicación items.
12. **Footer:** logo, tagline, anchor links, RIF line, green mark.

## Behavior

- **Quote card:** a mode selector (Marítimo, Aéreo, Terrestre, Multimodal), then Origen, Destino, "¿Qué vas a enviar?". A button "Añadir más detalles (recomendado)" expands: peso bruto (kg), cantidad de bultos, medidas por bulto, tipo de embalaje, valor (USD), fecha en que está lista, one **mode-specific field**, and nombre/empresa/RIF. The mode-specific field depends on the mode: Marítimo → contenedor o volumen (FCL 20'/40'/40' HC, LCL m³); Aéreo → urgencia; Terrestre → direcciones de recogida y entrega; Multimodal → tramos o modos a combinar.
- **Submit** = an `<a href="mailto:sales@gbalogistic.com?subject=…&body=…">`, subject "Solicitud de cotización", body built from every field as labelled lines (empty fields still appear as empty labelled lines so the sender can complete them in their email app). Nothing is required. Use `encodeURIComponent`.
- **Mode tabs** in `#cotizar-datos` (Marítimo FCL, Marítimo LCL, Aéreo, Terrestre) switch three explanatory items.
- **"Ir al formulario"** scrolls to `#cotizar` and sets the extra details open.
- Mobile menu toggles open and closes, and closes on link click.

## Responsive rules

The design uses container queries on the page wrapper, not viewport queries. Equivalent viewport breakpoints are fine in the real build.

- **≤ 980px (tablet):** hero, about and Logística block go single column; hero and Logística photos hidden; 4-column grids become 2; 3-column grids and the two-column checklist become 1; header links hidden, "Menú" shown; process steps and mission/vision stack without diagonal cuts; section vertical padding about 72px; h1 44px.
- **≤ 560px (phone):** all grids 1 column; side padding 20px; h1 34px, h2 28px; section padding 56px; quote card and bands get tighter padding; mode selectors become two-per-row full-width.

## Still placeholders

- `[TIEMPO DE RESPUESTA]` in the quote card (typical response time).
- Testimonials: three real ones with name, role, company.

## Accessibility

Real `<label>` for every input, real `<button>` and `<a>` elements, 44px minimum touch targets, `aria-label` on the menu button and decorative images with `alt=""`. Keep the color contrast rules above.
