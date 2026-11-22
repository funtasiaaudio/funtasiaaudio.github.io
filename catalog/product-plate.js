/* FUN Plate FREE v1.0.0 — product detail copy for the five current catalog locales. */
(function () {
  const key = 'fun-plate';
  window.FUN_PRODUCT_DETAILS = window.FUN_PRODUCT_DETAILS || {};
  window.FUN_PRODUCT_DETAILS[key] = {
    lead: 'Classic plate character, with a little movement.',
    paras: [
      'FUN Plate FREE v1.0.0 is a free classic plate reverb effect for Windows 64-bit VST3 hosts. It uses the CLASSIC engine from FUN Plate Pro as its sole reverb type.',
      'Shape the reverb with Decay, Bandwidth, Damping and Dry/Wet Mix. The independent Chorus modulation module provides 1–7 voices, adjustable Rate, Depth and Stereo Width. Switch Chorus on or off to choose between a steady tail and gentle periodic motion.',
      'The interface includes 24 factory presets, preset search and favorites, A/B comparison, Undo/Redo, output metering, Mono Check, Wet Solo, a resizable UI and nine color themes. FUN Plate FREE is a separate plugin from FUN Plate Pro.'
    ],
    features: ['CLASSIC PLATE REVERB', 'DECAY / BANDWIDTH / DAMPING / MIX',
      'CHORUS · 1–7 VOICES', 'RATE 0.05–2 Hz · DEPTH 0–5 ms', 'STEREO WIDTH 0–200%',
      '24 FACTORY PRESETS', 'A/B · UNDO/REDO', '9 COLOR THEMES', 'FREE WINDOWS x64 VST3']
  };
  const copy = {
    ja: {
      summary: 'FUN Plate FREEは、CLASSICエンジンと1〜7 VoicesのCHORUSを備えた無料のWindows VST3プレートリバーブです。',
      paras: [
        'FUN Plate FREE v1.0.0は、FUN Plate ProのCLASSICエンジンを継承したWindows 64-bit向けの無料VST3プレートリバーブです。Pro版のMODERN／MODAL／PHYSICALやOrganic／Pinkの各モードは含まず、CLASSICの音作りに集中できます。',
        'MAINではDECAY、BANDWIDTH、DAMPING、MIXを調整できます。独立したCHORUSでは1〜7 Voices、RATE 0.05〜2 Hz、DEPTH 0〜5 ms、STEREO WIDTH 0〜200%を操作でき、周期的で滑らかな揺らぎを加えられます。',
        '24種類のFactory Preset、検索とFavorites、A/B比較、Undo／Redo、メーター、Mono Check、Wet Solo、GUIリサイズと9種類のカラーテーマを搭載。FUN Plate Proとは別のプラグインとして使用できます。'
      ]
    },
    en: {
      summary: 'A free classic plate reverb VST3 with 1–7-voice chorus modulation, 24 presets and nine color themes.',
      paras: [
        'FUN Plate FREE v1.0.0 brings the CLASSIC reverb engine from FUN Plate Pro into a focused, free Windows 64-bit VST3 effect. MODERN, MODAL and PHYSICAL types, plus Organic and Pink modulation modes, remain exclusive to Pro.',
        'Adjust Decay, Bandwidth, Damping and Mix. The independent Chorus offers 1–7 voices, Rate from 0.05 to 2 Hz, Depth from 0 to 5 ms, and Stereo Width from 0 to 200%.',
        'Includes 24 factory presets, search and favorites, A/B comparison, Undo/Redo, output meters, Mono Check, Wet Solo, a resizable interface and nine color themes.'
      ]
    },
    de: {
      summary: 'Kostenloser CLASSIC-Plate-Hall als Windows-VST3 mit Chorus (1–7 Stimmen), 24 Presets und neun Farbthemen.',
      paras: [
        'FUN Plate FREE v1.0.0 übernimmt die CLASSIC-Hall-Engine von FUN Plate Pro als eigenständiges, kostenloses VST3-Plug-in für Windows 64 Bit. MODERN, MODAL und PHYSICAL sowie die Modulationsmodi Organic und Pink bleiben der Pro-Version vorbehalten.',
        'Decay, Bandwidth, Damping und Mix formen den Hall. Das unabhängige Chorus-Modul bietet 1–7 Stimmen, eine Rate von 0,05–2 Hz, eine Depth von 0–5 ms und eine Stereo Width von 0–200 %.',
        'Enthalten sind 24 Factory-Presets, Suche und Favoriten, A/B-Vergleich, Undo/Redo, Ausgangsanzeige, Mono Check, Wet Solo, skalierbare Bedienoberfläche und neun Farbthemen.'
      ]
    },
    fr: {
      summary: 'Réverbération à plaque CLASSIC gratuite au format VST3 Windows, avec chorus de 1 à 7 voix, 24 presets et neuf thèmes.',
      paras: [
        'FUN Plate FREE v1.0.0 reprend le moteur de réverbération CLASSIC de FUN Plate Pro dans un effet VST3 gratuit pour Windows 64 bits. Les types MODERN, MODAL et PHYSICAL, ainsi que les modes de modulation Organic et Pink, restent réservés à Pro.',
        'Réglez Decay, Bandwidth, Damping et Mix. Le chorus indépendant propose de 1 à 7 voix, une Rate de 0,05 à 2 Hz, une Depth de 0 à 5 ms et une Stereo Width de 0 à 200 %.',
        'Il comprend 24 presets d’usine, recherche et favoris, comparaison A/B, Undo/Redo, indicateurs de sortie, Mono Check, Wet Solo, interface redimensionnable et neuf thèmes de couleur.'
      ]
    },
    ru: {
      summary: 'Бесплатный пластинчатый ревербератор CLASSIC для Windows VST3 с хорусом на 1–7 голосов, 24 пресетами и девятью темами.',
      paras: [
        'FUN Plate FREE v1.0.0 использует движок реверберации CLASSIC из FUN Plate Pro и распространяется как отдельный бесплатный VST3-эффект для Windows 64-bit. Типы MODERN, MODAL и PHYSICAL, а также режимы модуляции Organic и Pink остаются в Pro.',
        'Регулируйте Decay, Bandwidth, Damping и Mix. Независимый Chorus предлагает 1–7 голосов, Rate от 0,05 до 2 Гц, Depth от 0 до 5 мс и Stereo Width от 0 до 200 %.',
        'Доступны 24 заводских пресета, поиск и избранное, сравнение A/B, Undo/Redo, индикаторы выхода, Mono Check, Wet Solo, изменение размера интерфейса и девять цветовых тем.'
      ]
    }
  };
  window.FUN_PRODUCT_LOCALIZED = window.FUN_PRODUCT_LOCALIZED || {};
  for (const [locale, value] of Object.entries(copy)) {
    if (!window.FUN_PRODUCT_LOCALIZED[locale]) window.FUN_PRODUCT_LOCALIZED[locale] = {};
    window.FUN_PRODUCT_LOCALIZED[locale][key] = value;
  }
}());
