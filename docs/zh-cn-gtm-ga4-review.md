# Simplified Chinese GTM / GA4 review — source and measurement gates

## What the staged repository implements

- Site-wide GTM container ID already present: `GTM-M88BK887`. Existing header bootstrap and noscript iframe are included on the home, Chinese Audio catalog, Quality, About, Support, Records, Studio, Studio Expansions, Studio study, and shared Utilities/Goods pages (**11 entry pages**).
- The Chinese Audio catalog is the only page with the custom `funtasia_product_download_click` event. The event is pushed to `window.dataLayer` when a direct ZIP release link in a product card is clicked.
- The supported data object is `{ event, site_language, product_name, product_key, download_url }`. `site_language` is `zh-CN`; `product_name` and `product_key` are read from the clicked card. This is a click-intent event, **not** proof of transfer success.
- The static MonoFilter detail pages (all six locales) are currently **not GTM-instrumented**. Their page views and ZIP CTA clicks are not covered by this site's installed GTM snippet. Whether to extend tracking requires a separate site-owner decision and consent review.

## CI verification

- `node scripts/check-zh-cn-analytics.mjs` checks the GTM bootstrap/noscript parity across 11 expected entry pages and the Chinese download event contract.
- Chromium `scripts/check-zh-cn-site-browser.mjs` loads the actual Chinese catalog, intercepts offsite navigation **without invoking live Google tags**, and verifies one `dataLayer` event per direct ZIP click, exact payload, no extra personal fields, no event on PDF/manual or details click, keyboard Enter activation, and no Chinese custom event on English catalog.
- This tests the **site source + browser-side `dataLayer`** only. The browser CI intentionally blocks calls to GTM, Analytics and other external networks. It cannot confirm an event was processed by GA4.

## GTM configuration that still requires access and approval

1. In **GTM-M88BK887**, check the appropriate consent mode and region/consent behavior; do not publish new Analytics tags before any legally required consent and privacy notice are in place.
2. Create / verify Data Layer Variables (Version 2): `site_language`, `product_name`, `product_key`, `download_url`.
3. Create / verify a Custom Event trigger with exact event name `funtasia_product_download_click`. Scope it to intended pages and consent state. Do not confuse this custom event with GA4's automatic `file_download` or `click` events.
4. Under the correct GA4 Google tag / Measurement ID, create / verify a GA4 Event tag with event name `funtasia_product_download_click`, using the four corresponding values as event parameters. Confirm destination property and no duplicate triggers.
5. In GTM Preview / Tag Assistant, test one intentional Chinese Audio ZIP click. Verify **one** Custom Event and correct parameters, and that non-download clicks do not trigger it. Use GA4 DebugView / Realtime to verify the event arrives in the intended property. Test whether enhanced measurement generates separate events before choosing what to count.
6. Inspect GA4 page view reporting for `/catalog/zh-cn/` and other Chinese routes, and confirm the interpretation of query-string language selection for dynamic home/Utilities/Goods pages. Check region and device consent configuration.
7. Record the test results and independently authorize publication of GTM settings. Merge the website PRs to `main` only after explicit approval.

## Not established by this QA

- GTM workspace or container configuration, its published version, and actual tag firings on a public site.
- GA4 Measurement ID, property receiving the events, event deduplication or conversion configuration.
- User consent or privacy compliance across countries and regions.
- Traffic and ZIP download completion from mainland China or physical user devices.

The rollout is intentionally still a **Draft PR**, and production has not been changed.
