/* About Hʉeliang — Japanese-first content translated to the site's five languages.
 * Keep the real Japanese copy in HTML, including when JavaScript is unavailable.
 * Respect the shared site language selection; URL ?lang= takes precedence.
 */
(() => {
  'use strict';
  const languages = ['ja', 'en', 'de', 'fr', 'ru'];
  const storeKey = 'funtasia.home.language';
  const rows = [
  [
    "← 総合トップへ",
    "← Back to home",
    "← Zur Startseite",
    "← Retour à l’accueil",
    "← На главную"
  ],
  [
    "音楽とソフトウェア、その両方を創る。",
    "Making music and software.",
    "Musik und Software entwickeln.",
    "Créer de la musique et des logiciels.",
    "Создаю музыку и программы."
  ],
  [
    "作曲家・音楽プロデューサー Hʉeliangのプロフィールと、FUNtasiaが大切にしている創作への思いをご紹介します。",
    "Meet Hʉeliang, composer and music producer, and learn what drives FUNtasia.",
    "Lerne Hʉeliang kennen – Komponist und Musikproduzent – und erfahre, was hinter FUNtasia steckt.",
    "Découvrez Hʉeliang, compositeur et producteur de musique, ainsi que les idées qui animent FUNtasia.",
    "Знакомьтесь: Hʉeliang, композитор и музыкальный продюсер. Здесь я рассказываю о себе и о том, что важно для FUNtasia."
  ],
  [
    "FUNtasiaについて",
    "About FUNtasia",
    "Über FUNtasia",
    "À propos de FUNtasia",
    "О FUNtasia"
  ],
  [
    "FUNtasiaは、音楽制作・オーディオソフトウェア・クリエイティブな活動をつなぐプロジェクトです。各分野の情報をこの総合サイトからたどれます。",
    "FUNtasia brings together music, audio software and creative projects. You can explore each part of it from this site.",
    "FUNtasia verbindet Musikproduktion, Audiosoftware und kreative Projekte. Auf dieser Website findest du alle Bereiche.",
    "FUNtasia réunit musique, logiciels audio et projets créatifs. Ce site permet de découvrir chacun de ces domaines.",
    "FUNtasia объединяет музыку, аудиопрограммы и творческие проекты. На этом сайте можно узнать о каждом направлении."
  ],
  [
    "音楽制作に使えるオーディオプラグイン。",
    "Audio plugins for music production.",
    "Audio-Plug-ins für die Musikproduktion.",
    "Des plug-ins audio pour la production musicale.",
    "Аудиоплагины для создания музыки."
  ],
  [
    "製品カタログを見る →",
    "Browse the plugin catalog →",
    "Zum Plug-in-Katalog →",
    "Voir le catalogue de plug-ins →",
    "Каталог плагинов →"
  ],
  [
    "DAWの開発プロジェクト。",
    "A DAW development project.",
    "Ein DAW-Entwicklungsprojekt.",
    "Un projet de développement de station audionumérique (DAW).",
    "Проект разработки цифровой звуковой рабочей станции (DAW)."
  ],
  [
    "Studioを見る →",
    "Explore Studio →",
    "Studio ansehen →",
    "Découvrir Studio →",
    "О Studio →"
  ],
  [
    "Windowsでの制作を支えるツール。",
    "Tools for creative work on Windows.",
    "Werkzeuge für kreative Arbeit unter Windows.",
    "Des outils pour créer sous Windows.",
    "Инструменты для творчества в Windows."
  ],
  [
    "Utilitiesを見る →",
    "Explore Utilities →",
    "Utilities ansehen →",
    "Découvrir Utilities →",
    "О Utilities →"
  ],
  [
    "音楽とクリエイターの活動。",
    "Music and the people who make it.",
    "Musik und die Menschen dahinter.",
    "La musique et celles et ceux qui la créent.",
    "Музыка и творчество артистов."
  ],
  [
    "Recordsを見る →",
    "Explore Records →",
    "Records ansehen →",
    "Découvrir Records →",
    "О Records →"
  ],
  [
    "作曲家 / 音楽プロデューサー",
    "Composer / Music Producer",
    "Komponist / Musikproduzent",
    "Compositeur / Producteur de musique",
    "Композитор / Музыкальный продюсер"
  ],
  [
    "1996年3月28日、東京都生まれ。洗足学園音楽大学卒業。",
    "I was born in Tokyo on March 28, 1996, and graduated from Senzoku Gakuen College of Music.",
    "Ich wurde am 28. März 1996 in Tokio geboren und habe mein Studium am Senzoku Gakuen College of Music abgeschlossen.",
    "Je suis né à Tokyo le 28 mars 1996 et j’ai étudié au Senzoku Gakuen College of Music.",
    "Я родился 28 марта 1996 года в Токио и окончил музыкальный колледж Senzoku Gakuen."
  ],
  [
    "3歳からピアノを始め、16歳から作曲をしています。",
    "I started playing piano at three and composing at sixteen.",
    "Mit drei Jahren begann ich Klavier zu spielen, mit sechzehn zu komponieren.",
    "J’ai commencé le piano à trois ans et la composition à seize ans.",
    "Я начал играть на фортепиано в три года, а сочинять музыку — в шестнадцать."
  ],
  [
    "好きな音楽は、ボカロ、ヴィジュアル系、EDM、Hardstyle、Epic Metal、ネオ中世音楽など。ジャンルの違う音楽を組み合わせたり、思いついた音を形にしたりするのが好きです。",
    "I like Vocaloid music, visual kei, EDM, hardstyle, epic metal and neo-medieval music. I enjoy mixing genres and turning sounds I imagine into something real.",
    "Ich mag Vocaloid-Musik, Visual Kei, EDM, Hardstyle, Epic Metal und neo-mittelalterliche Musik. Besonders gern verbinde ich verschiedene Genres und setze Klangideen in die Tat um.",
    "J’aime la musique Vocaloid, le visual kei, l’EDM, le hardstyle, l’epic metal et la musique néo-médiévale. J’aime mélanger les genres et donner forme aux sons que j’imagine.",
    "Мне нравятся Vocaloid, visual kei, EDM, hardstyle, epic metal и неосредневековая музыка. Люблю смешивать жанры и воплощать звуки, которые представляю."
  ],
  [
    "音楽制作に使うソフトウェアやプラグインの制作にも取り組んでいます。",
    "I also develop music software and audio plugins.",
    "Außerdem entwickle ich Musiksoftware und Audio-Plug-ins.",
    "Je développe aussi des logiciels de musique et des plug-ins audio.",
    "Я также разрабатываю музыкальные программы и аудиоплагины."
  ],
  [
    "FUNtasiaを通して実現したいのは、経済状況や障害の有無に関係なく、誰もが気軽に創作を楽しめる環境です。",
    "With FUNtasia, I want to make it easier for anyone to enjoy creating, regardless of their financial situation or disability.",
    "Mit FUNtasia möchte ich einen Raum schaffen, in dem alle Menschen unabhängig von ihrer finanziellen Situation oder einer Behinderung Freude am kreativen Schaffen haben können.",
    "Avec FUNtasia, je veux que chacun puisse créer librement, quelles que soient ses ressources financières ou une éventuelle situation de handicap.",
    "Я хочу, чтобы с FUNtasia каждый мог заниматься творчеством независимо от финансовых возможностей и наличия инвалидности."
  ],
  [
    "音楽もソフトウェアも、必ずしも大勢の人に届かなくていいと思っています。",
    "I don't think my music or software needs to reach a huge audience.",
    "Meine Musik und Software müssen nicht unbedingt ein großes Publikum erreichen.",
    "Je ne cherche pas forcément à toucher un très large public avec ma musique ou mes logiciels.",
    "Я не считаю, что моя музыка или программы обязательно должны охватить огромную аудиторию."
  ],
  [
    "たくさんの人に少しずつ届くより、誰か一人にでも深く刺さるものを作れたら嬉しい。",
    "I'd rather make something that means a lot to even one person than something that only touches many people briefly.",
    "Lieber möchte ich etwas schaffen, das auch nur einen Menschen wirklich berührt, als etwas, das viele nur flüchtig erreicht.",
    "Je préfère créer quelque chose qui touche profondément ne serait-ce qu’une personne, plutôt que d’effleurer beaucoup de monde.",
    "Мне приятнее создать что-то, что по-настоящему тронет хотя бы одного человека, чем лишь мельком затронет многих."
  ],
  [
    "そんな気持ちで、日々いろいろなものを作っています。",
    "That's the thought behind the things I make every day.",
    "Mit diesem Gedanken arbeite ich jeden Tag an neuen Dingen.",
    "C’est dans cet esprit que je crée chaque jour.",
    "С этой мыслью я каждый день создаю что-то новое."
  ],
  [
    "音楽が好きな人も、ソフトウェアが好きな人も、何かを作ってみたい人も、気軽にFUNtasiaの世界を覗いてみてください。",
    "If you like music, software or making things yourself, feel free to explore FUNtasia.",
    "Wenn du Musik oder Software magst oder selbst etwas erschaffen möchtest, schau dich gern bei FUNtasia um.",
    "Si vous aimez la musique, les logiciels ou simplement créer, n’hésitez pas à découvrir FUNtasia.",
    "Если вам близки музыка, программы или само творчество, загляните в мир FUNtasia."
  ],
  [
    "Creative workspace",
    "Creative workspace",
    "Kreativer Arbeitsplatz",
    "Espace de création",
    "Творческая студия"
  ],
  [
    "GEAR & SETUP",
    "GEAR & SETUP",
    "EQUIPMENT & SETUP",
    "MATÉRIEL & CONFIGURATION",
    "ОБОРУДОВАНИЕ И СТУДИЯ"
  ],
  [
    "STUDIO SETUP",
    "STUDIO SETUP",
    "STUDIO-AUSSTATTUNG",
    "INSTALLATION DU STUDIO",
    "ОБОРУДОВАНИЕ СТУДИИ"
  ],
  [
    "Keyboard",
    "Keyboard",
    "Keyboard",
    "Clavier",
    "Клавишный инструмент"
  ],
  [
    "Audio Interface",
    "Audio Interface",
    "Audio-Interface",
    "Interface audio",
    "Аудиоинтерфейс"
  ],
  [
    "Studio Monitors",
    "Studio Monitors",
    "Studiomonitore",
    "Enceintes de monitoring",
    "Студийные мониторы"
  ],
  [
    "Headphones",
    "Headphones",
    "Kopfhörer",
    "Casque",
    "Наушники"
  ],
  [
    "FAVORITE PLUGINS",
    "FAVORITE PLUGINS",
    "LIEBLINGS-PLUG-INS",
    "PLUG-INS PRÉFÉRÉS",
    "ЛЮБИМЫЕ ПЛАГИНЫ"
  ],
  [
    "DEVELOPMENT TOOLS",
    "DEVELOPMENT TOOLS",
    "ENTWICKLUNGSWERKZEUGE",
    "OUTILS DE DÉVELOPPEMENT",
    "ИНСТРУМЕНТЫ РАЗРАБОТКИ"
  ],
  [
    "Home",
    "Home",
    "Startseite",
    "Accueil",
    "Главная"
  ],
  [
    "サイト内ナビゲーション",
    "Site navigation",
    "Seitennavigation",
    "Navigation du site",
    "Навигация по сайту"
  ],
  [
    "Hʉeliangの現在のアーティストアイコン",
    "Current artist avatar of Hʉeliang",
    "Aktuelles Künstlerprofilbild von Hʉeliang",
    "Portrait actuel de l’artiste Hʉeliang",
    "Текущий аватар артиста Hʉeliang"
  ]
];
  const translationMap = new Map(rows.map(row => [row[0], row]));
  const selected = document.getElementById('about-language');
  const label = document.querySelector('.section-language-switch label');
  const meta = document.querySelector('meta[name="description"]');
  const nav = document.querySelector('.site-nav');
  const avatar = document.querySelector('.profile-avatar');
  const attrOriginals = avatar ? { alt: avatar.getAttribute('alt') } : {};
  const links = [...document.querySelectorAll('a[href]')].map(node => ({
    node, href: node.getAttribute('href')
  }));
  const nodes = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    if (node.parentElement?.closest('script,style,select')) continue;
    const original = node.nodeValue;
    const trimmed = original.trim();
    if (!translationMap.has(trimmed)) continue;
    nodes.push({node, original, trimmed, before: original.slice(0, original.indexOf(trimmed)), after: original.slice(original.indexOf(trimmed) + trimmed.length)});
  }
  const titles = {
    ja: ['About FUNtasia | FUNtasia', 'FUNtasiaをつくるHʉeliangの音楽、ソフトウェア開発、そして創作への思いをご紹介します。'],
    en: ['About Hʉeliang | FUNtasia', 'Meet Hʉeliang, composer and music producer, and explore his music, software and creative work.'],
    de: ['Über Hʉeliang | FUNtasia', 'Hʉeliang: Komponist, Musikproduzent und Entwickler von Musiksoftware bei FUNtasia.'],
    fr: ['À propos de Hʉeliang | FUNtasia', 'Découvrez Hʉeliang, compositeur et producteur de musique, ainsi que ses projets musicaux et logiciels.'],
    ru: ['О Hʉeliang | FUNtasia', 'Знакомство с Hʉeliang: композитором, музыкальным продюсером и разработчиком FUNtasia.']
  };
  const aria = {
    ja: ['サイトの言語を選択', 'サイト内ナビゲーション', 'Language'],
    en: ['Select website language', 'Site navigation', 'Language'],
    de: ['Sprache der Website wählen', 'Seitennavigation', 'Sprache'],
    fr: ['Choisir la langue du site', 'Navigation du site', 'Langue'],
    ru: ['Выбрать язык сайта', 'Навигация по сайту', 'Язык']
  };
  function preferredLocale() {
    for (const setting of navigator.languages || [navigator.language || '']) {
      const code = String(setting).toLowerCase().split(/[-_]/)[0];
      if (languages.includes(code)) return code;
    }
    return 'en';
  }
  function storedLocale() {
    try {
      const code = localStorage.getItem(storeKey);
      return languages.includes(code) ? code : null;
    } catch { return null; }
  }
  function urlLocale() {
    const code = new URLSearchParams(location.search).get('lang');
    return languages.includes(code) ? code : null;
  }
  function translated(original, lang) {
    const row = translationMap.get(original);
    return row ? (lang === 'ja' ? row[0] : row[languages.indexOf(lang)]) : original;
  }
  function targetHref(original, lang) {
    if (original === '../') return '../?lang=' + lang;
    if (original === '../catalog/ja/') return '../catalog/' + lang + '/';
    if (original === '../studio/') return lang === 'ja' ? '../studio/official/ja/' : lang === 'ru' ? '../studio/official/ru/' : '../studio/official/';
    if (original === '../utilities/' || original === '../goods/') return original + '?lang=' + lang;
    if (original === '../records/') return lang === 'ja' ? original : '../records/' + lang + '/';
    if (original === '../about/' || original === './') return original + '?lang=' + lang;
    return original;
  }
  function applyLocale(lang, remember = false) {
    if (!languages.includes(lang)) return;
    for (const binding of nodes) {
      binding.node.nodeValue = binding.before + translated(binding.trimmed, lang) + binding.after;
    }
    if (avatar) avatar.setAttribute('alt', translated(attrOriginals.alt, lang));
    document.documentElement.lang = lang;
    document.title = titles[lang][0];
    if (meta) meta.content = titles[lang][1];
    if (selected) {
      selected.value = lang;
      selected.setAttribute('aria-label', aria[lang][0]);
    }
    if (label) label.textContent = aria[lang][2];
    if (nav) nav.setAttribute('aria-label', aria[lang][1]);
    for (const {node, href} of links) node.setAttribute('href', targetHref(href, lang));
    if (remember) {
      try { localStorage.setItem(storeKey, lang); } catch { /* No storage required */ }
      const url = new URL(location.href);
      if (url.searchParams.has('lang')) {
        url.searchParams.delete('lang');
        history.replaceState(history.state, '', url.pathname + url.search + url.hash);
      }
    }
  }
  applyLocale(urlLocale() || storedLocale() || preferredLocale());
  selected?.addEventListener('change', () => applyLocale(selected.value, true));
})();
