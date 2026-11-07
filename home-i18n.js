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
    supportNote: '#support .note',
    funSupportTitle: '#fun-support-title',
    funSupportLead: '#support-funtasia-audio .lead',
    funSupportAppealTitle: '#support-funtasia-audio .fun-support-appeal h3',
    funSupportAppealBody: '#support-funtasia-audio .fun-support-appeal > p:first-of-type',
    funSupportButton: '#support-funtasia-audio .fun-support-appeal .btn',
    funSupportReassurance: '#support-funtasia-audio .fun-support-reassurance'
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
      studioTag: 'Digital Audio Workstation', studioBody: 'Visit the dedicated site for FUNtasia Studio’s public beta and free expansion packs.', studioMore: 'Development updates →',
      utilitiesTag: 'Windows Tools', utilitiesBody: 'Discover Windows tools including FUNtasia Quick Launcher, Player, Mixer, and Session Note.', utilitiesMore: 'Explore utilities →',
      goodsTag: 'Goods · Free Wallpapers', goodsBody: 'Download 21 free wallpapers and seven Windows 11 mouse cursor themes.', goodsMore: 'Free wallpapers →',
      guildEyebrow: 'Community · Discord', guildSub: 'The official FUNtasia community, where creativity and ideas meet.',
      guildBody1: 'Join fellow creators to talk about music production and sound design, share your work, and exchange ideas.',
      guildBody2: 'We also welcome <strong>bug reports, troubleshooting questions, feature requests, and suggestions for improvements</strong>.',
      guildBody3: 'Together, we shape the future of FUNtasia.',
      guildButton: 'Join the Alchemist Guild ↗',
      aboutEyebrow: 'The creator', aboutBody: 'Piano since age three, composing since sixteen. Hʉeliang creates both music and software, aiming to make creative expression accessible to everyone.', aboutButton: 'Read the profile',
      supportTitle: 'Find what you need, simply.', supportBody: 'Find product information, contact options for FUNtasia Records, and other resources for your next step.', supportButton: 'Support information', supportNote: 'The existing FUNtasia Audio and FUNtasia Records websites also remain available.',
      funSupportTitle: "Help keep creative tools within everyone's reach.",
      funSupportLead: "At FUNtasia Audio, we believe free products deserve the same care and quality as paid ones. Developing and maintaining them takes considerable time and resources, and your support helps make that work possible.",
      funSupportAppealTitle: "Please consider supporting the ongoing development of FUNtasia Audio.",
      funSupportAppealBody: "Our Amazon Wish List includes equipment needed for development as well as food and everyday essentials. If you share our mission and are in a position to help, your support makes a genuine difference.",
      funSupportButton: "Support via Amazon Wish List ↗",
      funSupportReassurance: "Support is entirely optional. The quality and terms of our free plug-ins do not depend on whether you contribute. Please give only if it is comfortable for you.",
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
      studioTag: 'Digital Audio Workstation', studioBody: 'Zur Website der öffentlichen Beta von FUNtasia Studio und der kostenlosen Erweiterungspakete.', studioMore: 'Entwicklung ansehen →',
      utilitiesTag: 'Windows-Werkzeuge', utilitiesBody: 'Windows-Tools wie FUNtasia Quick Launcher, Player, Mixer und Session Note entdecken.', utilitiesMore: 'Werkzeuge entdecken →',
      goodsTag: 'Extras · Kostenlose Wallpaper', goodsBody: '21 kostenlose Wallpaper und sieben Mauszeiger-Themes für Windows 11 herunterladen.', goodsMore: 'Wallpaper ansehen →',
      guildEyebrow: 'Community · Discord', guildSub: 'Die offizielle FUNtasia-Community: ein Treffpunkt für Kreativität und Ideen.',
      guildBody1: 'Tausche dich über Musikproduktion und Sounddesign aus, teile deine Werke und lerne andere Kreative kennen.',
      guildBody2: 'Auch <strong>Fehlermeldungen, Fragen zu Problemen, Funktionswünsche und Verbesserungsvorschläge</strong> sind willkommen.',
      guildBody3: 'Gemeinsam gestalten wir die Zukunft von FUNtasia.',
      guildButton: 'Dem Alchemist Guild beitreten ↗',
      aboutEyebrow: 'Der Entwickler', aboutBody: 'Seit dem dritten Lebensjahr am Klavier, seit dem sechzehnten am Komponieren. Hʉeliang entwickelt Musik und Software, damit kreative Arbeit für alle zugänglich wird.', aboutButton: 'Profil lesen',
      supportTitle: 'Schnell zur richtigen Information.', supportBody: 'Hier findest du Produktinformationen, Kontaktmöglichkeiten für FUNtasia Records und weitere Hilfen.', supportButton: 'Zum Support', supportNote: 'Die bisherigen Websites von FUNtasia Audio und FUNtasia Records bleiben weiterhin erreichbar.',
      funSupportTitle: "Damit kreative Werkzeuge für alle zugänglich bleiben.",
      funSupportLead: "Bei FUNtasia Audio entwickeln wir kostenlose Produkte mit demselben Qualitätsanspruch wie kostenpflichtige. Entwicklung und Pflege erfordern viel Zeit und Ressourcen. Deine Unterstützung hilft uns, diese Arbeit fortzusetzen.",
      funSupportAppealTitle: "Bitte unterstütze die weitere Entwicklung von FUNtasia Audio.",
      funSupportAppealBody: "Auf unserer Amazon-Wunschliste stehen Entwicklungsgeräte sowie Lebensmittel und Dinge des täglichen Bedarfs. Wenn du unsere Überzeugung teilst und uns unterstützen kannst, freuen wir uns über deine Hilfe.",
      funSupportButton: "Über die Amazon-Wunschliste unterstützen ↗",
      funSupportReassurance: "Jede Unterstützung ist freiwillig. Qualität und Nutzungsbedingungen unserer kostenlosen Plug-ins hängen nicht davon ab, ob du etwas beiträgst. Bitte unterstütze uns nur, wenn es für dich möglich ist.",
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
      studioTag: 'Station audionumérique', studioBody: 'Visitez le site de la bêta publique de FUNtasia Studio et de ses extensions gratuites.', studioMore: 'Suivre le développement →',
      utilitiesTag: 'Outils Windows', utilitiesBody: 'Découvrez les outils Windows : FUNtasia Quick Launcher, Player, Mixer et Session Note.', utilitiesMore: 'Explorer les outils →',
      goodsTag: 'Bonus · Fonds d’écran gratuits', goodsBody: 'Téléchargez 21 fonds d’écran gratuits et sept thèmes de curseurs pour Windows 11.', goodsMore: 'Voir les fonds d’écran →',
      guildEyebrow: 'Communauté · Discord', guildSub: 'La communauté officielle FUNtasia, où se rencontrent créativité et idées.',
      guildBody1: 'Échangez autour de la production musicale et du sound design, partagez vos créations et rencontrez d’autres passionnés.',
      guildBody2: 'Nous accueillons aussi les <strong>signalements de bugs, demandes d’aide, suggestions de fonctions et propositions d’amélioration</strong>.',
      guildBody3: 'Votre voix contribue à construire l’avenir de FUNtasia.',
      guildButton: 'Rejoindre l’Alchemist Guild ↗',
      aboutEyebrow: 'Le créateur', aboutBody: 'Pianiste depuis l’âge de trois ans et compositeur depuis seize ans, Hʉeliang crée de la musique et des logiciels pour rendre la création accessible à tous.', aboutButton: 'Lire le profil',
      supportTitle: 'Trouvez facilement les bonnes informations.', supportBody: 'Accédez aux informations produits, aux contacts de FUNtasia Records et aux ressources utiles.', supportButton: 'Voir l’assistance', supportNote: 'Les anciens sites FUNtasia Audio et FUNtasia Records restent également accessibles.',
      funSupportTitle: "Pour que les outils de création restent accessibles à tous.",
      funSupportLead: "Chez FUNtasia Audio, nous apportons le même soin et les mêmes exigences de qualité aux produits gratuits et payants. Leur développement et leur entretien demandent beaucoup de temps et de ressources. Votre soutien nous aide à poursuivre ce travail.",
      funSupportAppealTitle: "Soutenez, si vous le pouvez, le développement de FUNtasia Audio.",
      funSupportAppealBody: "Notre liste de souhaits Amazon comprend du matériel de développement, mais aussi des produits alimentaires et des articles du quotidien. Si vous partagez notre démarche et pouvez nous aider, votre soutien compte beaucoup.",
      funSupportButton: "Soutenir via la liste de souhaits Amazon ↗",
      funSupportReassurance: "Tout soutien est entièrement facultatif. La qualité et les conditions d’utilisation de nos plug-ins gratuits ne dépendent pas d’une contribution. N’apportez votre aide que si vous en avez la possibilité.",
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
      studioTag: 'Цифровая аудиостанция', studioBody: 'Перейдите на страницу публичной бета-версии FUNtasia Studio и бесплатных дополнений.', studioMore: 'Новости разработки →',
      utilitiesTag: 'Инструменты Windows', utilitiesBody: 'Программы для Windows: FUNtasia Quick Launcher, Player, Mixer и Session Note.', utilitiesMore: 'Смотреть инструменты →',
      goodsTag: 'Материалы · Бесплатные обои', goodsBody: 'Скачайте 21 бесплатные обои и семь тем курсоров для Windows 11.', goodsMore: 'Смотреть обои →',
      guildEyebrow: 'Сообщество · Discord', guildSub: 'Официальное сообщество FUNtasia — место встречи идей и творчества.',
      guildBody1: 'Обсуждайте создание музыки и саунд-дизайн, делитесь работами и общайтесь с другими авторами.',
      guildBody2: 'Мы принимаем <strong>сообщения об ошибках, вопросы о неполадках, предложения новых функций и улучшений</strong>.',
      guildBody3: 'Ваше мнение помогает формировать будущее FUNtasia.',
      guildButton: 'Присоединиться к Alchemist Guild ↗',
      aboutEyebrow: 'Об авторе', aboutBody: 'Hʉeliang играет на фортепиано с трёх лет и пишет музыку с шестнадцати. Он создаёт музыку и программы, делая творчество доступнее для всех.', aboutButton: 'Читать профиль',
      supportTitle: 'Нужная информация — без лишних поисков.', supportBody: 'Здесь собраны сведения о продуктах, контакты FUNtasia Records и полезные ресурсы.', supportButton: 'Раздел поддержки', supportNote: 'Предыдущие сайты FUNtasia Audio и FUNtasia Records по-прежнему доступны.',
      funSupportTitle: "Чтобы инструменты для творчества оставались доступны каждому.",
      funSupportLead: "FUNtasia Audio уделяет бесплатным продуктам столько же внимания и заботы о качестве, сколько и платным. Разработка и поддержка требуют много времени и ресурсов, и ваша помощь позволяет продолжать эту работу.",
      funSupportAppealTitle: "Пожалуйста, поддержите дальнейшую разработку FUNtasia Audio, если можете.",
      funSupportAppealBody: "В нашем списке желаний Amazon есть оборудование для разработки, а также продукты питания и повседневные необходимые вещи. Если вы разделяете наши идеи и можете помочь, ваша поддержка будет очень ценной.",
      funSupportButton: "Поддержать через список желаний Amazon ↗",
      funSupportReassurance: "Любая помощь полностью добровольна. Качество и условия использования бесплатных плагинов не зависят от пожертвований. Поддерживайте нас только в пределах ваших возможностей.",
      audioAlt: 'Интерфейс аудиоплагина FUN Rack', recordsAlt: 'Иллюстрированная обложка FUNtasia Records с цветами', studioAlt: 'DAW FUNtasia Studio с дорожками и Device Rack', utilitiesAlt: 'FUNtasia Quick Launcher для Windows в теме Original Sage', goodsAlt: 'Обои FUNtasia Studio Original Sage',
      logoAria: 'Главная FUNtasia', navAria: 'Главная навигация', languageAria: 'Выбор языка сайта', quickAria: 'Поиск по интересам'
    }
  };

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
  const aboutLinks = [...document.querySelectorAll('a[href="about/"]')];
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
    for (const link of aboutLinks) link.href = locale === 'ja' ? 'about/' : 'about/' + locale + '/';
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
