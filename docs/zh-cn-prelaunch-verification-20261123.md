# FUNtasia zh-CN — Prelaunch verification record (2026-11-23 JST)

All changes remain in review branches / Draft PRs. This is a report of the checks below, **not** a claim of production availability or a completed mainland-China user download.

## Automated coverage
- Chinese website static QA: 34 Audio catalog product entries; release/image parity against existing English Audio catalog.
- Records, Utilities and Goods translation checks, including Utilities/Goods language-switch DOM harness.
- Studio landing-page link and beta-information checks; Chinese expansion and composition-study checks.
- New site-local URL and accessibility smoke test: 13 page entry points, internal image/file paths, same-page fragment IDs, Chinese language metadata and image alt attributes. CI result for commit `733e988c`: GitHub Actions PASS on push and pull request.
- Expansion-filter runtime test: category selection, result counts, A–Z and featured sorting, URL state/Back handling, zero-results state and JA/EN fallback (run in simulated DOM, not a real browser).

## GitHub release metadata (verified against official release asset records)
| Product | Release | Exact published ZIP asset | Asset size |
|---|---|---|---|
| FUNtasia Studio | v1.3.0beta | FUNtasia.Studio.1.3.0beta.zip | 54,287,632 bytes |
| Kawaii Wavetable Vol.1 | v1.0.0 | Kawaii_Wavetable_Vol1.zip | 61,179,905 bytes |
| FUN Orchestral Percussion Vol.1 | v1.0.0 | FUN.Orchestral.Percussion.Vol.1.zip | 650,597,565 bytes |
| Nyan 8bit Drum Kit Vol.1 | v1.0.0 | Nyan_8bit_Drum_Kit_Vol_1.zip | 594,270 bytes |
| FUN Epic Metal Drums Vol.1 | FEM01-v1.0.0 | FUN_Epic_Metal_Drums_Vol01_v1.0.0_Free.zip | 3,608,882 bytes |
| FUN Fantasy Folk Drums MIDI Pack | v1.0.0 | FUN_Fantasy_Folk_Drums_MIDI_Pack_v1.0.0.zip | 3,507,170 bytes |

The Kawaii, Orchestral and Nyan artwork and their separately linked LICENSE.txt assets also match the release records. The HTML points to the exact browser_download_url values, where applicable. This verifies **published metadata and filename/URL parity**, not transfer completion.

## Legacy Pages project
- The legacy path `/funtasia-audio/` is served by the separate repository `funtasiaaudio/funtasia-audio`, not the main website repository.
- The four checked pages (home, Chinese Audio catalog, Utilities and Goods) contain **28 direct legacy-project references**; the linked image files exist in the legacy repository.
- The nine Chinese catalog links targeting `/funtasia-audio/#...` correspond to existing element IDs in the legacy homepage.
- The URL checker reports legacy-project references separately instead of falsely flagging them as absent local files.

## Remaining release gates
1. Native Chinese editorial and terminology review, especially product/license wording.
2. Real desktop/mobile viewport, language-selection, keyboard and screen-reader checks.
3. Actual ZIP/PDF transfers, download integrity, cross-border network access from mainland China, and linked pages in the target region.
4. GTM Custom Event and GA4 tag/parameter configuration and consent-aware event QA.
5. Final explicit approval to merge the rollout into production `main`.


## Full-site Chromium regression — 2026-11-23 JST

- [Real-browser Push QA: **PASS**](https://github.com/funtasiaaudio/funtasiaaudio.github.io/actions/runs/45051795461), commit `9ee702f8d4`: Studio checks **127 assertions**; multi-division site checks **471 assertions**.
- Site-wide Chromium coverage: **9 pages × 3 viewport widths** (1440/390/320 px) = **27 screenshots**, plus 9 Studio screenshots in the same workflow.
- Includes explicit Simplified Chinese home language switching and links to Audio, Records, Studio, Utilities and Goods; 34-card catalog search, filters, a native product detail dialog; Records, MonoFilter, About, Quality and Support; Utilities/Goods bilingual selectors; browser errors, local resources and horizontal document overflow.
- The mobile navigation deliberately uses horizontally scrollable menus. The QA now confirms offscreen items are **reachable by scrolling** instead of incorrectly demanding that all links be simultaneously visible.
- Corrected three real localization issues: Chinese home Studio link (formerly pointed to EN), Chinese Audio catalog links to Studio/Records/Utilities/Goods (formerly English or locale-dependent), and MonoFilter introductory paragraph that remained in English.
- [Screenshots + inspection JSON](https://github.com/funtasiaaudio/funtasiaaudio.github.io/actions/runs/45051795461/artifacts/14766290916), GitHub Actions retention 14 days. Tests serve the candidate branch on a local HTTP server and block external tracking/downloads; no mainland-China or real ZIP-transfer evidence is implied.

## Chinese accessibility and locale routing — 2026-11-23 JST

- Commit `88d7d9ce`: corrected **31 Chinese Audio catalog image alt descriptions**, preserving the 34 product identities and artwork URLs. Automated browser test rejects remaining English-only artwork-description phrasing.
- The Studio route `/studio/?lang=zh` now supports the same explicit Simplified Chinese aliases as other sections, including `zh-CN`, `zh-Hans` and `zh-SG`. The browser locale evaluator distinguishes Simplified (`zh`, `zh-CN`, `zh-Hans`, `zh-SG`) from Traditional locales (`zh-TW`, `zh-HK`, `zh-Hant`). A Traditional browser locale defaults to the existing English page when no Traditional Chinese translation is published; an explicit Simplified choice still works.
- Browser-matrix QA covers seven browser locale settings across home / Utilities / Goods / Studio, four explicit Studio aliases, keyboard focus into the native Audio product-detail dialog, Enter to open and Escape to close.
- [GitHub Actions Push Chromium: PASS](https://github.com/funtasiaaudio/funtasiaaudio.github.io/actions/runs/45052180618): **508 site-wide assertions + 127 Studio assertions PASS**; [PR Chromium: PASS](https://github.com/funtasiaaudio/funtasiaaudio.github.io/actions/runs/45052185254).
- [Push static checks: PASS](https://github.com/funtasiaaudio/funtasiaaudio.github.io/actions/runs/45052180561); [PR static checks: PASS](https://github.com/funtasiaaudio/funtasiaaudio.github.io/actions/runs/45052185238).
- [Screenshot and diagnosis artifact](https://github.com/funtasiaaudio/funtasiaaudio.github.io/actions/runs/45052180618/artifacts/14765663801): nine Studio and 27 other-site screenshots. This is Chromium-based local deployment QA, not a real smartphone, a native Chinese editorial signoff, nor a mainland-China download/network check.

## Canonical, reciprocal hreflang and Chinese support navigation — 2026-11-23 JST

- Fixed the Chinese About/Support header, body and footer links to their intended Simplified Chinese destinations for Audio, Studio, Records, Utilities and Goods. Removed outdated "(English)" annotations where the destination now has Chinese content.
- Added visible JA/zh-CN language switching on Japanese and Chinese Support pages; reciprocal canonical-language alternates on Japanese About/Support; existing localized About language controls retained.
- Audited `catalog/zh-cn/fun-monofilter.html`: its five non-Chinese counterpart pages lacked reciprocal language alternates. Added all six declared alternate language tags to each JA/EN/DE/FR/RU counterpart **without changing their legacy release links, manuals or page text**.
- Added `scripts/check-zh-cn-seo.mjs` to CI. It verifies exactly one self-canonical, page language, meta description, one H1, sitemap entry, self hreflang, alternate target existence and reciprocity. **PASS: nine Chinese pages, 37 reciprocal language links**.
- Extended Chromium QA with Chinese About/Support cross-division navigation clicks and the Japanese ↔ Chinese Support switch. **PASS: 559 site-wide assertions + 127 Studio assertions**.
- [Push static QA PASS](https://github.com/funtasiaaudio/funtasiaaudio.github.io/actions/runs/45052698586), [PR static QA PASS](https://github.com/funtasiaaudio/funtasiaaudio.github.io/actions/runs/45052704409).
- [Push Chromium PASS](https://github.com/funtasiaaudio/funtasiaaudio.github.io/actions/runs/45052698577), [PR Chromium PASS](https://github.com/funtasiaaudio/funtasiaaudio.github.io/actions/runs/45052704495).
- [36 screenshots and diagnostic JSON](https://github.com/funtasiaaudio/funtasiaaudio.github.io/actions/runs/45052698577/artifacts/14766093246) (GitHub Actions artifact with limited retention).

**MonoFilter version discrepancy — resolved 2026-11-23 JST:** JA/EN/DE/FR/RU standalone detail pages previously referenced v1.0.0. The six existing Audio catalog cards already referenced v1.1.0. After independently verifying the official latest published release asset and current v1.1.0 local artwork, the five older detail pages were updated to v1.1.0. All six localized PDF manual URLs were preserved; the PDF documents themselves were not rewritten or certified as v1.1.0-specific.

**Remaining publication gates:** native Simplified Chinese editorial approval, real phone/tablet and assistive-technology checks, mainland-China network access and end-user download integrity, GTM/GA4 event validation and explicit approval before merging into production `main`. A GitHub-hosted Ubuntu runner has successfully downloaded and checked the MonoFilter v1.1.0 ZIP, but this is not a mainland-China or every-product download test.

## FUN MonoFilter — official release parity and actual CI transfer (2026-11-23 JST)

- Official repository `funtasiaaudio/FUN-MonoFilter`: verified **latest published release is v1.1.0**, issued November 9, 2026. Exact release asset: `FUN.MonoFilter.1.1.0.zip` at `https://github.com/funtasiaaudio/FUN-MonoFilter/releases/download/v1.1.0/FUN.MonoFilter.1.1.0.zip`.
- Official asset metadata: **6,070,159 bytes**, SHA-256 **`9dc913b61d15f75be86ca9e1f34b9b432a61c642eec968a5747e8fbcdf3d32f6`**.
- Updated the five individual FUN MonoFilter pages `catalog/{ja,en,de,fr,ru}/fun-monofilter.html` to the verified v1.1.0 ZIP, `card-fun-monofilter-v1.1.0-sage-portrait.webp` and v1.1.0 footer. The Chinese sixth page and six full catalog cards already referenced v1.1.0. Kept all original descriptions, language alternates, canonical URLs and locale-specific PDF manual hrefs.
- Added `scripts/check-zh-cn-monofilter-release.mjs` to normal site CI to require **all six language pages and catalog cards** agree on current published ZIP, artwork, version, and the existence of the respective existing local PDF manuals. **[Static Push QA PASS](https://github.com/funtasiaaudio/funtasiaaudio.github.io/actions/runs/45053186156)**, **[Static PR QA PASS](https://github.com/funtasiaaudio/funtasiaaudio.github.io/actions/runs/45053190933)**.
- Extended real Chromium tests to open all **six locale detail pages at 1440 / 390 / 320 px**, check actual local artwork load and CTA URL, footer version and horizontal overflow, and capture **18 additional screenshots**. **[Browser Push QA PASS](https://github.com/funtasiaaudio/funtasiaaudio.github.io/actions/runs/45053186202)** / **[Browser PR QA PASS](https://github.com/funtasiaaudio/funtasiaaudio.github.io/actions/runs/45053190917)**: **685 site assertions + 127 Studio assertions**, **54 screenshots total**. [Screenshots and diagnostics](https://github.com/funtasiaaudio/funtasiaaudio.github.io/actions/runs/45053186202/artifacts/14766109243) (temporary GitHub Actions artifact).
- Added a separate, reproducible release-transfer check in `.github/workflows/check-zh-cn-monofilter-download.yml`, which downloads the complete official release ZIP in GitHub-hosted Ubuntu, checks byte length and authoritative SHA-256, and checks ZIP contents with `unzip -tqq` (no installation or execution of downloaded binaries). **[Real transfer, SHA-256 and ZIP CRC: PASS](https://github.com/funtasiaaudio/funtasiaaudio.github.io/actions/runs/45053329317)**.
- **Scope:** the successful transfer comes from GitHub-hosted Ubuntu, not a device in mainland China. China-specific reachability, final end-user browser downloads, other product ZIPs and the PDF manuals' internal release-specific editorial content are not proven by this run.


## Frontend GTM / GA4 event readiness — 2026-11-23 JST

- New source audit `scripts/check-zh-cn-analytics.mjs` verifies the pre-existing GTM bootstrap and matching noscript iframe across **11** Chinese/shared entry pages, and validates the `funtasia_product_download_click` frontend event contract in `catalog/catalog.js`.
- New real Chromium assertions on Chinese Audio catalog verify one `dataLayer` object per direct GitHub Release ZIP click; exactly five fields `event`, `site_language`, `product_name`, `product_key`, `download_url` with the clicked card's values; keyboard Enter activation; no false event for PDF manuals or product details; and no Chinese custom event from the English catalog.
- [Static Push QA: PASS](https://github.com/funtasiaaudio/funtasiaaudio.github.io/actions/runs/45053884251). [Browser Push QA: PASS](https://github.com/funtasiaaudio/funtasiaaudio.github.io/actions/runs/45053884237): **700 site-wide assertions + 127 Studio assertions**, 54 existing-page screenshots and diagnostic JSON. [Browser evidence artifact](https://github.com/funtasiaaudio/funtasiaaudio.github.io/actions/runs/45053884237/artifacts/14767165231).
- The browser test **blocks** remote GTM, GA4 and other third-party scripts; it deliberately does not send events to live Analytics. This establishes the website's event generation, **not** published GTM event-tag mapping, consent compliance, or actual GA4 receipt.
- All six standalone MonoFilter detail pages currently omit GTM. This remains a separate analytics coverage decision for the site owner; new tracking was **not** silently enabled.
- [GTM / GA4 operational checklist](https://github.com/funtasiaaudio/funtasiaaudio.github.io/blob/feature/zh-cn-studio-subpages-20261123/docs/zh-cn-gtm-ga4-review.md) identifies the four Data Layer Variables, matching Custom Event trigger and GA4 Event tag, proper consent controls, duplicate-event review, GTM Preview/Tag Assistant and GA4 DebugView/Realtime checks.
- **Still pending:** authorized GTM container inspection, actual GA4 event receipt, privacy/consent review, native Chinese proofread, real user-device accessibility, mainland-China connectivity and transfer tests, and explicit production approval.
