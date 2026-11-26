/* Shared, accessible six-language content for the Utilities and Goods pages.
 * Visible Japanese source is preserved in HTML when scripting is disabled.
 * Language is inferred from the browser on first visit; user changes persist.
 */
(() => {
  'use strict';
  const locales = ['ja', 'en', 'de', 'fr', 'ru', 'zh-CN'];
  const storageKey = 'funtasia.home.language';
  const page = document.body.dataset.i18nPage;
  if (!['utilities', 'goods'].includes(page)) return;

  // Each row: original Japanese, English, German, French, Russian.
  // Keep this table aligned with the Japanese source page's text nodes.
  const utilityRows = [
    ["FUNtasia Audio Compare · Original Sage（クリックで拡大）","FUNtasia Audio Compare · Original Sage (click to enlarge)","FUNtasia Audio Compare · Original Sage (zum Vergrößern klicken)","FUNtasia Audio Compare · Original Sage (cliquer pour agrandir)","FUNtasia Audio Compare · Original Sage (нажмите для увеличения)"],
    ["公開ベータ · v0.2.1 · Windows 10/11 x64 · 無料","Public beta · v0.2.1 · Windows 10/11 x64 · Free","Öffentliche Beta · v0.2.1 · Windows 10/11 x64 · Kostenlos","Bêta publique · v0.2.1 · Windows 10/11 x64 · Gratuit","Публичная бета · v0.2.1 · Windows 10/11 x64 · Бесплатно"],
    ["最大4つの音源を同じ条件で聴き比べる、Windows用スタンドアロン・オーディオ比較ツール。A/B/C/Dの切替とラウドネスマッチングで、ミックスやマスタリングの判断をサポートします。","A standalone Windows tool for comparing up to four audio references under consistent listening conditions. Switch between A/B/C/D sources and match loudness when evaluating mixes or masters.","Ein eigenständiges Windows-Tool zum Vergleich von bis zu vier Audioreferenzen unter gleichen Hörbedingungen. Wechsle zwischen A/B/C/D und gleiche die Lautheit für Mix- und Mastering-Entscheidungen ab.","Un outil Windows autonome pour comparer jusqu’à quatre références audio dans des conditions d’écoute cohérentes. Passez de A à D et égalisez la sonie pour évaluer vos mixages et masters.","Автономная программа для Windows, позволяющая сравнивать до четырёх аудиофайлов в сопоставимых условиях. Переключайтесь между A/B/C/D и выравнивайте громкость при оценке сведения и мастеринга."],
    ["最大4音源（A/B/C/D）","Up to four sources (A/B/C/D)","Bis zu vier Quellen (A/B/C/D)","Jusqu’à quatre sources (A/B/C/D)","До четырёх источников (A/B/C/D)"],
    ["LUFS解析・音量マッチング","LUFS analysis · loudness matching","LUFS-Analyse · Lautheitsabgleich","Analyse LUFS · égalisation de sonie","Анализ LUFS · выравнивание громкости"],
    ["True Peak測定","True Peak measurement","True-Peak-Messung","Mesure True Peak","Измерение True Peak"],
    ["相関を考慮したクロスフェード","Correlation-aware crossfade","Korrelationsbewusstes Crossfade","Fondu enchaîné tenant compte de la corrélation","Кроссфейд с учётом корреляции"],
    ["Blind X/Y試聴","Blind X/Y listening","Blindes X/Y-Hörvergleich","Écoute à l’aveugle X/Y","Слепое прослушивание X/Y"],
    ["セッション保存・復元","Save and restore sessions","Sessions speichern und wiederherstellen","Sauvegarde et restauration de sessions","Сохранение и восстановление сессий"],
    ["9色のダークテーマ","Nine dark themes","Neun dunkle Themes","Neuf thèmes sombres","Девять тёмных тем"],
    ["Original Sageを初期色に、9色のダークテーマを搭載。ブラインド比較や測定結果の確認にも対応し、比較セッションを保存・復元できます。","Choose from nine dark themes, with Original Sage as the default. Blind comparisons, measurement results and session saving and restoration are supported.","Neun dunkle Themes mit Original Sage als Standard. Blindvergleiche, Messwerte und das Speichern und Wiederherstellen von Sessions werden unterstützt.","Neuf thèmes sombres, dont Original Sage par défaut. Comparez à l’aveugle, consultez les mesures et enregistrez ou restaurez vos sessions.","Девять тёмных тем, по умолчанию Original Sage. Доступны слепое сравнение, просмотр измерений, сохранение и восстановление сессий."],
    ["FUNtasia Audio Compareをダウンロード（ZIP） →","Download FUNtasia Audio Compare (ZIP) →","FUNtasia Audio Compare herunterladen (ZIP) →","Télécharger FUNtasia Audio Compare (ZIP) →","Скачать FUNtasia Audio Compare (ZIP) →"],
    ["リリースノート・インストール案内 →","Release notes and installation details →","Versionshinweise und Installationsanleitung →","Notes de version et installation →","Примечания к выпуску и установка →"],
    ["公開ベータ版です。配布内容とインストール方法は公式リリースページをご確認ください。","This is a public beta. Check the official release page for package contents and installation details.","Dies ist eine öffentliche Beta. Paketinhalt und Installationshinweise findest du auf der offiziellen Release-Seite.","Il s’agit d’une bêta publique. Consultez la page officielle pour le contenu de l’archive et l’installation.","Это публичная бета-версия. Состав архива и инструкции по установке приведены на официальной странице выпуска."],
    ["← 総合トップへ","← Back to home","← Zur Startseite","← Retour à l’accueil","← На главную"],
    ["制作を支える、小さく便利なツール。","Small tools for your creative flow.","Kleine Helfer für deinen kreativen Alltag.","De petits outils pour faciliter la création.","Небольшие инструменты для творчества."],
    ["FUNtasia Audio Compare、Quick Launcher、Player、Mixer、Session Noteなど、公開中のWindows向けアプリをご紹介します。","Explore our Windows applications: Audio Compare, Quick Launcher, Player, Mixer and Session Note.","Entdecke unsere Windows-Programme: Audio Compare, Quick Launcher, Player, Mixer und Session Note.","Découvrez nos applications Windows : Audio Compare, Quick Launcher, Player, Mixer et Session Note.","Знакомьтесь с нашими приложениями для Windows: Audio Compare, Quick Launcher, Player, Mixer и Session Note."],
    ["Utilitiesのご案内","About Utilities","Über Utilities","À propos des utilitaires","Об утилитах"],
    ["日々の制作を支えるツール","Tools for everyday creativity","Werkzeuge für den kreativen Alltag","Des outils pour créer au quotidien","Инструменты для повседневного творчества"],
    ["音楽制作やWindowsでの作業を快適にするユーティリティを紹介するためのページです。公開状態や基本機能とともに、各ツールの入手先をご案内します。","A home for helpful tools that make music production and Windows workflows easier. Find features, availability and official downloads here.","Hier stellen wir nützliche Programme für Musikproduktion und Windows vor – mit Funktionen, Veröffentlichungsstatus und offiziellen Downloads.","Cette page présente des outils qui simplifient la production musicale et l’utilisation de Windows, avec leurs fonctions et liens officiels.","Здесь собраны программы, упрощающие создание музыки и работу в Windows, с описанием функций и официальными ссылками."],
    ["製品の公開情報","Release information","Informationen zu Veröffentlichungen","Informations sur les versions","Информация о выпусках"],
    ["対応OS、バージョン、公式の配布先をご確認いただけます。公開ベータには未検証の環境や動作が残る場合があります。","Check supported Windows versions, releases and official download sources. Public betas may still have untested situations.","Hier findest du unterstützte Systeme, Versionen und offizielle Downloads. Öffentliche Betas können noch ungetestete Fälle enthalten.","Vérifiez les systèmes compatibles, les versions et les téléchargements officiels. Certaines situations restent non testées en bêta.","Проверяйте совместимость, версии и официальные ссылки. Публичные бета-версии могут содержать непроверенные сценарии."],
    ["サポートページを見る →","Visit support →","Zum Support →","Voir l’assistance →","Перейти в поддержку →"],
    ["公開済みのツール","Available tools","Verfügbare Werkzeuge","Outils disponibles","Доступные инструменты"],
    ["公開ベータ · v0.1.16 · Windows 11 x64","Public beta · v0.1.16 · Windows 11 x64","Öffentliche Beta · v0.1.16 · Windows 11 x64","Bêta publique · v0.1.16 · Windows 11 x64","Публичная бета · v0.1.16 · Windows 11 x64"],
    ["創作のワークスペースへ、すぐアクセス。","Your creative workspace, one shortcut away.","Dein kreativer Arbeitsplatz – nur einen Tastendruck entfernt.","Votre espace de création, à portée de raccourci.","Ваше творческое пространство — по одному сочетанию клавиш."],
    ["で呼び出せる、キーボード中心の軽量Windowsランチャーです。アプリ、ファイル、フォルダー、URLの検索・起動をひとつにまとめます。"," opens this lightweight, keyboard-first Windows launcher. Search and launch apps, files, folders and URLs in one place."," öffnet diesen schlanken Windows-Launcher mit Tastaturfokus. Suche und starte Apps, Dateien, Ordner und URLs an einem Ort."," ouvre ce lanceur Windows léger centré sur le clavier. Recherchez et lancez applications, fichiers, dossiers et URL au même endroit."," открывает лёгкий лаунчер Windows с управлением с клавиатуры. Поиск и запуск приложений, файлов, папок и URL — в одном месте."],
    ["ドラッグ＆ドロップで追加","Add with drag & drop","Per Drag-and-drop hinzufügen","Ajout par glisser-déposer","Добавление перетаскиванием"],
    ["ショートカットの並べ替え・ピン留め","Reorder and pin shortcuts","Shortcuts sortieren und anheften","Trier et épingler les raccourcis","Сортировка и закрепление ярлыков"],
    ["日本語 / English","Japanese / English","Japanisch / Englisch","Japonais / anglais","Японский / английский"],
    ["FUNtasia Studioの7色テーマ","Seven FUNtasia Studio themes","Sieben FUNtasia-Studio-Themes","Sept thèmes FUNtasia Studio","Семь тем FUNtasia Studio"],
    ["Windows起動時の自動起動（任意）","Optional startup with Windows","Optionaler Start mit Windows","Démarrage automatique facultatif","Автозапуск с Windows (по желанию)"],
    ["標準アイコンはOriginal Sage。Charcoal、Deep Brown、Lapis Lazuli、Lavender、Coral Red、Mikan Orangeの6色も、ショートカットの着せ替え用アイコンとして用意しています。","Original Sage is the default icon. Six additional colors—Charcoal, Deep Brown, Lapis Lazuli, Lavender, Coral Red and Mikan Orange—are included for personalizing shortcuts.","Original Sage ist das Standardsymbol. Sechs weitere Farben – Charcoal, Deep Brown, Lapis Lazuli, Lavender, Coral Red und Mikan Orange – ermöglichen eigene Shortcut-Icons.","Original Sage est l’icône par défaut. Six couleurs supplémentaires — Charcoal, Deep Brown, Lapis Lazuli, Lavender, Coral Red et Mikan Orange — sont incluses pour personnaliser les raccourcis.","Стандартная иконка — Original Sage. Для ярлыков также доступны шесть цветов: Charcoal, Deep Brown, Lapis Lazuli, Lavender, Coral Red и Mikan Orange."],
    ["Windows版をダウンロード（ZIP） →","Download for Windows (ZIP) →","Für Windows herunterladen (ZIP) →","Télécharger pour Windows (ZIP) →","Скачать для Windows (ZIP) →"],
    ["リリースノート・配布内容を見る →","Release notes and package details →","Versionshinweise und Paketinhalt →","Notes de version et contenu →","Примечания к выпуску и состав архива →"],
    ["基本的なWindows実機テストを通過したベータ版です。すべての環境での動作を保証するものではありません。","This beta passed basic tests on a Windows PC, but operation in every environment is not guaranteed.","Diese Beta hat grundlegende Tests auf einem Windows-PC bestanden; der Betrieb in jeder Umgebung ist nicht garantiert.","Cette bêta a passé les tests de base sur un PC Windows, sans garantie pour toutes les configurations.","Бета-версия прошла базовые проверки на Windows, но работа во всех конфигурациях не гарантируется."],
    ["Original Sage · Windows 実機画面（クリックで拡大）","Original Sage · Windows screenshot (click to enlarge)","Original Sage · Windows-Screenshot (zum Vergrößern klicken)","Original Sage · Capture Windows (cliquer pour agrandir)","Original Sage · Скриншот Windows (нажмите для увеличения)"],
    ["公開中 · v1.0.0 · Windows 11","Available · v1.0.0 · Windows 11","Veröffentlicht · v1.0.0 · Windows 11","Disponible · v1.0.0 · Windows 11","Доступно · v1.0.0 · Windows 11"],
    ["Windows 11の通知領域から使える、コンパクトなアプリ別ボリュームミキサー。アプリごとの音量調整やミュート、操作する出力デバイスの選択、よく使うアプリのピン留めに対応しています。","A compact app-volume mixer for the Windows 11 system tray. Adjust or mute individual apps, choose an output device and pin favorites.","Ein kompakter App-Lautstärkemixer für den Infobereich von Windows 11. Regle und stummschalte Apps, wähle ein Ausgabegerät und hefte Favoriten an.","Un mixeur de volume compact dans la zone de notification de Windows 11. Réglez chaque application, choisissez une sortie et épinglez vos favoris.","Компактный микшер громкости приложений в трее Windows 11. Регулируйте громкость и звук отдельных программ, выбирайте устройство вывода и закрепляйте избранное."],
    ["FUNtasia Studioに合わせた7色のテーマと、Kaisei Optiを使った落ち着いたデザイン。選択した出力デバイスの音量を操作でき、Windowsの既定の出力デバイスは切り替えません。","Seven themes matching FUNtasia Studio and a calm Kaisei Opti design. Control the selected output device without changing the Windows default.","Sieben auf FUNtasia Studio abgestimmte Themes und ruhiges Design mit Kaisei Opti. Regle das ausgewählte Gerät, ohne das Windows-Standardgerät zu ändern.","Sept thèmes assortis à FUNtasia Studio et une interface sobre avec Kaisei Opti. Réglez la sortie choisie sans modifier la sortie par défaut de Windows.","Семь тем в стиле FUNtasia Studio и спокойный интерфейс со шрифтом Kaisei Opti. Управляет выбранным устройством, не меняя устройство Windows по умолчанию."],
    ["FUNtasia Mixer v1.0.0をダウンロード（ZIP） →","Download FUNtasia Mixer v1.0.0 (ZIP) →","FUNtasia Mixer v1.0.0 herunterladen (ZIP) →","Télécharger FUNtasia Mixer v1.0.0 (ZIP) →","Скачать FUNtasia Mixer v1.0.0 (ZIP) →"],
    ["リリース・更新情報を見る →","Release and update information →","Versions- und Updateinformationen →","Versions et mises à jour →","Информация о выпуске и обновлениях →"],
    ["FUNtasia Mixer · Original Sage（画像を拡大）","FUNtasia Mixer · Original Sage (enlarge image)","FUNtasia Mixer · Original Sage (Bild vergrößern)","FUNtasia Mixer · Original Sage (agrandir l’image)","FUNtasia Mixer · Original Sage (увеличить изображение)"],
    ["公開中 · v1.2.1 · Windows x64 · 無料","Available · v1.2.1 · Windows x64 · Free","Veröffentlicht · v1.2.1 · Windows x64 · Kostenlos","Disponible · v1.2.1 · Windows x64 · Gratuit","Доступно · v1.2.1 · Windows x64 · Бесплатно"],
    ["再生のためのシンプルなスタンドアロン・オーディオプレーヤー。Windowsからファイルを開くかドラッグ＆ドロップし、再生・停止・リピート・シーク・音量を操作できます。","A simple standalone audio player. Open or drop files from Windows; play, pause, stop, repeat, seek and adjust the volume.","Ein einfacher eigenständiger Audioplayer. Dateien öffnen oder per Drag-and-drop laden; Wiedergabe, Pause, Stopp, Wiederholung, Suche und Lautstärke steuern.","Un lecteur audio autonome et simple. Ouvrez ou déposez des fichiers ; lecture, pause, arrêt, boucle, navigation et volume sont accessibles.","Простой автономный аудиоплеер. Открывайте или перетаскивайте файлы; доступны воспроизведение, пауза, стоп, повтор, перемотка и громкость."],
    ["再生・一時停止・停止","Play · Pause · Stop","Wiedergabe · Pause · Stopp","Lecture · Pause · Arrêt","Воспроизведение · Пауза · Стоп"],
    ["リピート・シーク・音量","Repeat · Seek · Volume","Wiederholen · Suchen · Lautstärke","Boucle · Navigation · Volume","Повтор · Перемотка · Громкость"],
    ["ドラッグ＆ドロップ","Drag & drop","Drag-and-drop","Glisser-déposer","Перетаскивание"],
    ["ファイルの関連付け","File associations","Dateizuordnungen","Associations de fichiers","Ассоциации файлов"],
    ["タイトル・アーティスト情報","Title and artist metadata","Titel- und Künstlerinfos","Titre et artiste","Название и исполнитель"],
    ["アートワーク表示","Artwork display","Cover-Anzeige","Affichage des pochettes","Отображение обложек"],
    ["7色テーマ","Seven color themes","Sieben Farbthemen","Sept thèmes de couleur","Семь цветовых тем"],
    ["5言語マニュアル","Manuals in five languages","Handbücher in fünf Sprachen","Manuels en cinq langues","Руководства на пяти языках"],
    ["v1.2.1ではASIO対応の音声出力設定と7色のテーマに対応。出力デバイスとテーマの選択を保存します。EQ・ノーマライズ・リミッター・サチュレーションなどの音声処理は追加しません。","Version 1.2.1 adds ASIO output settings and seven themes, saving device and theme choices. No EQ, normalization, limiting or saturation is added.","Version 1.2.1 bietet ASIO-Ausgabe und sieben Themes und speichert Geräte- und Theme-Auswahl. EQ, Normalisierung, Limiting und Sättigung gehören nicht dazu.","La version 1.2.1 inclut la sortie ASIO et sept thèmes et mémorise les choix. Aucun traitement EQ, normalisation, limiteur ou saturation n’est ajouté.","Версия 1.2.1 поддерживает вывод ASIO и семь тем, сохраняя выбранное устройство и тему. Эквалайзер, нормализация, лимитер и сатурация не добавляются."],
    ["FUNtasia Playerをダウンロード（ZIP） →","Download FUNtasia Player (ZIP) →","FUNtasia Player herunterladen (ZIP) →","Télécharger FUNtasia Player (ZIP) →","Скачать FUNtasia Player (ZIP) →"],
    ["リリース情報・説明を見る →","Release details and description →","Veröffentlichung und Beschreibung →","Version et description →","Выпуск и описание →"],
    ["Windows 11 · x64 · 公開ベータ v0.1.0k","Windows 11 · x64 · Public beta v0.1.0k","Windows 11 · x64 · Öffentliche Beta v0.1.0k","Windows 11 · x64 · Bêta publique v0.1.0k","Windows 11 · x64 · Публичная бета v0.1.0k"],
    ["ひらめきを残して、音楽へ。制作セッションごとにアイデア・メモ・ToDoをまとめ、BPM・キー・進行状況も記録できる軽量デスクトップアプリです。","Capture ideas and bring them into your music. A lightweight desktop app for per-session notes, tasks, BPM, key and production progress.","Halte Ideen fest und mach Musik daraus. Eine leichte Desktop-App für Notizen, Aufgaben, BPM, Tonart und Fortschritt pro Session.","Gardez vos idées pour en faire de la musique. Une application légère pour notes, tâches, BPM, tonalité et avancement de chaque session.","Сохраняйте идеи для будущей музыки. Лёгкая программа для заметок, задач, BPM, тональности и статуса каждой сессии."],
    ["ローカル自動保存、日本語／English切替、Kaisei Opti内蔵、7色のダークテーマ、最前面固定、Ctrl + Alt + Nでの表示切替に対応。作曲の流れを邪魔せず、必要なときだけ呼び出せます。","Local autosave, Japanese/English UI, embedded Kaisei Opti, seven dark themes, always-on-top and Ctrl + Alt + N toggling. Bring it up only when needed.","Lokales Autosave, Japanisch/Englisch, Kaisei Opti, sieben dunkle Themes, Immer-im-Vordergrund und Ctrl + Alt + N zum Ein-/Ausblenden.","Sauvegarde locale automatique, interface japonais/anglais, Kaisei Opti intégré, sept thèmes sombres, toujours au premier plan et raccourci Ctrl + Alt + N.","Локальное автосохранение, японский/английский интерфейс, Kaisei Opti, семь тёмных тем, поверх окон и переключение Ctrl + Alt + N."],
    ["Windows版をZIPでダウンロード →","Download Windows ZIP →","Windows-ZIP herunterladen →","Télécharger le ZIP Windows →","Скачать ZIP для Windows →"],
    ["リリースノート・インストール案内を見る →","Release notes and installation guide →","Versionshinweise und Installation →","Notes de version et installation →","Выпуск и инструкция по установке →"],
    ["ベータ版です。大切な制作メモはバックアップを取ってください。","This is a beta. Please back up important production notes.","Dies ist eine Beta. Bitte sichere wichtige Produktionsnotizen.","Version bêta : sauvegardez vos notes de production importantes.","Это бета-версия. Сохраняйте резервные копии важных заметок."],
    ["公開済み製品の入手方法や更新情報は、各製品の公式配布先でご確認ください。","For downloads and updates, please refer to each product’s official release page.","Downloads und Updates findest du auf der offiziellen Veröffentlichungsseite des jeweiligen Produkts.","Pour les téléchargements et mises à jour, consultez la page officielle de chaque produit.","Ссылки на загрузки и обновления доступны на официальных страницах каждого продукта."]
  ];

  const goodsRows = [
    ["← 総合トップへ","← Back to home","← Zur Startseite","← Retour à l’accueil","← На главную"],
    ["FUNtasiaを、デスクトップにも。","Bring FUNtasia to your desktop.","FUNtasia für deinen Desktop.","FUNtasia jusque sur votre bureau.","FUNtasia — и на вашем рабочем столе."],
    ["FUNtasia Studioの植物をモチーフにしたモノグラムを、7つの落ち着いたテーマカラーで楽しめる無料壁紙。4K横型・ウルトラワイド・縦型の3サイズ、合計21枚をまとめてダウンロードできます。Windows 11向けの無料マウスカーソル7テーマもご用意しています。","Free wallpapers featuring FUNtasia Studio’s botanical monogram in seven calm colors. Download all 21 images in 4K, ultrawide and portrait formats, plus seven free Windows 11 cursor themes.","Kostenlose Wallpaper mit dem botanischen Monogramm von FUNtasia Studio in sieben dezenten Farben. Lade 21 Bilder in 4K, Ultrawide und Hochformat sowie sieben kostenlose Windows-11-Cursor-Themes herunter.","Des fonds d’écran gratuits avec le monogramme végétal de FUNtasia Studio, déclinés en sept couleurs douces. Téléchargez 21 images en 4K, ultra-large et portrait, ainsi que sept thèmes de curseurs Windows 11.","Бесплатные обои с растительной монограммой FUNtasia Studio в семи спокойных цветах. 21 изображение в 4K, сверхшироком и вертикальном форматах, а также семь тем курсоров для Windows 11."],
    ["7つのカラーテーマ","Seven color themes","Sieben Farbthemen","Sept thèmes de couleur","Семь цветовых тем"],
    ["無料ダウンロード","Free downloads","Kostenlose Downloads","Téléchargements gratuits","Бесплатные загрузки"],
    ["壁紙21枚をダウンロード（ZIP） ↗","Download 21 wallpapers (ZIP) ↗","21 Wallpaper herunterladen (ZIP) ↗","Télécharger les 21 fonds d’écran (ZIP) ↗","Скачать 21 изображение (ZIP) ↗"],
    ["リリース情報を見る ↗","View release information ↗","Versionsinformationen ansehen ↗","Voir les informations de version ↗","Сведения о выпуске ↗"],
    ["収録サイズ：","Included sizes:","Enthaltene Größen:","Formats inclus :","Размеры:"],
    ["3840 × 2160（4K）、5120 × 2160（ウルトラワイド）、2160 × 3840（縦型）","3840 × 2160 (4K), 5120 × 2160 (ultrawide), 2160 × 3840 (portrait)","3840 × 2160 (4K), 5120 × 2160 (Ultrawide), 2160 × 3840 (Hochformat)","3840 × 2160 (4K), 5120 × 2160 (ultra-large), 2160 × 3840 (portrait)","3840 × 2160 (4K), 5120 × 2160 (сверхширокий), 2160 × 3840 (вертикальный)"],
    ["内容：","Contents:","Inhalt:","Contenu :","Содержимое:"],
    ["7色 × 3サイズ＝21枚のPNG画像 / ZIP約37.1 MB","7 colors × 3 sizes = 21 PNG files / ZIP approx. 37.1 MB","7 Farben × 3 Größen = 21 PNG-Dateien / ZIP ca. 37,1 MB","7 couleurs × 3 formats = 21 fichiers PNG / ZIP env. 37,1 Mo","7 цветов × 3 размера = 21 PNG-файл / ZIP около 37,1 МБ"],
    ["壁紙のプレビュー画像とZIPは、現在も既存のFUNtasia Audio公開サイト・GitHub Releasesを利用しています。移行中も既存のダウンロードURLを維持します。","Wallpaper previews and ZIP archives are still hosted on the existing FUNtasia Audio website and GitHub Releases. The download links remain unchanged during the transition.","Vorschauen und ZIP-Dateien liegen weiterhin auf der bisherigen FUNtasia-Audio-Website und bei GitHub Releases. Die Downloadlinks bleiben beim Übergang bestehen.","Les aperçus et archives ZIP sont toujours hébergés sur le site FUNtasia Audio existant et sur GitHub Releases. Les liens restent inchangés pendant la transition.","Превью и ZIP-архивы по-прежнему размещены на сайте FUNtasia Audio и в GitHub Releases. При переносе ссылки на загрузку не изменяются."],
    ["FUNtasiaを、マウス操作にも。","Bring FUNtasia to your cursor.","FUNtasia auch für deinen Mauszeiger.","FUNtasia jusqu’au pointeur de votre souris.","FUNtasia — даже для курсора мыши."],
    ["FUNtasia Studioの7色テーマに合わせた、Windows 11向けの無料マウスカーソルセット。各テーマには17種類のポインター役割が含まれ、待機中とバックグラウンド作業中のアニメーションカーソルも収録されています。","Free cursor sets for Windows 11 in seven FUNtasia Studio colors. Each theme includes 17 pointer roles, with animated cursors for waiting and background activity.","Kostenlose Windows-11-Cursor in sieben FUNtasia-Studio-Farben. Jedes Theme enthält 17 Zeigerfunktionen sowie animierte Warte- und Hintergrundcursor.","Des curseurs gratuits pour Windows 11 dans les sept couleurs FUNtasia Studio. Chaque thème contient 17 types de pointeurs, dont des curseurs animés pour l’attente et l’activité en arrière-plan.","Бесплатные курсоры для Windows 11 в семи цветах FUNtasia Studio. В каждой теме 17 типов указателей, включая анимации ожидания и фоновой работы."],
    ["カーソル7テーマをダウンロード（ZIP） ↗","Download 7 cursor themes (ZIP) ↗","7 Cursor-Themes herunterladen (ZIP) ↗","Télécharger les 7 thèmes de curseurs (ZIP) ↗","Скачать 7 тем курсоров (ZIP) ↗"],
    ["カーソルのリリース情報を見る ↗","Cursor release details ↗","Cursor-Versionshinweise ↗","Informations de version des curseurs ↗","Информация о выпуске курсоров ↗"],
    ["Windows 11向け・無料 / v0.1 / ZIP約3.6 MB","For Windows 11 · Free / v0.1 / ZIP approx. 3.6 MB","Für Windows 11 · Kostenlos / v0.1 / ZIP ca. 3,6 MB","Pour Windows 11 · Gratuit / v0.1 / ZIP env. 3,6 Mo","Для Windows 11 · Бесплатно / v0.1 / ZIP около 3,6 МБ"],
    ["。アーカイブを展開し、付属の",". Extract the archive and open the included ",". Entpacke das Archiv und öffne die enthaltene Datei ",". Extrayez l’archive et ouvrez le fichier fourni ",". Распакуйте архив и откройте файл "],
    ["からカラーを選択できます。詳しい手順・注意事項はリリース情報をご確認ください。"," to choose your color. See the release notes for detailed instructions and precautions."," , um eine Farbe auszuwählen. Anleitungen und Hinweise stehen in den Versionsinformationen."," pour choisir une couleur. Consultez les notes de version pour les instructions et précautions."," , чтобы выбрать цвет. Инструкции и предупреждения указаны на странице выпуска."]
,
    ["FUNtasiaを、好きなアイテムに。","Bring FUNtasia to the things you love.","FUNtasia für deine Lieblingsstücke.","FUNtasia sur les objets que vous aimez.","FUNtasia — на любимых вещах."],
    ["SUZURIなどにないアイテムも、好きなプリントサービスで。フォルテ単独・FUNtasia文字付き・Hʉeliang DJロゴの透過PNGを無料で配布しています。","Make personalized items even when they are not sold on SUZURI. Download transparent PNGs of the forte emblem, FUNtasia wordmark and Hʉeliang DJ logo for your preferred printing service.","Gestalte persönliche Artikel auch dann, wenn SUZURI sie nicht anbietet. Lade transparente PNGs des Forte-Symbols, des FUNtasia-Schriftzugs und des Hʉeliang-DJ-Logos herunter.","Personnalisez même les objets indisponibles sur SUZURI. Téléchargez les PNG transparents du symbole forte, du logo FUNtasia et du logo DJ Hʉeliang pour votre imprimeur préféré.","Создавайте персональные вещи, даже если их нет на SUZURI. Скачайте PNG с прозрачным фоном: знак forte, логотип FUNtasia и DJ-логотип Hʉeliang."],
    ["フォルテ単独ロゴ","Forte emblem","Forte-Symbol","Symbole forte","Символ forte"],
    ["FUNtasia Studioの追加8色。PNG・背景透過。","Eight additional FUNtasia Studio colors. Transparent PNGs.","Acht weitere FUNtasia-Studio-Farben. Transparente PNGs.","Huit couleurs supplémentaires de FUNtasia Studio. PNG transparents.","Восемь дополнительных цветов FUNtasia Studio. PNG с прозрачным фоном."],
    ["8色ZIPをダウンロード","Download 8-color ZIP","8-Farben-ZIP herunterladen","Télécharger le ZIP de 8 couleurs","Скачать ZIP с 8 цветами"],
    ["フォルテ＋FUNtasia文字付きロゴ","Forte + FUNtasia wordmark","Forte + FUNtasia-Schriftzug","Forte + nom FUNtasia","Forte + надпись FUNtasia"],
    ["フォルテとFUNtasiaの組み合わせ。追加8色・背景透過PNG。","Forte emblem with FUNtasia lettering. Eight additional colors, transparent PNGs.","Forte-Symbol mit FUNtasia-Schriftzug. Acht weitere Farben, transparente PNGs.","Symbole forte et texte FUNtasia. Huit couleurs supplémentaires, PNG transparents.","Знак forte и надпись FUNtasia. Восемь дополнительных цветов, прозрачные PNG."],
    ["Hʉeliang DJロゴ","Hʉeliang DJ logo","Hʉeliang DJ-Logo","Logo DJ Hʉeliang","DJ-логотип Hʉeliang"],
    ["HʉeliangのDJワードマーク。追加8色・背景透過PNG。","Hʉeliang DJ wordmark. Eight additional colors, transparent PNGs.","Hʉeliang DJ-Schriftzug. Acht weitere Farben, transparente PNGs.","Logo typographique DJ Hʉeliang. Huit couleurs supplémentaires, PNG transparents.","DJ-логотип Hʉeliang. Восемь дополнительных цветов, прозрачные PNG."],
    ["基本カラー＆制作キット","Core colors & publishing kit","Basisfarben & Publishing-Kit","Couleurs de base et kit de publication","Базовые цвета и комплект для публикации"],
    ["基本カラーと制作向けの参考ファイルを同梱。","Includes core-color assets and reference files for publishing.","Enthält Basisfarbdateien und Referenzmaterial zur Veröffentlichung.","Contient les couleurs de base et des fichiers de référence pour la publication.","Включает основные цвета и вспомогательные файлы для публикации."],
    ["基本キットをダウンロード","Download core kit","Basis-Kit herunterladen","Télécharger le kit de base","Скачать основной комплект"],
    ["個人用のオーダーメイドグッズ制作や、制作を依頼する印刷サービスへの入稿に利用できます。","You may use these files to make custom items for personal use, including submitting them to a print service.","Die Dateien dürfen für persönliche Sonderanfertigungen verwendet und dafür an einen Druckdienst übermittelt werden.","Vous pouvez utiliser ces fichiers pour créer des objets personnalisés à usage personnel, y compris auprès d’un imprimeur.","Эти файлы можно использовать для личных заказных вещей, в том числе отправлять в типографию."],
    ["素材データの再配布・無断販売・公式商品と誤認される利用はご遠慮ください。商用利用を希望する場合はお問い合わせください。","Please do not redistribute the source files, sell merchandise without permission, or imply that your items are official products. Contact us about commercial use.","Bitte die Quelldateien nicht weiterverbreiten, ohne Erlaubnis keine Waren verkaufen und private Artikel nicht als offizielle Produkte darstellen. Für kommerzielle Nutzung bitte Kontakt aufnehmen.","Merci de ne pas redistribuer les fichiers, de vendre des objets sans autorisation ni de les présenter comme des produits officiels. Contactez-nous pour un usage commercial.","Не распространяйте исходные файлы, не продавайте товары без разрешения и не выдавайте их за официальную продукцию. Для коммерческого использования свяжитесь с нами."],
    ["LINEスタンプストア","LINE Sticker Store","LINE-Sticker-Shop","Boutique de stickers LINE","Магазин стикеров LINE"],
    ["遥と優春のちびキャラスタンプなど、FUNtasiaのLINEスタンプをお楽しみください。","Enjoy FUNtasia’s LINE stickers, including chibi Haruka and Yasaharu.","Entdecke die LINE-Sticker von FUNtasia, darunter Haruka und Yasaharu im Chibi-Stil.","Découvrez les stickers LINE de FUNtasia, dont Haruka et Yasaharu en version chibi.","Откройте для себя стикеры LINE от FUNtasia, в том числе Харуки и Ясахару в стиле чиби."],
    ["LINEスタンプストアを見る ↗","Visit the LINE Sticker Store ↗","Zum LINE-Sticker-Shop ↗","Visiter la boutique de stickers LINE ↗","Перейти в магазин стикеров LINE ↗"],
    ["FUNtasiaストア","FUNtasia Store","FUNtasia-Shop","Boutique FUNtasia","Магазин FUNtasia"],
    ["SUZURIでFUNtasiaのグッズをご覧いただけます。商品の種類・価格・配送条件はSUZURIのページでご確認ください。","Explore FUNtasia merchandise on SUZURI. See the SUZURI store for available items, prices, and delivery conditions.","Entdecke FUNtasia-Artikel auf SUZURI. Verfügbare Produkte, Preise und Versandbedingungen findest du direkt bei SUZURI.","Découvrez les articles FUNtasia sur SUZURI. Consultez la boutique pour les produits disponibles, les prix et les conditions de livraison.","Ознакомьтесь с товарами FUNtasia на SUZURI. Ассортимент, цены и условия доставки указаны на сайте SUZURI."],
    ["SUZURIストアを見る ↗","Visit SUZURI store ↗","SUZURI-Shop besuchen ↗","Visiter la boutique SUZURI ↗","Перейти в магазин SUZURI ↗"]
  ];

  // Chinese is stored separately so the original five-language rows remain unchanged.
  const zhUtilityRows = [
  "FUNtasia Audio Compare · Original Sage（点击放大）",
  "公开测试版 · v0.2.1 · Windows 10/11 x64 · 免费",
  "适用于 Windows 的独立音频对比工具，可在一致的试听条件下比较最多四个音源。通过 A/B/C/D 切换和响度匹配，辅助混音与母带制作决策。",
  "最多四个音源（A/B/C/D）",
  "LUFS 分析 · 响度匹配",
  "True Peak 测量",
  "考虑相关性的交叉淡化",
  "盲听 X/Y 对比",
  "保存与恢复会话",
  "九种深色主题",
  "提供九种深色主题，默认使用 Original Sage。支持盲听对比、查看测量结果，以及保存和恢复对比会话。",
  "下载 FUNtasia Audio Compare（ZIP） →",
  "发行说明与安装指南 →",
  "当前为公开测试版。请前往官方发行页面查看安装方法和下载包内容。",
  "← 返回 FUNtasia 首页",
  "让创作更顺畅的实用小工具。",
  "了解我们已发布的 Windows 应用：Audio Compare、Quick Launcher、Player、Mixer 和 Session Note。",
  "关于 Utilities",
  "支持日常创作的工具",
  "这里汇集了帮助音乐制作和 Windows 日常操作的工具，提供功能介绍、发布状态及官方下载入口。",
  "发布信息",
  "查看支持的 Windows 版本、产品版本和官方下载地址。公开测试版可能仍有尚未覆盖的使用场景。",
  "查看支持页面 →",
  "已发布的工具",
  "公开测试版 · v0.1.16 · Windows 11 x64",
  "一个快捷键，直达创作工作区。",
  " 即可打开这款轻量、以键盘操作为主的 Windows 启动器。在同一位置搜索并启动应用、文件、文件夹和 URL。",
  "拖放添加",
  "排序与固定快捷方式",
  "日语／英语",
  "七种 FUNtasia Studio 主题",
  "可选的 Windows 开机启动",
  "默认图标为 Original Sage。另提供 Charcoal、Deep Brown、Lapis Lazuli、Lavender、Coral Red 和 Mikan Orange 六种颜色，供自定义快捷方式图标。",
  "下载 Windows 版本（ZIP） →",
  "发行说明与下载包内容 →",
  "该测试版已通过 Windows 实机基本测试，但不代表所有环境均已覆盖。",
  "Original Sage · Windows 实机截图（点击放大）",
  "已发布 · v1.0.0 · Windows 11",
  "适用于 Windows 11 系统托盘的轻量应用音量混音器。可分别调节或静音应用音量、选择要控制的输出设备，并固定常用应用。",
  "采用与 FUNtasia Studio 一致的七种主题和 Kaisei Opti 字体。可控制所选输出设备的音量，但不会更改 Windows 默认输出设备。",
  "下载 FUNtasia Mixer v1.0.0（ZIP） →",
  "查看发行与更新信息 →",
  "FUNtasia Mixer · Original Sage（点击放大）",
  "已发布 · v1.2.1 · Windows x64 · 免费",
  "简单的独立音频播放器。可在 Windows 中打开或拖放音频文件，并控制播放、暂停、停止、循环、跳转和音量。",
  "播放 · 暂停 · 停止",
  "循环 · 跳转 · 音量",
  "拖放",
  "文件关联",
  "标题与艺术家元数据",
  "封面显示",
  "七种配色主题",
  "五种语言的使用手册",
  "v1.2.1 增加 ASIO 音频输出设置及七种主题，并保存设备和主题选择。不包含 EQ、响度标准化、限制器或饱和处理。",
  "下载 FUNtasia Player（ZIP） →",
  "查看发行说明与介绍 →",
  "Windows 11 · x64 · 公开测试版 v0.1.0k",
  "记录灵感，将想法带入音乐。轻量桌面应用，可按制作会话整理笔记、任务、BPM、调性和进度。",
  "支持本地自动保存、日语／英语界面、内置 Kaisei Opti、七种深色主题、窗口置顶和 Ctrl + Alt + N 显示切换。需要时随时打开，不打断创作。",
  "下载 Windows ZIP →",
  "发行说明与安装指南 →",
  "当前为测试版，请备份重要的制作笔记。",
  "下载方式与更新信息请以各产品的官方发行页面为准。"
];
  const zhGoodsRows = [
  "← 返回 FUNtasia 首页",
  "让 FUNtasia 陪伴你的桌面。",
  "以 FUNtasia Studio 植物主题字母标志为设计元素的免费壁纸，共有七种柔和配色。可一次下载 4K 横版、超宽屏和竖版共 21 张图片，另有适用于 Windows 11 的七种免费鼠标光标主题。",
  "七种配色主题",
  "免费下载",
  "下载 21 张壁纸（ZIP） ↗",
  "查看发行信息 ↗",
  "包含尺寸：",
  "3840 × 2160（4K）、5120 × 2160（超宽屏）、2160 × 3840（竖版）",
  "内容：",
  "七种配色 × 三种尺寸 = 21 张 PNG 图片／ZIP 约 37.1 MB",
  "壁纸预览和 ZIP 文件仍由原 FUNtasia Audio 网站及 GitHub Releases 托管。迁移期间下载链接保持不变。",
  "让 FUNtasia 也出现在鼠标光标上。",
  "适用于 Windows 11 的免费鼠标光标套装，采用 FUNtasia Studio 的七种配色。每种主题包含 17 种指针用途，以及等待和后台运行时的动态光标。",
  "下载七种光标主题（ZIP） ↗",
  "查看光标发行信息 ↗",
  "Windows 11 · 免费／v0.1／ZIP 约 3.6 MB",
  "。解压文件并打开附带的 ",
  "，即可选择配色。详细步骤与注意事项请参阅发行说明。",
  "让 FUNtasia 出现在你喜爱的物品上。",
  "即使 SUZURI 没有销售你想要的物品，也可以使用喜欢的印刷服务自行制作。我们免费提供独立 Forte 标志、带 FUNtasia 字样的标志及 Hʉeliang DJ 标志的透明 PNG。",
  "独立 Forte 标志",
  "FUNtasia Studio 的另外八种配色，提供透明背景 PNG。",
  "下载八色 ZIP",
  "Forte 标志＋FUNtasia 字样",
  "Forte 标志搭配 FUNtasia 文字，另外八种配色，透明背景 PNG。",
  "Hʉeliang DJ 标志",
  "Hʉeliang DJ 字标，另外八种配色，透明背景 PNG。",
  "基础配色与制作素材包",
  "包含基础配色素材和制作参考文件。",
  "下载基础素材包",
  "可将这些文件用于制作个人使用的定制商品，包括提交给印刷服务商制作。",
  "请勿重新分发源文件、未经许可销售商品，或使他人误认为私人制作的商品是官方产品。如需商业用途，请联系我们。",
  "LINE 贴图商店",
  "欢迎使用 FUNtasia 的 LINE 贴图，包括遥与优春的 Q 版角色贴图。",
  "访问 LINE 贴图商店 ↗",
  "FUNtasia 商店",
  "可在 SUZURI 查看 FUNtasia 周边商品。具体商品、价格与配送条件请以 SUZURI 商店页面为准。",
  "访问 SUZURI 商店 ↗"
];
  if (zhUtilityRows.length !== utilityRows.length || zhGoodsRows.length !== goodsRows.length)
    throw new Error('zh-CN translation row count mismatch');
  utilityRows.forEach((row, i) => row.push(zhUtilityRows[i]));
  goodsRows.forEach((row, i) => row.push(zhGoodsRows[i]));
  goodsRows.push(
    ["おすすめの制作ショップ","Recommended print shop","Empfohlener Druckservice","Atelier d’impression recommandé","Рекомендуемая мастерская печати","推荐定制店铺"],
    ["自分だけのFUNtasiaグッズを作ろう。","Make your own FUNtasia goods.","Gestalte deine eigenen FUNtasia-Artikel.","Créez vos propres articles FUNtasia.","Создайте свои собственные вещи FUNtasia.","制作专属于你的 FUNtasia 周边。"],
    ["CORNER PRINTINGは、Tシャツやパーカーの生地・色・加工方法にこだわりたい方におすすめです。無料の公式ロゴ素材を使って、お好みのアイテムを個人用にオーダーできます。注文・価格・配送条件は制作ショップでご確認ください。","We recommend CORNER PRINTING if you want to choose your own T-shirt or hoodie fabric, color and finish. Use our free official logo assets to order custom items for personal use. Check the print shop for ordering, prices and shipping.","CORNER PRINTING ist unsere Empfehlung, wenn du Stoff, Farbe und Veredelung deiner T-Shirts oder Hoodies selbst wählen möchtest. Nutze unsere kostenlosen offiziellen Logo-Dateien für persönliche Einzelanfertigungen. Bestellablauf, Preise und Versandbedingungen findest du beim Druckservice.","Nous recommandons CORNER PRINTING pour choisir le tissu, la couleur et la finition de vos T-shirts ou sweats à capuche. Utilisez nos logos officiels gratuits pour commander vos propres articles à usage personnel. Consultez l’atelier pour les commandes, les prix et la livraison.","Рекомендуем CORNER PRINTING тем, кто хочет самостоятельно выбирать ткань, цвет и способ нанесения на футболки и худи. Используйте бесплатные официальные логотипы для индивидуального заказа в личных целях. Условия заказа, цены и доставки уточняйте у мастерской.","如果你希望自由选择 T 恤或连帽卫衣的面料、颜色和加工方式，我们推荐 CORNER PRINTING。你可以使用免费的官方标志素材，定制个人使用的商品。下单、价格及配送条件请以定制店铺为准。"],
    ["CORNER PRINTINGを見る ↗","Visit CORNER PRINTING ↗","Zu CORNER PRINTING ↗","Visiter CORNER PRINTING ↗","Перейти в CORNER PRINTING ↗","访问 CORNER PRINTING ↗"],
    ["無料ロゴ素材をダウンロード ↓","Download free logo assets ↓","Kostenlose Logo-Dateien herunterladen ↓","Télécharger les logos gratuits ↓","Скачать бесплатные логотипы ↓","下载免费标志素材 ↓"]
  );
  const localeIndex = {ja: 0, en: 1, de: 2, fr: 3, ru: 4, 'zh-CN': 5};
  const rows = page === 'utilities' ? utilityRows : goodsRows;
  const byJapanese = new Map(rows.map(row => [row[0], row]));
  const head = {
    utilities: {
      ja: ['FUNtasia Utilities | FUNtasia', 'FUNtasia Audio Compare、Quick Launcher、Player、Mixer、Session Noteの公開情報とWindows版ダウンロード先をご紹介します。'],
      en: ['FUNtasia Utilities | Creative Windows Tools', 'Download FUNtasia Audio Compare, Quick Launcher, Player, Mixer and Session Note for Windows.'],
      de: ['FUNtasia Utilities | Kreative Windows-Werkzeuge', 'FUNtasia Audio Compare, Quick Launcher, Player, Mixer und Session Note für Windows entdecken und herunterladen.'],
      fr: ['FUNtasia Utilities | Outils créatifs Windows', 'Découvrez et téléchargez FUNtasia Audio Compare, Quick Launcher, Player, Mixer et Session Note pour Windows.'],
      ru: ['FUNtasia Utilities | Инструменты для Windows', 'Скачать FUNtasia Audio Compare, Quick Launcher, Player, Mixer и Session Note для Windows.'],
      'zh-CN': ['FUNtasia Utilities | Windows 创作工具', '了解并下载适用于 Windows 的 FUNtasia Audio Compare、Quick Launcher、Player、Mixer 与 Session Note。']
    },
    goods: {
      ja: ['FUNtasia Goods | 無料壁紙・カーソル・公式ロゴ素材', 'FUNtasiaの無料壁紙、Windows用マウスカーソル、カスタムグッズ制作に使える公式ロゴ素材をダウンロードできます。'],
      en: ['FUNtasia Goods | Free Wallpapers, Cursors & Logos', 'Download FUNtasia wallpapers, Windows cursor themes and official logo assets for personal custom merchandise.'],
      de: ['FUNtasia Goods | Kostenlose Wallpaper, Cursor & Logos', 'Lade FUNtasia-Wallpaper, Windows-Cursor und offizielle Logo-Dateien für persönliche Sonderanfertigungen herunter.'],
      fr: ['FUNtasia Goods | Fonds d’écran, curseurs et logos gratuits', 'Téléchargez les fonds d’écran FUNtasia, les curseurs Windows et les logos officiels pour des objets personnalisés à usage personnel.'],
      ru: ['FUNtasia Goods | Обои, курсоры и логотипы', 'Скачайте обои FUNtasia, курсоры Windows и официальные логотипы для персональных вещей.'],
      'zh-CN': ['FUNtasia Goods | 免费壁纸、光标与标志素材', '下载 FUNtasia 免费壁纸、Windows 光标主题，以及用于个人定制商品的官方标志素材。']
    }
  };
  const common = {
    ja: {language: '言語', nav: 'サイト内ナビゲーション', home: 'Home', quickFeatures: 'Quick Launcherの機能', playerFeatures: 'FUNtasia Playerの機能', playerThemes: 'FUNtasia Playerの7つのテーマ', colorThemes: '7種類のカラーテーマ'},
    en: {language: 'Language', nav: 'Site navigation', home: 'Home', quickFeatures: 'Quick Launcher features', playerFeatures: 'FUNtasia Player features', playerThemes: 'Seven FUNtasia Player themes', colorThemes: 'Seven color themes'},
    de: {language: 'Sprache', nav: 'Seitennavigation', home: 'Startseite', quickFeatures: 'Quick-Launcher-Funktionen', playerFeatures: 'FUNtasia-Player-Funktionen', playerThemes: 'Sieben FUNtasia-Player-Themes', colorThemes: 'Sieben Farbthemen'},
    fr: {language: 'Langue', nav: 'Navigation du site', home: 'Accueil', quickFeatures: 'Fonctions de Quick Launcher', playerFeatures: 'Fonctions de FUNtasia Player', playerThemes: 'Sept thèmes de FUNtasia Player', colorThemes: 'Sept thèmes de couleur'},
    ru: {language: 'Язык', nav: 'Навигация по сайту', home: 'Главная', quickFeatures: 'Функции Quick Launcher', playerFeatures: 'Функции FUNtasia Player', playerThemes: 'Семь тем FUNtasia Player', colorThemes: 'Семь цветовых тем'},
    'zh-CN': {language: '语言', nav: '网站导航', home: '首页', quickFeatures: 'Quick Launcher 功能', playerFeatures: 'FUNtasia Player 功能', playerThemes: 'FUNtasia Player 的七种主题', colorThemes: '七种配色主题'}
  };

  const textBindings = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    const parent = node.parentElement;
    if (!parent || ['SCRIPT', 'STYLE', 'SELECT', 'OPTION', 'NOSCRIPT'].includes(parent.tagName)) continue;
    const raw = node.nodeValue;
    const value = raw.trim();
    if (!byJapanese.has(value) && value !== 'Home') continue;
    const leading = raw.slice(0, raw.indexOf(value));
    const trailing = raw.slice(raw.indexOf(value) + value.length);
    textBindings.push({node, value, leading, trailing});
  }

  const attrBindings = [];
  for (const element of document.querySelectorAll('[alt],[aria-label],[title]')) {
    for (const attr of ['alt', 'aria-label', 'title']) {
      const value = element.getAttribute(attr);
      if (value && /[\u3040-\u30ff\u3400-\u9fff]/.test(value)) attrBindings.push({element, attr, value});
    }
  }

  function attributeText(value, code) {
    if (code === 'ja') return value;
    if (code === 'zh-CN') {
      const fixed = {
        '黒いFUNtasiaパーカー。胸元にセージグリーンの植物モチーフのフォルテロゴ。': '黑色 FUNtasia 连帽衫，胸前印有鼠尾草绿色的植物主题 Forte 标志。',
        'FUNtasia Audio Compare v0.2.1の実画面を拡大表示': '放大 FUNtasia Audio Compare v0.2.1 实机截图',
        'FUNtasia Audio Compare v0.2.1のOriginal Sage画面。4音源の読み込み、再生操作、True Peakメーターを表示。': 'FUNtasia Audio Compare v0.2.1 Original Sage 界面，显示四个音源、播放控制和 True Peak 电平表。',
        'FUNtasia Audio Compareの機能': 'FUNtasia Audio Compare 功能',
        'FUNtasia Quick Launcher v0.1.16の実画面を拡大表示': '放大 FUNtasia Quick Launcher v0.1.16 实机截图',
        'FUNtasia Quick Launcher v0.1.16。Original SageテーマでFUNtasia Studio、Mixer、Playerの3つのショートカットを表示したWindows実機画面。': 'FUNtasia Quick Launcher v0.1.16 Original Sage Windows 实机界面，显示 Studio、Mixer 和 Player 三个快捷方式。',
        'FUNtasia Mixer v1.0.0の画面を拡大表示': '放大 FUNtasia Mixer v1.0.0 截图',
        'Windows 11上のFUNtasia Mixer。Apogee Duet 3の出力音量、DiscordとSystem soundsのアプリ別音量スライダーを表示': 'Windows 11 上的 FUNtasia Mixer，显示 Apogee Duet 3 输出音量，以及 Discord 和系统声音的独立音量滑块。',
        'FUNtasia Session Noteの実画面を拡大表示': '放大 FUNtasia Session Note 实机截图',
        'FUNtasia Session Note v0.1.0kのOriginal Sageテーマの実際の画面。セッション情報、ToDo、アイデア・メモを表示。': 'FUNtasia Session Note v0.1.0k Original Sage 实机界面，显示会话信息、待办事项和创作笔记。',
        'FUNtasia Alchemist Cursorsのポインターデザインと7色のテーマ': 'FUNtasia Alchemist Cursors 指针设计与七种配色主题',
        'FUNtasia SUZURIストアを開く': '打开 FUNtasia SUZURI 商店'
      };
      if (Object.hasOwn(fixed, value)) return fixed[value];
      if (value === 'サイト内ナビゲーション') return common[code].nav;
      if (value === 'Quick Launcherの機能') return common[code].quickFeatures;
      if (value === 'FUNtasia Playerの機能') return common[code].playerFeatures;
      if (value === 'FUNtasia Playerの7つのテーマ') return common[code].playerThemes;
      if (value === '7種類のカラーテーマ') return common[code].colorThemes;
      const wall = value.match(/^FUNtasia Studio (.+)の壁紙プレビュー$/);
      if (wall) return `FUNtasia Studio ${wall[1]} 壁纸预览`;
      const icon = value.match(/^FUNtasia Player (.+)テーマのアイコン$/);
      if (icon) return `FUNtasia Player ${icon[1]} 主题图标`;
      return value;
    }

    const locale = common[code];
    if (value === "黒いFUNtasiaパーカー。胸元にセージグリーンの植物モチーフのフォルテロゴ。") return {
      en: "Black FUNtasia hoodie with a sage-green botanical forte emblem on the chest.",
      de: "Schwarzer FUNtasia-Hoodie mit salbeigrünem botanischem Forte-Symbol auf der Brust.",
      fr: "Sweat à capuche FUNtasia noir avec un emblème forte végétal vert sauge sur la poitrine.",
      ru: "Чёрное худи FUNtasia с ботанической эмблемой forte шалфейно-зелёного цвета на груди."
    }[code];
    if (value === 'サイト内ナビゲーション') return locale.nav;
    if (value === 'Quick Launcherの機能') return locale.quickFeatures;
    if (value === 'FUNtasia Audio Compare v0.2.1の実画面を拡大表示') return {
      en: 'Enlarge FUNtasia Audio Compare v0.2.1 screenshot',
      de: 'Screenshot von FUNtasia Audio Compare v0.2.1 vergrößern',
      fr: 'Agrandir la capture de FUNtasia Audio Compare v0.2.1',
      ru: 'Увеличить снимок экрана FUNtasia Audio Compare v0.2.1'
    }[code];
    if (value === 'FUNtasia Audio Compare v0.2.1のOriginal Sage画面。4音源の読み込み、再生操作、True Peakメーターを表示。') return {
      en: 'FUNtasia Audio Compare v0.2.1 in Original Sage, showing four source slots, playback controls and True Peak meters.',
      de: 'FUNtasia Audio Compare v0.2.1 im Design Original Sage mit vier Audioquellen, Wiedergabesteuerung und True-Peak-Anzeigen.',
      fr: 'FUNtasia Audio Compare v0.2.1 avec le thème Original Sage, quatre sources audio, des commandes de lecture et des indicateurs True Peak.',
      ru: 'FUNtasia Audio Compare v0.2.1 в теме Original Sage: четыре источника, управление воспроизведением и индикаторы True Peak.'
    }[code];

    if (value === 'FUNtasia Audio Compareの機能') return {en:'FUNtasia Audio Compare features',de:'Funktionen von FUNtasia Audio Compare',fr:'Fonctions de FUNtasia Audio Compare',ru:'Функции FUNtasia Audio Compare'}[code];
    if (value === 'FUNtasia Playerの機能') return locale.playerFeatures;
    if (value === 'FUNtasia Playerの7つのテーマ') return locale.playerThemes;
    if (value === '7種類のカラーテーマ') return locale.colorThemes;
    const wall = value.match(/^FUNtasia Studio (.+)の壁紙プレビュー$/);
    if (wall) return {
      en: `FUNtasia Studio ${wall[1]} wallpaper preview`,
      de: `FUNtasia Studio ${wall[1]} Wallpaper-Vorschau`,
      fr: `Aperçu du fond d’écran FUNtasia Studio ${wall[1]}`,
      ru: `Предпросмотр обоев FUNtasia Studio ${wall[1]}`
    }[code];
    const icon = value.match(/^FUNtasia Player (.+)テーマのアイコン$/);
    if (icon) return {
      en: `FUNtasia Player ${icon[1]} theme icon`,
      de: `FUNtasia Player ${icon[1]} Theme-Symbol`,
      fr: `Icône du thème ${icon[1]} de FUNtasia Player`,
      ru: `Иконка темы ${icon[1]} FUNtasia Player`
    }[code];
    if (value.includes('カーソル') || value.includes('ポインター')) return {
      en: 'FUNtasia Alchemist Cursors pointer designs in seven colors',
      de: 'FUNtasia Alchemist Cursors mit sieben Farbthemen',
      fr: 'Curseurs FUNtasia Alchemist et leurs sept couleurs',
      ru: 'Курсоры FUNtasia Alchemist в семи цветах'
    }[code];
    if (value.includes('Quick Launcher')) return {
      en: 'FUNtasia Quick Launcher on Windows in the Original Sage theme',
      de: 'FUNtasia Quick Launcher unter Windows im Theme Original Sage',
      fr: 'FUNtasia Quick Launcher pour Windows, thème Original Sage',
      ru: 'FUNtasia Quick Launcher для Windows, тема Original Sage'
    }[code];
    if (value.includes('Mixer')) return {
      en: 'FUNtasia Mixer on Windows 11 in the Original Sage theme',
      de: 'FUNtasia Mixer unter Windows 11 im Theme Original Sage',
      fr: 'FUNtasia Mixer sur Windows 11, thème Original Sage',
      ru: 'FUNtasia Mixer для Windows 11, тема Original Sage'
    }[code];
    if (value.includes('Session Note')) return {
      en: 'FUNtasia Session Note in Original Sage, showing session details, tasks and notes',
      de: 'FUNtasia Session Note in Original Sage mit Sessiondaten, Aufgaben und Notizen',
      fr: 'FUNtasia Session Note, thème Original Sage, avec sessions, tâches et notes',
      ru: 'FUNtasia Session Note в теме Original Sage, с сессиями, задачами и заметками'
    }[code];
    return value;
  }

  const select = document.querySelector('#section-language');
  const label = document.querySelector('.section-language-switch label');
  const meta = document.querySelector('meta[name="description"]');
  const brandLinks = [...document.querySelectorAll('a[href="../"]')];
  const studioLinks = [...document.querySelectorAll('a[href="../studio/"]')];
  const aboutLinks = [...document.querySelectorAll('a[href="../about/"]')];
  const supportLinks = [...document.querySelectorAll('a[href="../support/"]')];
  const catalogLinks = [...document.querySelectorAll('a[href="../catalog/ja/"]')];
  const recordsLinks = [...document.querySelectorAll('a[href="../records/"]')];
  const utilityLinks = [...document.querySelectorAll('a[href="../utilities/"]')];
  const goodsLinks = [...document.querySelectorAll('a[href="../goods/"]')];
  const nav = document.querySelector('.site-nav');

  function preferredLocale() {
    const preferences = navigator.languages?.length ? navigator.languages : [navigator.language || ''];
    for (const preference of preferences) {
      const full = String(preference).toLowerCase().replace('_', '-');
      if (/^zh(?:$|-(?:cn|sg|hans)(?:-|$))/.test(full)) return 'zh-CN';
      const code = full.split('-')[0];
      if (locales.includes(code)) return code;
    }
    return 'en';
  }
  function storedLocale() {
    try {
      const stored = localStorage.getItem(storageKey);
      return locales.includes(stored) ? stored : null;
    } catch { return null; }
  }
  function queryLocale() {
    const requested = new URLSearchParams(location.search).get('lang');
    const normalized = String(requested || '').toLowerCase().replace(/_/g, '-');
    return /^zh(?:$|-(?:cn|sg|hans)(?:-|$))/.test(normalized)
      ? 'zh-CN' : (locales.includes(requested) ? requested : null);
  }

  function applyLocale(code, remember = false) {
    if (!locales.includes(code)) return;
    for (const binding of textBindings) {
      const translated = binding.value === 'Home'
        ? common[code].home
        : byJapanese.get(binding.value)[localeIndex[code]];
      binding.node.nodeValue = binding.leading + translated + binding.trailing;
    }
    for (const binding of attrBindings) {
      binding.element.setAttribute(binding.attr, attributeText(binding.value, code));
    }
    document.documentElement.lang = code;
    document.title = head[page][code][0];
    if (meta) meta.content = head[page][code][1];
    if (select) {
      select.value = code;
      select.setAttribute('aria-label', {
        ja: 'サイトの言語を選択', en: 'Select website language',
        de: 'Websitesprache wählen', fr: 'Choisir la langue du site',
        ru: 'Выбрать язык сайта', 'zh-CN': '选择网站语言'
      }[code]);
    }
    if (label) label.textContent = common[code].language;
    if (nav) nav.setAttribute('aria-label', common[code].nav);
    for (const link of brandLinks) link.href = `../?lang=${code}`;
    for (const link of catalogLinks) link.href = `../catalog/${code === 'zh-CN' ? 'zh-cn' : code}/`;
    for (const link of recordsLinks) link.href = code === 'ja' ? '../records/' : `../records/${code === 'zh-CN' ? 'zh-cn' : code}/`;
    for (const link of utilityLinks) link.href = `../utilities/?lang=${code}`;
    for (const link of goodsLinks) link.href = `../goods/?lang=${code}`;
    // Chinese subpages are real translated routes. Do not let the Studio
    // browser-locale router or Japanese About/Support pages override an explicit
    // ?lang=zh-CN link when the visitor has an older saved language preference.
    for (const link of studioLinks) link.href = code === 'zh-CN'
      ? '../studio/official/zh-cn/' : '../studio/';
    for (const link of aboutLinks) link.href = code === 'zh-CN'
      ? '../about/zh-cn/' : '../about/';
    for (const link of supportLinks) link.href = code === 'zh-CN'
      ? '../support/zh-cn/' : '../support/';
    if (remember) {
      try { localStorage.setItem(storageKey, code); } catch { /* Private browsing remains usable. */ }
      const url = new URL(location.href);
      url.searchParams.delete('lang');
      history.replaceState(history.state, '', url.pathname + url.search + url.hash);
    }
  }

  applyLocale(queryLocale() || storedLocale() || preferredLocale());
  select?.addEventListener('change', () => applyLocale(select.value, true));
})();
