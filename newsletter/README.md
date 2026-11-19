# FUNtasia Audio Newsletter — Brevo integration

Status: **STAGED ONLY — not live**. Both JA and EN public Brevo iframe URLs are connected in the draft branch. The site has not been deployed. The owner reported successfully using the JA confirmation-email link in a Brevo-hosted form test; EN registration/confirmation, list routing, unsubscribe, and on-site iframe behavior are not yet verified.

## Scope
- `newsletter/ja/` and `newsletter/en/`: Japanese and English subscription pages.
- `news/ja/` and `news/en/`: archive landing pages; empty until real announcements are approved.
- Catalog links in the Japanese and English product catalogs.
- Existing product and audio/download code is untouched.

## Owner setup in Brevo
1. Create or log in to your Brevo account; select the free tier.
2. Under Marketing > Forms, create two **Full page/embedded** forms:
   - `FUNtasia Audio Newsletter - JA`
   - `FUNtasia Audio Newsletter - EN`
3. Give each form its own language-specific opt-in consent statement and **Double confirmation email** template. Check that the mandatory confirmation button works.
4. Map the Japanese and English forms to distinct subscription lists or a tested language attribute/segment, so a Japanese subscriber isn't automatically sent English newsletters.
5. Copy each published **iframe URL** from Brevo's embed code. Only the public HTTPS `https://...sibforms.com/serve/...` URL is needed; NEVER an API key.
6. **JA and EN connected in draft:** each locale's `data-form-url` is now set to its separately supplied public Brevo HTTPS iframe URL. If a form is replaced later, HTML-encode `&` as `&amp;` in the attribute.
7. Verify: form appearance on mobile/desktop, required consent, CAPTCHA/anti-bot behavior, double-opt-in email, confirmed Brevo list/segment, language-specific welcome message, successful unsubscribe, and blocked/declined confirmation.
8. Review privacy notice / sender identification / local marketing-email law before enabling campaigns. Authenticate a sending domain with SPF, DKIM, and DMARC as supported by your domain and Brevo.
9. Only then remove `noindex,follow` (if desired), merge the PR and announce the subscription publicly.

## Security and deployment
- This is a GitHub Pages static-site integration; **do not** expose a private Brevo API key, credentials, or contact records to client-side JavaScript.
- The form loader accepts only HTTPS `sibforms.com` and subdomains of it under `/serve/`.
- Empty or invalid `data-form-url` values intentionally display a truthful "not yet available" notice; they never simulate a successful subscription.
- The Brevo-hosted form handles its own consent, validation and double opt-in. The static site stores no subscriber email address.

## Official docs
https://help.brevo.com/hc/en-us/articles/208771869-Create-a-sign-up-form-in-Brevo
https://help.brevo.com/hc/en-us/articles/208733449-Double-opt-in-DOI-What-it-is-and-how-to-track-user-sign-ups
