# FUNtasia Audio — 简体中文站点发布检查 / zh-CN rollout

Status: **Draft implementation — not published**. Branch: `feature/zh-cn-audio-localization-20261122`.

## Included

- Homepage text and developer statement: 70 translated UI/content keys + 21 support-appeal entries, selected via `?lang=zh-CN` or language menu.
- Standalone Simplified Chinese Audio catalog: `/catalog/zh-cn/`; 34 product cards and 34 product descriptions.
- Utilities and Goods: Simplified Chinese client-side translations via `?lang=zh-CN` and the language selectors; Japanese remains the no-JavaScript fallback. Existing download URLs unchanged.
- FUNtasia Records: `/records/zh-cn/` (artists, collaboration, creator rights, support and patronage), with a six-language switch and homepage routing.
- Chinese product detail page: `/catalog/zh-cn/fun-monofilter.html`, with current catalog-linked v1.1.0 ZIP.
- Quality Assurance: `/quality/zh-cn/`; About: `/about/zh-cn/`; Support: `/support/zh-cn/`.
- Language navigation, reciprocal catalog/QA hreflang, Chinese sitemap entries and existing GTM installation.
- Existing release, manual and product-artwork URLs were preserved from the English catalog. Language availability of manuals is explicitly disclosed; no Chinese PDF translations are implied.
- Chinese Audio catalog sends a `dataLayer` custom event for links to release ZIP downloads.

## Required before publication

1. **Editorial review:** Check Chinese copy for fluency, product accuracy, brand voice, and version-specific claims. Ensure all pages preserve factual meaning. The catalog is based on the current English release listings. Updated for FUNtasia Free Collection v1.1.0 and FUN Plate FREE v1.0.0 on 2026-11-23.
2. **Desktop and mobile:** Inspect homepage language switcher, catalog navigation, 34 cards, search, category/genre filters, dialogs, imagery, FAQ, Chinese font fallback, keyboard focus and scrolling.
3. **Links:** Test Chinese About, Support, Quality, catalog and MonoFilter. Verify external GitHub Release ZIP downloads and PDF links. Pages for other FUNtasia divisions remain in their existing languages and are labeled `(EN)` where appropriate.
4. **From mainland China:** Verify real access to GitHub Pages, GitHub release downloads, fonts and images from a Chinese network, not from a VPN or merely an overseas IP. If unreliable, review delivery options before promotion.
5. **GA4:** GTM `GTM-M88BK887` is present, but a dataLayer push **does not itself create a GA4 event**. Configure a GTM Custom Event trigger named `funtasia_product_download_click` and a GA4 Event tag (under the correct GA4 measurement setup) with the same event name. Map `site_language`, `product_name`, `product_key`, `download_url` data layer variables to GA4 event parameters. Publish the GTM container only after review and consent / tracking requirements have been checked.
6. **Measurement QA:** Use GTM Preview/Tag Assistant and GA4 DebugView or Realtime to verify one event per actual ZIP click. Check `/catalog/zh-cn/` page views and clicks by Country=China, and segment engaged sessions/referrals. Baseline is limited and includes suspected non-human visits; do not attribute every Direct session to genuine Chinese interest.
7. **Static regression:** Run `node scripts/check-zh-cn.mjs`. This validates file coverage, 34 Chinese product entries, unchanged artifact links, hreflang, metadata, and JS syntax.
8. **Review and merge:** Merge the PR only after the checks are accepted. The live website is unchanged until merge and GitHub Pages deployment.

## Measurement definitions

- `funtasia_product_download_click`: a click on a direct GitHub Release ZIP link (not evidence that a ZIP finished downloading).
- Page/landing views: available from the URL `/catalog/zh-cn/` in GA4 (assuming pageview tracking remains active).
- Source/medium and engagement: track separately; do not treat unknown Direct referrals as confirmed social mentions.

## Update workflow

Maintain product names, versions, release URLs, and card ordering consistently across language catalog files. When a product is added or updated, update `catalog/product-zh-cn.js`, run the static check and manually verify translated UI content.


## Studio subpages — staged 2026-11-23 (Japan time)

- Chinese expansion browser: `/studio/official/expansions/zh-cn/` with five packs (original MIDI performances, drum/WAV sample sets and The Wavelace wavetables), translated specifications, use instructions and license distinctions.
- Chinese composition reading guide: `/studio/official/zh-cn/study/`, translating the Japanese composition-theory guide, preserving Japanese bibliographic titles and author/publisher links. It clearly states that the listed books are Japanese publications.
- Studio zh-CN landing navigation links directly to both Chinese subpages. Existing English/Japanese expansion pages and Japanese study page link to the new Chinese pages; sitemap entries added.
- Expansion category/sort JavaScript now displays Chinese result counts. Existing English/Japanese behavior and pack downloads remain unchanged.
- Run both `node scripts/check-zh-cn.mjs` and `node scripts/check-zh-cn-studio-subpages.mjs` before publishing. The latter checks the five-pack count, official release/book URL parity, local asset paths, reciprocal navigation and JS syntax.
- Review pending: actual desktop/mobile layout, browser interactions, external downloads, Chinese native-language editorial checks and mainland-China network access. The Chinese translation does not imply that Japanese-language books or manuals have been translated into Chinese.

## Automated site-local link audit

- `node scripts/check-zh-cn-links.mjs` checks 13 entry points (Chinese pages and shared-language home/Utilities/Goods routers), HTML language and metadata, image alternative text, same-page fragment targets and link/file existence in this repository.
- Legacy references under `https://funtasiaaudio.github.io/funtasia-audio/` intentionally point at **a different GitHub Pages project**, repository `funtasiaaudio/funtasia-audio`. They are counted separately, not misreported as missing files. Its repository structure has been checked independently, but actual mainland-China network reachability and individual HTTP download success are not yet verified.
- Run all three static checks in GitHub Actions before publication. They complement, not replace, browser rendering/interaction and real-network checks.
