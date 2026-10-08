# Quote form setup

The form on the homepage calls a Next.js Server Action (`src/app/actions/quote.ts`), which:

1. validates the request and checks the spam signals (honeypot, minimum fill time),
2. sends the email to sales through **Mailtrap** (`src/lib/server/mailtrap.ts`),
3. appends a row to a **Google Sheet** through an **Apps Script** web app (`src/lib/server/google-sheet.ts`).

The email is the main channel; the Google Sheet is optional and independent of it. The visitor sees "sent" if at least one enabled channel worked; if all fail they see an error with a `mailto:` fallback.

## Switches

| Variable | Default | Effect |
|---|---|---|
| `QUOTE_FORM_ENABLED` | on | Set to `false` (or `0`, `no`, `off`) for a maintenance stop: the form is replaced by a "write to us by email" notice and the Server Action refuses to send anything. |
| `QUOTE_SHEET_ENABLED` | off | Set to `true` to also log each request in the Google Sheet. Turn it off any time; email keeps working and the Apps Script variables can stay in place. |

Vercel applies env var changes on the next deployment, so redeploy after changing either switch. Failures are logged (`[quote] email failed` / `[quote] sheet failed`) in the Vercel function logs.

## 1. Google Sheet + Apps Script (use the gbalogistic Google account)

1. Create a new Google Sheet, e.g. "Cotizaciones web".
2. **Extensions > Apps Script**. Replace the contents of `Code.gs` with `integrations/google-apps-script/Code.gs`.
3. **Project Settings (gear) > Script Properties > Add**: name `SECRET`, value a long random string (e.g. `openssl rand -hex 32`). Keep it: it is also `APPS_SCRIPT_SECRET` in Vercel.
4. **Deploy > New deployment > type: Web app**
   - Execute as: **Me**
   - Who has access: **Anyone** (the secret is what protects it)
5. Authorize when asked, then copy the **Web app URL** (ends in `/exec`). This is `APPS_SCRIPT_URL`.
6. The `Cotizaciones` tab and its header row are created on the first request. If you already created the tab with an older version of the script, delete it (or fix the headers) so it matches the current columns (Tipo de cliente, Nombre, Empresa, RIF and Comentarios are separate columns).

After editing the script later, use **Deploy > Manage deployments > Edit > New version** so the same URL serves the new code.

## 2. Mailtrap

1. Create a Mailtrap account and open **Email Sending** (not Email Sandbox).
2. **Sending Domains > Add Domain**: `gbalogistic.com`. Add the DNS records Mailtrap shows (verification, SPF, DKIM, DMARC) at your DNS provider.
   - A domain can only have **one** SPF record. If one already exists (e.g. for Google Workspace), merge Mailtrap's `include:` into it instead of adding a second record.
3. Wait for the domain to show as verified and pass the compliance check.
4. **API Tokens**: create a token for that domain. This is `MAILTRAP_API_TOKEN`.
5. `MAILTRAP_FROM_EMAIL` must be an address on `gbalogistic.com` (e.g. `web@gbalogistic.com`).

Free plan: 4,000 emails/month, 150/day.

## 3. Environment variables

See `.env.example`. Locally copy it to `.env.local`. On Vercel add the same variables (the two Apps Script ones are only needed with `QUOTE_SHEET_ENABLED=true`) for Production (and Preview if you want to test there), then redeploy.

### Two different email addresses

| Variable | Used for | Visible to visitors |
|---|---|---|
| `QUOTE_TO_EMAIL` | Inbox that receives quote requests sent through the form (Mailtrap delivery). | No (server only) |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Contact address shown on the site: top bar, "Contáctanos", mailto links, the maintenance notice, the `mailto:` fallback and structured data. | Yes |

They can be the same or different. If `NEXT_PUBLIC_CONTACT_EMAIL` is unset or not a valid address, the site uses `sales@gbalogistic.com`. It is inlined at build time, so redeploy after changing it.

## 4. Test it

1. Run `npm run dev`, open `/es`, fill email + cargo, press "Enviar solicitud".
2. Check the sales inbox (and spam) and the Sheet. Replying to the email should address the visitor.
3. To test the failure path with the Sheet enabled, blank one group of variables at a time: the form should still succeed. Blank both: it shows the error and the `mailto:` link.
4. Set `QUOTE_FORM_ENABLED=false` and redeploy to check the maintenance notice.

## Spam

Built in: hidden honeypot field, minimum 2.5 s fill time, field length limits, shared secret between the site and the script. If real spam shows up, add Cloudflare Turnstile (free) or a Vercel Firewall rate-limit rule on `POST /es` and `/en`.
