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
