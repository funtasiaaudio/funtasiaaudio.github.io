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
'FUN Room':'reverb','FUN PreAmp':'distortion','FUN Clipper & Limiter Pack':'dynamics','FUN Dynamics Pack':'dynamics','FUN OTT':'dynamics','FUN Clip Distortion':'distortion','FUN WaveShaper':'distortion','FUN EQ':'eq','FUN MEQ':'eq','FUN Basic Filter Pack':'eq',
'FUN Dimension Expander':'modulation','FUN Dither':'other','FUN Volume Shaper':'dynamics','FUN DC Filter':'eq','FUN Drum Pad':'drum','The Deep Roots':'synth','FUN Kick':'drum','FUN Sampler':'sampler','FUN Strike':'physical'
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
details['fun-volume-shaper']={
 lead:'Draw the volume. Shape the groove.',
 paras:[
  'FUN Volume Shaper is a free single-band stereo volume-shaping effect for Windows VST3. Draw a smooth gain curve directly in the editor to create rhythmic ducking, gates, fades and custom volume movements.',
  'Choose DAW sync, MIDI-note or audio triggering. The curve editor supports nodes, curved segments, snap-to-grid, horizontal and vertical flips, copy/paste, undo/redo, Depth and Time Shift. Internal and external sidechain sources are available.',
  'Save your own curves as user presets and recall them across projects. The v1.0.0 release passed pluginval Strictness Level 10 and 537 of 537 Steinberg VST3 Validator tests; these checks do not guarantee compatibility with every DAW.'
 ],
 features:['SINGLE-BAND STEREO','EDITABLE CURVE','SYNC / MIDI / AUDIO TRIGGER','INTERNAL / EXTERNAL SIDECHAIN','USER PRESETS','WINDOWS VST3','FIVE-LANGUAGE PDF MANUALS']
};
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
 const href=card.querySelector('a[href*="funtasia-audio/#"]')?.href || card.querySelector('a[href*="github.com/funtasiaaudio/FUN-Dither/releases/"]')?.href || card.querySelector('a[href*="github.com/funtasiaaudio/FUN-Volume-Shaper/releases/"]')?.href || card.querySelector('a[href*="github.com/funtasiaaudio/FUN-DC-Filter/releases/"]')?.href || card.querySelector('a[href*="github.com/funtasiaaudio/FUN-Dimension-Expander/releases/"]')?.href || card.querySelector('a[href*="github.com/funtasiaaudio/FUN-MonoFilter/releases/tag/"]')?.href || card.querySelector('a[href*="github.com/funtasiaaudio/FUN-Analysis-Pack/releases/"]')?.href;
 if(!href)continue;
 const key=card.dataset.productKey||href.split('#')[1],item=details[key];
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
  if(item.features.length){const list=document.createElement('ul');list.className='dialog-features';for(const feature of item.features){const li=document.createElement('li');li.textContent=feature;list.append(li);}body.append(list);}
  const link=dialog.querySelector('.dialog-original');link.href=href;link.textContent=(['fun-dither','fun-volume-shaper','fun-dc-filter','fun-dimension-expander','fun-monofilter','fun-analysis-pack'].includes(card.dataset.productKey)?({ja:'リリースページ',en:'Release page',de:'Release-Seite',fr:'Page de version',ru:'Страница выпуска'}[locale]||'Release page'):words[2])+' →';
  dialog.showModal();
 });
}
