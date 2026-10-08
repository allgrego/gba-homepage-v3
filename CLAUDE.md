@AGENTS.md

# GBA Logistics homepage

Single-page, bilingual (Spanish/English) marketing site for GBA Logistics, a Venezuelan freight forwarder (`gbalogistic.com`). Next.js 16.4 App Router, React 19, Tailwind 4, TypeScript, deployed on Vercel. No database, no CMS.

This is a refactor of the currently deployed homepage and the **third version** of the site. Do not assume behavior from earlier versions; the code, `DESIGN.md` and the docs here are the source of truth.

`DESIGN.md` is the brief for the approved design (brand tokens, shape language, page structure, accessibility rules). `design/Main.dc.html` is the original copy/markup reference. It is **not runnable**, read it only. `assets/` holds the original source images; the ones the site serves live in `public/images/`.

## Commands

```bash
npm run dev          # dev server
npm run build        # production build (also generates route types)
npm run lint         # eslint (next core-web-vitals + typescript)
npx tsc --noEmit     # typecheck (run after a build so .next/types are fresh)
```

There is no test suite. Verify with typecheck + lint + build. `next/font/google` downloads Montserrat at build time, so builds need network access.

## Next.js 16 specifics (read `node_modules/next/dist/docs/` before changing any of this)

- `next.config.ts` enables `cacheComponents` and `partialPrefetching`. Pages are prerendered statically.
- Middleware is called **`src/proxy.ts`** here (export `proxy`, not `middleware`).
- The locale lives in the route: everything is under `src/app/[lang]/`, and the root layout is `src/app/[lang]/layout.tsx`. Server components read the locale with `lang()` from `next/root-params`; `LayoutProps<"/[lang]">` / `PageProps` are global types.
- `next.config.ts` also turns off `x-powered-by` and sets security headers (nosniff, referrer policy, `frame-ancestors 'none'` / `X-Frame-Options`, permissions policy). It deliberately has **no full CSP**: Next's inline scripts and the JSON-LD tag would need nonces first.
- Unmatched URLs use `src/app/global-not-found.tsx` (`experimental.globalNotFound`), because the root layout sits under `[lang]` and there is no layout to reuse. It is a full HTML document with **both languages inline** (it has no locale prop and bypasses the dictionaries). A tiny inline script reads the locale from the URL path before first paint (`data-lang` on `<html>`, CSS in `globals.css` hides the other language); without JS both show. Unmatched URLs always carry a locale because `proxy.ts` redirects locale-less paths. A catch-all route + `[lang]/not-found.tsx` was tried and rejected: under `cacheComponents` it returned an empty server-rendered shell.
- Server Actions run in serverless functions; `next/root-params` does **not** work inside them.

## Routing and i18n

- Locales: `es` (default) and `en`, defined in `src/lib/i18n.ts`. URLs are `/es` and `/en`.
- `src/proxy.ts` redirects locale-less paths: saved `lang` cookie first, then the best match from `Accept-Language`, then Spanish. The header language switcher sets that cookie and keeps the URL hash.
- All visible copy lives in `src/app/[lang]/dictionaries/{es,en}.json`. `es.json` defines the shape; `en.json` must have exactly the same keys (enforced at compile time in `dictionaries.ts`). Never hard-code user-facing strings in components. A few strings use placeholders (e.g. `{email}`) that components fill in.
- Server components call `getDictionary()` / `getLocale()` (`src/app/[lang]/dictionaries.ts`) with no arguments. Client components get the slice they need as props (e.g. `t={dict.quote}`), never the whole dictionary.
- Metadata, hreflang, `sitemap.ts`, `robots.ts` and JSON-LD are per locale. Canonical site URL and contact email: `src/lib/site.ts`.

## UI conventions

- Sections are components in `src/components/`, composed in `src/app/[lang]/page.tsx`. They are async server components; only these are client components: `HeaderClient`, `QuoteCard`, `ModeTabs`, `OpenFormLink`.
- Styling is Tailwind utilities plus design tokens in `src/app/globals.css` (`@theme`: `navy`, `navy-deep`, `blue`, `green`, `green-text`, `green-light`, `ink`, `tint`, ...). Use the tokens, not new hex values (the odd one-off like `#2e5fa8` for links exists in the design).
- Breakpoints are the design's, mobile-first: `sm` = 561px, `lg` = 981px (tablet/desktop switch). The header collapses to the "Menú" button below `xl` (1280px) to fit the language switcher. Shared classes: `.wrap` (page width/gutters), `.sec-pad` (section padding), `.btn`, `.btn-primary`, `.btn-outline`, `.field`, `.label`, `.seg-btn`. Diagonal `clip-path` shapes (`.hero-photo`, `.chev`, `.mv-a`/`.mv-b`...) apply from `lg` up only.
- Design rules to keep: sharp shapes (2px radius, 4px for icon squares), no pills or soft shadows. Small green text on light backgrounds uses `green-text`, on navy uses `green-light`; text on green buttons is `ink`, never white. Headings mix light + bold via `<Heading>`. 44px minimum touch targets, real labels on every input.
- The header is sticky; anchor targets use `scroll-mt-20 sm:scroll-mt-24` so they stop below it.
- Icons: `src/app/favicon.ico` (16px, provided by the client), `src/app/icon.png` (64px) and `src/app/apple-icon.png` (180px, navy background), all from the green chevron mark. Social image: `public/images/og.jpg` (1200x630: hero photo + navy gradient + logo). These were generated with `sharp`; regenerate rather than hand-edit if the brand mark changes.
- Images go through `next/image` from `public/images/` (hero is `priority`). Decorative images use `alt=""`. The logo is the `Logo` SVG component (single color, follows `currentColor`).

## Quote form

Two steps in one `<form>` (`src/components/QuoteCard.tsx`): step 1 is the shipment (mode, origin, destination, cargo, optional details), step 2 is the contact (client type company/individual, name, company, email, phone, notes). Both steps stay mounted in one grid cell and the inactive one is `inert`, so the card height is stable and every field is submitted.

Flow: `QuoteCard` -> Server Action `submitQuote` (`src/app/actions/quote.ts`) -> in parallel:
- email to sales through Mailtrap's HTTP API (`src/lib/server/mailtrap.ts`),
- optional row in a Google Sheet via an Apps Script web app (`src/lib/server/google-sheet.ts`, script in `integrations/google-apps-script/Code.gs`).

Success if any enabled channel works; if all fail the UI shows an error with a `mailto:` fallback.

Rules to preserve:
- Validation lives in `src/lib/quote-validation.ts` and is shared by the browser (instant errors) and the action (the one that enforces). Company name is required only for client type `company`.
- Spam checks in the action: honeypot field `website` (fake success), minimum fill time (`elapsed`), length limits. Keep them.
- Emails and Sheet rows for the sales team are always **Spanish** (labels come from `es.json` via `quote-payload.ts`), whatever language the visitor used.
- The Sheet columns are defined in `Code.gs` and in the `row` object in `google-sheet.ts`; they must stay in sync. Changing columns means the existing `Cotizaciones` tab must be deleted/recreated.
- Adding a form field touches: `QuoteCard.tsx` (state + `Field`), both dictionaries (label, placeholder, `mail` label), `quote.ts` (`mailto:` fallback), `actions/quote.ts` (read + limit), `quote-payload.ts` (type + email text), `google-sheet.ts`, `Code.gs`, and `docs/quote-form-setup.md` if columns change.

Full setup (Google Sheet + Apps Script, Mailtrap domain/DNS, Vercel env vars, how to test): `docs/quote-form-setup.md`.

### Environment variables (see `.env.example`; changes need a redeploy on Vercel)

| Variable | Purpose |
|---|---|
| `QUOTE_FORM_ENABLED` | Kill switch for the form and the Server Action. On unless `false`/`0`/`no`/`off`; while off the form is replaced by a "write to us" notice. |
| `QUOTE_SHEET_ENABLED` | Opt-in Google Sheet logging (`true` to enable). Email keeps working either way. |
| `MAILTRAP_API_TOKEN`, `MAILTRAP_FROM_EMAIL` | Mailtrap Email Sending (not Sandbox); the From address must be on the verified domain. |
| `QUOTE_TO_EMAIL` | Inbox that receives form submissions (server only). |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Public contact address shown on the site. Separate from `QUOTE_TO_EMAIL`; defaults to `sales@gbalogistic.com`. |
| `APPS_SCRIPT_URL`, `APPS_SCRIPT_SECRET` | Only needed when the Sheet is enabled; the secret must equal the script's `SECRET` property. |

`.env.local` is for local secrets and is git-ignored; `.env.example` is committed.

### Testing the Server Action without a browser

Call it with React's own encoder (`encodeReply` from `next/dist/compiled/react-server-dom-turbopack/client.node`) and the `Next-Action` header against `next start`, pointing `MAILTRAP`/`APPS_SCRIPT` at local mock servers. Hand-built multipart bodies do not decode correctly.

## Still open

- Testimonials are intentionally removed until real ones exist (the design had placeholders). Re-add as a dictionary slice + component.
- Photo usage rights are unconfirmed (acknowledged, not a blocker).
