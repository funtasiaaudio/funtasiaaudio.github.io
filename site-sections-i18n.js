/* Shared, accessible five-language content for the Utilities and Goods pages.
 * Visible Japanese source is preserved in HTML when scripting is disabled.
 * Language is inferred from the browser on first visit; user changes persist.
 */
(() => {
  'use strict';
  const locales = ['ja', 'en', 'de', 'fr', 'ru'];
  const storageKey = 'funtasia.home.language';
  const page = document.body.dataset.i18nPage;
  if (!['utilities', 'goods'].includes(page)) return;

  // Each row: original Japanese, English, German, French, Russian.
  // Keep this table aligned with the Japanese source page's text nodes.
  const utilityRows = [
    ["← 総合トップへ","← Back to home","← Zur Startseite","← Retour à l’accueil","← На главную"],
    ["制作を支える、小さく便利なツール。","Small tools for your creative flow.","Kleine Helfer für deinen kreativen Alltag.","De petits outils pour faciliter la création.","Небольшие инструменты для творчества."],
    ["FUNtasia Quick Launcher、Player、Mixer、Session Noteなど、公開中のWindows向けアプリをご紹介します。","Explore our Windows applications: Quick Launcher, Player, Mixer and Session Note.","Entdecke unsere Windows-Programme: Quick Launcher, Player, Mixer und Session Note.","Découvrez nos applications Windows : Quick Launcher, Player, Mixer et Session Note.","Знакомьтесь с нашими приложениями для Windows: Quick Launcher, Player, Mixer и Session Note."],
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
    ["素材データの再配布・無断販売・公式商品と誤認される利用はご遠慮ください。商用利用を希望する場合はお問い合わせください。","Please do not redistribute the source files, sell merchandise without permission, or imply that your items are official products. Contact us about commercial use.","Bitte die Quelldateien nicht weiterverbreiten, ohne Erlaubnis keine Waren verkaufen und private Artikel nicht als offizielle Produkte darstellen. Für kommerzielle Nutzung bitte Kontakt aufnehmen.","Merci de ne pas redistribuer les fichiers, de vendre des objets sans autorisation ni de les présenter comme des produits officiels. Contactez-nous pour un usage commercial.","Не распространяйте исходные файлы, не продавайте товары без разрешения и не выдавайте их за официальную продукцию. Для коммерческого использования свяжитесь с нами."]
  ];

  const localeIndex = {ja: 0, en: 1, de: 2, fr: 3, ru: 4};
  const rows = page === 'utilities' ? utilityRows : goodsRows;
  const byJapanese = new Map(rows.map(row => [row[0], row]));
  const head = {
    utilities: {
      ja: ['FUNtasia Utilities | FUNtasia', 'FUNtasia Quick Launcher、Player、Mixer、Session Noteの公開情報とWindows版ダウンロード先をご紹介します。'],
      en: ['FUNtasia Utilities | Creative Windows Tools', 'Download FUNtasia Quick Launcher, Player, Mixer and Session Note for Windows.'],
      de: ['FUNtasia Utilities | Kreative Windows-Werkzeuge', 'FUNtasia Quick Launcher, Player, Mixer und Session Note für Windows entdecken und herunterladen.'],
      fr: ['FUNtasia Utilities | Outils créatifs Windows', 'Découvrez et téléchargez FUNtasia Quick Launcher, Player, Mixer et Session Note pour Windows.'],
      ru: ['FUNtasia Utilities | Инструменты для Windows', 'Скачать FUNtasia Quick Launcher, Player, Mixer и Session Note для Windows.']
    },
    goods: {
      ja: ['FUNtasia Goods | 無料壁紙・カーソル・公式ロゴ素材', 'FUNtasiaの無料壁紙、Windows用マウスカーソル、カスタムグッズ制作に使える公式ロゴ素材をダウンロードできます。'],
      en: ['FUNtasia Goods | Free Wallpapers, Cursors & Logos', 'Download FUNtasia wallpapers, Windows cursor themes and official logo assets for personal custom merchandise.'],
      de: ['FUNtasia Goods | Kostenlose Wallpaper, Cursor & Logos', 'Lade FUNtasia-Wallpaper, Windows-Cursor und offizielle Logo-Dateien für persönliche Sonderanfertigungen herunter.'],
      fr: ['FUNtasia Goods | Fonds d’écran, curseurs et logos gratuits', 'Téléchargez les fonds d’écran FUNtasia, les curseurs Windows et les logos officiels pour des objets personnalisés à usage personnel.'],
      ru: ['FUNtasia Goods | Обои, курсоры и логотипы', 'Скачайте обои FUNtasia, курсоры Windows и официальные логотипы для персональных вещей.']
    }
  };
  const common = {
    ja: {language: '言語', nav: 'サイト内ナビゲーション', home: 'Home', quickFeatures: 'Quick Launcherの機能', playerFeatures: 'FUNtasia Playerの機能', playerThemes: 'FUNtasia Playerの7つのテーマ', colorThemes: '7種類のカラーテーマ'},
    en: {language: 'Language', nav: 'Site navigation', home: 'Home', quickFeatures: 'Quick Launcher features', playerFeatures: 'FUNtasia Player features', playerThemes: 'Seven FUNtasia Player themes', colorThemes: 'Seven color themes'},
    de: {language: 'Sprache', nav: 'Seitennavigation', home: 'Startseite', quickFeatures: 'Quick-Launcher-Funktionen', playerFeatures: 'FUNtasia-Player-Funktionen', playerThemes: 'Sieben FUNtasia-Player-Themes', colorThemes: 'Sieben Farbthemen'},
    fr: {language: 'Langue', nav: 'Navigation du site', home: 'Accueil', quickFeatures: 'Fonctions de Quick Launcher', playerFeatures: 'Fonctions de FUNtasia Player', playerThemes: 'Sept thèmes de FUNtasia Player', colorThemes: 'Sept thèmes de couleur'},
    ru: {language: 'Язык', nav: 'Навигация по сайту', home: 'Главная', quickFeatures: 'Функции Quick Launcher', playerFeatures: 'Функции FUNtasia Player', playerThemes: 'Семь тем FUNtasia Player', colorThemes: 'Семь цветовых тем'}
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
    const locale = common[code];
    if (value === 'サイト内ナビゲーション') return locale.nav;
    if (value === 'Quick Launcherの機能') return locale.quickFeatures;
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
  const catalogLinks = [...document.querySelectorAll('a[href="../catalog/ja/"]')];
  const recordsLinks = [...document.querySelectorAll('a[href="../records/"]')];
  const utilityLinks = [...document.querySelectorAll('a[href="../utilities/"]')];
  const goodsLinks = [...document.querySelectorAll('a[href="../goods/"]')];
  const nav = document.querySelector('.site-nav');

  function preferredLocale() {
    const preferences = navigator.languages?.length ? navigator.languages : [navigator.language || ''];
    for (const preference of preferences) {
      const code = String(preference).toLowerCase().split(/[-_]/)[0];
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
    return locales.includes(requested) ? requested : null;
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
        ru: 'Выбрать язык сайта'
      }[code]);
    }
    if (label) label.textContent = common[code].language;
    if (nav) nav.setAttribute('aria-label', common[code].nav);
    for (const link of brandLinks) link.href = `../?lang=${code}`;
    for (const link of catalogLinks) link.href = `../catalog/${code}/`;
    for (const link of recordsLinks) link.href = code === 'ja' ? '../records/' : `../records/${code}/`;
    for (const link of utilityLinks) link.href = `../utilities/?lang=${code}`;
    for (const link of goodsLinks) link.href = `../goods/?lang=${code}`;
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
