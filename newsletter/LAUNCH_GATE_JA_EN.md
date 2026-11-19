# FUNtasia Audio Newsletter — Launch Gate / 公開チェック

Date / 記録日: 2026-11-19
Branch: `feat/newsletter-brevo-setup-20261119`
PR: https://github.com/funtasiaaudio/funtasiaaudio.github.io/pull/16
Status: **HOLD: draft, not yet published**

## Recorded results / 実施済み

- [x] JA form: registration and double confirmation email link succeeded, owner report.
- [x] EN form: registration and double confirmation email link succeeded, owner report.
- [x] Both contacts appear in their respective JA and EN lists, owner report.
- [x] A test email campaign arrived, owner report. Brevo send notification states it was sent to 1 contact.
- [x] Unsubscribe flow completed, owner report. Not independently inspected in Brevo suppression records.
- [x] Public iframe URL is configured for each language and validated against the correct locale in source.
- [x] Both newsletter landing pages link to bilingual privacy information.
- [x] Catalog has links to the subscription pages; product audio/plugin files are unaffected.

## Publication blockers / 公開前に必ず確認

### 1. Email sender identification and footer / 送信者情報
Check the actual **campaign footer** (not merely the Brevo account's own marketing email footer) before general mailing:
- The responsible sender's **legal name / business name** (not automatically satisfied by a brand label alone).
- A genuine public mailing/business address and suitable contact method (telephone number, email or URL for enquiries).
- A clearly recognizable unsubscribe link next to explanatory text.
- For commerce-related campaigns, review any additional requirements under the Act on Specified Commercial Transactions.

Do not invent the operator's identity or publish a private home address without deliberate approval. The owner should configure the actual public-facing details through Brevo and review the resulting campaign email.

Reference (Japanese): https://www.dekyo.or.jp/soudan/contents/taisaku/1-2.html
Brevo email footer: https://help.brevo.com/hc/en-us/articles/9741388688402-Do-I-need-to-add-an-unsubscribe-link-to-my-emails

### 2. Subscription page privacy information
- Review the draft text at `newsletter/privacy/ja/` and `newsletter/privacy/en/` for accuracy, including Brevo's personal-data processing.
- Ensure the **Brevo form consent field** links to privacy information and labels the responsible organization appropriately. Linking only outside the iframe is not a substitute for reviewing the form itself.
- Publish the privacy pages and form pages together. Do not use an outdated/unreachable URL in the opt-in label.

### 3. Confirm email language and domain
- JA opt-in email, post-confirmation copy and future campaigns are in Japanese; EN counterparts in English.
- Sender email must be verified in Brevo and sender-domain authentication completed for dependable delivery, especially for campaigns to Gmail/Yahoo/Microsoft. Prefer a domain owned by the project over an unauthenticated free mailbox.
- Verify SPF/DKIM/DMARC status as appropriate to the configured sending domain in Brevo.

### 4. Website deployment QA
After deployment, test:
- https://funtasiaaudio.github.io/newsletter/ja/
- https://funtasiaaudio.github.io/newsletter/en/
- https://funtasiaaudio.github.io/newsletter/privacy/ja/
- https://funtasiaaudio.github.io/newsletter/privacy/en/
- Both links from `catalog/ja/` and `catalog/en/`.
- Desktop and mobile layout (iframe height, scrolling, CAPTCHA, opt-in text visibility, submit/confirmation behavior).
- A real on-site end-to-end test, distinct from testing the Brevo-hosted full-page form.
- Browser without JavaScript: currently a static pending notice remains, so manual fallback should be considered if required.
- Adjust `noindex` before/after deployment if intended to make pages discoverable in search.

### 5. Release
Keep the PR in Draft until the above mandatory conditions have been satisfied and reviewed.
Merge into `main`, then verify the GitHub Pages deployment and live URLs.
