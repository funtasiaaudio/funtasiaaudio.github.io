const search=document.querySelector('#product-search');
const cards=[...document.querySelectorAll('[data-product-name]')];
const count=document.querySelector('#product-count');
const unit=count?.dataset.unit||'';
const filters=[...document.querySelectorAll('[data-filter]')];
const localeFilter=document.documentElement.lang||'en';
const labels={
ja:{genre:'ジャンル',all:'すべて',free:'無料のみ表示',paid:'有償のみ表示',effects:['EQ・フィルター','ダイナミクス','ディストーション','リバーブ・ディレイ','モジュレーション','その他'],instruments:['シンセサイザー','物理モデリング','サンプラー','ドラム音源']},
en:{genre:'Genre',all:'All',free:'Free only',paid:'Paid only',effects:['EQ & Filters','Dynamics','Distortion','Reverb & Delay','Modulation','Other'],instruments:['Synthesizers','Physical Modeling','Samplers','Drum Instruments']},
de:{genre:'Genre',all:'Alle',free:'Nur kostenlos',paid:'Nur kostenpflichtig',effects:['EQ & Filter','Dynamik','Verzerrung','Hall & Delay','Modulation','Sonstige'],instruments:['Synthesizer','Physikalische Modellierung','Sampler','Drum-Instrumente']},
fr:{genre:'Genre',all:'Tout',free:'Gratuits uniquement',paid:'Payants uniquement',effects:['EQ et filtres','Dynamique','Distorsion','Réverbération et délai','Modulation','Autres'],instruments:['Synthétiseurs','Modélisation physique','Sampleurs','Instruments de batterie']},
ru:{genre:'Жанр',all:'Все',free:'Только бесплатные',paid:'Только платные',effects:['Эквалайзеры и фильтры','Динамика','Дисторшн','Реверберация и задержка','Модуляция','Другое'],instruments:['Синтезаторы','Физическое моделирование','Сэмплеры','Ударные инструменты']}
};
const tr=labels[localeFilter]||labels.en;
const effectGenres=['eq','dynamics','distortion','reverb','modulation','other'];
const instrumentGenres=['synth','physical','sampler','drum'];
const genreByName={
'FUN Lo-Fi Pack':'distortion','FUN Pair':'other','FUN Room':'reverb','FUN PreAmp':'distortion','FUN Clipper & Limiter Pack':'dynamics','FUN Dynamics Pack':'dynamics','FUN OTT':'dynamics','FUN Clip Distortion':'distortion','FUN WaveShaper':'distortion','FUN EQ':'eq','FUN MEQ':'eq','FUN Basic Filter Pack':'eq',
'FUN Test Tone':'other','FUN Dimension Expander':'modulation','FUN Dither':'other','FUN Stereo Pack':'other','FUN Volume Shaper':'dynamics','FUN Fader':'other','FUN DC Filter':'eq','FUN Drum Pad':'drum','The Deep Roots':'synth','FUN Kick':'drum','FUN Sampler':'sampler','FUN Strike':'physical'
};
for(const card of cards){
 const name=card.dataset.productName;
 card.dataset.genre=genreByName[name]||'other';
 // All currently published catalog entries are free; future paid products must be explicitly tagged.
 if(!card.dataset.pricing)card.dataset.pricing='free';
}

/* Product artwork is a first-class media asset, separate from release navigation. */
const artworkLabels={
 ja:{open:'製品画像を新しいタブで開く',save:'製品画像を保存',note:'製品画像は各カードの「製品画像を保存」からダウンロードできます。'},
 en:{open:'Open product artwork in a new tab',save:'Save product artwork',note:'Download product artwork using “Save product artwork” on each card.'},
 de:{open:'Produktbild in neuem Tab öffnen',save:'Produktbild speichern',note:'Produktbilder können über „Produktbild speichern“ auf jeder Karte heruntergeladen werden.'},
 fr:{open:'Ouvrir le visuel dans un nouvel onglet',save:'Enregistrer l’image',note:'Téléchargez les visuels des produits via « Enregistrer l’image » sur chaque fiche.'},
 ru:{open:'Открыть изображение в новой вкладке',save:'Сохранить изображение',note:'Изображения продуктов можно скачать кнопкой « Сохранить изображение » на каждой карточке.'}
};
const artworkText=artworkLabels[localeFilter]||artworkLabels.en;
const mediaNote=document.createElement('p');
mediaNote.className='media-note';
mediaNote.textContent=artworkText.note;
document.querySelector('.concept-note')?.after(mediaNote);
for(const card of cards){
 const productLink=card.querySelector(':scope > a');
 const image=productLink?.querySelector('img.shot');
 const actions=card.querySelector('.card-actions');
 if(!image||!actions)continue;
 const source=image.getAttribute('src');
 if(!source)continue;
 const imageUrl=new URL(source,document.baseURI).href;
 const imageLink=document.createElement('a');
 imageLink.className='card-image-link';
 imageLink.href=imageUrl;
 imageLink.target='_blank';
 imageLink.rel='noopener noreferrer';
 imageLink.setAttribute('aria-label',card.dataset.productName+' — '+artworkText.open);
 productLink.before(imageLink);
 imageLink.append(image);
 productLink.classList.add('card-title-link');
 const saveLink=document.createElement('a');
 saveLink.className='mini-btn image-download-btn';
 saveLink.href=imageUrl;
 saveLink.download=imageUrl.split('/').pop().split('?')[0]||'FUNtasia-artwork.webp';
 saveLink.textContent=artworkText.save;
 saveLink.setAttribute('aria-label',card.dataset.productName+' — '+artworkText.save);
 actions.prepend(saveLink);
}

/* Editorial links: show a note button only where a verified, product-relevant article exists. */
const noteArticleUrls={
 'FUN Lo-Fi Pack':'https://note.com/hueliang_/n/n5394df5d19c1',
 'FUN Stereo Pack':'https://note.com/hueliang_/n/n28cf323b9c04',
 'FUN Dimension Expander':'https://note.com/hueliang_/n/nba13c974ee1b',
 'FUN Volume Shaper':'https://note.com/hueliang_/n/ne37c8caea459',
 'FUN Pair':'https://note.com/hueliang_/n/n827fcb586475',
 'FUN Drum Pad':'https://note.com/hueliang_/n/n51639c5b5515',
 'FUN PreAmp':'https://note.com/yucila_funtasia/n/n34f61e322ab7',
 'FUN MEQ':'https://note.com/hueliang_/n/na80e32517859',
 'FUN Strike':'https://note.com/yucila_funtasia/n/n3e9bd940e046',
 'FUN Sampler':'https://note.com/hueliang_/n/nc87525a831ae',
 'FUN Basic Filter Pack':'https://note.com/hueliang_/n/n1a37c585f102',
 'The Deep Roots':'https://note.com/hueliang_/n/n54dea131da1f',
 'FUN Clipper & Limiter Pack':'https://note.com/yucila_funtasia/n/n44e70e2c1b17',
 'FUN OTT':'https://note.com/hueliang_/n/n49f84e3d5ef1'
};
const noteButtonLabels={
 ja:'noteで記事を読む',
 en:'Read on note',
 de:'Artikel auf note',
 fr:'Lire sur note',
 ru:'Читать на note'
};
const noteButtonLabel=noteButtonLabels[localeFilter]||noteButtonLabels.en;
for(const card of cards){
 const articleUrl=noteArticleUrls[card.dataset.productName];
 const actions=card.querySelector('.card-actions');
 if(!articleUrl||!actions)continue;
 const link=document.createElement('a');
 link.className='mini-btn note-article-btn';
 link.href=articleUrl;
 link.target='_blank';
 link.rel='noopener noreferrer';
 link.textContent=noteButtonLabel;
 link.setAttribute('aria-label',card.dataset.productName+' — '+noteButtonLabel);
 actions.append(link);
}

const categoryBar=document.querySelector('.filters');
const genreBar=document.createElement('div');genreBar.className='filters genre-filters';genreBar.setAttribute('role','group');genreBar.setAttribute('aria-label',tr.genre);genreBar.hidden=true;
const priceBar=document.createElement('div');priceBar.className='price-filters';priceBar.setAttribute('role','group');priceBar.setAttribute('aria-label','Pricing');
for(const [value,label] of [['free',tr.free],['paid',tr.paid]]){
 const item=document.createElement('label');item.className='price-option';
 const input=document.createElement('input');input.type='checkbox';input.value=value;input.dataset.priceFilter=value;
 item.append(input,document.createTextNode(' '+label));priceBar.append(item);
}
categoryBar?.after(genreBar,priceBar);
let active='all',activeGenre='all',activePrice='all';
function renderGenres(){
 genreBar.replaceChildren();
 const keys=active==='effect'?effectGenres:active==='instrument'?instrumentGenres:[];
 genreBar.hidden=keys.length===0;
 if(!keys.length)return;
 for(const [i,key] of ['all',...keys].entries()){
  const button=document.createElement('button');button.type='button';button.className='filter-btn';button.dataset.genreFilter=key;
  button.textContent=i===0?tr.all:(active==='effect'?tr.effects:tr.instruments)[i-1];
  button.setAttribute('aria-pressed',String(key===activeGenre));
  button.addEventListener('click',()=>{activeGenre=key;renderGenres();filter();});
  genreBar.append(button);
 }
}
function filter(){
 const q=(search?.value||'').toLocaleLowerCase().trim();let n=0;
 for(const c of cards){
  const visible=c.dataset.productName.toLocaleLowerCase().includes(q)
   &&(active==='all'||c.dataset.category===active)
   &&(activeGenre==='all'||c.dataset.genre===activeGenre)
   &&(activePrice==='all'||c.dataset.pricing===activePrice);
  c.hidden=!visible;if(visible)n++;
 }
 if(count)count.textContent=n+' '+unit;
 const empty=document.querySelector('#empty-state');if(empty)empty.hidden=n!==0;
}
search?.addEventListener('input',filter);
for(const b of filters)b.addEventListener('click',()=>{active=b.dataset.filter;activeGenre='all';for(const x of filters)x.setAttribute('aria-pressed',String(x===b));renderGenres();filter();});
for(const input of priceBar.querySelectorAll('input'))input.addEventListener('change',()=>{
 activePrice=input.checked?input.value:'all';
 for(const other of priceBar.querySelectorAll('input'))other.checked=other.value===activePrice;
 filter();
});
for(const b of document.querySelectorAll('.instagram-share-btn'))b.addEventListener('click',async()=>{
 const url=b.dataset.shareUrl,title=b.dataset.shareTitle;
 const message='FUNtasia Audio - '+title+' '+url;
 // Instagram does not offer a standard web URL intent for feed posts.
 // Native sharing is offered where available; desktop fallback copies the product link.
 if(navigator.share){
  try{await navigator.share({title:'FUNtasia Audio - '+title,text:'FUNtasia Audio - '+title,url});return;}
  catch(error){if(error?.name==='AbortError')return;}
 }
 try{
  await navigator.clipboard.writeText(message);
  window.alert(({ja:'製品名とURLをコピーしました。Instagramで貼り付けてください。',en:'Product name and URL copied. Paste them into Instagram.',de:'Produktname und URL kopiert. In Instagram einfügen.',fr:'Nom et URL du produit copiés. Collez-les dans Instagram.',ru:'Название и ссылка скопированы. Вставьте их в Instagram.'})[localeFilter]||'Product URL copied.');
 }catch{window.prompt('Copy product link for Instagram',message);}
});
renderGenres();filter();

/* Accessible native dialog with original Audio product descriptions. */
const details=window.FUN_PRODUCT_DETAILS||{};
const localized=window.FUN_PRODUCT_LOCALIZED||{};
/* Keep the selectable 9-colour GUI themes visible in details for these 16 releases. */
const nineThemeProductKeys=new Set([
 'fun-pair','fun-dc-filter','fun-dither','fun-monofilter',
 'fun-stereo-pack','fun-lo-fi-pack','fun-dimension-expander','fun-volume-shaper',
 'fun-drum-pad','fun-room','fun-ott','fun-clip-distortion',
 'fun-waveshaper','fun-kick','fun-sampler','basic-filter-pack'
]);
const nineThemeFeatureLabels={
 ja:'9種類のカラーテーマから選択可能',
 en:'9 SELECTABLE COLOUR THEMES',
 de:'9 WÄHLBARE FARBTHEMEN',
 fr:'9 THÈMES DE COULEUR AU CHOIX',
 ru:'9 ЦВЕТОВЫХ ТЕМ НА ВЫБОР'
};


/* FUN Test Tone v1.0.0 — free signal generator used for our own plugin testing. */
details['fun-test-tone']={
 "lead": "A precise starting point for sound inside your DAW.",
 "paras": [
  "FUN Test Tone v1.0.0 is a free Windows 64-bit VST3 signal generator used in FUNtasia Audio's own plug-in development and testing. It replaces the incoming audio with a generated signal rather than mixing the two. OUTPUT OFF therefore produces silence, not dry-through.",
  "Select SINE, SQUARE, SAW or NOISE, with WHITE and PINK noise types. Square and saw waves use band-limited edge processing to reduce aliasing. The oscillator covers 20 Hz to 20 kHz, while LEVEL ranges from −100 to 0 dBFS in 0.1 dB steps; −100 dBFS is silence.",
  "Periodic tones are identical on left and right. In NOISE mode, MONO outputs the same noise on both channels, while STEREO generates independent left/right noise. FREQUENCY and SWEEP are unavailable in NOISE mode.",
  "The 1 kHz button changes only frequency to 1000 Hz. REF sets SINE, 1000 Hz and −18 dBFS and resets oscillator phase without changing OUTPUT or CHANNEL. PHASE RESET sets the oscillator phase to zero at the next audio block. SWEEP runs logarithmically from 20 Hz to 20 kHz over 10 seconds for periodic waves.",
  "The waveform preview and peak display are visual aids, not calibrated measurement tools. The GUI scales from 50% to 200%, and settings are saved with the DAW project. The ZIP includes PDF manuals in Japanese, English, Korean and Traditional Chinese (Taiwan). Turn down monitoring before using test signals; start near −18 dBFS or lower."
 ],
 "features": [
  "FREE WINDOWS x64 VST3",
  "SINE / SQUARE / SAW",
  "WHITE / PINK NOISE",
  "20 Hz–20 kHz",
  "−100 TO 0 dBFS",
  "MONO / STEREO",
  "1 kHz / REF",
  "PHASE RESET",
  "10-SECOND LOG SWEEP",
  "50–200% GUI SIZE",
  "DAW STATE SAVE",
  "4-LANGUAGE PDF MANUALS"
 ]
};
const testToneTranslations={
 "ja": [
  "FUN Test Tone v1.0.0は、FUNtasia Audio自身がプラグイン開発・動作検証に使っている、Windows 64-bit向け無料VST3信号ジェネレーターです。入力音声に音を混ぜるのではなく、入力を生成信号で置き換えます。OUTPUTをOFFにしても原音は通過せず、無音になります。",
  "SINE（正弦波）・SQUARE（矩形波）・SAW（ノコギリ波）・NOISEを選択でき、ノイズはWHITE／PINKを切り替えられます。SQUAREとSAWには折り返し歪みを抑える帯域制限処理を搭載。周期波形の周波数は20 Hz〜20 kHz、LEVELは−100〜0 dBFS（0.1 dB刻み）で、−100 dBFSは無音です。",
  "周期波形は左右同じ信号です。NOISE時のMONOは左右同じノイズ、STEREOは左右独立のノイズを生成します。NOISE中はFREQUENCYとSWEEPが無効になります。",
  "「1 kHz」は周波数だけを1000 Hzに設定。「REF」はSINE／1000 Hz／−18 dBFSへ戻して位相もリセットしますが、OUTPUTとCHANNELは変更しません。「PHASE RESET」は次のオーディオブロックで位相を0に戻します。「SWEEP」は周期波形で20 Hz〜20 kHzを10秒かけて対数的に走査します。",
  "波形プレビューとピーク表示は状態確認用で、校正された測定器ではありません。GUI倍率は50〜200%で、設定はDAWプロジェクトに保存されます。ZIPには日本語・英語・韓国語・繁体字中国語（台湾）のPDFマニュアルが付属。テスト信号の再生前にモニター音量を下げ、−18 dBFS以下の控えめなレベルから始めてください。"
 ],
 "en": [
  "FUN Test Tone v1.0.0 is a free Windows 64-bit VST3 signal generator used in FUNtasia Audio's own plug-in development and testing. It replaces the incoming audio with a generated signal rather than mixing the two. OUTPUT OFF therefore produces silence, not dry-through.",
  "Select SINE, SQUARE, SAW or NOISE, with WHITE and PINK noise types. Square and saw waves use band-limited edge processing to reduce aliasing. The oscillator covers 20 Hz to 20 kHz, while LEVEL ranges from −100 to 0 dBFS in 0.1 dB steps; −100 dBFS is silence.",
  "Periodic tones are identical on left and right. In NOISE mode, MONO outputs the same noise on both channels, while STEREO generates independent left/right noise. FREQUENCY and SWEEP are unavailable in NOISE mode.",
  "The 1 kHz button changes only frequency to 1000 Hz. REF sets SINE, 1000 Hz and −18 dBFS and resets oscillator phase without changing OUTPUT or CHANNEL. PHASE RESET sets the oscillator phase to zero at the next audio block. SWEEP runs logarithmically from 20 Hz to 20 kHz over 10 seconds for periodic waves.",
  "The waveform preview and peak display are visual aids, not calibrated measurement tools. The GUI scales from 50% to 200%, and settings are saved with the DAW project. The ZIP includes PDF manuals in Japanese, English, Korean and Traditional Chinese (Taiwan). Turn down monitoring before using test signals; start near −18 dBFS or lower."
 ],
 "de": [
  "FUN Test Tone v1.0.0 ist ein kostenloser VST3-Testsignalgenerator für Windows 64 Bit, den FUNtasia Audio selbst bei der Plugin-Entwicklung verwendet. Das erzeugte Signal ersetzt das Eingangsaudio; OUTPUT OFF führt zu Stille und nicht zur Durchleitung des Originals.",
  "Wählbar sind SINE, SQUARE, SAW sowie NOISE mit WHITE oder PINK. Rechteck- und Sägezahnwellen verwenden eine bandbegrenzende Verarbeitung zur Verringerung von Aliasing. Frequenz: 20 Hz bis 20 kHz; LEVEL: −100 bis 0 dBFS in 0,1-dB-Schritten, wobei −100 dBFS stumm bedeutet.",
  "Periodische Signale sind links und rechts identisch. NOISE MONO verwendet dasselbe Rauschen auf beiden Kanälen, NOISE STEREO erzeugt unabhängiges L/R-Rauschen. FREQUENCY und SWEEP sind im NOISE-Modus deaktiviert.",
  "1 kHz setzt nur die Frequenz. REF wählt SINE, 1000 Hz und −18 dBFS und setzt die Phase zurück, ohne OUTPUT oder CHANNEL zu ändern. PHASE RESET setzt die Phase im nächsten Audioblock auf null. SWEEP durchläuft logarithmisch 20 Hz bis 20 kHz in 10 Sekunden.",
  "Wellenform- und Pegelanzeigen dienen zur Orientierung, nicht als kalibrierte Messgeräte. GUI-Größe: 50–200 %; Einstellungen werden im DAW-Projekt gespeichert. Das ZIP enthält PDF-Handbücher auf Japanisch, Englisch, Koreanisch und traditionellem Chinesisch (Taiwan). Vor Testsignalen die Abhörlautstärke reduzieren."
 ],
 "fr": [
  "FUN Test Tone v1.0.0 est un générateur de signaux VST3 gratuit pour Windows 64 bits, utilisé lors du développement des plug-ins FUNtasia Audio. Le signal généré remplace l'audio entrant : OUTPUT OFF produit du silence, sans laisser passer le signal original.",
  "Il propose SINE, SQUARE, SAW et NOISE (WHITE ou PINK). Les formes carrée et en dents de scie emploient un traitement limitant le repliement spectral. Fréquence : 20 Hz à 20 kHz ; LEVEL : −100 à 0 dBFS par pas de 0,1 dB (−100 dBFS correspond au silence).",
  "Les signaux périodiques sont identiques à gauche et à droite. En mode NOISE, MONO duplique le même bruit sur les deux canaux, tandis que STEREO génère deux bruits indépendants. FREQUENCY et SWEEP sont désactivés en mode NOISE.",
  "1 kHz ne change que la fréquence. REF rétablit SINE, 1000 Hz et −18 dBFS, puis réinitialise la phase sans toucher à OUTPUT ni CHANNEL. PHASE RESET remet la phase à zéro au bloc audio suivant. SWEEP parcourt 20 Hz à 20 kHz de façon logarithmique en 10 secondes.",
  "L'aperçu et le niveau crête sont des indicateurs visuels, non des instruments étalonnés. Interface redimensionnable de 50 à 200 % ; réglages enregistrés dans le projet DAW. Le ZIP contient des manuels PDF en japonais, anglais, coréen et chinois traditionnel (Taïwan). Réduisez le volume d'écoute avant tout test."
 ],
 "ru": [
  "FUN Test Tone v1.0.0 — бесплатный VST3-генератор тестовых сигналов для Windows 64-bit, который FUNtasia Audio использует при разработке своих плагинов. Он заменяет входной звук, а не подмешивает к нему сигнал: при OUTPUT OFF на выходе тишина.",
  "Доступны SINE, SQUARE, SAW и NOISE с вариантами WHITE / PINK. Прямоугольные и пилообразные сигналы используют ограничение спектра для уменьшения алиасинга. Частота: 20 Гц–20 кГц; уровень: от −100 до 0 dBFS с шагом 0,1 дБ (−100 dBFS — тишина).",
  "Периодические сигналы одинаковы слева и справа. NOISE MONO дублирует один шум на оба канала, а NOISE STEREO создаёт независимые сигналы L/R. В режиме NOISE настройки FREQUENCY и SWEEP недоступны.",
  "Кнопка 1 kHz меняет только частоту. REF устанавливает SINE, 1000 Гц и −18 dBFS и сбрасывает фазу, не меняя OUTPUT или CHANNEL. PHASE RESET обнуляет фазу в следующем аудиоблоке. SWEEP выполняет логарифмический проход 20 Гц–20 кГц за 10 секунд.",
  "Предпросмотр волны и индикатор пика — вспомогательные, не калиброванные измерители. Масштаб GUI: 50–200 %, параметры сохраняются с проектом DAW. В ZIP находятся PDF-руководства на японском, английском, корейском и традиционном китайском (Тайвань). Перед тестом уменьшите громкость мониторов."
 ]
};
for(const [lang,paras] of Object.entries(testToneTranslations)){
 if(!localized[lang])localized[lang]={};
 localized[lang]['fun-test-tone']={paras};
}

/* FUN Utility Pack v1.0.0 — FUN Time Align + FUN Channel. */
details['fun-utility-pack']={
 lead:'Two essential tools. One pack.',
 paras:[
  'FUN Utility Pack v1.0.0 brings together two audio utility plugins from FUNtasia Audio: FUN Time Align and FUN Channel.',
  'FUN Time Align provides independent left and right delay adjustment for precise stereo timing alignment and Haas-style positioning.',
  'FUN Channel provides stereo and channel routing options, left/right swap, mono summing, polarity and mute controls, Mid/Side encode/decode, and monitoring modes. Download both plugins from the release package.'
 ],
 features:['FUN TIME ALIGN','FUN CHANNEL','LEFT / RIGHT TIMING','STEREO ROUTING','MID / SIDE','POLARITY / MUTE','FREE DOWNLOAD']
};
const utilityPackTranslations={
 ja:['FUN Utility Pack v1.0.0は、FUN Time AlignとFUN Channelの2製品をまとめたFUNtasia Audioのオーディオユーティリティパックです。','FUN Time Alignは左右チャンネルのディレイを個別に調整し、精密なタイミング補正やHaas効果を使った音作りに対応します。','FUN Channelは、L/R SWAP、MONO SUM、L TO BOTH、R TO BOTH、M/S ENCODE・DECODE、左右独立のPOLARITY・MUTE、ソロ・Mid・Sideなどのモニター切替を備えています。'],
 en:['FUN Utility Pack v1.0.0 combines FUN Time Align and FUN Channel for practical stereo timing and channel control.','FUN Time Align offers independent left/right timing adjustment and Haas-style control.','FUN Channel includes stereo routing, L/R swap, mono sum, Mid/Side encoding and decoding, polarity, mute, and useful monitoring modes.'],
 de:['FUN Utility Pack v1.0.0 enthält die beiden Audiowerkzeuge FUN Time Align und FUN Channel.','FUN Time Align bietet unabhängige Zeitkorrekturen für die linken und rechten Kanäle, auch für Haas-Effekte.','FUN Channel bietet Stereo-Routing, L/R-Tausch, Monosumme, Mid/Side-Encoding und -Decoding, Polarität, Mute und verschiedene Monitoring-Modi.'],
 fr:['FUN Utility Pack v1.0.0 regroupe deux utilitaires audio : FUN Time Align et FUN Channel.','FUN Time Align permet de régler séparément le décalage temporel des canaux gauche et droit, notamment pour les effets Haas.','FUN Channel propose le routage stéréo, l’inversion L/R, la somme mono, l’encodage/décodage Mid/Side, la polarité, le mute et des modes de monitoring.'],
 ru:['FUN Utility Pack v1.0.0 объединяет два аудиоплагина: FUN Time Align и FUN Channel.','FUN Time Align позволяет независимо корректировать задержку левого и правого каналов, в том числе для эффекта Хааса.','FUN Channel предлагает маршрутизацию каналов, обмен L/R, моносуммирование, кодирование и декодирование Mid/Side, полярность, Mute и режимы мониторинга.']
};
for(const [lang,paras] of Object.entries(utilityPackTranslations)){
 if(!localized[lang])localized[lang]={};
 localized[lang]['fun-utility-pack']={paras};
}
details['fun-stereo-pack']={
 lead:'Shape your stereo. Your way.',
 paras:[
  'FUN Stereo Pack v1.1.0 includes two independent free VST3 effects for Windows x64: FUN Dual Pan and FUN Stereo Width.',
  'FUN Dual Pan provides independent left/right positioning, input balance, linked controls, mono check and selectable pan law. FUN Stereo Width adjusts stereo width from 0% mono to 200% expanded stereo, with stereo-field and correlation monitoring.',
  'NEW IN v1.1.0: Both plug-ins now offer nine colour themes, including Sakura Pink and Aquamarine. Each plug-in remembers the last manually selected theme for new instances. Saved DAW projects restore their own themes, while other open instances stay unchanged.',
  'Theme settings affect only the GUI, not audio processing or automation. Both plug-ins work separately in VST3-compatible DAWs. Five-language PDF manuals are included in the ZIP.'
 ],
 features:['TWO FREE VST3 EFFECTS','DUAL PAN / INPUT BALANCE','PAN LAW / LINK / MONO','STEREO WIDTH 0–200%','STEREO FIELD / CORRELATION','MONO CHECK','9 COLOUR THEMES','GLOBAL THEME PREFERENCES','WINDOWS x64']
};
const stereoPackTranslations={
 ja:{paras:[
  'FUN Stereo Pack v1.1.0は、FUN Dual PanとFUN Stereo Widthの2製品を収録したWindows 64-bit用の無料VST3エフェクトパックです。',
  'FUN Dual Panは左右の定位、入力バランス、LINK、MONO CHECK、PAN LAWを操作できます。FUN Stereo Widthは0〜200%のステレオ幅調整とSTEREO FIELD表示、相関メーターを搭載しています。',
  'v1.1.0では、両プラグインにSakura PinkとAquamarineを追加し、全9色のGUIテーマに対応しました。手動選択したテーマは各プラグインの新規インスタンスに引き継がれます。保存済みDAWプロジェクトではプロジェクトの保存色が優先され、開いている他のインスタンスは自動変更されません。',
  'テーマ設定はGUI専用で、音声処理やAutomationには影響しません。2製品は別々に使用でき、日本語・英語・ドイツ語・フランス語・ロシア語のPDFマニュアルがZIPに付属します。'
 ]},
 de:{paras:[
  'FUN Stereo Pack v1.1.0 enthält zwei unabhängige, kostenlose VST3-Effekte für Windows x64: FUN Dual Pan und FUN Stereo Width.',
  'FUN Dual Pan bietet eine separate Positionierung der beiden Eingangskanäle, Eingangs-Balance, gekoppelte Regler, Mono-Prüfung und wählbares Pan Law. FUN Stereo Width regelt die Stereobreite von 0 % (Mono) bis 200 % mit Stereo-Field-Anzeige und Korrelationsmesser.',
  'NEU IN v1.1.0: Beide Plug-ins bieten jetzt neun Farbthemen, darunter Sakura Pink und Aquamarine. Jedes Plug-in merkt sich das zuletzt manuell gewählte Thema für neue Instanzen. Gespeicherte DAW-Projekte stellen ihr eigenes Thema wieder her; bereits geöffnete Instanzen bleiben unverändert.',
  'Die Themen betreffen nur die Oberfläche, nicht die Audioverarbeitung oder Automation. Beide Effekte sind einzeln verwendbar. PDF-Handbücher in fünf Sprachen sind im ZIP enthalten.'
 ]},
 fr:{paras:[
  'FUN Stereo Pack v1.1.0 réunit deux effets VST3 gratuits et indépendants pour Windows 64 bits : FUN Dual Pan et FUN Stereo Width.',
  'FUN Dual Pan permet de positionner séparément les canaux gauche et droit, de régler la balance, de lier les commandes, de vérifier le mono et de choisir une loi panoramique. FUN Stereo Width règle la largeur stéréo de 0 % (mono) à 200 %, avec affichage du champ stéréo et corrélation.',
  'NOUVEAUTÉ v1.1.0 : Les deux plug-ins proposent désormais neuf thèmes, dont Sakura Pink et Aquamarine. Chaque plug-in mémorise le dernier thème choisi manuellement pour les nouvelles instances. Les projets DAW enregistrés restaurent leur propre thème et les autres instances ouvertes ne changent pas.',
  'Les thèmes modifient uniquement l’interface, sans toucher au traitement audio ni à l’automation. Les deux effets sont utilisables séparément. Des manuels PDF en cinq langues sont inclus dans le ZIP.'
 ]},
 ru:{paras:[
  'FUN Stereo Pack v1.1.0 объединяет два независимых бесплатных VST3-эффекта для Windows x64: FUN Dual Pan и FUN Stereo Width.',
  'FUN Dual Pan позволяет отдельно размещать левый и правый каналы, регулировать входной баланс, связывать регуляторы, проверять моно и выбирать закон панорамирования. FUN Stereo Width изменяет ширину от 0 % (моно) до 200 % с дисплеем стереополя и индикатором корреляции.',
  'НОВОЕ В v1.1.0: В обоих плагинах теперь девять цветовых тем, включая Sakura Pink и Aquamarine. Каждый плагин запоминает последнюю выбранную вручную тему для новых экземпляров. Сохранённые проекты DAW восстанавливают свою тему, а уже открытые экземпляры не изменяются.',
  'Темы меняют только интерфейс и не влияют на обработку звука или автоматизацию. Оба эффекта можно использовать отдельно. В ZIP включены PDF-руководства на пяти языках.'
 ]}
};
for(const [language,translation] of Object.entries(stereoPackTranslations)){
 (localized[language]??={})['fun-stereo-pack']=translation;
}
details['fun-volume-shaper']={
 lead:'Draw the volume. Shape the groove.',
 paras:[
  'FUN Volume Shaper is a free single-band stereo volume-shaping effect for Windows VST3. Draw a smooth gain curve directly in the editor to create rhythmic ducking, gates, fades and custom volume movements.',
  'Choose DAW sync, MIDI-note or audio triggering. The curve editor supports nodes, curved segments, snap-to-grid, horizontal and vertical flips, copy/paste, undo/redo, Depth and Time Shift. Internal and external sidechain sources are available.',
  'Save your own curves as user presets and recall them across projects. The v1.0.0 release passed pluginval Strictness Level 10 and 537 of 537 Steinberg VST3 Validator tests; these checks do not guarantee compatibility with every DAW.'
 ],
 features:['SINGLE-BAND STEREO','EDITABLE CURVE','SYNC / MIDI / AUDIO TRIGGER','INTERNAL / EXTERNAL SIDECHAIN','USER PRESETS','WINDOWS VST3','FIVE-LANGUAGE PDF MANUALS']
};
details['fun-fader']={
 lead:'One fader. Complete control.',
 paras:[
  'FUN Fader is a free VST3 volume-control utility for Windows, with a Gothic-inspired, resizable interface and a single precise gain fader.',
  'It supports mono and stereo audio, DAW automation, and host project state saving and restoration. The visual design features a wooden fader, deep green scenery and Kaisei Opti typography.',
  'Version 1.0.0 passed pluginval Strictness Level 5 and all 537 Steinberg VST3 Validator extensive tests. Automated tests do not guarantee compatibility with every DAW.'
 ],
 features:['FREE WINDOWS VST3','MONO / STEREO','VOLUME FADER','DAW AUTOMATION','RESIZABLE GUI','KAISEI OPTI']
};
const faderTranslations={
 ja:{paras:[
  'FUN Faderは、ゴシック調のGUIを備えたWindows用の無料VST3音量フェーダーです。木製フェーダーをドラッグして音量を調整でき、GUIサイズも変更できます。',
  'モノラル／ステレオ音声、DAWオートメーション、プロジェクトへの設定保存・復元に対応。深緑の情景とKaisei Optiの文字を組み合わせたデザインです。',
  'v1.0.0はpluginval Strictness Level 5とSteinberg VST3 Validatorの全537項目に合格しました。ただし、すべてのDAWでの動作を保証するものではありません。'
 ]},
 de:{paras:[
  'FUN Fader ist ein kostenloses VST3-Werkzeug für Windows zur Lautstärkeregelung. Die skalierbare Oberfläche kombiniert einen hölzernen Fader mit einer gotisch inspirierten Gestaltung.',
  'Unterstützt Mono und Stereo, DAW-Automation sowie das Speichern und Wiederherstellen des Plugin-Zustands im Projekt. Die Typografie verwendet Kaisei Opti.',
  'Version 1.0.0 bestand pluginval auf Strictness Level 5 und alle 537 erweiterten Tests des Steinberg VST3 Validators. Eine Kompatibilität mit jeder DAW kann damit nicht garantiert werden.'
 ]},
 fr:{paras:[
  'FUN Fader est un outil VST3 gratuit pour Windows permettant un réglage précis du volume, avec une interface redimensionnable d’inspiration gothique et un curseur en bois.',
  'Il prend en charge les pistes mono et stéréo, l’automatisation dans le DAW et la sauvegarde ainsi que la restauration de l’état du plugin. La typographie est en Kaisei Opti.',
  'La version 1.0.0 a réussi pluginval au niveau de rigueur 5 et les 537 tests approfondis du validateur VST3 de Steinberg. Cela ne garantit pas la compatibilité avec tous les DAW.'
 ]},
 ru:{paras:[
  'FUN Fader — бесплатный VST3-плагин для Windows с точным управлением громкостью, изменяемым размером интерфейса и готическим оформлением с деревянным фейдером.',
  'Поддерживаются моно и стерео, автоматизация DAW, сохранение и восстановление состояния плагина в проекте. Используется шрифт Kaisei Opti.',
  'Версия 1.0.0 прошла pluginval Strictness Level 5 и все 537 расширенных тестов Steinberg VST3 Validator. Это не гарантирует совместимость со всеми DAW.'
 ]}
};
for(const [language,translation] of Object.entries(faderTranslations)){
 (localized[language]??={})['fun-fader']=translation;
}
const volumeShaperTranslations={
 ja:{paras:[
  'FUN Volume Shaperは、音量の変化をカーブで直接描けるWindows用の無料VST3エフェクトです。リズミカルなダッキング、ゲート、フェード、自由な音量シェイピングに使えます。',
  'DAW同期、MIDIノート、音声トリガーに対応。ノード編集、曲率変更、グリッド吸着、上下左右反転、コピー／ペースト、Undo／Redo、DEPTH、TIME SHIFTを搭載し、内部／外部サイドチェインを選べます。',
  '作成したカーブはユーザープリセットとして保存できます。v1.0.0はpluginval Strictness Level 10およびSteinberg VST3 Validator 537/537件のテストに合格していますが、すべてのDAWでの動作を保証するものではありません。'
 ]},
 de:{paras:[
  'FUN Volume Shaper ist ein kostenloser VST3-Effekt für Windows, mit dem sich die Stereolautstärke über eine frei zeichnbare Kurve formen lässt: für rhythmisches Ducking, Gates, Fades und eigene Lautstärkebewegungen.',
  'DAW-Synchronisation, MIDI-Noten- und Audio-Trigger werden unterstützt. Der Kurveneditor bietet Knoten, Krümmung, Raster, Spiegelungen, Kopieren/Einfügen, Undo/Redo, DEPTH und TIME SHIFT sowie interne und externe Sidechain-Quellen.',
  'Eigene Kurven lassen sich als Benutzer-Presets speichern. v1.0.0 bestand pluginval auf Strictness Level 10 und alle 537 Tests des Steinberg VST3 Validators. Dies garantiert jedoch nicht die Kompatibilität mit jeder DAW.'
 ]},
 fr:{paras:[
  'FUN Volume Shaper est un effet VST3 gratuit pour Windows qui permet de dessiner directement une courbe de volume stéréo sur une seule bande, pour créer du ducking rythmique, des gates, des fondus et des mouvements personnalisés.',
  'Il propose la synchronisation DAW, le déclenchement MIDI ou audio, des nœuds éditables, la courbure des segments, la grille, les inversions, copier/coller, annuler/rétablir, DEPTH, TIME SHIFT et des sources sidechain internes ou externes.',
  'Enregistrez vos courbes comme préréglages utilisateur. La version 1.0.0 a réussi pluginval au niveau de rigueur 10 et les 537 tests du validateur VST3 de Steinberg. Ces résultats ne garantissent pas la compatibilité avec tous les DAW.'
 ]},
 ru:{paras:[
  'FUN Volume Shaper — бесплатный VST3-эффект для Windows, в котором можно вручную рисовать кривую изменения стереогромкости в одной полосе: для ритмического приглушения, гейтов, фейдов и собственных движений уровня.',
  'Доступны синхронизация с DAW, запуск по MIDI-ноте или аудиосигналу, редактирование узлов и изгибов, привязка к сетке, отражение кривой, копирование/вставка, отмена/повтор, DEPTH, TIME SHIFT, а также внутренний и внешний сайдчейн.',
  'Свои кривые можно сохранять в пользовательские пресеты. Версия 1.0.0 прошла pluginval Strictness Level 10 и все 537 тестов Steinberg VST3 Validator, но это не гарантирует совместимость со всеми DAW.'
 ]}
};
for(const [language,translation] of Object.entries(volumeShaperTranslations)){
 (localized[language]??={})['fun-volume-shaper']=translation;
}
/* FUN Lo-Fi Pack v1.0.0 — FUN Bitcrusher + FUN Downsampler. */
details['fun-lo-fi-pack']={
 lead:'Two plugins. Digital character.',
 paras:[
  'FUN Lo-Fi Pack v1.0.0 brings together two separate digital lo-fi audio effects: FUN Bitcrusher and FUN Downsampler.',
  'FUN Bitcrusher reduces bit depth for crunchy quantization textures. FUN Downsampler reduces sample rate for gritty, retro-inspired digital color. Use the two effects independently or combine them in your own signal chain.'
 ],
 features:['FUN BITCRUSHER','FUN DOWNSAMPLER','BIT DEPTH REDUCTION','SAMPLE RATE REDUCTION','FREE DOWNLOAD']
};
const loFiTranslations={
 ja:{paras:[
  'FUN Lo-Fi Pack v1.0.0は、デジタルLo-Fiサウンドを作る2つのエフェクト、FUN BitcrusherとFUN Downsamplerを収録した無料パックです。',
  'FUN Bitcrusherはビット深度を下げて粗い量子化の質感を作り、FUN Downsamplerはサンプルレートを下げてレトロなデジタルサウンドを生み出します。2つは独立したエフェクトとして使用できます。'
 ]},
 de:{paras:[
  'FUN Lo-Fi Pack v1.0.0 enthält zwei eigenständige digitale Lo-Fi-Effekte: FUN Bitcrusher und FUN Downsampler.',
  'FUN Bitcrusher reduziert die Bittiefe für körnige Quantisierungsartefakte. FUN Downsampler senkt die Abtastrate für raue, retro-inspirierte digitale Klangfarben. Beide Effekte können einzeln oder kombiniert verwendet werden.'
 ]},
 fr:{paras:[
  'FUN Lo-Fi Pack v1.0.0 rassemble deux effets lo-fi numériques indépendants : FUN Bitcrusher et FUN Downsampler.',
  'FUN Bitcrusher réduit la résolution en bits pour créer une texture de quantification granuleuse. FUN Downsampler réduit la fréquence d’échantillonnage pour des couleurs numériques brutes et rétro. Les deux effets peuvent être utilisés séparément ou ensemble.'
 ]},
 ru:{paras:[
  'FUN Lo-Fi Pack v1.0.0 объединяет два самостоятельных цифровых lo-fi эффекта: FUN Bitcrusher и FUN Downsampler.',
  'FUN Bitcrusher уменьшает разрядность для характерной грубой текстуры квантования, а FUN Downsampler снижает частоту дискретизации для ретро-цифрового звучания. Эффекты можно использовать по отдельности или вместе.'
 ]}
};
for(const [language,translation] of Object.entries(loFiTranslations)){
 (localized[language]??={})['fun-lo-fi-pack']=translation;
}
const locale=document.documentElement.lang||'en';
const words={ja:['詳しく見る','製品紹介','元サイトで見る','閉じる','元サイト掲載の英語説明'],en:['Details','Product details','Original page','Close','Original English description'],de:['Details','Produktdetails','Originalseite','Schließen','Englische Originalbeschreibung'],fr:['Détails','Présentation','Page originale','Fermer','Description originale en anglais'],ru:['Подробнее','О продукте','Оригинальная страница','Закрыть','Оригинальное описание на английском']}[locale]||['Details','Product details','Original page','Close','Original English description'];
const dialog=document.createElement('dialog');dialog.className='product-dialog';dialog.setAttribute('aria-labelledby','product-dialog-title');
dialog.innerHTML='<div class="dialog-top"><span class="dialog-kicker"></span><button class="dialog-close" type="button"></button></div><h2 id="product-dialog-title"></h2><div class="dialog-body"></div><div class="dialog-footer"><a class="dialog-original" target="_blank" rel="noopener noreferrer"></a></div>';
document.body.append(dialog);
dialog.querySelector('.dialog-kicker').textContent=words[1];
dialog.querySelector('.dialog-close').textContent=words[3];
dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
for(const card of cards){
 const href=card.querySelector('a[href*="funtasia-audio/#"]')?.href || card.querySelector('a[href*="github.com/funtasiaaudio/FUN-Lo-Fi-Pack/releases/"]')?.href || card.querySelector('a[href*="github.com/funtasiaaudio/FUN-Dither/releases/"]')?.href || card.querySelector('a[href*="github.com/funtasiaaudio/FUN-Fader/releases/"]') || card.querySelector('a[href*="github.com/funtasiaaudio/FUN-Volume-Shaper/releases/"]')?.href || card.querySelector('a[href*="github.com/funtasiaaudio/FUN-DC-Filter/releases/"]')?.href || card.querySelector('a[href*="github.com/funtasiaaudio/FUN-Dimension-Expander/releases/"]')?.href || card.querySelector('a[href*="github.com/funtasiaaudio/FUN-MonoFilter/releases/tag/"]')?.href || card.querySelector('a[href*="github.com/funtasiaaudio/FUN-Analysis-Pack/releases/"]')?.href || card.querySelector('a[href*="github.com/funtasiaaudio/FUN-Stereo-Pack/releases/"]')?.href || card.querySelector('a[href*="github.com/funtasiaaudio/FUN-Test-Tone/releases/"]')?.href || card.querySelector('a[href*="github.com/funtasiaaudio/FUN-Utility-Pack/releases/"]')?.href || card.querySelector('a[href*="github.com/funtasiaaudio/FUN-Pair/releases"]')?.href || card.querySelector('a[href*="github.com/funtasiaaudio/FUN-Basic-Filter-Pack/releases/"]')?.href || card.querySelector('a[href*="github.com/funtasiaaudio/FUN-Kick/releases/tag/"]')?.href || card.querySelector('a[href*="github.com/funtasiaaudio/FUN-Sampler/releases/tag/"]')?.href;
 if(!href)continue;
 const key=card.dataset.productKey||({'FUN Kick':'fun-kick','FUN Sampler':'fun-sampler'}[card.dataset.productName])||href.split('#')[1],item=details[key];
 if(!item)continue;
 const btn=document.createElement('button');btn.type='button';btn.className='mini-btn detail-btn';btn.textContent=words[0];
 const actions=card.querySelector('.card-actions');actions?.prepend(btn);
 btn.addEventListener('click',()=>{
  dialog.querySelector('#product-dialog-title').textContent=card.dataset.productName;
  const body=dialog.querySelector('.dialog-body');body.replaceChildren();
  if(item.lead && !localized[locale]?.[key]){const lead=document.createElement('p');lead.className='dialog-lead';lead.textContent=item.lead;body.append(lead);}
  const translation=localized[locale]?.[key];
  if(translation){const paragraphs=typeof translation==='string'?[translation]:(translation.paras?.length?translation.paras:[translation.summary]);for(const line of paragraphs){const p=document.createElement('p');p.textContent=line;body.append(p);}const disclosure=document.createElement('details');disclosure.className='dialog-english';const summary=document.createElement('summary');summary.textContent=words[4];disclosure.append(summary);for(const line of item.paras){const original=document.createElement('p');original.textContent=line;disclosure.append(original);}body.append(disclosure);}
  else for(const line of item.paras){const p=document.createElement('p');p.textContent=line;body.append(p);}
  const hasNineThemes=nineThemeProductKeys.has(key);
  const featureList=hasNineThemes?item.features.map(feature=>feature.replace(/\b9\s+(?:(?:GUI|COLOUR|COLOR)\s+)*THEMES?\b/gi,'').replace(/^[\s·|/]+|[\s·|/]+$/g,'')).filter(Boolean):item.features;
  if(featureList.length||hasNineThemes){
   const list=document.createElement('ul');list.className='dialog-features';
   for(const feature of featureList){const li=document.createElement('li');li.textContent=feature;list.append(li);}
   if(hasNineThemes){const li=document.createElement('li');li.textContent=nineThemeFeatureLabels[locale]||nineThemeFeatureLabels.en;list.append(li);}
   body.append(list);
  }
  const link=dialog.querySelector('.dialog-original');link.href=href;link.textContent=(['fun-lo-fi-pack','fun-dither','fun-volume-shaper','fun-fader','fun-dc-filter','fun-dimension-expander','fun-monofilter','fun-analysis-pack','fun-stereo-pack','fun-pair','fun-utility-pack','fun-test-tone','basic-filter-pack'].includes(card.dataset.productKey)?({ja:'リリースページ',en:'Release page',de:'Release-Seite',fr:'Page de version',ru:'Страница выпуска'}[locale]||'Release page'):words[2])+' →';
  dialog.showModal();
 });
}
