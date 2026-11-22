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

## Chinese bibliographic editorial consistency — 2026-11-23 JST

- Cross-checked the Chinese FUNtasia Studio composition-reading page against its original Japanese study guide. The Chinese page promised to keep original Japanese author/publisher titles, but five bibliography metadata strings had translated or simplified name characters.
- Corrected all **seven book credit strings** to the Japanese page's exact author, publisher and circle attributions, e.g. `川辺 真 / 音楽之友社`, `清水 響 / リットーミュージック` and `サークル「月に憑かれたピエロ」`. The Chinese learning explanations and all external book URLs were preserved.
- Added an exact bibliography-parity assertion in `scripts/check-zh-cn-studio-subpages.mjs` to prevent future alteration of Japanese names in the Chinese guide.
- Checked Epic Metal Drums Vol.01 official FEM01 v1.0.0 asset metadata (**3,608,882 bytes**) and clarified its Chinese expansion page size as **approximately 3.61 MB / 3.44 MiB** instead of the ambiguous `3.44 MB`. A static assertion protects both display units.
- Updated `docs/zh-cn-rollout.md` to reflect the existing Chinese routes, completed Chromium checks and limited Ubuntu download integrity verification without misrepresenting physical devices, live GA4 measurement, mainland-China access or native Chinese language review.
- [Static GitHub Actions Push QA: PASS](https://github.com/funtasiaaudio/funtasiaaudio.github.io/actions/runs/45061332052), including the added book-credit and byte-unit assertions.
- This is **automated/source editorial consistency**, not a professional native-Simplified-Chinese proofreading signoff.


## Automated accessibility audit — 2026-11-23 JST

- Added `scripts/check-zh-cn-accessibility.mjs` and `.github/workflows/check-zh-cn-accessibility.yml`, running **axe-core 4.10.3 inside real Chromium** in the staged review branch.
- Static/default view coverage: **12 Chinese/shared entry pages × two viewport widths (1440px desktop and 390px mobile) = 24 scans**, checking tagged WCAG **2.0, 2.1 and 2.2 Level A/AA** automated rules.
- Dynamic UI coverage: Audio product details dialog (open), Audio Effects filter, and Studio expansion MIDI pack filter at both widths = **six additional state scans**. Total **30 automated scans**, all with **zero detected violations and zero affected elements**.
- [Push accessibility audit PASS](https://github.com/funtasiaaudio/funtasiaaudio.github.io/actions/runs/45061823167); [initial 24-scan baseline PASS](https://github.com/funtasiaaudio/funtasiaaudio.github.io/actions/runs/45061689350).
- [Full 30-scan axe result JSON artifact](https://github.com/funtasiaaudio/funtasiaaudio.github.io/actions/runs/45061823167/artifacts/14769389363), including per-page rules and incompletely evaluated groups, retained temporarily under the GitHub Actions artifact policy.
- **Scope boundary:** automated axe checks with zero violations **do not certify WCAG conformance**. The scanner reported some `incomplete` rule groups for human inspection. Physical keyboard-only navigation, NVDA/VoiceOver spoken output, zoom/reflow, contrast edge cases, touch target behavior and actual device/browser differences remain manual acceptance checks. Offsite Google tracking and external content were blocked in the local Chromium audit.


## Keyboard-only focus containment and 320px CSS reflow — 2026-11-23 JST

- Added `scripts/check-zh-cn-keyboard-reflow.mjs` to the existing Chromium workflow, using actual keyboard input and reporting focus state, `:focus-visible`, focused target viewport reachability and full-document horizontal overflow for **12 Chinese entry pages at 1440 and 320 CSS pixels**. The test presses Tab and Shift+Tab through the available keyboard navigation controls without accidentally requiring navigation beyond the final element on a short page.
- The first run discovered a **real issue** in the shared Audio product detail dialog: on desktop and mobile, Tab/Shift+Tab could send `document.activeElement` to `body` while the native modal remained open. A separate short-page false-positive on the 3-link MonoFilter detail page was corrected in the test harness (Tab leaving the browser document after its last available link is not an application bug).
- Fixed `catalog/catalog.js` by preserving keyboard focus inside the open product dialog: forward Tab wraps from its last enabled/visible focus control to the first and Shift+Tab wraps backward. The list is computed from current visible controls, keeping the Chinese original-English disclosure `<summary>` and locale-specific dialog links keyboard reachable. The native Escape-to-close and restoration to the invoking button are retained.
- Extended the regression to the **Japanese and English catalog dialogs**, because the underlying `catalog.js` is shared across all six supported languages. Checked modal Enter/open, 6 forward/6 reverse Tab events and Escape/return-focus on both viewport widths.
- [Full push Chromium QA PASS](https://github.com/funtasiaaudio/funtasiaaudio.github.io/actions/runs/45062588766): **1,108 keyboard/reflow assertions**, **700 Chinese whole-site assertions**, **127 Chinese Studio assertions**. [Keyboard focus/reflow inspection JSON and existing 54 page screenshots](https://github.com/funtasiaaudio/funtasiaaudio.github.io/actions/runs/45062588766/artifacts/14770441072), limited GitHub Actions artifact retention.
- The 320 CSS pixel viewport provides a **reflow-width proxy**, not a simulation of browser 400% zoom, operating-system magnification, a screen reader or touch device. Human/manual focus visibility and browser zoom remain separate acceptance criteria. The axe-core WCAG rule scans from the prior gate remain valid independently.


## Studio Expansion 5-pack official release integrity and multilingual terms — 2026-11-23 JST

- Independently inspected **all five pinned GitHub Releases** and their official asset metadata. The five public ZIP URLs used in the **EN, JA and zh-CN** expansion browser match the official URLs: **15 cards**, five product/version mappings. The three publicly linked license-asset URLs also match official release assets across all three locales. This verifies link identity/existence, **not independent legal interpretation of usage terms**.
- Pinned authoritative release ZIP byte counts and GitHub SHA-256 digests in `docs/studio-expansion-release-pins.json`. Values, all current v1.0.0:
  
  | Pack | Official ZIP size | Automated real download |
  | --- | ---: | --- |
  | Kawaii Wavetable Vol.1 | 61,179,905 B | **PASS** (bytes + SHA-256 + CRC) |
  | FUN Orchestral Percussion Vol.1 | 650,597,565 B | **Not downloaded** (official API size + SHA-256 match) |
  | Nyan 8bit Drum Kit Vol.1 | 594,270 B | **PASS** (bytes + SHA-256 + CRC) |
  | FUN Epic Metal Drums Vol.1 | 3,608,882 B | **PASS** (bytes + SHA-256 + CRC) |
  | FUN Fantasy Folk Drums MIDI Pack | 3,507,170 B | **PASS** (bytes + SHA-256 + CRC) |

- Corrected the outdated EN and JA Epic Metal `3.44 MB` display to decimal **approximately 3.61 MB / binary 3.44 MiB**, consistent with the Chinese page and official 3,608,882-byte release ZIP. Added the missing Chinese Nyan 8bit (`约 594 KB`) and Fantasy Folk (`约 3.51 MB`) size references. Reworded repetitive Chinese license sentences without changing their destinations or license claims. Added localization and size regression assertions to `scripts/check-zh-cn-studio-subpages.mjs`.
- New `scripts/check-studio-expansion-release-metadata.mjs` protects five ZIP URLs across three localized pages, product order, pinned byte counts and digests and linked official license assets. With `--remote`, it fetches official GitHub Releases data to revalidate all five file sizes/digests dynamically.
- New `scripts/check-studio-expansion-downloads.sh` downloads **four** official ZIP files from GitHub on a runner (the large Orchestral ZIP is excluded to avoid a 650 MB transfer on every PR), checks each file's authoritative SHA-256 and byte count and runs `unzip -tqq` for CRC. Separate `.github/workflows/check-studio-expansion-releases.yml` triggers these checks on relevant changes.
- **[Push official metadata and real ZIP integrity QA: PASS](https://github.com/funtasiaaudio/funtasiaaudio.github.io/actions/runs/45080454778)** and **[PR official metadata/integrity QA: PASS](https://github.com/funtasiaaudio/funtasiaaudio.github.io/actions/runs/45080458496)**. The standard Simplified Chinese site static QA also passed for this code change.
- **Scope:** The actual ZIP transfers were made from a GitHub-hosted Ubuntu runner, not from a device or network in mainland China. The 650 MB Orchestral ZIP was not independently transferred. License file *contents* were not legally reviewed or certified by metadata validation. Native Chinese editorial, physical user-device accessibility, live GA4 event receipt and mainland China access remain pending publication gates.


## Five Studio expansion license originals checked against Chinese guidance — 2026-11-23 JST

- Downloaded original **license documents for all five published v1.0.0 Studio expansion packs** using official release assets. Each download was verified by the matching GitHub Releases byte length and authoritative SHA-256 digest before inspection.
- Three separately published source documents: Kawaii Wavetable `LICENSE.txt`, Orchestral Percussion `FUN_Orchestral_Percussion_Vol1_LICENSE.txt`, and Nyan 8bit `LICENSE.txt`.
- Extracted two additional original documents **from SHA-256-verified MIDI ZIPs**, without executing any included files: `FUN_Epic_Metal_Drums_Vol01_v1.0.0/LICENSE.md` and `FUN_Fantasy_Folk_Drums_MIDI_Pack_v1.0.0/LICENSE.txt`. Their exact archive paths are now checked by `scripts/audit-studio-expansion-license-sources.sh`.
- The original terms distinguish:
  - Orchestral Percussion **CC0 recordings**, which may be reused and redistributed; cover art/branding remain separate.
  - Kawaii Wavetable and Nyan 8bit, which permit use in commercial creative works but prohibit repackaging/reselling audio/wavetable assets as standalone libraries.
  - Epic Metal, which permits royalty-free commercial/noncommercial musical works from MIDI phrases but does **not** permit selling or redistributing included MIDI files as a standalone asset pack.
  - Fantasy Folk, which permits sharing editable MIDI inside substantive original DAW projects while prohibiting standalone MIDI-stock redistribution.
- Clarified the Chinese Wavetable summary to explicitly prohibit standalone-library redistribution/resale and the Chinese Epic Metal summary to state the separate standalone-MIDI redistribution restriction. Also labeled the exact `LICENSE.md`/`LICENSE.txt` files as **inside the ZIPs**; unchanged official license links and compatible CC0/Fantasy Folk permissions are retained.
- Added `scripts/check-zh-cn-studio-subpages.mjs` assertions protecting these source-specific distinctions; no new license rights or legal opinions were created.
- [Source-license download and extraction CI PASS](https://github.com/funtasiaaudio/funtasiaaudio.github.io/actions/runs/45081175464), with [original licensed texts + structured excerpts](https://github.com/funtasiaaudio/funtasiaaudio.github.io/actions/runs/45081175464/artifacts/14777441231) saved as a temporary GitHub Actions artifact. [Updated Chinese source and license-filename regression CI PASS](https://github.com/funtasiaaudio/funtasiaaudio.github.io/actions/runs/45081340963).
- **Scope:** This is a faithful documentation/source-parity audit, **not a formal legal determination**. Original license documents remain authoritative; legally significant edge cases require document-level review. The repository changes are confined to the Draft rollout branch and have not been merged into production `main`.


## Chinese Audio sharing locale and manual-language editorial correction — 2026-11-23 JST

- A six-product Chinese Audio catalog group retained English-language fallback deep links in both X's encoded `intent/tweet?url=` and Instagram's `data-share-url`, despite the product cards having valid Chinese `#product-id` anchors. Corrected **12 social sharing destinations (6 X + 6 Instagram)** from `/catalog/en/#product` to `/catalog/zh-cn/#product` without changing the other 28 cards' links to official GitHub Releases.
- Corrected the Chinese in-page filter button `实用工具 (EN)` to `实用工具`; the button is a product **category filter**, not a foreign-language route.
- Found five Chinese product-card PDF buttons whose linked manuals are explicitly the existing `_EN.pdf` English editions, while their label was ambiguous `PDF 使用手册`. Relabeled all five **`PDF 使用手册（英文）`** without inventing Chinese-language manuals or modifying any source PDF URL/content.
- Updated `scripts/check-zh-cn.mjs` with exact per-card locale-deep-link verification, correct X URL decoding, English PDF filename/label parity and absence of stale fallback labels. Added real Chromium DOM checks for share destinations and language disclosure at desktop 1440, mobile 390, and narrow 320 CSS-px widths in `scripts/check-zh-cn-site-browser.mjs`.
- [Static source/locale regression: PASS](https://github.com/funtasiaaudio/funtasiaaudio.github.io/actions/runs/45082836450). The existing all-page browser, keyboard, SEO and automated WCAG jobs remain separate CI gates. These edits require no site-owner GTM tag changes and introduce no new external tracking.
- **Scope:** consistency and disclosure corrections in an unmerged Draft PR. Actual native-speaker proofreading, mainland-China network connectivity, physical device/screen-reader and live GA4 receipt are still unresolved publication criteria.


## Restrictive-network graceful degradation — 2026-11-23 JST

- Inspected third-party resource dependencies across the Simplified Chinese website. The Studio Expansion browser has three prominent covers hosted on **GitHub Releases** (Kawaii Wavetable, Orchestral Percussion, and Nyan 8bit); two other covers are already local. About includes an offsite avatar. Official download buttons still lead to GitHub Releases. GTM and other nonessential third-party requests must never be prerequisites for website navigation.
- Added a safe, non-deceptive fallback in shared `studio/official/expansions/expansions.js` and `expansions.css`: if any of the three offsite cover images fails, show its **actual pack name** and localized unavailable-image hint rather than a blank/broken cover. The original image alt description is retained via `role="img"` and `aria-label` on the fallback. Local artwork, external official download URLs, license links and category filters are unchanged.
- Works on **EN, JA and zh-CN**, including an eager image failure before the JS handler is attached. Does not silently replace unavailable product artwork with unrelated images.
- Added `scripts/check-zh-cn-external-fallback.mjs` to Chromium QA: block **all offsite requests** and check the actual 3-locale cover fallbacks at **1440px and 390px**, the two local cover assets, accessible fallback names, working MIDI filters and intact official download URLs. In addition, smoke-test seven core Chinese pages at two widths with blocked offsite services and one no-JavaScript Chinese expansion page ensuring all five static cards and ZIP links still exist.
- [Initial restricted-network Chromium QA PASS](https://github.com/funtasiaaudio/funtasiaaudio.github.io/actions/runs/45083176623): **156 assertions**, **57 blocked offsite requests**, plus standard Chinese site browser (745 assertions), Studio (127), keyboard/reflow (1,108). [Browser evidence artifact](https://github.com/funtasiaaudio/funtasiaaudio.github.io/actions/runs/45083176623/artifacts/14778182884) (temporary).
- The existing lightweight Studio DOM runtime harness was updated to ignore the new cover-only image selector; full image-failure behavior is tested in real Chromium. Its first static QA run failed because the older mock assumed every card selector was `h3`—a **test-harness mismatch**, not a user-visible product regression. The [follow-up static QA](https://github.com/funtasiaaudio/funtasiaaudio.github.io/actions/runs/45083335012) passed after the mock fix.
- **Important scope boundary:** Blocking arbitrary external requests from GitHub-hosted Chromium is **not** equivalent to measuring reachability, speed, TLS behavior or user download success from mainland China. GitHub Pages itself and GitHub Release ZIP delivery may be inaccessible to some in-region users. Actual in-region devices/network probes remain a separate publication gate; this work cannot guarantee availability there.


## Utilities / Goods locale persistence and cross-section navigation — 2026-11-23 JST

- The shared client-side translated Utilities/Goods pages correctly rendered Simplified Chinese for `?lang=zh-CN`, but **their Studio, About and Support navigation links remained on the default language/router URL**. This could send a Chinese reader to Japanese About/Support or another Studio locale if a previous language choice in localStorage conflicted with the URL.
- Fixed `site-sections-i18n.js` to explicitly route those three destinations to `../studio/official/zh-cn/`, `../about/zh-cn/` and `../support/zh-cn/` for `zh-CN` while preserving existing fallback destinations for Japanese and other locales.
- Extended `scripts/check-zh-cn-site-browser.mjs` to seed an older English stored preference, enter Utilities/Goods using explicit `?lang=zh-CN`, verify their Chinese links, perform a real Goods → Chinese About navigation, reload pages, change and persist language manually, verify subsequent cross-page language persistence, and confirm an explicit Japanese URL overrides stored Chinese without leaking Chinese About/Support links.
- **[Real Chromium PR QA PASS](https://github.com/funtasiaaudio/funtasiaaudio.github.io/actions/runs/45083609483)**: **775 whole-site browser assertions**, **127 Studio assertions**, **1,108 keyboard/reflow assertions**, including the expanded navigation cases. [Chromium evidence artifact](https://github.com/funtasiaaudio/funtasiaaudio.github.io/actions/runs/45083609483/artifacts/14777364080) (temporary).
- **[Site static QA PASS](https://github.com/funtasiaaudio/funtasiaaudio.github.io/actions/runs/45083609458)**, **[axe-core accessibility PR QA PASS](https://github.com/funtasiaaudio/funtasiaaudio.github.io/actions/runs/45083609460)**, **[Studio expansion integrity PR QA PASS](https://github.com/funtasiaaudio/funtasiaaudio.github.io/actions/runs/45083609471)**.
- The fixes coexist with other Chinese Audio editorial/image resilience changes on the shared Draft branch. Production `main` remains unchanged. This automated browser verification is separate from native Chinese review, actual China-region network access, physical screen-reader tests and live GA4 receipt.

