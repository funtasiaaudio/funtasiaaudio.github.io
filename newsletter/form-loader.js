/* FUNtasia Audio: no Brevo API key or subscriber information is handled by this site.
   Replace each locale's data-form-url with its public Brevo iframe URL after DOI is tested. */
(function(){
  "use strict";
  var container=document.querySelector("[data-brevo-embed]");
  if(!container)return;
  var raw=(container.getAttribute("data-form-url")||"").trim();
  if(!raw)return; // Keep the honest "registration not yet open" fallback.
  var url;
  try{url=new URL(raw)}catch(e){return}
  var host=url.hostname.toLowerCase();
  if(url.protocol!=="https:"||!(host==="sibforms.com"||host.endsWith(".sibforms.com"))||!url.pathname.startsWith("/serve/"))return;
  var lang=document.documentElement.lang==="ja"?"ja":"en";
  var iframe=document.createElement("iframe");
  iframe.className="brevo-frame";
  iframe.title=lang==="ja"?"FUNtasia Audio メール購読登録":"FUNtasia Audio newsletter subscription";
  iframe.src=url.href;
  iframe.loading="lazy";
  iframe.referrerPolicy="strict-origin-when-cross-origin";
  iframe.setAttribute("scrolling","yes");
  var fallback=container.querySelector(".pending");
  if(fallback)fallback.hidden=true;
  container.appendChild(iframe);
  var a=document.createElement("a");
  a.className="direct-link small";
  a.href=url.href;
  a.target="_blank";
  a.rel="noopener noreferrer";
  a.textContent=lang==="ja"?"フォームが表示されない場合はこちら":"Open the subscription form in a new tab";
  container.appendChild(a);
})();
