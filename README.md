# GBA Logistics homepage

Marketing site for [GBA Logistics](https://gbalogistic.com), a Venezuelan freight forwarder. A single page in Spanish and English with a two-step quote form that emails the sales team (and can optionally log each request in a Google Sheet).

**Background:** this is a refactor of the currently deployed GBA Logistics homepage, and the **third version** of the site. It reimplements the approved design in `DESIGN.md` (see "Design system" below) and adds the bilingual setup and the quote form integrations described here.

**Stack:** Next.js 16.4 (App Router) · React 19 · Tailwind CSS 4 · TypeScript · deployed on Vercel. There is no database and no CMS.

> This is not the Next.js you may know. This version has breaking changes (for example `proxy.ts` instead of `middleware.ts`, Cache Components, `next/root-params`). Read the relevant guide in `node_modules/next/dist/docs/` before changing framework-level code. See also [AGENTS.md](AGENTS.md) and [CLAUDE.md](CLAUDE.md), which carry the same project rules for AI coding assistants.

## Quick start

Requirements: Node.js **20.9 or newer** and npm. The build downloads the Montserrat font from Google Fonts, so it needs network access.

```bash
npm install
cp .env.example .env.local   # then fill in what you need (see "Environment variables")
npm run dev                  # http://localhost:3000  (redirects to /es or /en)
```

The site renders without any environment variables. They are only needed to actually send quote requests.

| Command | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build (also generates route types) |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint (Next core-web-vitals + TypeScript rules) |
| `npx tsc --noEmit` | Typecheck. Run it after a build so the generated route types are fresh |

There is no automated test suite. Before opening a PR, run `npx tsc --noEmit`, `npm run lint` and `npm run build`.

## Project layout

```
src/
  proxy.ts                       Locale redirect: / -> /es or /en
  app/
    [lang]/                      Everything localized lives here (root layout included)
      layout.tsx                 <html lang>, Montserrat, per-locale metadata + hreflang
      page.tsx                   Composes the page sections
      dictionaries.ts            getDictionary() / getLocale() helpers
      dictionaries/{es,en}.json  ALL visible copy (es defines the shape, en must match)
    actions/quote.ts             Server Action behind the quote form
    global-not-found.tsx         404 page (both languages inline)
    globals.css                  Tailwind import, design tokens (@theme), shared classes
    sitemap.ts, robots.ts        SEO
    icon.png, apple-icon.png, favicon.ico
  components/                    One component per page section, plus QuoteCard, Logo, icons
  lib/
    i18n.ts                      Locales, Accept-Language matching
    site.ts                      Canonical URL, public contact email
    quote*.ts                    Quote types, shared validation, mailto: fallback builder
    server/                      Server-only: Mailtrap, Google Sheet, payload/email text, env flags
public/images/                   Images served by the site (hero, photos, logo, og.jpg)
integrations/google-apps-script/ Code.gs: the script that appends rows to the Google Sheet
docs/quote-form-setup.md         Step-by-step setup for the form integrations
DESIGN.md, design/               Approved design brief and the original markup reference
assets/                          Original source images (the site uses public/images/)
```

## Internationalization

- Two locales: `es` (default) and `en`. URLs are `/es` and `/en`; `src/proxy.ts` redirects any path without a locale. It uses the saved `lang` cookie first (set by the header language switcher), then the browser's `Accept-Language`, then Spanish.
- **All visible text lives in `src/app/[lang]/dictionaries/{es,en}.json`.** Do not hard-code copy in components. `en.json` must have exactly the same keys as `es.json`; a mismatch fails the typecheck.
- Server components call `getDictionary()` with no arguments. Client components receive only the slice they need as props.
- Unknown URLs get a 404 from `global-not-found.tsx`, which shows both languages and lets a small inline script hide the one that doesn't match the URL.

## Design system

`DESIGN.md` is the source of truth (colors, shape language, accessibility rules). The essentials:

- Brand colors are Tailwind tokens defined in `src/app/globals.css` (`navy`, `blue`, `green`, `green-text`, `green-light`, `ink`, ...). Use them instead of raw hex values.
- Sharp shapes: 2px radius (4px for icon squares), no pills, no soft shadows. Diagonal cuts use `clip-path` and only apply from the `lg` breakpoint up.
- Breakpoints are mobile-first and match the design: `sm` = 561px, `lg` = 981px. The header collapses to a menu below `xl` (1280px).
- Contrast: small green text on light backgrounds uses `green-text`; on navy use `green-light`. Text on green buttons is `ink`, never white.
- Accessibility: real labels on every input, 44px minimum touch targets, `alt=""` on decorative images.

## Quote form

A two-step form in `src/components/QuoteCard.tsx`:

1. **Shipment:** transport mode, origin, destination, cargo and optional details.
2. **Contact:** client type (company or individual), name, company (required only for companies), email, phone and notes.

```
QuoteCard  ->  Server Action submitQuote (src/app/actions/quote.ts)
                 |- validates (same rules as the browser: src/lib/quote-validation.ts)
                 |- checks spam signals (honeypot field, minimum fill time)
                 |- in parallel:
                      email to sales via Mailtrap's HTTP API      (always)
                      row in a Google Sheet via Apps Script       (optional)
```

The visitor sees success if at least one enabled channel worked. If all fail, the form shows an error with a `mailto:` fallback. Failures are logged as `[quote] email failed` / `[quote] sheet failed` in the function logs.

Emails and Sheet rows are always in **Spanish**, whatever language the visitor used, because they are for the sales team.

To set up or change the integrations (Mailtrap domain and DNS, Apps Script deployment, Vercel variables, how to test), follow [docs/quote-form-setup.md](docs/quote-form-setup.md).

### Adding a field to the form

Update all of these, or the data will silently drop out somewhere:

1. `QuoteCard.tsx`: state and the `Field`
2. Both dictionaries: label, placeholder and the `mail` label
3. `src/lib/quote.ts`: the `mailto:` fallback
4. `src/app/actions/quote.ts`: read it and cap its length
5. `src/lib/server/quote-payload.ts`: type and email text
6. `src/lib/server/google-sheet.ts` and `integrations/google-apps-script/Code.gs`: keep the Sheet columns in sync. Changing columns means deleting the existing `Cotizaciones` tab so it is recreated.

## Environment variables

Copy `.env.example` to `.env.local` for local work (it is git-ignored). On Vercel, add them in **Project > Settings > Environment Variables** and **redeploy**: values are read at build or deploy time.

| Variable | Required | Purpose |
|---|---|---|
| `MAILTRAP_API_TOKEN` | To send email | Mailtrap **Email Sending** API token (not the Sandbox) |
| `MAILTRAP_FROM_EMAIL` | To send email | Sender address, on the domain verified in Mailtrap (e.g. `web@gbalogistic.com`) |
| `QUOTE_TO_EMAIL` | To send email | Inbox that receives quote requests (server only, never shown) |
| `NEXT_PUBLIC_CONTACT_EMAIL` | No | Public contact address shown on the site. Defaults to `sales@gbalogistic.com`. Independent of `QUOTE_TO_EMAIL` |
| `QUOTE_FORM_ENABLED` | No | Kill switch. On unless set to `false`, `0`, `no` or `off`. While off, the form is replaced by a "write to us" notice and the Server Action refuses to send |
| `QUOTE_SHEET_ENABLED` | No | Set to `true` to also log requests in the Google Sheet. Off by default; email keeps working either way |
| `APPS_SCRIPT_URL`, `APPS_SCRIPT_SECRET` | Only if the Sheet is enabled | Apps Script web app URL (`/exec`) and the shared secret saved in the script's `SECRET` property |

## Deployment

The site is built for Vercel. A normal push deploys it; use a Preview deployment to try the form against the real services before going to production.

Before the first production launch:

- Verify the sending domain in Mailtrap (DNS records) and set the env vars above on Vercel.
- Submit a real request on a Preview deployment and confirm it arrives with the visitor as Reply-To.
- Point both `gbalogistic.com` and `www` at the project, with `www` redirecting to the apex (canonical URLs use the apex).
- Consider rate limiting or Cloudflare Turnstile for the form. The built-in honeypot and timing check only stop basic bots, and Mailtrap's free plan is capped at 150 emails a day.
- Note that Vercel's Hobby plan is for non-commercial use.

## Troubleshooting

- **The form says it couldn't send:** check the function logs for `[quote] ...failed`. Usual causes are an unverified Mailtrap domain, a `MAILTRAP_FROM_EMAIL` outside that domain, or env vars missing on the deployment (remember to redeploy after changing them).
- **A form change doesn't show in production:** `NEXT_PUBLIC_*` values and `QUOTE_FORM_ENABLED` affect the prerendered pages, so they need a new deployment.
- **Typecheck complains about missing route types or a removed route:** run `npm run build` first; it regenerates `.next/types`.
- **`npm run build` fails fetching fonts:** Montserrat is downloaded from Google Fonts at build time; check network or proxy access.
- **A Sheet column is misaligned:** the `Cotizaciones` tab was created by an older version of the script. Delete the tab and let the next request recreate it.

## Open items

- Testimonials were removed until real ones exist (add them back as a dictionary slice plus a component).
- Photo and logo usage rights are not confirmed. Keep that in mind before making the repository public.
