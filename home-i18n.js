/* FUNtasia homepage localization.
 * Use the visitor's preferred browser language on first visit, then remember
 * only an explicit choice made with the header language selector.
 */
(() => {
  'use strict';

  const supported = ['ja', 'en', 'de', 'fr', 'ru'];
  const storageKey = 'funtasia.home.language';

  const selectors = {
    languageLabel: '#home-language-label',
    heroEyebrow: '.hero .eyebrow',
    heroTitle: '.hero h1',
    heroLead: '.hero .lead',
    heroAudio: '.hero .actions a:nth-child(1)',
    heroExplore: '.hero .actions a:nth-child(2)',
    heroRecords: '.hero .actions a:nth-child(3)',
    philosophyEyebrow: '#audio-philosophy .eyebrow',
    philosophyTitle: '#audio-philosophy-title',
    philosophyLead: '#audio-philosophy .lead',
    freeTitle: '#audio-philosophy .grid .card:nth-child(1) h3',
    freeBody: '#audio-philosophy .grid .card:nth-child(1) p',
    proTitle: '#audio-philosophy .grid .card:nth-child(2) h3',
    proBody: '#audio-philosophy .grid .card:nth-child(2) p',
    premiumTitle: '#audio-philosophy .grid .card:nth-child(3) h3',
    premiumBody: '#audio-philosophy .grid .card:nth-child(3) p',
    philosophyButton: '#audio-philosophy .btn',
    quickTitle: '.quick-paths-title',
    quickAudio: '.quick-paths a:nth-of-type(1) span:first-child',
    quickRecords: '.quick-paths a:nth-of-type(2) span:first-child',
    quickUtilities: '.quick-paths a:nth-of-type(3) span:first-child',
    quickGoods: '.quick-paths a:nth-of-type(4) span:first-child',
    quickSupport: '.quick-paths a:nth-of-type(5) span:first-child',
    exploreEyebrow: '#explore .section-heading .eyebrow',
    exploreTitle: '#explore .section-heading h2',
    exploreLead: '#explore .section-heading p',
    audioTag: '#explore #audio .tag',
    audioBody: '#explore #audio p',
    audioMore: '#explore #audio .more',
    recordsTag: '#explore #records .tag',
    recordsBody: '#explore #records p',
    recordsMore: '#explore #records .more',
    studioTag: '#explore #studio .tag',
    studioBody: '#explore #studio p',
    studioMore: '#explore #studio .more',
    utilitiesTag: '#explore #utilities .tag',
    utilitiesBody: '#explore #utilities p',
    utilitiesMore: '#explore #utilities .more',
    goodsTag: '#explore #goods .tag',
    goodsBody: '#explore #goods p',
    goodsMore: '#explore #goods .more',
    guildEyebrow: '#guild .eyebrow',
    guildSub: '#guild h3',
    guildBody1: '#guild p:nth-of-type(1)',
    guildBody2: '#guild p:nth-of-type(2)',
    guildBody3: '#guild p:nth-of-type(3)',
    guildButton: '#guild .btn',
    aboutEyebrow: '#about .eyebrow',
    aboutBody: '#about .lead',
    aboutButton: '#about .btn',
    supportTitle: '#support h2',
    supportBody: '#support .lead',
    supportButton: '#support .btn',
    supportNote: '#support .note'
  };
  const htmlKeys = new Set(['heroTitle', 'guildBody2']);
  const imageAltSelectors = {
    audioAlt: '#explore #audio img',
    recordsAlt: '#explore #records img',
    studioAlt: '#explore #studio img',
    utilitiesAlt: '#explore #utilities img',
    goodsAlt: '#explore #goods img'
  };

  const copy = {
    en: {
      title: 'FUNtasia | A World of Music and Creation',
      description: 'Discover FUNtasia music, audio plug-ins, a DAW, creative utilities, and the people behind them.',
      languageLabel: 'Language',
      heroEyebrow: 'One creative universe',
      heroTitle: 'Sound. Creation.<br>Imagination.',
      heroLead: 'From the tools that create sound to the places where music is shared. Discover the creative world of FUNtasia in one place.',
      heroAudio: 'Explore Audio Plug-ins', heroExplore: 'Explore FUNtasia', heroRecords: 'Discover Records Music',
      philosophyEyebrow: 'FUNtasia Audio · Our Philosophy',
      philosophyTitle: 'We never put a price on sound quality.',
      philosophyLead: 'Professional quality, even for free. What changes with price is not the quality of the sound, but the depth of control, creative freedom, and the experience and sensibility of its creator.',
      freeTitle: 'Professional quality. Even for free.',
      freeBody: 'Free should never mean compromised sound. We want everyone to have access to tools worthy of professional productions.',
      proTitle: 'More depth. More freedom.',
      proBody: 'Paid tools offer specialized controls and the freedom to shape sound more deeply—not a higher tier of sound quality.',
      premiumTitle: 'A creator’s experience, made audible.',
      premiumBody: 'Years of making music, artistic judgment, and aesthetic vision are built into the design. The value lies in an experience that cannot be measured by feature count alone.',
      philosophyButton: 'Explore FUNtasia Audio',
      quickTitle: 'Looking for something?', quickAudio: 'Find plug-ins', quickRecords: 'Music & artists', quickUtilities: 'Creative tools', quickGoods: 'Free wallpapers', quickSupport: 'Get support',
      exploreEyebrow: 'Explore FUNtasia', exploreTitle: 'One world for creative expression.',
      exploreLead: 'Make music, build tools, and share your creations. Explore every part of FUNtasia from one place.',
      audioTag: 'Software · Plug-ins', audioBody: 'Discover available effects and instruments, with their features and details.', audioMore: 'View product catalog →',
      recordsTag: 'Music · Artists', recordsBody: 'Explore music, artists, releases, and profiles from FUNtasia Records.', recordsMore: 'Explore Records →',
      studioTag: 'Digital Audio Workstation', studioBody: 'Visit the FUNtasia Studio site for the public beta and free expansion packs.', studioMore: 'Visit Studio site →',
      utilitiesTag: 'Windows Tools', utilitiesBody: 'Discover Windows tools including FUNtasia Quick Launcher, Player, Mixer, and Session Note.', utilitiesMore: 'Explore utilities →',
      goodsTag: 'Goods · Free Wallpapers', goodsBody: 'Download 21 free wallpapers and seven Windows 11 mouse cursor themes.', goodsMore: 'Free wallpapers →',
      guildEyebrow: 'Community · Discord', guildSub: 'The official FUNtasia community, where creativity and ideas meet.',
      guildBody1: 'Join fellow creators to talk about music production and sound design, share your work, and exchange ideas.',
      guildBody2: 'We also welcome <strong>bug reports, troubleshooting questions, feature requests, and suggestions for improvements</strong>.',
      guildBody3: 'Together, we shape the future of FUNtasia.',
      guildButton: 'Join the Alchemist Guild ↗',
      aboutEyebrow: 'The creator', aboutBody: 'Piano since age three, composing since sixteen. Hʉeliang creates both music and software, aiming to make creative expression accessible to everyone.', aboutButton: 'Read the profile',
      supportTitle: 'Find what you need, simply.', supportBody: 'Find product information, contact options for FUNtasia Records, and other resources for your next step.', supportButton: 'Support information', supportNote: 'The existing FUNtasia Audio and FUNtasia Records websites also remain available.',
      audioAlt: 'FUN Rack audio plug-in interface', recordsAlt: 'FUNtasia Records illustrated header surrounded by flowers', studioAlt: 'FUNtasia Studio DAW workspace with tracks and Device Rack', utilitiesAlt: 'FUNtasia Quick Launcher on Windows in the Original Sage theme', goodsAlt: 'FUNtasia Studio Original Sage wallpaper',
      logoAria: 'FUNtasia home', navAria: 'Main navigation', languageAria: 'Select website language', quickAria: 'Browse by interest'
    },
    de: {
      title: 'FUNtasia | Die Welt der Musik und Kreativität',
      description: 'Entdecke Musik, Audio-Plug-ins, eine DAW, Kreativwerkzeuge und die Menschen hinter FUNtasia.',
      languageLabel: 'Sprache',
      heroEyebrow: 'Ein kreatives Universum',
      heroTitle: 'Klang. Kreativität.<br>Fantasie.',
      heroLead: 'Von Werkzeugen, die Klänge erschaffen, bis zu Orten, an denen Musik geteilt wird. Entdecke die kreative Welt von FUNtasia an einem Ort.',
      heroAudio: 'Audio-Plug-ins entdecken', heroExplore: 'FUNtasia erkunden', heroRecords: 'Musik von Records entdecken',
      philosophyEyebrow: 'FUNtasia Audio · Unsere Philosophie',
      philosophyTitle: 'Klangqualität hat bei uns keine Preisklasse.',
      philosophyLead: 'Professionelle Qualität – auch kostenlos. Der Preis bestimmt nicht die Klangqualität, sondern den Umfang der Gestaltungsmöglichkeiten, die Spezialisierung sowie die Erfahrung und das Gespür des Entwicklers.',
      freeTitle: 'Profiqualität. Auch kostenlos.',
      freeBody: 'Kostenlos darf keinen Kompromiss beim Klang bedeuten. Jeder soll Werkzeuge nutzen können, die auch professionellen Produktionen gerecht werden.',
      proTitle: 'Mehr Tiefe. Mehr Freiheit.',
      proBody: 'Kostenpflichtige Werkzeuge bieten spezialisierte Parameter und mehr Freiheit bei der Klanggestaltung – keine höhere Klangqualitätsstufe.',
      premiumTitle: 'Erfahrung und Gespür werden hörbar.',
      premiumBody: 'Musikalische Erfahrung, künstlerische Entscheidungen und Ästhetik fließen in das Design ein. Dieser Wert lässt sich nicht allein an der Zahl der Funktionen messen.',
      philosophyButton: 'FUNtasia Audio entdecken',
      quickTitle: 'Wonach suchst du?', quickAudio: 'Plug-ins finden', quickRecords: 'Musik & Künstler', quickUtilities: 'Kreativwerkzeuge', quickGoods: 'Kostenlose Wallpaper', quickSupport: 'Hilfe finden',
      exploreEyebrow: 'FUNtasia entdecken', exploreTitle: 'Eine Welt für kreative Ideen.',
      exploreLead: 'Musik machen, Werkzeuge entwickeln und Werke veröffentlichen. Entdecke alle Bereiche von FUNtasia an einem Ort.',
      audioTag: 'Software · Plug-ins', audioBody: 'Entdecke veröffentlichte Effekte und Instrumente mit ihren Funktionen und Details.', audioMore: 'Zum Produktkatalog →',
      recordsTag: 'Musik · Künstler', recordsBody: 'Musik, Künstler, Veröffentlichungen und Profile von FUNtasia Records.', recordsMore: 'Records entdecken →',
      studioTag: 'Digital Audio Workstation', studioBody: 'Besuche die FUNtasia-Studio-Website für die öffentliche Beta und kostenlose Erweiterungspakete.', studioMore: 'Zur Studio-Website →',
      utilitiesTag: 'Windows-Werkzeuge', utilitiesBody: 'Windows-Tools wie FUNtasia Quick Launcher, Player, Mixer und Session Note entdecken.', utilitiesMore: 'Werkzeuge entdecken →',
      goodsTag: 'Extras · Kostenlose Wallpaper', goodsBody: '21 kostenlose Wallpaper und sieben Mauszeiger-Themes für Windows 11 herunterladen.', goodsMore: 'Wallpaper ansehen →',
      guildEyebrow: 'Community · Discord', guildSub: 'Die offizielle FUNtasia-Community: ein Treffpunkt für Kreativität und Ideen.',
      guildBody1: 'Tausche dich über Musikproduktion und Sounddesign aus, teile deine Werke und lerne andere Kreative kennen.',
      guildBody2: 'Auch <strong>Fehlermeldungen, Fragen zu Problemen, Funktionswünsche und Verbesserungsvorschläge</strong> sind willkommen.',
      guildBody3: 'Gemeinsam gestalten wir die Zukunft von FUNtasia.',
      guildButton: 'Dem Alchemist Guild beitreten ↗',
      aboutEyebrow: 'Der Entwickler', aboutBody: 'Seit dem dritten Lebensjahr am Klavier, seit dem sechzehnten am Komponieren. Hʉeliang entwickelt Musik und Software, damit kreative Arbeit für alle zugänglich wird.', aboutButton: 'Profil lesen',
      supportTitle: 'Schnell zur richtigen Information.', supportBody: 'Hier findest du Produktinformationen, Kontaktmöglichkeiten für FUNtasia Records und weitere Hilfen.', supportButton: 'Zum Support', supportNote: 'Die bisherigen Websites von FUNtasia Audio und FUNtasia Records bleiben weiterhin erreichbar.',
      audioAlt: 'Benutzeroberfläche des Audio-Plug-ins FUN Rack', recordsAlt: 'Illustrierter FUNtasia-Records-Header mit Blumen', studioAlt: 'FUNtasia Studio DAW mit Spuren und Device Rack', utilitiesAlt: 'FUNtasia Quick Launcher unter Windows im Theme Original Sage', goodsAlt: 'FUNtasia Studio Wallpaper Original Sage',
      logoAria: 'FUNtasia Startseite', navAria: 'Hauptnavigation', languageAria: 'Sprache der Website wählen', quickAria: 'Nach Interesse stöbern'
    },
    fr: {
      title: 'FUNtasia | Un univers de musique et de création',
      description: 'Découvrez la musique, les plug-ins audio, la station audionumérique, les outils créatifs et les artistes de FUNtasia.',
      languageLabel: 'Langue',
      heroEyebrow: 'Un univers créatif',
      heroTitle: 'Son. Création.<br>Imagination.',
      heroLead: 'Des outils qui donnent naissance au son aux espaces où la musique se partage : découvrez tout l’univers créatif de FUNtasia au même endroit.',
      heroAudio: 'Découvrir les plug-ins Audio', heroExplore: 'Explorer FUNtasia', heroRecords: 'Découvrir la musique de Records',
      philosophyEyebrow: 'FUNtasia Audio · Notre philosophie',
      philosophyTitle: 'La qualité sonore n’a pas de prix chez nous.',
      philosophyLead: 'Une qualité professionnelle, même gratuitement. Ce qui change avec le prix, ce n’est pas la qualité du son, mais la liberté de création, les paramètres spécialisés, ainsi que l’expérience et la sensibilité de l’auteur.',
      freeTitle: 'Qualité professionnelle, même gratuite.',
      freeBody: 'Gratuit ne signifie pas faire de compromis sur le son. Nous voulons offrir à tous des outils à la hauteur des productions professionnelles.',
      proTitle: 'Plus de profondeur. Plus de liberté.',
      proBody: 'Les outils payants offrent des réglages spécialisés et une plus grande liberté de création, pas un niveau supérieur de qualité sonore.',
      premiumTitle: 'L’expérience du créateur prend vie dans le son.',
      premiumBody: 'Années de création, jugement musical et sens esthétique nourrissent la conception. Cette valeur ne se mesure pas au simple nombre de fonctions.',
      philosophyButton: 'Découvrir FUNtasia Audio',
      quickTitle: 'Vous cherchez quelque chose ?', quickAudio: 'Trouver des plug-ins', quickRecords: 'Musique et artistes', quickUtilities: 'Outils créatifs', quickGoods: 'Fonds d’écran gratuits', quickSupport: 'Obtenir de l’aide',
      exploreEyebrow: 'Explorer FUNtasia', exploreTitle: 'Un monde dédié à la création.',
      exploreLead: 'Créer de la musique, concevoir des outils et partager des œuvres. Explorez toutes les facettes de FUNtasia au même endroit.',
      audioTag: 'Logiciels · Plug-ins', audioBody: 'Découvrez les effets et instruments disponibles, leurs fonctions et leurs caractéristiques.', audioMore: 'Voir le catalogue →',
      recordsTag: 'Musique · Artistes', recordsBody: 'Découvrez la musique, les artistes, les sorties et les profils de FUNtasia Records.', recordsMore: 'Explorer Records →',
      studioTag: 'Station audionumérique', studioBody: 'Visitez le site FUNtasia Studio pour la bêta publique et les extensions gratuites.', studioMore: 'Voir le site Studio →',
      utilitiesTag: 'Outils Windows', utilitiesBody: 'Découvrez les outils Windows : FUNtasia Quick Launcher, Player, Mixer et Session Note.', utilitiesMore: 'Explorer les outils →',
      goodsTag: 'Bonus · Fonds d’écran gratuits', goodsBody: 'Téléchargez 21 fonds d’écran gratuits et sept thèmes de curseurs pour Windows 11.', goodsMore: 'Voir les fonds d’écran →',
      guildEyebrow: 'Communauté · Discord', guildSub: 'La communauté officielle FUNtasia, où se rencontrent créativité et idées.',
      guildBody1: 'Échangez autour de la production musicale et du sound design, partagez vos créations et rencontrez d’autres passionnés.',
      guildBody2: 'Nous accueillons aussi les <strong>signalements de bugs, demandes d’aide, suggestions de fonctions et propositions d’amélioration</strong>.',
      guildBody3: 'Votre voix contribue à construire l’avenir de FUNtasia.',
      guildButton: 'Rejoindre l’Alchemist Guild ↗',
      aboutEyebrow: 'Le créateur', aboutBody: 'Pianiste depuis l’âge de trois ans et compositeur depuis seize ans, Hʉeliang crée de la musique et des logiciels pour rendre la création accessible à tous.', aboutButton: 'Lire le profil',
      supportTitle: 'Trouvez facilement les bonnes informations.', supportBody: 'Accédez aux informations produits, aux contacts de FUNtasia Records et aux ressources utiles.', supportButton: 'Voir l’assistance', supportNote: 'Les anciens sites FUNtasia Audio et FUNtasia Records restent également accessibles.',
      audioAlt: 'Interface du plug-in audio FUN Rack', recordsAlt: 'Illustration de la bannière FUNtasia Records entourée de fleurs', studioAlt: 'Station FUNtasia Studio avec pistes et Device Rack', utilitiesAlt: 'FUNtasia Quick Launcher sur Windows avec le thème Original Sage', goodsAlt: 'Fond d’écran FUNtasia Studio Original Sage',
      logoAria: 'Accueil FUNtasia', navAria: 'Navigation principale', languageAria: 'Choisir la langue du site', quickAria: 'Explorer par centre d’intérêt'
    },
    ru: {
      title: 'FUNtasia | Мир музыки и творчества',
      description: 'Откройте для себя музыку, аудиоплагины, DAW, творческие инструменты и авторов FUNtasia.',
      languageLabel: 'Язык',
      heroEyebrow: 'Единая творческая вселенная',
      heroTitle: 'Звук. Творчество.<br>Воображение.',
      heroLead: 'От инструментов для создания звука до пространства, где делятся музыкой. Добро пожаловать в творческий мир FUNtasia.',
      heroAudio: 'Каталог аудиоплагинов', heroExplore: 'Исследовать FUNtasia', heroRecords: 'Музыка FUNtasia Records',
      philosophyEyebrow: 'FUNtasia Audio · Наша философия',
      philosophyTitle: 'Качество звука не зависит от цены.',
      philosophyLead: 'Профессиональное качество доступно и бесплатно. Цена определяет не уровень звучания, а глубину настроек, свободу творчества, опыт и художественное видение автора.',
      freeTitle: 'Профессиональное качество. Даже бесплатно.',
      freeBody: 'Бесплатный инструмент не должен уступать в качестве звука. Мы хотим, чтобы каждый мог работать с инструментами профессионального уровня.',
      proTitle: 'Больше возможностей. Больше свободы.',
      proBody: 'Платные инструменты дают расширенные параметры и больше свободы в работе со звуком, а не более высокое качество звучания.',
      premiumTitle: 'Опыт автора, воплощённый в звуке.',
      premiumBody: 'Музыкальный опыт, творческие решения и эстетика становятся частью инструмента. Их ценность нельзя измерить только числом функций.',
      philosophyButton: 'Открыть FUNtasia Audio',
      quickTitle: 'Что вы ищете?', quickAudio: 'Найти плагины', quickRecords: 'Музыка и артисты', quickUtilities: 'Творческие инструменты', quickGoods: 'Бесплатные обои', quickSupport: 'Поддержка',
      exploreEyebrow: 'Мир FUNtasia', exploreTitle: 'Единый мир для творчества.',
      exploreLead: 'Создавайте музыку, разрабатывайте инструменты и делитесь своими работами. Узнайте обо всех направлениях FUNtasia.',
      audioTag: 'Программы · Плагины', audioBody: 'Узнайте о доступных эффектах и инструментах и об их возможностях.', audioMore: 'Каталог продуктов →',
      recordsTag: 'Музыка · Артисты', recordsBody: 'Музыка, артисты, релизы и профили FUNtasia Records.', recordsMore: 'Открыть Records →',
      studioTag: 'Цифровая аудиостанция', studioBody: 'Откройте сайт FUNtasia Studio, чтобы узнать о публичной бета-версии и бесплатных дополнениях.', studioMore: 'Открыть сайт Studio →',
      utilitiesTag: 'Инструменты Windows', utilitiesBody: 'Программы для Windows: FUNtasia Quick Launcher, Player, Mixer и Session Note.', utilitiesMore: 'Смотреть инструменты →',
      goodsTag: 'Материалы · Бесплатные обои', goodsBody: 'Скачайте 21 бесплатные обои и семь тем курсоров для Windows 11.', goodsMore: 'Смотреть обои →',
      guildEyebrow: 'Сообщество · Discord', guildSub: 'Официальное сообщество FUNtasia — место встречи идей и творчества.',
      guildBody1: 'Обсуждайте создание музыки и саунд-дизайн, делитесь работами и общайтесь с другими авторами.',
      guildBody2: 'Мы принимаем <strong>сообщения об ошибках, вопросы о неполадках, предложения новых функций и улучшений</strong>.',
      guildBody3: 'Ваше мнение помогает формировать будущее FUNtasia.',
      guildButton: 'Присоединиться к Alchemist Guild ↗',
      aboutEyebrow: 'Об авторе', aboutBody: 'Hʉeliang играет на фортепиано с трёх лет и пишет музыку с шестнадцати. Он создаёт музыку и программы, делая творчество доступнее для всех.', aboutButton: 'Читать профиль',
      supportTitle: 'Нужная информация — без лишних поисков.', supportBody: 'Здесь собраны сведения о продуктах, контакты FUNtasia Records и полезные ресурсы.', supportButton: 'Раздел поддержки', supportNote: 'Предыдущие сайты FUNtasia Audio и FUNtasia Records по-прежнему доступны.',
      audioAlt: 'Интерфейс аудиоплагина FUN Rack', recordsAlt: 'Иллюстрированная обложка FUNtasia Records с цветами', studioAlt: 'DAW FUNtasia Studio с дорожками и Device Rack', utilitiesAlt: 'FUNtasia Quick Launcher для Windows в теме Original Sage', goodsAlt: 'Обои FUNtasia Studio Original Sage',
      logoAria: 'Главная FUNtasia', navAria: 'Главная навигация', languageAria: 'Выбор языка сайта', quickAria: 'Поиск по интересам'
    }
  };

  // The original Audio support appeal is preserved in full and localized with the home language.
  const appealKeys = ["eyebrow","title","copy1","copy2","copy3","copy4","copy5","copy6","copy7","copy8","copy9","copy10","ask1","ask2","ask3","button","after1","after2","after3","after4","after5"];
  const appealCopy = {
  "en": [
    "A Note From The Developer",
    "A chance to create,<br>for everyone.",
    "I have a developmental disability and related sensory sensitivities.",
    "As a student, I endured severe bullying while working to afford sound libraries and music equipment. Those experiences still affect me deeply, and I am currently receiving treatment for depression.",
    "Having faced these difficulties myself, there is something I sincerely hope for.",
    "A world where <strong>everyone has the chance to live as themselves and explore their potential</strong>, regardless of disability, financial circumstances, upbringing, or the challenges they face.",
    "To make music. To express something of their own.",
    "I do not want people to have to give up on that possibility because they cannot afford the tools.",
    "That belief is why I devote special care and effort to developing free plugins at FUNtasia Audio.",
    "To me, a free product is not worth less than a paid one. I take the quality and the breadth of our free offerings just as seriously.",
    "To be honest, the time and costs going into development are currently far out of balance with the revenue it brings in.",
    "Even so, I do not want to let go of this belief by reducing the number of free products or compromising their quality.",
    "That is why I am <strong>actively asking for support</strong> from those who believe in FUNtasia Audio and are in a position to help.",
    "Our Amazon Wish List includes development equipment as well as food and everyday essentials that help sustain this work.",
    "Your support makes a real difference in keeping development going and bringing creative tools to more people.",
    "VIEW OUR SUPPORT WISH LIST (AMAZON)",
    "Of course, if financial or other circumstances make it difficult to contribute, please do not worry about it at all.",
    "You never need to feel guilty for not providing support.",
    "Free plugins are here for everyone who needs them, with no hesitation or obligation.",
    "<strong>If you are enjoying making music and creating things in your own way, then one of my goals has already been fulfilled.</strong>",
    "And to everyone who supports this work, thank you from the bottom of my heart."
  ],
  "de": [
    "Eine Nachricht des Entwicklers",
    "Eine Chance, kreativ zu sein.<br>Für alle.",
    "Ich lebe mit einer Entwicklungsbehinderung und damit verbundenen sensorischen Überempfindlichkeiten.",
    "Während meiner Schulzeit wurde ich schwer gemobbt, als ich gleichzeitig arbeitete, um mir Soundbibliotheken und Musikausrüstung leisten zu können. Diese Erlebnisse wirken bis heute tief in mir nach, und ich bin derzeit wegen einer Depression in Behandlung.",
    "Weil ich diese Schwierigkeiten selbst erlebt habe, liegt mir ein Wunsch besonders am Herzen.",
    "Eine Welt, in der <strong>alle Menschen die Möglichkeit haben, sie selbst zu sein und ihr Potenzial zu entdecken</strong> – unabhängig von Behinderung, finanzieller Lage, ihrem Aufwachsen oder den Herausforderungen, vor denen sie stehen.",
    "Musik machen. Etwas Eigenes ausdrücken.",
    "Niemand soll diese Möglichkeit aufgeben müssen, nur weil die nötigen Werkzeuge zu teuer sind.",
    "Deshalb widme ich der Entwicklung kostenloser Plug-ins bei FUNtasia Audio besondere Sorgfalt und viel Arbeit.",
    "Für mich ist ein kostenloses Produkt nicht weniger wert als ein kostenpflichtiges. Qualität und Umfang unserer kostenlosen Angebote nehme ich genauso ernst.",
    "Ehrlich gesagt stehen Zeitaufwand und Kosten der Entwicklung derzeit in einem deutlichen Missverhältnis zu den Einnahmen.",
    "Trotzdem möchte ich diesen Grundsatz nicht aufgeben, indem ich weniger kostenlose Produkte anbiete oder ihre Qualität einschränke.",
    "Deshalb <strong>bitte ich ausdrücklich um Unterstützung</strong> von Menschen, die die Überzeugung von FUNtasia Audio teilen und helfen können.",
    "Unsere Amazon-Wunschliste enthält Entwicklungsausrüstung sowie Lebensmittel und Dinge des täglichen Bedarfs, die diese Arbeit ermöglichen.",
    "Deine Unterstützung hilft ganz konkret dabei, die Entwicklung fortzusetzen und kreative Werkzeuge mehr Menschen zugänglich zu machen.",
    "UNSERE AMAZON-WUNSCHLISTE ANSEHEN",
    "Wenn du aus finanziellen oder anderen Gründen nichts beitragen kannst, mach dir bitte keinerlei Sorgen.",
    "Du musst dich niemals schuldig fühlen, wenn du uns nicht unterstützt.",
    "Kostenlose Plug-ins sind für alle da, die sie brauchen – ohne Hemmungen und ohne Verpflichtung.",
    "<strong>Wenn du auf deine eigene Weise Freude an Musik und kreativem Schaffen hast, ist eines meiner Ziele bereits erreicht.</strong>",
    "Allen, die diese Arbeit unterstützen, danke ich von ganzem Herzen."
  ],
  "fr": [
    "Un mot du développeur",
    "La possibilité de créer,<br>pour tout le monde.",
    "Je vis avec un handicap du développement et des sensibilités sensorielles qui y sont liées.",
    "Pendant mes études, j’ai subi un harcèlement grave tout en travaillant pour pouvoir acheter des banques de sons et du matériel musical. Ces expériences me marquent encore profondément et je suis actuellement soigné pour une dépression.",
    "Après avoir traversé moi-même ces difficultés, il y a quelque chose que je souhaite sincèrement.",
    "Un monde où <strong>chacun peut être soi-même et explorer son potentiel</strong>, quels que soient son handicap, sa situation financière, son milieu d’origine ou les difficultés rencontrées.",
    "Faire de la musique. Exprimer quelque chose qui nous appartient.",
    "Je ne veux pas que quelqu’un doive renoncer à cette possibilité faute de pouvoir acheter les outils nécessaires.",
    "C’est cette conviction qui me pousse à apporter un soin et un travail particuliers aux plug-ins gratuits de FUNtasia Audio.",
    "Pour moi, un produit gratuit n’a pas moins de valeur qu’un produit payant. Je prends tout aussi au sérieux la qualité et l’étendue de nos offres gratuites.",
    "Pour être honnête, le temps et les coûts consacrés au développement sont actuellement très disproportionnés par rapport aux revenus générés.",
    "Pourtant, je ne veux pas abandonner cette conviction en réduisant le nombre de produits gratuits ou en sacrifiant leur qualité.",
    "C’est pourquoi je <strong>sollicite activement le soutien</strong> des personnes qui partagent les valeurs de FUNtasia Audio et qui peuvent aider.",
    "Notre liste de souhaits Amazon comprend du matériel de développement, mais aussi de la nourriture et des produits du quotidien qui permettent de poursuivre ce travail.",
    "Votre soutien fait une réelle différence pour continuer le développement et rendre les outils créatifs accessibles à davantage de personnes.",
    "CONSULTER NOTRE LISTE DE SOUHAITS AMAZON",
    "Bien entendu, si votre situation financière ou personnelle ne vous permet pas de contribuer, ne vous inquiétez surtout pas.",
    "Vous ne devez jamais vous sentir coupable de ne pas apporter de soutien.",
    "Les plug-ins gratuits sont là pour toutes les personnes qui en ont besoin, sans hésitation ni obligation.",
    "<strong>Si vous prenez plaisir à faire de la musique et à créer à votre manière, alors l’un de mes objectifs est déjà atteint.</strong>",
    "À toutes les personnes qui soutiennent ce travail, merci du fond du cœur."
  ],
  "ru": [
    "Обращение разработчика",
    "Возможность творить —<br>для каждого.",
    "У меня есть нарушение развития и связанная с ним повышенная сенсорная чувствительность.",
    "Во время учёбы мне пришлось пережить жестокую травлю, одновременно зарабатывая на звуковые библиотеки и музыкальное оборудование. Этот опыт до сих пор глубоко влияет на меня, и сейчас я прохожу лечение от депрессии.",
    "Пройдя через эти трудности, я искренне мечтаю об одном.",
    "О мире, где <strong>каждый может оставаться собой и раскрывать свой потенциал</strong> независимо от инвалидности, финансового положения, условий взросления или жизненных трудностей.",
    "Создавать музыку. Выражать что-то своё.",
    "Я не хочу, чтобы кому-то приходилось отказываться от этой возможности лишь потому, что он не может позволить себе необходимые инструменты.",
    "Именно поэтому я уделяю особое внимание и много сил разработке бесплатных плагинов FUNtasia Audio.",
    "Для меня бесплатный продукт не менее ценен, чем платный. Я одинаково серьёзно отношусь к качеству и разнообразию наших бесплатных предложений.",
    "Честно говоря, затраты времени и денег на разработку сейчас значительно превышают доходы от неё.",
    "И всё же я не хочу отказываться от этого принципа, сокращая количество бесплатных продуктов или снижая их качество.",
    "Поэтому я <strong>открыто прошу о поддержке</strong> тех, кому близка идея FUNtasia Audio и кто может помочь.",
    "В нашем списке желаний Amazon есть оборудование для разработки, продукты питания и повседневные вещи, которые помогают продолжать работу.",
    "Ваша поддержка действительно помогает развивать проект и делать творческие инструменты доступными большему числу людей.",
    "ПОСМОТРЕТЬ СПИСОК ЖЕЛАНИЙ AMAZON",
    "Конечно, если финансовые или другие обстоятельства не позволяют вам помочь, пожалуйста, не переживайте.",
    "Вам никогда не нужно чувствовать вину из-за того, что вы не можете поддержать нас.",
    "Бесплатные плагины доступны всем, кому они нужны, без стеснения и каких-либо обязательств.",
    "<strong>Если вы получаете удовольствие от музыки и творчества по-своему, значит, одна из моих целей уже достигнута.</strong>",
    "И всем, кто поддерживает эту работу, искреннее спасибо от всего сердца."
  ]
};
  const appealNodes = appealKeys.map(key => document.querySelector('[data-appeal="' + key + '"]'));
  const appealOriginal = appealNodes.map(node => node?.innerHTML ?? '');

  const original = {};
  const bindings = {};
  for (const [key, selector] of Object.entries(selectors)) {
    const node = document.querySelector(selector);
    if (!node) continue;
    bindings[key] = node;
    original[key] = htmlKeys.has(key) ? node.innerHTML : node.textContent;
  }
  const altBindings = {};
  for (const [key, selector] of Object.entries(imageAltSelectors)) {
    const node = document.querySelector(selector);
    if (!node) continue;
    altBindings[key] = node;
    original[key] = node.getAttribute('alt') || '';
  }
  original.title = document.title;
  original.description = document.querySelector('meta[name="description"]')?.content || '';
  original.logoAria = document.querySelector('.logo')?.getAttribute('aria-label') || '';
  original.navAria = document.querySelector('.nav')?.getAttribute('aria-label') || '';
  original.languageAria = document.querySelector('#home-language')?.getAttribute('aria-label') || '';
  original.quickAria = document.querySelector('.quick-paths')?.getAttribute('aria-label') || '';

  const catalogLinks = [...document.querySelectorAll('a[href="catalog/ja/"]')];
  const recordsLinks = [...document.querySelectorAll('a[href="records/"]')];
  const studioLinks = [...document.querySelectorAll('a[href="studio/official/ja/"]')];
  const select = document.querySelector('#home-language');

  function browserLocale() {
    const prefs = Array.isArray(navigator.languages) && navigator.languages.length
      ? navigator.languages : [navigator.language || ''];
    for (const pref of prefs) {
      const language = String(pref).toLowerCase().split(/[-_]/)[0];
      if (supported.includes(language)) return language;
    }
    return 'en';
  }
  function savedLocale() {
    try {
      const value = localStorage.getItem(storageKey);
      return supported.includes(value) ? value : null;
    } catch {
      return null;
    }
  }
  function queryLocale() {
    const requested = new URLSearchParams(location.search).get('lang');
    return supported.includes(requested) ? requested : null;
  }
  function applyLocale(locale, remember = false) {
    if (!supported.includes(locale)) return;
    const strings = locale === 'ja' ? original : copy[locale];
    for (const [key, node] of Object.entries(bindings)) {
      const value = strings[key] ?? original[key];
      if (htmlKeys.has(key)) node.innerHTML = value;
      else node.textContent = value;
    }
    for (const [key, node] of Object.entries(altBindings)) {
      node.setAttribute('alt', strings[key] ?? original[key]);
    }
    const appealStrings = locale === 'ja' ? appealOriginal : appealCopy[locale];
    appealNodes.forEach((node, index) => { if (node) node.innerHTML = appealStrings[index]; });
    document.documentElement.lang = locale;
    document.title = strings.title;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.content = strings.description;
    document.querySelector('.logo')?.setAttribute('aria-label', strings.logoAria);
    document.querySelector('.nav')?.setAttribute('aria-label', strings.navAria);
    select?.setAttribute('aria-label', strings.languageAria);
    document.querySelector('.quick-paths')?.setAttribute('aria-label', strings.quickAria);
    for (const link of catalogLinks) link.href = 'catalog/' + locale + '/';
    for (const link of recordsLinks) link.href = locale === 'ja' ? 'records/' : 'records/' + locale + '/';
    for (const link of studioLinks) link.href = locale === 'ja' ? 'studio/official/ja/' : (locale === 'ru' ? 'studio/official/ru/' : 'studio/official/');
    if (select) select.value = locale;
    if (remember) {
      try { localStorage.setItem(storageKey, locale); } catch { /* Browsing without local storage is supported. */ }
      const url = new URL(location.href);
      if (url.searchParams.has('lang')) {
        url.searchParams.delete('lang');
        history.replaceState(history.state, '', url.pathname + url.search + url.hash);
      }
    }
  }

  applyLocale(queryLocale() || savedLocale() || browserLocale());
  select?.addEventListener('change', () => applyLocale(select.value, true));
})();
