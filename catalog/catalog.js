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
'FUN Motion Pack':'modulation','FUN Modulation Pack':'modulation','FUN Lo-Fi Pack':'distortion','FUN Pair':'other','FUN Room':'reverb','FUN PreAmp':'distortion','FUN Clipper & Limiter Pack':'dynamics','FUN Dynamics Pack':'dynamics','FUN OTT':'dynamics','FUN Clip Distortion':'distortion','FUN WaveShaper':'distortion','FUN EQ':'eq','FUN MEQ':'eq','FUN Basic Filter Pack':'eq',
'FUN Developer Pack':'other','FUN Dimension Expander':'modulation','FUN Dither':'other','FUN Stereo Pack':'other','FUN Volume Shaper':'dynamics','FUN Fader':'other','FUN DC Filter':'eq','FUN Drum Pad':'drum','The Deep Roots':'synth','FUN Kick':'drum','FUN Sampler':'sampler','The Resonant Forge':'physical','The Hollow Winds':'physical'
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
const themeChoiceLabels={
 ja:'9種類のカラーテーマから、お好みの色を選べます。',
 en:'Choose your favorite from 9 color themes.',
 de:'Wähle deine Lieblingsfarbe aus 9 Farbthemen.',
 fr:'Choisissez votre couleur préférée parmi 9 thèmes de couleurs.',
 ru:'Выберите любимую цветовую тему из 9 вариантов.'
};
const themeChoiceText=themeChoiceLabels[localeFilter]||themeChoiceLabels.en;
const mediaNote=document.createElement('p');
mediaNote.className='media-note';
mediaNote.textContent=artworkText.note;
document.querySelector('.concept-note')?.after(mediaNote);
for(const card of cards){
 const productLink=card.querySelector(':scope > a');
 const image=productLink?.querySelector('img.shot');
 const actions=card.querySelector('.card-actions');
 if(!image||!actions)continue;
 const source=image.dataset.artworkSrc||image.getAttribute('src');
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
 // Leave the Free Collection unmarked; every other current catalog entry supports 9 themes.
 if(card.dataset.productKey!=='funtasia-free-collection'){
  const mark=document.createElement('img');
  mark.className='nine-color-theme-mark';
  mark.src='../assets/nine-color-theme-mark.svg';
  mark.alt='';
  mark.setAttribute('aria-hidden','true');
  mark.decoding='async';
  imageLink.append(mark);
  const themeNote=document.createElement('p');
  themeNote.className='theme-choice-note';
  themeNote.textContent=themeChoiceText;
  productLink.after(themeNote);
 }
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
 'FUN Analysis Pack':'https://note.com/hueliang_/n/n6132a91b81f9',
 'FUN Stereo Pack':'https://note.com/hueliang_/n/n28cf323b9c04',
 'FUN Dimension Expander':'https://note.com/hueliang_/n/nba13c974ee1b',
 'FUN DC Filter':'https://note.com/hueliang_/n/nc1c18e7a4778',
 'FUN Dither':'https://note.com/hueliang_/n/n83d6223f4433',
 'FUN Volume Shaper':'https://note.com/hueliang_/n/ne37c8caea459',
 'FUN Fader':'https://note.com/hueliang_/n/n16aec114f207',
 'FUN MonoFilter':'https://note.com/hueliang_/n/n8ad8faf0a5fc',
 'FUN Pair':'https://note.com/hueliang_/n/n827fcb586475',
 'FUN Rack FREE':'https://note.com/hueliang_/n/nd25e1ad15cff',
 'FUN Drum Pad':'https://note.com/hueliang_/n/n51639c5b5515',
 'FUN Room':'https://note.com/hueliang_/n/n481b51fe0ee0',
 'FUN PreAmp':'https://note.com/hueliang_/n/n34f61e322ab7',
 'FUN Clipper & Limiter Pack':'https://note.com/hueliang_/n/nab69771d8f29',
 'FUN Dynamics Pack':'https://note.com/hueliang_/n/ne7bc97157706',
 'FUN OTT':'https://note.com/hueliang_/n/n9c1439e5a4fb',
 'The Deep Roots':'https://note.com/hueliang_/n/n54dea131da1f',
 'FUN Clip Distortion':'https://note.com/hueliang_/n/n65f62314035a',
 'FUN WaveShaper':'https://note.com/hueliang_/n/na04f32e0e0b7',
 'FUN EQ':'https://note.com/hueliang_/n/n5480c0ff39e8',
 'FUN MEQ':'https://note.com/hueliang_/n/na80e32517859',
 'FUN Kick':'https://note.com/hueliang_/n/nc0ae64c3f062',
 'FUN Sampler':'https://note.com/hueliang_/n/nc87525a831ae',
 'The Resonant Forge':'https://note.com/hueliang_/n/n3e9bd940e046',
 'FUN Basic Filter Pack':'https://note.com/hueliang_/n/n1a37c585f102'
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
/* FUN Modulation Pack v1.0.0: three distinct Windows VST3 effects. */
details['fun-modulation-pack']={
 lead:'Three modulation effects, one cohesive collection.',
 paras:[
  'FUN Modulation Pack v1.0.0 brings together FUN Chorus, FUN Flanger, and FUN Phaser in a single free download for Windows x64 VST3 hosts.',
  'FUN Chorus provides organic modulation with adjustable voices, phase spread and stereo spread. FUN Flanger offers delay-based motion, feedback and stereo control. FUN Phaser provides frequency-swept phase effects with adjustable stages and feedback.',
  'Each plugin includes nine selectable interface color themes. The release archive includes five-language PDF user manuals.'
 ],
 features:['FUN CHORUS','FUN FLANGER','FUN PHASER','9 COLOR THEMES EACH','WINDOWS x64 VST3','FREE DOWNLOAD','PDF USER MANUALS']
};
const modulationPackTranslations={
 ja:{summary:'FUN Chorus・FUN Flanger・FUN Phaserの3種類を収録した無料のWindows VST3モジュレーションパック。3製品とも9カラーテーマに対応。',paras:['FUN Modulation Pack v1.0.0は、FUN Chorus、FUN Flanger、FUN Phaserをまとめた無料のWindows x64 VST3エフェクトパックです。','Chorusは有機的なモジュレーションとVoice／Phase Spread／Stereo Spread調整、Flangerはディレイの動きとFeedback／ステレオ制御、PhaserはStagesとFeedbackを備えた周波数スイープ型の位相効果を提供します。','3製品すべて9種類のGUIカラーテーマに対応。日本語・英語・ドイツ語・フランス語・ロシア語のPDFマニュアルを同梱しています。']},
 en:{summary:'Three free Windows VST3 effects: FUN Chorus, FUN Flanger, and FUN Phaser. Nine color themes in each plugin.'},
 de:{summary:'Drei kostenlose Windows-VST3-Effekte: FUN Chorus, FUN Flanger und FUN Phaser. Jeder bietet neun Farbthemen.',paras:['FUN Modulation Pack v1.0.0 vereint drei kostenlose VST3-Effekte für Windows x64 in einem Download: FUN Chorus, FUN Flanger und FUN Phaser.','FUN Chorus bietet organische Modulation mit Voices, Phase Spread und Stereo Spread. FUN Flanger ermöglicht Delay-Modulation mit Feedback und Stereo-Steuerung. FUN Phaser formt bewegte Phaseneffekte mit Stages und Feedback.','Alle drei Plug-ins bieten jeweils neun auswählbare GUI-Farbthemen. PDF-Handbücher liegen in fünf Sprachen bei.']},
 fr:{summary:'Trois effets VST3 gratuits pour Windows : FUN Chorus, FUN Flanger et FUN Phaser. Neuf thèmes de couleur pour chacun.',paras:['FUN Modulation Pack v1.0.0 réunit trois effets VST3 gratuits pour Windows x64 : FUN Chorus, FUN Flanger et FUN Phaser.','FUN Chorus propose une modulation organique avec réglage des voix et de la répartition de phase et stéréo. FUN Flanger apporte un mouvement de délai et des commandes de feedback et de stéréo. FUN Phaser offre un balayage de phase avec réglage des étages et du feedback.','Chaque plug-in dispose de neuf thèmes de couleur pour son interface. Des manuels PDF en cinq langues sont inclus.']},
 ru:{summary:'Три бесплатных VST3-эффекта для Windows: FUN Chorus, FUN Flanger и FUN Phaser. У каждого девять цветовых тем.',paras:['FUN Modulation Pack v1.0.0 включает три бесплатных VST3-эффекта для Windows x64: FUN Chorus, FUN Flanger и FUN Phaser.','FUN Chorus предлагает органическую модуляцию с настройками Voices, Phase Spread и Stereo Spread. FUN Flanger позволяет управлять задержкой, обратной связью и стерео. FUN Phaser создаёт движущиеся фазовые эффекты с настройкой числа каскадов и обратной связи.','Во всех трёх плагинах доступно по девять цветовых тем интерфейса. PDF-руководства прилагаются на пяти языках.']}
};
for(const [language,body] of Object.entries(modulationPackTranslations)){
 (localized[language]??={})['fun-modulation-pack']=body;
}

/* FUN Motion Pack v1.0.0 — two independently usable motion effects. */
details['fun-motion-pack']={
 lead:'Shape time. Move through stereo.',
 paras:[
  'FUN Motion Pack v1.0.0 includes FUN Tape Stop / Start and FUN Auto Pan, two free VST3 audio effects for Windows x64.',
  'FUN Tape Stop / Start creates tape-style slowdown and speed-up effects with adjustable stop/start times, transport curves, and Dry/Wet blending.',
  'FUN Auto Pan draws and plays stereo movement curves with DAW sync, phase and width controls, retriggering, pan slew and Dry/Wet mix. The two effects can be loaded independently.',
  'The downloadable ZIP contains five-language PDF documentation.'
 ],
 features:['FUN TAPE STOP / START','FUN AUTO PAN','TAPE SLOWDOWN / SPEED-UP','EDITABLE PAN CURVES','DAW SYNC','WINDOWS x64 VST3','FREE DOWNLOAD','PDF USER MANUALS']
};
const motionPackTranslations={
 ja:{paras:['FUN Motion Pack v1.0.0は、FUN Tape Stop / StartとFUN Auto Panの2製品を収録したWindows x64向け無料VST3エフェクトパックです。','FUN Tape Stop / Startは、停止・再始動時間や変化カーブを調整してテープ風の減速・加速効果を作れます。','FUN Auto Panは、編集可能なPan Curveによる左右の動きに、DAW同期、Phase・Width、Retrigger、Pan Slew、Mixなどの操作を組み合わせられます。両製品は独立して使用可能です。','日本語・英語・ドイツ語・フランス語・ロシア語のPDFマニュアルを同梱しています。']},
 en:{summary:'Two free Windows x64 VST3 motion effects: FUN Tape Stop / Start and FUN Auto Pan.'},
 de:{paras:['FUN Motion Pack v1.0.0 enthält zwei kostenlose VST3-Effekte für Windows x64: FUN Tape Stop / Start und FUN Auto Pan.','FUN Tape Stop / Start erzeugt bandähnliches Verlangsamen und Beschleunigen mit einstellbaren Zeiten und Kurven.','FUN Auto Pan ermöglicht Stereo-Bewegungen mit editierbarer Panoramakurve, DAW-Synchronisation, Phasen- und Breitenreglern sowie Retrigger und Pan Slew. Beide Plug-ins sind einzeln nutzbar.','PDF-Handbücher in fünf Sprachen sind im ZIP enthalten.']},
 fr:{paras:['FUN Motion Pack v1.0.0 rassemble deux effets VST3 gratuits pour Windows 64 bits : FUN Tape Stop / Start et FUN Auto Pan.','FUN Tape Stop / Start crée des ralentissements et des accélérations de bande avec durées et courbes réglables.','FUN Auto Pan crée des mouvements stéréo grâce à une courbe panoramique modifiable, la synchronisation DAW, les réglages de phase et de largeur, le redéclenchement et le Pan Slew. Les deux effets sont indépendants.','Des manuels PDF en cinq langues sont inclus dans le ZIP.']},
 ru:{paras:['FUN Motion Pack v1.0.0 включает два бесплатных эффекта VST3 для Windows x64: FUN Tape Stop / Start и FUN Auto Pan.','FUN Tape Stop / Start создаёт замедление и ускорение в стиле магнитной ленты с настраиваемыми длительностями и кривыми.','FUN Auto Pan позволяет рисовать кривые панорамирования и создавать стереодвижение с синхронизацией DAW, управлением фазой и шириной, повторным запуском и Pan Slew. Оба эффекта работают независимо.','PDF-руководства на пяти языках включены в ZIP.']}
};
for(const [language,body] of Object.entries(motionPackTranslations)){
 (localized[language]??={})['fun-motion-pack']=body;
}

/* Keep the selectable 9-colour GUI themes visible in details for these 16 releases. */
const nineThemeProductKeys=new Set([
 'fun-modulation-pack','fun-pair','fun-dc-filter','fun-dither','fun-monofilter',
 'fun-stereo-pack','fun-lo-fi-pack','fun-dimension-expander','fun-volume-shaper',
 'fun-analysis-pack',
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



/* FUNtasia Free Collection v1.0.8 — FUN Tape Stop + FUN Auto Pan added. */
details['funtasia-free-collection']={
 lead:'All free FUNtasia Audio plugins in one collection.',
 paras:[
  'FUNtasia Free Collection v1.0.8 brings free FUNtasia Audio effects, instruments, mixing tools and analyzers together in one Windows x64 VST3 download.',
  'NEW IN v1.0.8: FUN Tape Stop creates creative tape-style slowdowns, while FUN Auto Pan adds rhythmic stereo movement.',
  'Previously added in v1.0.6: FUN Tuner helps you check instrument tuning, and FUN De-Esser reduces harsh sibilance in vocal recordings. Both remain included.',
  'The previously added FUN Modulation Pack (FUN Chorus, FUN Flanger and FUN Phaser) remains included. Each of those three plugins offers nine GUI color themes. Other earlier additions, including The Hollow Winds, remain available.',
  'The collection and its plugins have separate version numbers. Extract the ZIP and install the VST3 files in your Windows VST3 folder.'
 ],
 features:['ALL FREE PLUGINS','NEW: FUN TAPE STOP / FUN AUTO PAN','FUN TUNER / FUN DE-ESSER','CHORUS / FLANGER / PHASER','WINDOWS x64 VST3','ONE COLLECTION DOWNLOAD']
};
const freeCollectionTranslations={
 ja:[
  'FUNtasia Free Collection v1.0.8は、FUNtasia Audioの無料エフェクト、音源、ミキシングツール、解析ツールをひとつにまとめたWindows x64 VST3コレクションです。',
  'v1.0.8ではFUN Tape StopとFUN Auto Panを追加。FUN Tape Stopはテープ風の減速エフェクト、FUN Auto Panはリズミカルなステレオの動きを作れます。',
  'v1.0.6で追加されたFUN TunerとFUN De-Esserも引き続き収録。FUN Tunerは楽器のチューニング確認に、FUN De-Esserはボーカルの耳につく歯擦音の抑制に使えます。',
  '以前追加されたFUN Modulation Pack（FUN Chorus・FUN Flanger・FUN Phaser）も引き続き収録しています。この3製品はそれぞれ9種類のGUIカラーテーマに対応。The Hollow Windsを含む従来のプラグインも利用できます。',
  'コレクションと各プラグインのバージョン番号は独立しています。ZIPを展開し、VST3ファイルをWindowsのVST3フォルダーへ配置してください。'
 ],
 de:[
  'FUNtasia Free Collection v1.0.8 bündelt kostenlose Effekte, Instrumente, Mixing-Tools und Analyse-Plug-ins von FUNtasia Audio in einem Download für Windows x64 VST3.',
  'NEU IN v1.0.8: FUN Tape Stop erzeugt kreative Bandstopp-Verlangsamungen, während FUN Auto Pan rhythmische Stereobewegungen ermöglicht.',
  'Die in v1.0.6 hinzugefügten Plug-ins FUN Tuner und FUN De-Esser bleiben enthalten. FUN Tuner prüft die Stimmung von Instrumenten; FUN De-Esser reduziert scharfe Zischlaute in Gesangsaufnahmen.',
  'Das bereits hinzugefügte FUN Modulation Pack mit FUN Chorus, FUN Flanger und FUN Phaser bleibt enthalten. Diese drei Plug-ins bieten jeweils neun GUI-Farbthemen. Frühere Ergänzungen wie The Hollow Winds bleiben ebenfalls dabei.',
  'Die Sammlung und die einzelnen Plug-ins haben separate Versionsnummern. Entpacken Sie die ZIP-Datei und kopieren Sie die VST3-Dateien in den Windows-VST3-Ordner.'
 ],
 fr:[
  'FUNtasia Free Collection v1.0.8 réunit les effets, instruments, outils de mixage et analyseurs gratuits de FUNtasia Audio dans une archive VST3 pour Windows x64.',
  'NOUVEAU EN v1.0.8 : FUN Tape Stop crée des ralentissements façon arrêt de bande, tandis que FUN Auto Pan apporte des mouvements stéréo rythmiques.',
  'FUN Tuner et FUN De-Esser, ajoutés dans la v1.0.6, restent inclus. FUN Tuner permet de vérifier l’accordage des instruments et FUN De-Esser aide à atténuer les sifflantes trop marquées dans les voix.',
  'FUN Modulation Pack, avec FUN Chorus, FUN Flanger et FUN Phaser, reste inclus. Ces trois plug-ins proposent chacun neuf thèmes de couleur pour leur interface. Les ajouts précédents, dont The Hollow Winds, sont également conservés.',
  'La collection et chaque plug-in ont leurs propres numéros de version. Extrayez le ZIP et copiez les fichiers VST3 dans le dossier VST3 de Windows.'
 ],
 ru:[
  'FUNtasia Free Collection v1.0.8 объединяет бесплатные эффекты, инструменты, средства сведения и анализа FUNtasia Audio в один пакет VST3 для Windows x64.',
  'НОВОЕ В v1.0.8: FUN Tape Stop создаёт эффект замедления магнитной ленты, а FUN Auto Pan добавляет ритмичное движение звука в стереополе.',
  'Добавленные в v1.0.6 плагины FUN Tuner и FUN De-Esser по-прежнему входят в набор. FUN Tuner помогает проверить настройку инструментов, а FUN De-Esser уменьшает резкие свистящие звуки в записи вокала.',
  'Ранее добавленный FUN Modulation Pack с FUN Chorus, FUN Flanger и FUN Phaser остаётся в наборе. Каждый из этих трёх плагинов поддерживает девять цветовых тем интерфейса. Другие прежние дополнения, включая The Hollow Winds, также сохранены.',
  'У коллекции и отдельных плагинов собственные номера версий. Распакуйте ZIP и скопируйте файлы VST3 в системную папку VST3 Windows.'
 ]
};
for(const [language,paras] of Object.entries(freeCollectionTranslations)){
 (localized[language]??={})['funtasia-free-collection']={paras};
}

/* FUN Developer Pack v1.0.0 — FUN Test Tone + FUN Test EQ. */
details['fun-developer-pack']={
 lead:'Two free tools for testing audio and digital EQ behaviour.',
 paras:[
  'FUN Developer Pack v1.0.0 combines two Windows 64-bit VST3 plugins: FUN Test Tone v1.1.0 and FUN Test EQ v1.0.0.',
  'FUN Test Tone generates sine, square and saw waves, white/pink noise, and a 20 Hz–20 kHz sweep for checking signal paths, levels and audio processing. Start with a low monitor volume when using test signals.',
  'FUN Test EQ is a six-band digital equalizer without de-cramping compensation. It deliberately retains the high-frequency clamping associated with conventional bilinear-transform EQ designs, making it a useful reference for comparisons with FUN EQ.',
  'Both plugins have their own controls and are installed separately from the same pack. The download includes PDF manuals in Japanese, English, German, French and Russian.'
 ],
 features:[
  'FUN TEST TONE v1.1.0',
  'FUN TEST EQ v1.0.0',
  'FREE WINDOWS x64 VST3',
  'SINE / SQUARE / SAW',
  'WHITE / PINK NOISE',
  '20 Hz–20 kHz SWEEP',
  '6-BAND UNCOMPENSATED DIGITAL EQ',
  'FIVE-LANGUAGE PDF MANUALS'
 ]
};
const developerPackTranslations={
 ja:[
  'FUN Developer Pack v1.0.0は、Windows 64-bit向けの無料VST3ツールを2つ収録しています。FUN Test Tone v1.1.0とFUN Test EQ v1.0.0を、ひとつのZIPから個別にインストールできます。',
  'FUN Test Toneは、Sine・Square・Saw、White／Pink Noise、20 Hz〜20 kHzのスイープ信号を生成します。信号経路やレベル、DSPの挙動を確認するためのツールです。再生前にモニター音量を下げてください。',
  'FUN Test EQは、デクランピング補正を行わない6バンドデジタルEQです。高域のクランピングをあえて残し、FUN EQなどとの周波数応答比較に使えます。',
  '日本語・英語・ドイツ語・フランス語・ロシア語のPDFマニュアルを同梱しています。'
 ],
 en:[
  'FUN Developer Pack v1.0.0 includes two free Windows 64-bit VST3 plugins: FUN Test Tone v1.1.0 and FUN Test EQ v1.0.0. Install them individually from the same ZIP.',
  'FUN Test Tone provides sine, square and saw waves, white/pink noise, and a 20 Hz–20 kHz sweep to check signal paths, levels and DSP behaviour. Lower your monitor volume before using test signals.',
  'FUN Test EQ is a six-band digital EQ without de-cramping compensation. Its deliberate high-frequency clamping makes it a useful comparison reference alongside FUN EQ.',
  'PDF manuals are included in Japanese, English, German, French and Russian.'
 ],
 de:[
  'FUN Developer Pack v1.0.0 enthält zwei kostenlose VST3-Plug-ins für Windows 64-Bit: FUN Test Tone v1.1.0 und FUN Test EQ v1.0.0. Beide lassen sich aus demselben ZIP separat installieren.',
  'FUN Test Tone erzeugt Sinus-, Rechteck- und Sägezahnwellen, weißes und rosa Rauschen sowie einen Sweep von 20 Hz bis 20 kHz. Damit lassen sich Signalwege, Pegel und DSP-Verhalten prüfen. Vor dem Test die Abhörlautstärke reduzieren.',
  'FUN Test EQ ist ein digitaler Sechsband-EQ ohne De-Cramping-Kompensation. Das bewusst beibehaltene Clamping im Hochtonbereich ermöglicht Vergleiche mit FUN EQ.',
  'PDF-Handbücher liegen auf Japanisch, Englisch, Deutsch, Französisch und Russisch bei.'
 ],
 fr:[
  'FUN Developer Pack v1.0.0 regroupe deux plug-ins VST3 gratuits pour Windows 64 bits : FUN Test Tone v1.1.0 et FUN Test EQ v1.0.0. Ils s’installent séparément depuis la même archive ZIP.',
  'FUN Test Tone génère des signaux sinusoïdaux, carrés et en dents de scie, du bruit blanc ou rose et un balayage de 20 Hz à 20 kHz pour vérifier les trajets audio, les niveaux et les traitements DSP. Baissez le volume d’écoute avant les tests.',
  'FUN Test EQ est un égaliseur numérique à six bandes sans correction de de-cramping. Il conserve volontairement le clamping dans les hautes fréquences afin de comparer sa réponse à celle de FUN EQ.',
  'Des manuels PDF sont inclus en japonais, anglais, allemand, français et russe.'
 ],
 ru:[
  'FUN Developer Pack v1.0.0 содержит два бесплатных VST3-плагина для Windows 64-bit: FUN Test Tone v1.1.0 и FUN Test EQ v1.0.0. Их можно установить отдельно из одного ZIP-архива.',
  'FUN Test Tone генерирует синусоидальный, прямоугольный и пилообразный сигналы, белый и розовый шум, а также свип от 20 Гц до 20 кГц. Это помогает проверять маршрутизацию, уровни и работу DSP. Перед тестом уменьшите громкость мониторов.',
  'FUN Test EQ — шестиполосный цифровой эквалайзер без de-cramping-коррекции. Он намеренно сохраняет сужение полосы на высоких частотах для сравнения с FUN EQ.',
  'PDF-руководства включены на японском, английском, немецком, французском и русском языках.'
 ]
};
for(const [lang,paras] of Object.entries(developerPackTranslations)){
 if(!localized[lang])localized[lang]={};
 localized[lang]['fun-developer-pack']={paras};
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
  'FUN Fader is a free VST3 volume-control utility for Windows, with a slim, resizable interface and a single precise gain fader. Version 1.1.0 adds the Classic style plus nine additional coordinated colour styles.',
  'It supports mono and stereo audio, DAW automation, and host project state saving and restoration. The Classic design features a wooden fader, deep green scenery and Kaisei Opti typography. Manually selected GUI styles become the user default for new instances; saved DAW projects restore their own styles.',
  'Version 1.1.0 passed pluginval Strictness Level 10 and all 537 Steinberg VST3 Validator extensive tests. Automated tests do not guarantee compatibility with every DAW.'
 ],
 features:['FREE WINDOWS VST3','MONO / STEREO','VOLUME FADER','DAW AUTOMATION','10 GUI STYLES','PROJECT STYLE RESTORE']
};
const faderTranslations={
 ja:{paras:[
  'FUN Faderは、ゴシック調のGUIを備えたWindows用の無料VST3音量フェーダーです。木製フェーダーをドラッグして音量を調整でき、GUIサイズも変更できます。',
  'モノラル／ステレオ音声、DAWオートメーション、プロジェクトへの設定保存・復元に対応。深緑の情景とKaisei Optiの文字を組み合わせたClassicに加え、9種類のカラーテーマを選択できます。手動選択したStyleは新しいインスタンスの初期表示に使われ、保存済みDAWプロジェクトのテーマは個別に復元されます。',
  'v1.1.0はpluginval Strictness Level 10とSteinberg VST3 Validatorの全537項目に合格しました。ただし、すべてのDAWでの動作を保証するものではありません。'
 ]},
 de:{paras:[
  'FUN Fader ist ein kostenloses VST3-Werkzeug für Windows zur Lautstärkeregelung. Die skalierbare Oberfläche kombiniert einen hölzernen Fader mit einer gotisch inspirierten Gestaltung. Neben Classic stehen neun weitere Farbthemen zur Auswahl.',
  'Unterstützt Mono und Stereo, DAW-Automation sowie das Speichern und Wiederherstellen des Plugin-Zustands im Projekt. Die Typografie verwendet Kaisei Opti.',
  'Version 1.1.0 bestand pluginval auf Strictness Level 10 und alle 537 erweiterten Tests des Steinberg VST3 Validators. Eine Kompatibilität mit jeder DAW kann damit nicht garantiert werden.'
 ]},
 fr:{paras:[
  'FUN Fader est un outil VST3 gratuit pour Windows permettant un réglage précis du volume, avec une interface redimensionnable d’inspiration gothique et un curseur en bois.',
  'Il prend en charge les pistes mono et stéréo, l’automatisation dans le DAW et la sauvegarde ainsi que la restauration de l’état du plugin. La typographie est en Kaisei Opti. La version 1.1.0 propose le style Classic et neuf autres thèmes de couleur.',
  'La version 1.1.0 a réussi pluginval au niveau de rigueur 10 et les 537 tests approfondis du validateur VST3 de Steinberg. Cela ne garantit pas la compatibilité avec tous les DAW.'
 ]},
 ru:{paras:[
  'FUN Fader — бесплатный VST3-плагин для Windows с точным управлением громкостью, изменяемым размером интерфейса и готическим оформлением с деревянным фейдером.',
  'Поддерживаются моно и стерео, автоматизация DAW, сохранение и восстановление состояния плагина в проекте. Используется шрифт Kaisei Opti. Версия 1.1.0 включает стиль Classic и ещё девять цветовых тем.',
  'Версия 1.1.0 прошла pluginval Strictness Level 10 и все 537 расширенных тестов Steinberg VST3 Validator. Это не гарантирует совместимость со всеми DAW.'
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
/* The Hollow Winds v1.0.0 — five-language product details. */
details['the-hollow-winds']={
 lead:'Shape a wind instrument from breath to resonance.',
 paras:[
  'The Hollow Winds is a free physical-modeling VST3 wind instrument for Windows. Choose from Transverse, Fipple, End-Blown, Vessel, and Custom models, then shape the sound with breath and body controls.',
  'Play with Manual breath input, MIDI CC2, Channel Pressure, or Poly Aftertouch. Adjust Pressure, Air Noise, Embouchure, attack response, resonance, vibrato, and six Tone Holes. Dimo and other model-specific controls offer further ways to shape the tone.',
  'The preset browser lets you save and recall your own sounds. Nine selectable GUI themes and a scalable interface let you adapt the instrument to your workspace.'
 ],
 features:[
  '5 WIND MODELS',
  'MANUAL / CC2 / CHANNEL PRESSURE / POLY AFTERTOUCH',
  'BREATH & BODY CONTROLS',
  'ATTACK, VIBRATO & PERFORMANCE',
  '6 TONE HOLES & DIMO',
  'USER PRESET BROWSER',
  'SCALABLE GUI',
  'WINDOWS 64-BIT VST3'
 ]
};
nineThemeProductKeys.add('the-hollow-winds');
const hollowWindsTranslations={
 ja:[
  'The Hollow Windsは、5種類の音響モデルを搭載したWindows用の無料VST3管楽器音源です。TRANSVERSE、FIPPLE、END-BLOWN、VESSEL、CUSTOMを切り替え、息の流れや管体の響きを調整して音色を作れます。',
  '息の制御はMANUAL、MIDI CC2、Channel Pressure、Poly Aftertouchから選択可能。PRESSURE、AIR NOISE、EMBOUCHURE、アタック、共鳴、ビブラート、6つのTONE HOLESなどを調整できます。DIMOやモデル専用の操作も備えています。',
  'プリセットブラウザで自作音色を保存・呼び出しできます。9種類のGUIテーマと画面倍率の変更にも対応しています。'
 ],
 de:[
  'The Hollow Winds ist ein kostenloses VST3-Blasinstrument mit Physical Modeling für Windows. Die fünf Modelle Transverse, Fipple, End-Blown, Vessel und Custom lassen sich über Atem- und Korpusparameter formen.',
  'Die Atemsteuerung erfolgt manuell, über MIDI CC2, Channel Pressure oder Poly Aftertouch. Einstellbar sind unter anderem Druck, Luftgeräusch, Ansatz, Anschlagverhalten, Resonanz, Vibrato und sechs Tonlöcher. Dimo und modellspezifische Regler erweitern die Klanggestaltung.',
  'Im Preset-Browser kannst du eigene Klänge speichern und wieder aufrufen. Neun wählbare GUI-Farbthemen und eine skalierbare Oberfläche passen sich deinem Arbeitsplatz an.'
 ],
 fr:[
  'The Hollow Winds est un instrument à vent VST3 gratuit pour Windows fondé sur la modélisation physique. Cinq modèles — Transverse, Fipple, End-Blown, Vessel et Custom — permettent de façonner le son grâce aux réglages de souffle et de corps.',
  'Le souffle se contrôle manuellement, par MIDI CC2, Channel Pressure ou Poly Aftertouch. Réglez la pression, le bruit d’air, l’embouchure, l’attaque, la résonance, le vibrato et six trous de jeu. Dimo et les commandes propres à chaque modèle offrent davantage de possibilités.',
  'Le navigateur de presets permet d’enregistrer et de rappeler vos sons. Neuf thèmes de couleur et une interface redimensionnable complètent l’instrument.'
 ],
 ru:[
  'The Hollow Winds — бесплатный VST3-инструмент для Windows с физическим моделированием духовых звуков. Пять моделей — Transverse, Fipple, End-Blown, Vessel и Custom — позволяют настраивать характер звука с помощью параметров дыхания и резонанса корпуса.',
  'Потоком воздуха можно управлять вручную, через MIDI CC2, Channel Pressure или Poly Aftertouch. Доступны давление, шум воздуха, амбушюр, атака, резонанс, вибрато и шесть игровых отверстий Tone Holes. Параметр Dimo и настройки отдельных моделей расширяют возможности звучания.',
  'Браузер пресетов позволяет сохранять и загружать собственные тембры. Доступны девять цветовых тем оформления и масштабирование интерфейса.'
 ]
};
for(const [language,paras] of Object.entries(hollowWindsTranslations)){
 (localized[language]??={})['the-hollow-winds']={paras};
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
 // The original product title link is marked earlier by the artwork setup.
 // Do not use the first anchor: the artwork link is inserted before it.
 const href=card.querySelector(':scope > a.card-title-link[href]')?.href
  || card.querySelector(':scope > a[href]:not(.card-image-link)')?.href;
 if(!href)continue;
 // Prefer the explicit stable product key, then an existing landing-page
 // fragment, then a normalized product name for GitHub release cards.
 const key=card.dataset.productKey
  || href.split('#')[1]
  || (card.dataset.productName||'').toLowerCase().replace(/\s+free$/i,'').trim().replace(/\s+/g,'-');
 const item=details[key];
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
   const tunerAddedLabel={ja:'v1.2.0 新規追加：FUN Tuner v1.1.2',en:'NEW IN v1.2.0: FUN Tuner v1.1.2',de:'NEU IN v1.2.0: FUN Tuner v1.1.2',fr:'NOUVEAUTÉ v1.2.0 : FUN Tuner v1.1.2',ru:'НОВИНКА В v1.2.0: FUN Tuner v1.1.2'};
  for(const feature of featureList){
    const li=document.createElement('li');
    li.textContent=key==='fun-analysis-pack'&&feature==='NEW: FUN TUNER v1.1.2' ? (tunerAddedLabel[locale]||tunerAddedLabel.en) : feature;
    list.append(li);
  }
   if(hasNineThemes){const li=document.createElement('li');li.textContent=nineThemeFeatureLabels[locale]||nineThemeFeatureLabels.en;list.append(li);}
   body.append(list);
  }
  const link=dialog.querySelector('.dialog-original');link.href=href;link.textContent=(href.includes('github.com/funtasiaaudio/')&&href.includes('/releases/')?({ja:'リリースページ',en:'Release page',de:'Release-Seite',fr:'Page de version',ru:'Страница выпуска'}[locale]||'Release page'):words[2])+' →';
  dialog.showModal();
 });
}
