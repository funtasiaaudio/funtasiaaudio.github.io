/* FUN DC Filter v1.1.1 — release details for the unified product catalog. */
window.FUN_PRODUCT_DETAILS = window.FUN_PRODUCT_DETAILS || {};
window.FUN_PRODUCT_DETAILS['fun-dc-filter'] = {
  lead: 'Remove what the sound does not need.',
  paras: [
    'FUN DC Filter is a free Windows VST3 audio effect that reduces DC offset and unwanted subsonic energy with a first-order, minimum-phase high-pass filter.',
    'Choose a cutoff from 1.0 to 100.0 Hz, or use the 3 Hz, 5 Hz and 10 Hz quick-select buttons. The response graph shows the calculated filter response, not an analyzer of the incoming audio.',
    'ACTIVE switches processing on or off with a short transition. Mono and stereo processing, nine GUI color themes and a resizable editor are included. A manually selected theme is remembered for new instances, while saved DAW projects restore their own theme. No latency is reported to the DAW.'
  ],
  features: [
    '1ST-ORDER HIGH-PASS · 6 dB/OCT',
    'DC / SUBSONIC REMOVAL',
    'CUTOFF 1.0–100.0 Hz',
    '3 / 5 / 10 Hz QUICK SELECT',
    'CALCULATED RESPONSE GRAPH',
    'ACTIVE ON / OFF',
    'MONO / STEREO',
    '9 GUI THEMES · ZERO REPORTED LATENCY'
  ]
};

window.FUN_PRODUCT_LOCALIZED = window.FUN_PRODUCT_LOCALIZED || {};
const dcFilterTranslations = {
  ja: [
    'FUN DC Filterは、DCオフセットと不要な超低域成分を抑える無料のWindows用VST3エフェクトです。一次の最小位相ハイパスフィルターを使用します。',
    'カットオフ周波数は1.0〜100.0 Hzで調整でき、3 Hz／5 Hz／10 Hzのクイック選択も用意。グラフは入力音のスペクトラムではなく、計算上のフィルター応答を示します。',
    'ACTIVEで処理を切り替えられます。モノ／ステレオ、9色のGUIテーマ、サイズ変更に対応。手動選択したテーマは新規インスタンス用に記憶し、保存済みDAWプロジェクトでは各インスタンスのテーマを復元します。DAWへの報告レイテンシーは0です。'
  ],
  de: [
    'FUN DC Filter ist ein kostenloser Windows-VST3-Effekt, der Gleichspannungsanteile und unerwünschte Infraschallsignale mit einem Hochpass erster Ordnung und minimaler Phase reduziert.',
    'Die Grenzfrequenz lässt sich von 1,0 bis 100,0 Hz einstellen. Über die Schnellwahltasten sind 3, 5 und 10 Hz direkt erreichbar. Die Grafik zeigt den berechneten Frequenzgang, nicht das Spektrum des Eingangssignals.',
    'ACTIVE schaltet die Bearbeitung mit einem kurzen Übergang ein oder aus. Mono und Stereo, neun Farbschemata und eine skalierbare Oberfläche werden unterstützt. Die zuletzt manuell gewählte Farbe gilt für neue Instanzen; gespeicherte DAW-Projekte behalten ihr eigenes Theme. Die gemeldete Latenz beträgt null Samples.'
  ],
  fr: [
    'FUN DC Filter est un effet VST3 gratuit pour Windows qui réduit le décalage continu et les infrabasses indésirables à l’aide d’un filtre passe-haut du premier ordre à phase minimale.',
    'Réglez la fréquence de coupure de 1,0 à 100,0 Hz ou choisissez directement 3, 5 ou 10 Hz. Le graphique représente la réponse calculée du filtre, pas une analyse spectrale du signal entrant.',
    'ACTIVE active ou désactive le traitement avec une transition brève. Le mode mono/stéréo, neuf thèmes de couleur et une interface redimensionnable sont proposés. Le dernier thème choisi manuellement s’applique aux nouvelles instances, tandis que les projets enregistrés restaurent leur propre thème. La latence déclarée à la DAW est nulle.'
  ],
  ru: [
    'FUN DC Filter — бесплатный VST3-эффект для Windows, который уменьшает постоянную составляющую и нежелательную инфранизкую энергию с помощью фильтра верхних частот первого порядка с минимальной фазой.',
    'Частота среза регулируется в диапазоне 1,0–100,0 Гц. Есть быстрый выбор 3, 5 и 10 Гц. График показывает расчётную частотную характеристику фильтра, а не спектр входящего звука.',
    'Кнопка ACTIVE включает и отключает обработку с коротким переходом. Поддерживаются моно и стерео, девять цветовых тем и изменение размера интерфейса. Последняя тема, выбранная вручную, применяется к новым экземплярам; проекты DAW сохраняют собственную тему. Заявленная задержка — 0 сэмплов.'
  ]
};
for (const [lang, paras] of Object.entries(dcFilterTranslations)) {
  window.FUN_PRODUCT_LOCALIZED[lang] = window.FUN_PRODUCT_LOCALIZED[lang] || {};
  window.FUN_PRODUCT_LOCALIZED[lang]['fun-dc-filter'] = {summary: paras[0], paras};
}
