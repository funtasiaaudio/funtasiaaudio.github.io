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
'FUN Dimension Expander':'modulation','FUN Dither':'other','FUN Drum Pad':'drum','The Deep Roots':'synth','FUN Kick':'drum','FUN Sampler':'sampler','FUN Strike':'physical'
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
 const href=card.querySelector('a[href*="funtasia-audio/#"]')?.href || card.querySelector('a[href*="github.com/funtasiaaudio/FUN-Dither/releases/"]')?.href || card.querySelector('a[href*="github.com/funtasiaaudio/FUN-Dimension-Expander/releases/"]')?.href || card.querySelector('a[href*="github.com/funtasiaaudio/FUN-MonoFilter/releases/tag/"]')?.href;
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
  const link=dialog.querySelector('.dialog-original');link.href=href;link.textContent=(['fun-dither','fun-dimension-expander','fun-monofilter'].includes(card.dataset.productKey)?({ja:'リリースページ',en:'Release page',de:'Release-Seite',fr:'Page de version',ru:'Страница выпуска'}[locale]||'Release page'):words[2])+' →';
  dialog.showModal();
 });
}
