# Fach-Vokabeln – Projektbeschreibung für Claude

> **Für Claude:** Lies diese Datei zuerst. Sie ersetzt das Durchlesen des gesamten Quellcodes.
> Fordere nur die Dateien an, die für die gewünschte Änderung wirklich nötig sind (siehe „Welche Dateien für welche Änderung“).
> Hochgeladene Dateien liegen unter `/mnt/user-data/uploads/`. Lies sie gezielt mit `grep -n` und `sed -n 'von,bisp'`, statt sie komplett anzuzeigen.
> Liefere am Ende **nur die geänderten Dateien** aus, erhöhe `VERSION` in `sw.js` und ergänze das Änderungsprotokoll unten.

## Nächste Schritte

> **Für Claude:** Fragt der Nutzer nach den nächsten Schritten („Was ist als Nächstes dran?“ o. Ä.), schau in die Status-Tabellen weiter unten und nenne die nächsten offenen Punkte (☐) in dieser Reihenfolge, jeweils mit Kategorie, Begriffszahl und kurzem Hinweis, was der Chat tun muss. Neue größere Vorhaben hier einreihen, erledigte Phasen abhaken.

1. ☑ **Schritt 2 für IT**: Zusatzinhalte für alle IT-Kategorien (Status unter „Ausbau ‚Verstehen statt Auswendiglernen‘“).
2. ☑ **Schritt G für Agile**: Grunddaten für alle 13 Kategorien (Status unter „Neues Modul ‚Agile & Projekte‘“). Ein Chat pro Kategorie.
3. ☑ **Schritt 2 für Agile**: Zusatzinhalte für alle 13 Kategorien (Status-Tabelle „Schritt 2 für Agile“).
4. ☑ **Modulsystem**: Module als Ordner, Nutzer wählt seine Module, nur gewählte werden geladen und offline gespeichert (Abschnitt „Vorhaben ‚Modulsystem‘“). Ein Chat.

Phase 1 und 2 hängen nicht voneinander ab und dürfen sich auch überschneiden. Phase 3 muss warten, weil die `conf`-Partner auch aus anderen Agile-Kategorien kommen dürfen und diese Begriffe dann schon existieren müssen.

## Was die App ist

Installierbare Web-App (PWA) zum Lernen englischer Fachbegriffe mit deutscher Übersetzung. Zielgruppe: der Nutzer selbst (Österreich), Android-Handy, Chrome.
Drei Module: **IT** (`dev`, 1.305 Begriffe, violettes Schema), **Glasfaser & FTTH** (`ftth`, 500 Begriffe, grünes Schema) und **Agile & Projekte** (`agile`, 507 Begriffe, weinrotes Schema).
Bereiche: Quiz, Karteikarten, Nachschlagen. Dazu Ränge, Kalender, Punkte-Erklärung, Export/Import.
Jeder Nutzer wählt im Katalog „Module verwalten“, welche Module er verwendet; nur diese werden geladen und offline gespeichert (seit v13).

## Hosting und Updates

- GitHub-Repository **`baumpinkler/FachVokabeln`** (öffentlich), GitHub Pages aus Branch `main`, Ordner `/ (root)`.
- Adresse: `https://baumpinkler.github.io/FachVokabeln/`
- Claude kann das Repo selbst klonen (`git clone https://github.com/baumpinkler/FachVokabeln.git`); der Nutzer muss dafür nichts hochladen.
- Update = geänderte Dateien im Repository hochladen („Add file → Upload files“).
- `sw.js` → `VERSION` bei jeder Auslieferung erhöhen (`"v2"` → `"v3"` …), damit Handys die Änderung sofort übernehmen.
- Alle Pfade sind relativ. Keine Build-Tools, keine Bibliotheken, kein Framework.

## Dateien

| Datei | Größe | Inhalt |
|---|---|---|
| `index.html` | 1 KB | Gerüst (`#modbar` Modulleiste, darunter `#pager` mit `#top` und `#app`), Manifest-Link, Fonts (Google Fonts), setzt gespeichertes Farbschema vor dem Laden |
| `app.js` | 88 KB (~24.000 Tokens) | gesamte Logik |
| `style.css` | 44 KB (~13.000 Tokens) | gesamte Gestaltung, Farben über CSS-Variablen |
| `sw.js` | 2 KB | Service Worker: Offline-Cache, „sofort aus Cache, im Hintergrund aktualisieren“ |
| `manifest.json` | 1 KB | App-Name, Symbole, Startfarbe `#0a0510` |
| `icons/` | – | `icon-192.png`, `icon-512.png`, `icon-maskable-512.png` |
| `modules/index.json` | 2 KB | Katalog aller Module (`desc`, `count` für „Module verwalten“) |
| `modules/<key>/module.json` | – | ein Modul; der Ordnername ist immer der `key` |
| `modules/dev/module.json` | 440 KB (~130.000 Tokens) | Modul IT, **nie komplett lesen oder einfügen** |
| `modules/ftth/module.json` | 172 KB (~50.000 Tokens) | Modul Glasfaser & FTTH, **nie komplett lesen oder einfügen** |
| `modules/agile/module.json` | 203 KB (~60.000 Tokens) | Modul Agile & Projekte, **nie komplett lesen oder einfügen** |
| `modules/<key>/extra/<kategorie>.json` | je 50–160 KB | Zusatzinhalte für schwere Fragearten (siehe „Verstehen statt Auswendiglernen“), optional |

Bis v12 hießen die Moduldateien `modules/it-scrum.json`, `modules/glasfaser.json`, `modules/agile.json` und die Zusatzdateien `modules/extra/<modul>/…`. Ältere Abschnitte weiter unten nennen noch diese Pfade.
| `docs/agile-projekte-begriffe.md` | 28 KB | verbindliche Begriffsliste für Agile & Projekte |

## Welche Dateien für welche Änderung

| Änderung | Mitschicken |
|---|---|
| Farben eines Moduls | `modules/index.json` + Hinweis, welches Modul. Claude erzeugt ein kleines Skript bzw. die `theme`-Werte; das große JSON wird per Skript geändert, nicht gelesen |
| Aussehen, Abstände, Schriften | `style.css` |
| Spielregeln, Punkte, Quiz, Kalender, neue Funktionen | `app.js` (+ ggf. `style.css`) |
| Neue Begriffe / neues Modul | `modules/index.json` (`count` mitpflegen) + **nur die Liste der vorhandenen englischen Begriffe** (nicht die ganze Datei, siehe unten). Neues Modul = neuer Ordner `modules/<key>/`, keine Code-Änderung, keine `VERSION`-Erhöhung |
| Katalog, Modulauswahl, Laden der Module | `app.js` (Bereich „Module laden“ und „Katalog“), `sw.js` (Daten-Cache) |
| Offline-Verhalten | `sw.js` |

Begriffsliste ohne ganze Datei erzeugen: Claude kann die Moduldatei hochgeladen bekommen und per Skript nur Spalte `[1]` (englischer Begriff) auslesen. Das kostet kaum Tokens, weil die Datei nicht in den Chat geladen wird.

## Datenformat

### `modules/index.json` (Katalog)
```json
{"modules":[{"key":"dev","name":"IT","short":"IT","icon":"💻",
  "desc":"Englische Fachbegriffe aus Programmierung, …","count":1305,
  "ls":"devvokabeln.progress.v1","doc":"progress","accent":"#6c3fb8","board":"#0a0510"}]}
```
Reihenfolge in `index.json` = Reihenfolge in Katalog, Modulleiste und beim Wischen. Die Moduldatei liegt immer unter `modules/<key>/module.json` (kein Feld `file` mehr).
- `desc`: ein Satz für den Katalog. `count`: Zahl der Begriffe (per Skript aus `raw`), optional, bei Begriffsänderungen mitpflegen.
- `ls` = Speicherschlüssel des Lernstands, **pro Modul eindeutig, nie ändern** (sonst ist der Fortschritt weg). Neue Module: `ls` = `lernapp.progress.<key>`, `doc` = `progress-<key>`. Die drei alten Module behalten ihre `devvokabeln.…`-Werte.
- Optional `format`/`version` wie in der Moduldatei: Braucht ein Modul eine neuere App, zeigt der Katalog das schon ohne Download an.
- Ab 4 gewählten Modulen wird der Umschalter automatisch zum Auswahlmenü.

### Moduldatei `modules/<key>/module.json`
```
{ format:"fachvokabeln-modul", version:1, key, name, short, icon,
  cats:   { "fgrund": {"name":"Glasfaser-Grundlagen","c":"var(--n-yellow)"}, … },
  levels: [[0,"Praktikant:in"],[100,"Lehrling"], … 20 Einträge … ,[50000,"Glasfaser-Legende"]],
  theme:  { board, board-dot, ink, ink-soft, surface, line, ok, bad, accent, m1, m2, m3 },
  raw:    [ Eintrag, Eintrag, … ] }
```
Kompakt gespeichert (`separators=(",",":")`, `ensure_ascii=False`, ohne Zeilenumbruch am Ende). Die App (`MOD_FORMAT`, `MOD_VERSION` in `app.js`) lädt nur `format` „fachvokabeln-modul“ mit `version` ≤ 1; sonst „braucht eine neuere App-Version“. Ohne gültiges JSON, `raw` oder `cats` gilt das Modul als fehlerhaft.
`theme`: `board` Hintergrund (fast schwarz), `surface` Flächen, `accent` Modul-Schalter, `m1`/`m2`/`m3` die drei Startseiten-Kärtchen (Karteikarten/Quiz/Nachschlagen).
XP-Grenzen der Ränge (alle Module gleich): 0, 100, 250, 400, 600, 900, 1.300, 1.800, 2.400, 3.200, 4.300, 5.700, 7.600, 10.000, 13.000, 17.000, 22.500, 29.500, 38.500, 50.000.

### Ein Begriff (`raw`-Eintrag, Array)
| Index | Inhalt | Regel |
|---|---|---|
| 0 | Kategorie-Schlüssel | muss in `cats` existieren |
| 1 | englischer Begriff | eindeutig im Modul; die ID wird daraus gebildet (Kleinbuchstaben, Sonderzeichen → `-`). Verben mit „to “ |
| 2 | deutsch, mit Artikel | z. B. `die Glasfaser / die optische Faser`; gegendert mit `:in` |
| 3 | Erklärung 1 | darf den englischen Begriff **nicht** enthalten |
| 4 | englischer Beispielsatz | soll den Begriff wörtlich enthalten (ohne „to “), sonst keine Lückentext-Frage |
| 5 | deutscher Beispielsatz | österreichischer Arbeitsalltag |
| 6 | Erklärung 2 | anderer Blickwinkel (Beispiel, Einsatz) – ohne den Begriff |
| 7 | Erklärung 3 | anderer Blickwinkel (Zweck, Abgrenzung) – ohne den Begriff |
| 8 | optional: Lücken im deutschen Satz | Array exakter Teilstrings aus [5], z. B. `["sperrt","aus"]`; nötig, wenn [4] den Begriff enthält |

## Spielregeln (Konstanten in `app.js`)

- **Quiz:** 10 Fragen (`QUIZ_LEN`), 5 Antworten mit unterschiedlichen Anfangsbuchstaben (`keyLetter`, Artikel/„to“ zählen nicht). Gemeisterte Begriffe kommen nicht mehr dran (`quizPool`). 3–9 offene Begriffe → Runde mit so vielen Fragen; 1–2 → werden wiederholt, bis 10 Fragen zusammen sind (`repeatFill`, nie zweimal derselbe direkt hintereinander). Wird ein Begriff während der Runde gemeistert, fliegen seine restlichen Fragen raus (beim Wiederholen wird mit den übrigen aufgefüllt); ist danach in den gewählten Themen nichts mehr offen, endet das Quiz nach dieser Frage (`Q.endEarly`). Fragen werden erst beim Erreichen gebaut (`nextQuestion`), damit der Lernstand aktuell ist.
- **Meisterrunde** (`startMaster`, nur für Themen mit allen Begriffen gemeistert, `catMastered`): jeder Begriff des Themas einmal, gemischt, Fragen wie bei gemeisterten Begriffen, aber alle Antworten ganz sichtbar (`masterQ`). Zeit: `MASTER_SEC` = 20 s pro Begriff, Uhr statt XP oben (`masterTick`), rot (`.behind`), sobald mehr als 20 s × (Nummer der aktuellen Frage) verbraucht sind, blinkt in den letzten 30 s. Versuche (beim Start gezählt) und Rekord an richtigen Antworten (beim Ende oder Abbruch, `masterRecord`) stehen unter dem Knopf. Richtig → nach 0,55 s automatisch weiter; ein Fehler oder Zeit um → Ende, neu starten. Keine XP pro Antwort, kein Einfluss auf Lernstand, Verwechslungen oder Tagespflicht. Erste geschaffte Runde: Thema gekrönt (`P.crowns`), +`MASTER_XP` (5) XP pro Begriff; danach zählt nur die Bestzeit.
- **Fragearten** (`makeQuestion`): Box 0–4 (`easyQuestion`): `en2de`, `de2en`, `def2en` (Erklärung → Begriff), `en2def` (Begriff → Erklärung, Antworten immer ganz sichtbar), `cloze` (Lückensatz, doppelt gewichtet). Ab Box 5 (`hardQuestion`/`hardTypes`): `type` (eintippen, doppelt gewichtet), `def2en` mit Verwechslungs-Ablenkern, `sit` (doppelt), `conf`, `tf`, `cloze` mit Zusatzsatz; ohne Zusatzinhalte nur `type` und `def2en`.
- **Spracheingabe** (🎤 neben dem Eingabefeld, nur wenn `SR` existiert): `en-US`, bis 5 Varianten, jede mit `checkTyped` geprüft (richtig > fast richtig > Verwechslung > falsch). Zählt wie Eintippen, auch für die Meister-Regel. Braucht in Chrome meist Internet.
- **Eintippen** (`checkTyped`, `typeNorm`, `lev`): Groß/Klein, führendes „to “, Bindestrich/Leerzeichen/Unterstrich egal; Levenshtein ≤ 1 je angefangene 6 Buchstaben = richtig mit Hinweis „Fast richtig“. Exakt ein anderer Begriff des Moduls = falsch (Verwechslung).
- **`conf`-Anzeige**: Die Unterschied-Sätze werden maskiert (`maskNames`): englischer Begriff und deutsche Hauptwörter (ohne Artikel, `:in`, kleine Endungen) → „A“/„B“. Falsche Antworten = maskierte Sätze anderer Paare (gleiche Kategorie zuerst); unter 3 anderen Paaren gibt es keine `conf`-Frage.
- **Punkte pro Antwort:** richtig +5, falsch −2, Profi-Begriff falsch −10, „Ganz anzeigen“ −1, falsch ohne „Ganz anzeigen“ zusätzlich −2 (nicht bei `en2def`, `type`, `conf`, `tf`, alle `full:true`). Ausnahme `tf`: richtig +3, falsch −2 (auch bei Profi). XP nie unter 0.
- **Lernstand** (`P.boxes`, 0–15): 0–4 in Arbeit, ab 5 (`SIT`) Profi ⭐, 15 (`MAX_BOX`) gemeistert 🏆. Profi braucht 10 richtige in Folge (`PRO_GOAL`), ein Fehler setzt auf 5 zurück. Nur das Quiz verändert den Lernstand.
- **Meister-Regel** (`settle`, `HARD`, `HARD_NEED` = 3): Box 15 nur mit mindestens 3 richtigen `type`/`sit`/`conf`-Antworten seit dem letzten Fehler (`P.hard`), sonst bleibt der Begriff auf 14. Auf Box 14 ohne erfüllte Regel kommen nur diese Fragearten.
- **Verwechslungen** (`P.mix`): bei falscher Antwort wird der gewählte Begriff gespeichert (bei `conf` der Partner, beim Eintippen ein exakt getippter anderer Begriff). `distractors` nimmt bei Profi-Begriffen zuerst diese, dann `conf`-Partner (beide Richtungen), dann wie bisher; die Anfangsbuchstaben-Regel gilt weiter.
- **Tagespflicht** (`QUIZ_GOAL` = 3, `QUIZ_PENALTY` = 200): pro Modul; versäumte Tage werden in `dailyCheck` beim nächsten Öffnen abgezogen. Ist das ganze Modul gemeistert (`allMastered`), entfällt sie; der Ring zeigt dann 🏆.
- **Tagesbonus** (`dayBonus`): 4.–9. Quiz +25, 10. +50, ab 11. +20.
- **Auswahl** (`pickQuizTerms`, nur aus `quizPool`): Pausen nach `gapFor` (in Arbeit 2 Runden, Profi 2–6), mind. 3 neue Begriffe pro Runde, max. 3 Vormerkungen (📌).
- **Karteikarten:** keine XP; „Nochmal üben“ setzt eine Vormerkung (`P.flags`).

## Code-Landkarte `app.js`

| Bereich | Funktionen |
|---|---|
| Module laden | `CATALOG_ORDER` (alle aus dem Index), `MODULE_ORDER` (nur gewählte, in Index-Reihenfolge), `INDEX` (Katalogdaten), `loadIndex`, `ensureModule` (merkt laufende Downloads, prüft Format, Fehler mit `code` `offline`/`missing`/`broken`/`newer`), `needsNewerApp`, `modErrText`, `applyTheme`, `loadModule`, `switchModule` (= `swipeTo`) |
| Modulauswahl | `initChosen` (Übergang: ohne `lernapp.chosen` alle mit Lernstand), `setChosen`, `hasProgress`, `unloadModule`, `dropModuleCache` |
| Katalog | `showCatalog` (Blatt „Module verwalten“), `mountCatalog`/`catalogItems` (auch für die Willkommen-Seite), `enterModule` (Tagespflicht-Pause, dann wechseln), `removeModule` |
| Start | `boot` (ganz unten): `loadIndex` → `initChosen` → `renderWelcome` (nichts gewählt) oder `startChosen` (Startmodul, kaputte überspringen, sonst `renderNoModule`) → `startApp` (lädt nach 1,5 s nur die übrigen gewählten Module vor) |
| Modulwechsel & Wischen | `renderModbar` (Leiste mit Marker `--pos`, Pfeiltasten), `initSwipe` (Wischgeste nur auf der Übersicht, nur Finger/Stift), `swipeTo` (raus-/reinschieben), `snapBack`, `slide`, `settleAnim`; Hinweis einmalig über `lernapp.swipehint` |
| Übergänge | `transit(fn, dir)` (View Transitions, `dir` = `fwd`/`back`), `goHome`; Karteikarten fliegen nach rechts (gewusst) oder links (nochmal) weg (`advance` in `renderCard`) |
| Zusatzinhalte | `fetchExtras` (gemeinsamer Lader, merkt laufende Downloads), `loadExtras` (beim Quizstart, max. 2,5 s warten, 404 still), `preloadExtras` (alle Kategorien nach dem Hinzufügen), `extraOf` (geprüfte Inhalte eines Begriffs), `nameVariants`, `maskNames`; im Speicher `MOD.extra`, `MOD.extraDone`; `BYID` = Begriffe nach ID |
| Begriffe | `buildTerms`, `cloze`, `clozeDe`, `keyLetter`, `shortLabel`, `highlight` |
| Speicher | `freshProgress`, `save`, `fixCats`; Cloud-Funktionen (`pushCloud`, `syncCloud`, `connectCloud`) sind Altlast aus claude.ai und außerhalb inaktiv |
| Punkte & Ränge | `addXP`, `levelInfo`, `levels`, `dailyCheck`, `dayBonus`, `setBox` |
| Auswahl | `pool`, `pickQuizTerms` (Quiz), `pickTerms` (Karteikarten), `distractors`, `gapFor` |
| Meisterrunde | `catTerms`, `catMastered`, `crowned`, `allMastered`, `startMaster` (async), `masterQ`, `masterTick`/`stopMaster`, `settleMaster` (aus `settle` abgezweigt), `masterTry`/`masterRecord`, `masterEnd`, `renderMasterEnd`, `crownOf` + `CROWN_DESIGNS`/`CROWN_GENERIC`, `clock` |
| Quiz | `startQuiz` (async), `quizPool`, `repeatFill`, `makeQuestion`, `easyQuestion`, `hardQuestion`, `hardTypes`, `otherConfs`, `renderQuiz`, `answer`/`answerTyped` → `settle` (Punkte, Lernstand), `checkTyped`, `nextQuestion`, `renderQuizDone` |
| Karteikarten | `startCards`, `renderCard`, `renderCardsDone` |
| Nachschlagen | `renderLex`, `proTag` |
| Startseite & Kopf | `renderHome` (Knopf „Module verwalten“ bei Export/Import), `renderTop`, `renderModbar` (nur gewählte Module, ＋ am Ende) |
| Fenster | `sheet`, `openDialog`, `showLevels`, `showHelp`, `showCalendar`/`renderCalendar`, `showExport`, `showImport`, `showModulePicker` |
| Zurück-Taste | `navPush`, `navEnterScreen`, `popstate`-Handler, `renderHome(fromPop)` |
| Sonstiges | `speak` (Vorlesen), `listen`/`stopListen`/`answerSpoken` (Spracheingabe, `SR`), `toast(msg, ms)`, `confetti`, `setFocus` (blendet Modulleiste und Kopf in Quiz/Karten/Nachschlagen aus) |

## Gespeicherter Fortschritt (`P`, pro Modul in `localStorage[ls]`)

`xp`, `crowns{kategorie:{day, best (ms), runs}}`, `mtries{kategorie:{n, best}}` (Meisterrunde: Versuche, meiste richtige Antworten), `boxes{id:0–15}`, `last{id:runde}`, `round`, `flags{id:1}`, `mix{id:{andereId:anzahl}}`, `hard{id:anzahl}`, `cats[]`, `quizLog{tag:anzahl}`, `xpLog{tag:netto}`, `penaltyLog{tag:200}`, `checkedUntil`, `penalty`, `updatedAt`.
Tagesformat: `JJJJ-M-T` (ohne führende Nullen, siehe `dayStr`). Export-Format: `{"format":"lernapp-fortschritt","version":1,"modules":{key:P}}`.
Weitere Schlüssel: `lernapp.chosen` (Array der gewählten Modul-Keys), `devvokabeln.module` (zuletzt offenes Modul), `lernapp.theme` (Farbschema für den Start), `lernapp.swipehint`.
Entfernen eines Moduls löscht nur `lernapp.chosen`-Eintrag und Daten-Cache, nie den Lernstand. Beim Wieder-Hinzufügen wird `checkedUntil` auf gestern gesetzt (keine Tagespflicht-Abzüge für die Pause). Der Export enthält alle Module mit Lernstand, auch abgewählte; ein Import nimmt nicht gewählte Module in die Auswahl auf.

## Gestaltung und Konventionen

- Dunkle Modul-Schemata (Hintergrund fast schwarz mit Farbstich) mit weichem Schein der Modulfarbe oben (`body::before`); gedämpfte Pastellkarten für Kategorien (`--n-*` in `style.css`), abgerundet, ohne Drehung und Klebestreifen.
- Theme-Farben sind mit `@property` registriert und blenden beim Modulwechsel in 0,45 s über. Maße: `--r-lg/--r-md/--r-sm`, Kurven `--ease`/`--spring`, Flächen `--raise`, `--edge`, `--shadow`.
- Alles Tippbare federt beim Antippen (`scale(.965)`). Fenster (`dialog`) kommen als Blatt von unten, ab 700 px Breite mittig. Seitenwechsel gleiten über `view-transition-name: page` auf `#pager`; Hintergrund und Modulleiste bleiben stehen. `prefers-reduced-motion` schaltet alle Bewegungen ab.
- `#pager` hat `touch-action: pan-y pinch-zoom`, damit senkrechtes Scrollen beim Browser bleibt und waagrechtes Wischen bei der App.
- Schriften: Bricolage Grotesque (Überschriften), Atkinson Hyperlegible (Text).
- Profi-Begriffe: goldener Rahmen (Quiz-Karte und Nachschlagen), gemeistert: grüner Rahmen.
- Gemeisterte Themen: unter der Themenzeile der Knopf „🏆 Meisterrunde“ (`.tgroup`, `.master-btn`). Gekrönte Themen bekommen `.crown` mit `data-crown="<Kategorie>"` (Übersicht und Nachschlagen). Jede Kategorie hat ein eigenes Muster in `style.css` (`.crown[data-crown="code"]` usw., alles CSS-Verläufe, ein Lichtstreif läuft über alle) und Name + Symbol in `CROWN_DESIGNS`. **Neue Kategorie:** dort und in `style.css` ein eigenes Design ergänzen, sonst bekommt sie eines der 6 allgemeinen (`g0`–`g5`, nach Position im Modul). Designs nicht vorab zeigen, sie sind die Belohnung.
- Texte auf Deutsch (Österreich: Lehrling, Gehsteig, Stiegenhaus, Krankenstand), Gendern mit `:in`.
- Fenster immer über `sheet(id)` + `openDialog(dlg)` öffnen, damit die Zurück-Taste funktioniert.
- Testen: lokal mit `python3 -m http.server` im Projektordner und Playwright; `file://` funktioniert wegen `fetch` nicht.

## Ausbau „Verstehen statt Auswendiglernen“ (in Arbeit)

Ziel: Profi-Begriffe nicht mehr an immer denselben Texten wiedererkennen, sondern anwenden und abgrenzen. Umsetzung in **getrennten Chats**: zuerst ein Code-Chat, dann ein Chat pro Kategorie für die Inhalte. Jeder Chat klont das Repo, liest diese Datei und hakt seinen Schritt unten im Status ab.

### Schritt 1: Code-Chat (wirkt für alle Module)

Dateien: `app.js`, `style.css`, `sw.js`. Moduldateien nie komplett lesen.

1. **Schwierigkeit nach Lernstand** (`makeQuestion`): Box 0–4 wie bisher. Ab Box 5 (Profi) nur noch schwere Fragearten: `type` (eintippen), `sit`, `conf`, `tf`, `cloze` mit Zusatzsatz, `def2en` mit Verwechslungs-Ablenkern. Fehlen für einen Begriff Zusatzinhalte, nur die vorhandenen schweren Arten verwenden.
2. **Eintippen** (`type`): Erklärung oder deutsches Wort wird gezeigt, englischer Begriff wird eingetippt. Toleranz: Groß/Klein, führendes „to “, Bindestrich/Leerzeichen egal; Levenshtein-Abstand ≤ 1 je angefangene 6 Buchstaben zählt als richtig (Hinweis „fast richtig: …“). Eingabefeld mit `autocapitalize="off" autocorrect="off" spellcheck="false"`, Enter bestätigt. Button „Weiß ich nicht“ = falsch.
3. **Ablenker aus eigenen Fehlern**: bei falscher Antwort Paar speichern in `P.mix = {id: {andereId: anzahl}}`. `distractors` nimmt für Profi-Begriffe zuerst diese, dann `conf`-Partner aus der Zusatzdatei, dann wie bisher.
4. **Meister-Regel**: Box 15 nur, wenn seit dem letzten Fehler mindestens 3 richtige Antworten aus `type`, `sit` oder `conf` dabei waren (`P.hard = {id: anzahl}`, wird bei Fehler auf 0 gesetzt). Sonst bleibt der Begriff auf Box 14, bis das erfüllt ist.
5. **Neue Fragearten anzeigen**: `sit` (Situation → welcher Begriff? 5 Antworten), `conf` („Was unterscheidet A von B?“ → richtige Unterschied-Aussage gegen 3 falsche aus anderen Paaren), `tf` (Aussage → „Stimmt“ / „Stimmt nicht“, danach Begründung). Nach jeder Antwort wie bisher Erklärung und Beispielsatz zeigen.
6. **Punkte**: wie bisher (+5 / −2 / Profi −10). Ausnahme `tf`: richtig +3, falsch −2 (Raten bringt sonst zu viel). Hilfe-Fenster (`showHelp`) um die neuen Fragearten und die Meister-Regel ergänzen.
7. **Zusatzdateien laden**: Pfad `modules/extra/<modul-key>/<kategorie-key>.json`, beim Quizstart nur für aktive Kategorien per `fetch`, fehlende Dateien (404) still ignorieren. Im Speicher pro Modul zwischenhalten. `sw.js`: nichts vorab laden, der Fetch-Handler cacht sie beim ersten Abruf.
8. Testdaten für 3–5 Begriffe nur lokal anlegen, **nicht** ausliefern. `VERSION` erhöhen, Änderungsprotokoll ergänzen.

### Schritt 2: Inhalte-Chats (zuerst IT, später Agile; ein Chat pro Kategorie)

Gilt für **beide** Module. Für Agile erst starten, wenn Schritt G für alle Agile-Kategorien erledigt ist (siehe „Nächste Schritte“). Unterschiede bei Agile: Begriffe aus `modules/agile/module.json` lesen, Datei `modules/agile/extra/<kategorie>.json` mit `"module":"agile"`, `conf`-IDs müssen in `modules/agile/module.json` existieren (die App sucht Partner nur im eigenen Modul), Status in der Tabelle „Schritt 2 für Agile“ abhaken. Alles andere (Format, Regeln, Prüfskript) wie unten beschrieben.

Ablauf: Repo klonen, per Skript nur die Begriffe der Kategorie auslesen (Index 1, 2, 3, 6, 7 – Begriff, Deutsch, Erklärungen), Inhalte in Blöcken von ca. 25 Begriffen schreiben, Datei per Skript prüfen (siehe unten), nur `modules/<modul>/extra/<kategorie>.json` und diese Datei (Status abhaken) ausliefern. **Keine** `VERSION`-Erhöhung nötig.

**Dateiformat** `modules/<modul>/extra/<kategorie>.json` (bis v12: `modules/extra/<modul>/…`):
```json
{"format":"fachvokabeln-extra","version":1,"module":"dev","cat":"net",
 "terms":{
  "latency":{
   "ex":[["High latency made every video call stutter.","Durch die hohe Latenz hat jeder Videocall geruckelt."],["…","…"]],
   "sit":["Situation 1","Situation 2","Situation 3"],
   "conf":[["bandwidth","Latenz ist die Verzögerung pro Paket, Bandbreite die Datenmenge pro Sekunde."]],
   "tf":[[false,"Mehr Bandbreite senkt automatisch die Latenz.","Die Leitung kann breit und trotzdem langsam im Antworten sein."],[true,"…","…"]]
  }}}
```
Schlüssel in `terms` = Begriffs-ID wie in `buildTerms` (Kleinbuchstaben, Sonderzeichen → `-`).

**Regeln für die Inhalte**
- `ex`: genau 2 neue Satzpaare (englisch, deutsch). Englischer Satz enthält den Begriff wörtlich (ohne „to “), anders als der vorhandene Beispielsatz. Achtung: Die App prüft mit Wortgrenzen (`termRe`), Plural oder angehängte Endungen („tasks“, „user interviews“) zählen **nicht**, der Satz fällt dann still weg. Deutsch: österreichischer Arbeitsalltag.
- `sit`: genau 3 Situationen auf Deutsch, je 2–3 Sätze, aus dem österreichischen Arbeitsalltag (Lehrling, Kolleg:in, Kund:in, Daily, Krankenstand …). Enthalten **weder** den englischen Begriff **noch** die deutsche Übersetzung oder deren Wortstamm. Keine Frage am Ende (die App fragt „Welcher Begriff passt?“). Die Situation muss eindeutig sein, auch gegenüber naheliegenden Begriffen derselben Kategorie. Die drei Situationen zeigen verschiedene Blickwinkel (Ursache, Folge, Einsatz).
- `conf`: 1–2 Verwechslungspartner (ID muss im Modul existieren, darf aus anderer Kategorie sein) mit **einem** Satz zum Unterschied, in dem beide Begriffe vorkommen dürfen. Gibt es keinen sinnvollen Partner, leeres Array. Die App ersetzt im Satz beide Begriffe durch „A“ (Begriff selbst) und „B“ (Partner), daher: beide mit dem englischen Begriff oder dem deutschen Hauptwort aus Index 2 nennen (keine Umschreibungen), Begriff zuerst, und der Satz muss auch mit A/B ohne die Namen verständlich sein.
- `tf`: genau 2 Aussagen auf Deutsch, eine wahr, eine falsch. Die falsche greift eine **typische Fehlvorstellung** auf, nicht etwas offensichtlich Absurdes. Begründung ein Satz. Hier darf der Begriff vorkommen.
- Gendern mit `:in`, österreichische Wörter, fachlich korrekt und passend zu den vorhandenen Erklärungen.

**Prüfskript vor der Auslieferung** (muss ohne Fehler laufen; am sichersten mit `termRe`, `buildTerms`, `nameVariants` und `maskNames` direkt aus `app.js` in Node, weil die App mit Wortgrenzen und deklinierten Formen arbeitet): jede Begriffs-ID der Kategorie vorhanden; `ex` = 2 Paare und englischer Satz enthält den Begriff; `sit` = 3 und keine enthält Begriff oder deutsche Übersetzung (ohne Artikel, Groß/Klein egal); `conf`-IDs existieren im Modul; `tf` = 2 mit genau einem `true`; gültiges JSON.

### Status

| Schritt | Begriffe | Erledigt |
|---|---|---|
| Code-Chat | – | ☑ (v6) |
| `code` Programmiergrundlagen | 122 | ☑ |
| `oop` Objektorientierung & Muster | 84 | ☑ |
| `algo` Algorithmen & Datenstrukturen | 74 | ☑ |
| `web` Web, UI & Apps | 105 | ☑ |
| `arch` Architektur & APIs | 103 | ☑ |
| `data` Datenbanken & Daten | 90 | ☑ |
| `net` Netzwerk | 80 | ☑ |
| `sec` IT-Sicherheit | 92 | ☑ |
| `ops` Betrieb, Cloud & DevOps | 104 | ☑ |
| `git` Git & Werkzeuge | 74 | ☑ |
| `test` Testen & Qualität | 81 | ☑ |
| `ai` KI & Machine Learning | 66 | ☑ |
| `talk` Kommunikation im Job | 125 | ☑ |
| `it` IT-Alltag & Hardware | 105 | ☑ |

## Neues Modul „Agile & Projekte“ (Umbau und Grunddaten erledigt)

Ziel: Scrum (`scrum`) und Projektmanagement (`pm`) aus dem IT-Modul (früher „IT & Scrum“) in ein eigenes Modul verschieben und auf 507 Begriffe in 13 Kategorien (je 30–50) ausbauen. Die verbindliche Begriffsliste mit Kategorie, Englisch, Deutsch und Herkunft (B = Bestand, N = neu) steht in **`docs/agile-projekte-begriffe.md`**. Diese Liste ist abgesegnet, nicht eigenmächtig ändern.
Umsetzung in **getrennten Chats**: zuerst der Umbau-Chat, dann ein Chat pro Kategorie für die neuen Begriffe. Jeder Chat klont das Repo, liest diese Datei und hakt seinen Schritt im Status unten ab.
**Keine Migration des Lernstands nötig**: In den Kategorien `scrum` und `pm` gibt es noch keinen Fortschritt.

### Schritt U: Umbau-Chat

Dateien: `modules/it-scrum.json` (nur per Skript, nie lesen), `modules/index.json`, neues `modules/agile.json`, `modules/extra/dev/*.json` (nur `conf` per Skript), `app.js` (`CROWN_DESIGNS`), `style.css` (Krönchen), `sw.js`, `README.md`, diese Datei.

1. **Neues Modul `modules/agile.json`** anlegen: `key` `agile`, `name` „Agile & Projekte“, `short` „Agile“, `icon` 🧭.
   - `cats` in dieser Reihenfolge mit Farben: `agil` Agile Grundlagen & Frameworks (mint), `team` Scrum-Rollen & Teamdynamik (teal), `sprint` Events & Sprint-Alltag (orange), `backlog` Backlog, Schätzen & Planen (butter), `lean` Kanban & Lean (sage), `produkt` Produktstrategie & Kennzahlen (sky), `discovery` Nutzerforschung & Design Thinking (rose), `orga` Agile Organisation & Führung (lilac), `plan` Projektplanung & Steuerung (pink), `anf` Anforderungen & Scope (peri), `kosten` Verträge, Kosten & Beschaffung (sand), `risiko` Risiko, Qualität & Abschluss (coral), `komm` Stakeholder, Kommunikation & Moderation (aqua). Farbe jeweils als `var(--n-…)`.
   - `levels` mit den üblichen XP-Grenzen. Namen: Praktikant:in, Lehrling, Projektassistent:in, Teammitglied, Story-Schreiber:in, Schätzprofi, Retro-Moderator:in, Kanban-Kenner:in, Requirements Engineer, Scrum Master, Product Owner, Projektleiter:in, Agile Coach, Release Train Engineer, Programmmanager:in, Portfolio-Manager:in, Head of PMO, Transformationslead, Chief Agile Officer, Agile-Legende.
   - `theme`: eigenes weinrotes Schema (`accent` etwa `#8a2342`, `board` fast schwarz mit Weinrot-Stich, etwa `#0d0407`), im Aufbau wie die anderen Module. Gut unterscheidbar von Violett (IT) und Grün (Glasfaser). `bad` (falsche Antwort) muss sich deutlich vom Weinrot abheben, z. B. ein helleres, wärmeres Rot oder Orange-Rot, und die Pastellkarten `coral`/`rose` müssen auf dem Hintergrund gut lesbar bleiben.
2. **Bestand verschieben** (198 Begriffe, alle mit Herkunft B in der Liste): per Skript aus `it-scrum.json` nach `agile.json` kopieren. Dabei nur Index 0 auf den neuen Kategorie-Key setzen, alles andere unverändert lassen. Danach aus `it-scrum.json` entfernen.
3. **IT-Modul bereinigen**:
   - Zusätzlich entfernen: `team velocity`, `to do`, `in progress`, `done`. Diese wandern nicht mit.
   - `cats` ohne `scrum` und `pm`.
   - `name` und `short` werden „IT“, in `it-scrum.json` und in `index.json`. `key`, `file` und `ls` bleiben, die Rangnamen auch.
   - Danach 1.305 Begriffe.
4. **Kaputte Verweise reparieren** (19 `conf`-Einträge in `modules/extra/dev/`). Ersatz:
   - `data.json`: kpi → `metric` (statt okr)
   - `talk.json`:
     - meeting → `all-hands meeting` (statt workshop)
     - availability → `high availability` (statt capacity)
     - knowledge-transfer → `onboarding` (statt handover)
     - concern → `to raise an issue` (statt risk)
     - to-raise-an-issue → `concern` (statt escalate)
     - use-case → `user flow` (statt user-story)
     - end-user → `client` (statt customer)
     - checklist → `runbook` (statt definition-of-done)
     - showstopper → `bug` (statt blocker)
     - out-of-scope → Eintrag streichen (statt scope-creep)
   - `algo.json`: iterative → `recursion` (statt iteration)
   - `web.json`: prototype → `proof of concept` (statt mvp)
   - `arch.json`:
     - third-party → `library` (statt vendor)
     - proof-of-concept → ein Eintrag `prototype` (statt mvp und spike)
     - non-functional-requirement → beide Einträge streichen (requirement, acceptance-criteria)
     - system-boundary → `bounded context` (statt scope)

   Jeder Ersatz bekommt einen neuen Unterschied-Satz nach den `conf`-Regeln (Begriff zuerst, beide mit englischem Begriff oder deutschem Hauptwort). Ist der Partner beim Begriff schon vorhanden, nur den alten Eintrag streichen. Danach per Skript prüfen, dass jede `conf`-ID im Modul existiert.
5. **`modules/index.json`**: dritten Eintrag ergänzen: `key` `agile`, `file` `agile.json`, `name` „Agile & Projekte“, `short` „Agile“, `icon` 🧭, `ls` `devvokabeln.progress.agile`, `doc` `progress-agile`, `accent`/`board` wie im Theme.
6. **Krönchen**:
   - In `CROWN_DESIGNS` und `style.css` den Key `scrum` in `sprint` und `pm` in `plan` umbenennen. Die Designs bleiben gleich.
   - Für die übrigen 11 Kategorien eigene Designs im Stil der vorhandenen ergänzen. Die Designs nicht im Chat zeigen oder beschreiben, sie sind die Belohnung.
7. **Testen** mit `python3 -m http.server` und Playwright: Modulleiste mit drei Modulen, Wischen, Quiz und Nachschlagen in beiden betroffenen Modulen, keine Konsolenfehler. Kategorien, die anfangs nur wenige Begriffe haben (z. B. `discovery` mit 2), sind erlaubt.
8. **Abschluss**:
   - `VERSION` in `sw.js` erhöhen.
   - README und diese Datei aktualisieren: Modulliste und Begriffszahlen, Tabelle „Dateien“; im Status von „Verstehen statt Auswendiglernen“ die Zeilen `scrum` und `pm` streichen, `git` auf 74.
   - Änderungsprotokoll ergänzen und Schritt U unten abhaken.

### Schritt G: Grunddaten-Chats (ein Chat pro Kategorie von `agile`)

Ablauf:
1. Repo klonen.
2. Aus `docs/agile-projekte-begriffe.md` die Begriffe der Kategorie mit Herkunft N lesen.
3. Per Skript die schon vorhandenen Begriffe der Kategorie aus `modules/agile.json` auslesen (nur Index 1, 2, 3), damit Erklärungen zusammenpassen und sich nicht wiederholen.
4. Die neuen Einträge im vollen Format (Index 0–8, siehe „Ein Begriff“) in Blöcken von etwa 25 Begriffen schreiben und per Skript an `raw` anhängen. Die Datei nie komplett lesen.
5. Das Deutsch aus der Liste übernehmen. Kleine Korrekturen sind erlaubt, wenn sie fachlich nötig sind; dann auch die Liste anpassen.

Inhaltliche Regeln wie überall: Erklärungen 1–3 ohne den englischen Begriff, Beispielsatz enthält ihn wörtlich (ohne „to “), deutscher Satz aus dem österreichischen Arbeitsalltag, Gendern mit `:in`.

**Prüfskript vor der Auslieferung** (muss ohne Fehler laufen):
- Gültiges JSON.
- Jeder N-Begriff der Kategorie ist genau einmal vorhanden; alle IDs im Modul sind eindeutig.
- Jeder Eintrag hat 8–9 Felder, Index 0 ist der Kategorie-Key.
- Index 3, 6 und 7 enthalten den englischen Begriff nicht (Groß/Klein egal).
- Index 4 enthält den Begriff (ohne „to “).
- Index 8, falls vorhanden, besteht nur aus exakten Teilstrings von Index 5.
- Kategorie danach 30–50 Begriffe.

Ausliefern: nur `modules/agile.json` und diese Datei (Status abhaken). Eine `VERSION`-Erhöhung ist nicht nötig.
**Danach Schritt 2:** Sobald alle Zeilen der Tabelle unten abgehakt sind, kommen die Zusatzinhalte für jede Agile-Kategorie (`modules/extra/agile/<kategorie>.json`, Ablauf und Regeln wie in Schritt 2 oben, Status in der Tabelle „Schritt 2 für Agile“).

### Status

| Schritt | Begriffe (B + N) | Erledigt |
|---|---|---|
| U Umbau-Chat | 198 verschoben | ☑ (v12) |
| G `agil` Agile Grundlagen & Frameworks | 23 + 20 = 43 | ☑ |
| G `team` Scrum-Rollen & Teamdynamik | 14 + 23 = 37 | ☑ |
| G `sprint` Events & Sprint-Alltag | 14 + 24 = 38 | ☑ |
| G `backlog` Backlog, Schätzen & Planen | 28 + 15 = 43 | ☑ |
| G `lean` Kanban & Lean | 11 + 31 = 42 | ☑ |
| G `produkt` Produktstrategie & Kennzahlen | 5 + 36 = 41 | ☑ |
| G `discovery` Nutzerforschung & Design Thinking | 2 + 37 = 39 | ☑ |
| G `orga` Agile Organisation & Führung | 6 + 31 = 37 | ☑ |
| G `plan` Projektplanung & Steuerung | 38 + 11 = 49 | ☑ |
| G `anf` Anforderungen & Scope | 10 + 24 = 34 | ☑ |
| G `kosten` Verträge, Kosten & Beschaffung | 17 + 18 = 35 | ☑ |
| G `risiko` Risiko, Qualität & Abschluss | 15 + 18 = 33 | ☑ |
| G `komm` Stakeholder, Kommunikation & Moderation | 15 + 21 = 36 | ☑ |

### Status Schritt 2 für Agile (erst nach Schritt G)

| Kategorie | Begriffe | Erledigt |
|---|---|---|
| `agil` Agile Grundlagen & Frameworks | 43 | ☑ |
| `team` Scrum-Rollen & Teamdynamik | 37 | ☑ |
| `sprint` Events & Sprint-Alltag | 38 | ☑ |
| `backlog` Backlog, Schätzen & Planen | 43 | ☑ |
| `lean` Kanban & Lean | 42 | ☑ |
| `produkt` Produktstrategie & Kennzahlen | 41 | ☑ |
| `discovery` Nutzerforschung & Design Thinking | 39 | ☑ |
| `orga` Agile Organisation & Führung | 37 | ☑ |
| `plan` Projektplanung & Steuerung | 49 | ☑ |
| `anf` Anforderungen & Scope | 34 | ☑ |
| `kosten` Verträge, Kosten & Beschaffung | 35 | ☑ |
| `risiko` Risiko, Qualität & Abschluss | 33 | ☑ |
| `komm` Stakeholder, Kommunikation & Moderation | 36 | ☑ |

## Vorhaben „Modulsystem“ (erledigt, v13)

Ziel: Die App ist der feste Lernrahmen, Module sind austauschbare Inhalte im Repo. Jeder Nutzer wählt, welche Module er verwendet. **Nur gewählte Module werden geladen und offline gespeichert.** Hintergrund: Später sollen viele, auch kleine Module dazukommen (z. B. Biologie oder Geographie für einen Schultest, von Claude erstellt). Dann darf nicht jedes Handy alles herunterladen.

**Abgrenzung:** Dieser Schritt ändert nichts an Inhalten, Fragearten, Punkten, Rängen oder Lernstand-Regeln. Neue Fragearten, Fortschritt in Stufen statt XP und die dafür nötigen neuen Modulinhalte gehören zum späteren Vorhaben „Lernrahmen“, eine Sprachprüfung mit KI zu einem eigenen Vorhaben. Beide sind noch nicht definiert und werden hier nicht vorweggenommen.

**Ein Chat.** Dateien: `app.js`, `sw.js`, `style.css` (Katalog), `modules/` (nur verschieben und per Skript ergänzen, große JSON-Dateien nie lesen), `README.md`, diese Datei.

### Ist-Zustand vor v13: warum damals alles geladen wurde

- `sw.js` lädt beim Installieren alle Module aus `index.json` in den Cache.
- `boot` lädt nach 1,5 s alle übrigen Module vor (`MODULE_ORDER.forEach(ensureModule)`).
- Modulleiste, Wischen, Pfeiltasten und `showModulePicker` zeigen immer alle Module aus `MODULE_ORDER`.

### Schritte

1. **Ein Ordner pro Modul** (mit `git mv`, damit die Historie bleibt):
   - `modules/<key>/module.json` und `modules/<key>/extra/<kategorie>.json`. Der Ordnername ist immer der `key`.
   - `it-scrum.json` → `modules/dev/module.json`, `modules/extra/dev/` → `modules/dev/extra/`; ebenso `glasfaser.json` → `modules/ftth/`, `agile.json` → `modules/agile/`.
   - `ensureModule` lädt `modules/<key>/module.json`, `loadExtras` lädt `modules/<key>/extra/<kat>.json`. Das Feld `file` in `index.json` entfällt.
   - Jede `module.json` bekommt vorne `"format":"fachvokabeln-modul","version":1` (per Skript, kompakt wie bisher, `ensure_ascii=False`, sonst nichts ändern). Damit kann der spätere Lernrahmen alte und neue Module unterscheiden.
2. **`index.json` wird zum Katalog.** Felder wie bisher (`key`, `name`, `short`, `icon`, `ls`, `doc`, `accent`, `board`), ohne `file`, dazu neu:
   - `desc`: ein Satz für den Katalog, z. B. „Englische Fachbegriffe rund um Glasfaserausbau und FTTH“.
   - `count`: Zahl der Begriffe (per Skript aus `raw` ermitteln). Optional; fehlt es, zeigt der Katalog keine Zahl. Bei Begriffsänderungen mitpflegen.
   - Regeln für neue Module: `ls` = `lernapp.progress.<key>`, `doc` = `progress-<key>`. Bestehende `ls`-Werte **nie ändern**.
3. **Auswahl speichern:** `localStorage["lernapp.chosen"]` = Array der gewählten Keys. Reihenfolge in Leiste und Wischen = Reihenfolge in `index.json`.
   - Empfehlung für den Code: `CATALOG_ORDER` = alle Module aus dem Index, `MODULE_ORDER` = nur gewählte. Dann bleiben die meisten Stellen, die `MODULE_ORDER` nutzen (Leiste, Wischen, Pfeiltasten, `modIdx`, `loadModule`), unverändert richtig.
   - **Übergang für bestehende Nutzer:** Fehlt `lernapp.chosen`, werden alle Module gewählt, für die schon Lernstand in `localStorage[ls]` liegt. Niemand verliert ein Modul.
   - **Neues Gerät** (nichts gewählt, kein Lernstand): Die App öffnet den Katalog statt der Übersicht.
   - Gewählte Keys, die nicht mehr im Index stehen, still aus der Auswahl entfernen.
4. **Katalog „Module verwalten“** (neues Blatt, ersetzt die Auswahlfunktion von `showModulePicker`):
   - Alle Module aus `index.json`: Symbol, Name, `desc`, `count`, Knopf „Hinzufügen“ bzw. „Entfernen“.
   - Erreichbar über ein ＋ am Ende der Modulleiste und im Menü bei Export/Import.
   - **Hinzufügen:** Modul laden (Ladeanzeige; ohne Netz klare Meldung), zur Auswahl ergänzen, direkt dorthin wechseln. Im Hintergrund danach alle Zusatzdateien seiner Kategorien laden (404 still ignorieren), damit das Modul vollständig offline läuft.
   - **Entfernen:** Rückfrage mit Hinweis „Dein Fortschritt bleibt gespeichert, falls du das Modul wieder hinzufügst“. Lernstand in `localStorage` bleibt, die Dateien des Moduls werden aus dem Daten-Cache gelöscht. Das letzte gewählte Modul kann nicht entfernt werden.
   - Das Auswahlmenü ab 4 Modulen (`showModulePicker`) zeigt weiterhin zum Wechseln, aber nur gewählte Module.
5. **Nur Gewähltes laden:** `boot` nimmt das Startmodul aus der Auswahl (zuletzt offenes, sonst erstes gewähltes) und lädt nach 1,5 s nur die übrigen **gewählten** Module vor. Kein Code darf mehr über alle Module des Katalogs `ensureModule` aufrufen.
6. **Tagespflicht bei Pause:** Beim Wieder-Hinzufügen eines Moduls mit vorhandenem Lernstand `checkedUntil` auf gestern setzen, bevor `dailyCheck` läuft. Die Zeit, in der das Modul abgewählt war, bringt keine Abzüge.
7. **Export/Import:** Export bleibt wie er ist (liest `localStorage`, lädt keine Module), enthält also auch abgewählte Module mit Lernstand. Import eines nicht gewählten Moduls nimmt es in die Auswahl auf.
8. **Service Worker:**
   - Beim Installieren nur noch `CORE` (inkl. `modules/index.json`), keine Module mehr.
   - Zwei Caches: `fach-vokabeln-<VERSION>` für die App-Dateien und `fach-vokabeln-daten` für alles unter `modules/` außer `index.json`. `activate` löscht nur alte App-Caches, **nie den Daten-Cache**, damit gewählte Module ein App-Update offline überstehen.
   - Strategie unverändert: sofort aus dem Cache, im Hintergrund aktualisieren.
   - Löschen beim Entfernen macht die App selbst über die Cache-API (`caches.open("fach-vokabeln-daten")`, alle Einträge unter `modules/<key>/`), ohne Nachricht an den Service Worker.
   - Hinweis: Nach dem Update mit den neuen Pfaden müssen gewählte Module einmal mit Internet neu geladen werden; die alten Pfade verschwinden mit dem alten Cache.
9. **Fehlerfälle:** Fehlt eine Moduldatei oder ist sie kaputt (kein gültiges JSON, kein `raw`, keine `cats`), zeigt die App eine Meldung und läuft mit den übrigen Modulen weiter; ist das Startmodul betroffen, startet das nächste gewählte. Hat ein Modul ein unbekanntes `format` oder eine höhere `version`, meldet der Katalog „Dieses Modul braucht eine neuere App-Version“ und bietet es nicht zum Hinzufügen an.
10. **Doku:** README-Abschnitt „Ein neues Modul hinzufügen“ neu (Ordner `modules/<key>/` mit `module.json`, optional `extra/`, Eintrag in `index.json` mit `desc`; keine `VERSION`-Erhöhung nötig). In dieser Datei „Dateien“, „Welche Dateien für welche Änderung“, „Datenformat“, „Code-Landkarte“ und „Gespeicherter Fortschritt“ (`lernapp.chosen`) anpassen.
11. **Testen** mit `python3 -m http.server` und Playwright:
    - Leerer Speicher → Katalog erscheint; nach Hinzufügen eines Moduls lädt das Netzwerkprotokoll **nur** dessen Dateien.
    - Vorhandener Lernstand für alle drei Module → alle drei gewählt, alles wie vorher.
    - Hinzufügen, Entfernen, Wieder-Hinzufügen: Lernstand bleibt, keine Tagespflicht-Abzüge für die Pause.
    - Offline (Playwright `offline`) nach dem Hinzufügen: Quiz inklusive schwerer Fragearten aus den Zusatzdateien funktioniert.
    - Wischen, Leiste und Pfeiltasten nur über gewählte Module; Export/Import; keine Konsolenfehler.
12. **Abschluss:** `VERSION` in `sw.js` erhöhen, Änderungsprotokoll ergänzen, Punkt 4 unter „Nächste Schritte“ abhaken.

**Umsetzung (v13), Abweichungen und Ergänzungen:**
- Die Modulleiste ist jetzt auch bei nur einem gewählten Modul sichtbar, damit das ＋ erreichbar bleibt. Im Auswahlmodus (ab 4) steht ＋ neben dem Auswahlknopf; das Auswahlmenü hat unten „Module verwalten“.
- Neues Gerät: Willkommen-Seite mit Katalog und „Importieren“ (Fortschritt von einem anderen Gerät übernehmen, die enthaltenen Module werden gewählt).
- Ist kein gewähltes Modul ladbar (z. B. offline direkt nach dem Update): Seite „Module nicht geladen“ mit „Nochmal versuchen“ und „Module verwalten“.
- Ein kaputtes Modul bleibt gewählt (kann ein vorübergehendes Problem sein); beim Wechseln dorthin kommt die Meldung, die übrigen Module laufen weiter.
- Entfernen des gerade offenen Moduls wechselt zuerst zum nächsten ladbaren gewählten Modul; geht das nicht (offline), wird nichts entfernt.
- Getestet mit Playwright: leerer Speicher (nur Dateien des gewählten Moduls geladen), Übergang mit Lernstand in allen drei Modulen, Entfernen/Wieder-Hinzufügen ohne Abzüge, echter Offline-Betrieb (Server gestoppt) mit schweren Fragearten aus dem Daten-Cache, Hinzufügen offline (Meldung), Wischen/Pfeiltasten, Export/Import, kaputtes und zu neues Modul.

## Änderungsprotokoll

| Version | Änderung |
|---|---|
| v1 | Umbau zur PWA: Module als JSON, Service Worker, Manifest, Icons, Modulauswahl |
| v2 | IT & Scrum mit violettem Farbschema |
| v3 | Startseite: Lernstand als ein Balken statt Erklärtext; „Themen zum Üben“ und „Was schon sitzt“ zu einer Themenliste mit Häkchen und Fortschritt zusammengelegt; Kopf zeigt „noch X bis <nächster Rang>“; Zahlen mit Tausenderpunkt (`num`) |
| v4 | `sw.js`: lädt beim Installieren und Aktualisieren am Browser-Zwischenspeicher vorbei (`cache:"reload"`/`"no-cache"`). Vorher landeten wegen der 10-Minuten-Zwischenspeicherung von GitHub Pages alte Dateien im neuen Cache |
| v5 | Neues App-Icon (Karteikarten mit Übersetzungs-Sprechblase, violett); Hintergrund auf `#0a0510` angepasst, maskierbare Variante mit Sicherheitsrand |
| v6 | Ausbau Schritt 1: ab Profi nur schwere Fragearten (Eintippen, Situation, Unterschied, Stimmt das?, Lückensatz mit Zusatzsatz, Erklärung mit Verwechslungs-Ablenkern); Zusatzdateien `modules/extra/<modul>/<kategorie>.json` werden beim Quizstart geladen; Ablenker aus eigenen Fehlern (`P.mix`); Meister-Regel (`P.hard`); `tf` +3/−2; Hilfe-Fenster ergänzt |
| v7 | Spracheingabe beim Eintippen: 🎤-Knopf (Web Speech API, Englisch), wertet mehrere erkannte Varianten aus, zählt wie getippt; Fehlermeldungen für blockiertes Mikrofon/kein Netz; Hilfe ergänzt |
| v8 | Neue Gestaltung: ruhigere, runde Flächen, Schein der Modulfarbe, Farben blenden beim Modulwechsel über; Übersicht mit großer Quiz-Kachel und zwei halben Kacheln. Modulwechsel per Wischen auf der Übersicht (Marker in der Modulleiste wandert mit, Gummiband am Rand, einmaliger Hinweis), Modulleiste auch mit Pfeiltasten. Übergänge zwischen Bereichen und Fragen (View Transitions), 3D-Umdrehen und Wegfliegen der Karteikarten, Antwort-Animationen und Vibration, Fenster als Blatt von unten, Toast mit Ein-/Ausblenden. Andere Module werden im Hintergrund vorgeladen. `index.html` bekommt `#modbar` und `#pager` |
| v9 | Vibration entfernt (bei Antworten und beim Modulwechsel) |
| v10 | Gemeisterte Begriffe nicht mehr im Quiz; bei 1–2 offenen Begriffen Wiederholung bis 10 Fragen; Quiz endet, wenn der letzte offene Begriff gemeistert wird. Meisterrunde für gemeisterte Themen (20 s pro Begriff, kein Fehler erlaubt, ohne Einfluss auf den Lernstand), Krönung mit eigenem Design pro Thema (23 Themen-Designs + 6 allgemeine), Meisterbonus. Tagespflicht entfällt bei komplett gemeistertem Modul. Hilfe ergänzt |
| v11 | Meisterrunde: Rekord an richtigen Antworten und Zahl der Versuche unter dem Knopf; Uhr wird rot, wenn man hinter dem Plan (20 s pro Frage) liegt |
| v12 | Neues Modul **Agile & Projekte** (`agile`, weinrot, 13 Kategorien): 198 Begriffe aus `scrum`, `pm` und 2 aus `git` verschoben (nur Kategorie geändert); `team velocity`, `to do`, `in progress`, `done` gestrichen. IT-Modul heißt jetzt „IT“ (1.305 Begriffe, `key`/`ls` unverändert). 19 `conf`-Verweise in `modules/extra/dev/` auf verschobene Begriffe ersetzt bzw. gestrichen. Krönchen: `scrum` → `sprint`, `pm` → `plan`, 11 neue Designs |
| – | Schritt G für Agile abgeschlossen: 309 neue Begriffe in allen 13 Kategorien, Modul jetzt 507 Begriffe (nur `modules/agile.json`, keine `VERSION`-Erhöhung) |
| – | Schritt 2 für Agile: Zusatzinhalte für `agil`, `team`, `sprint`, `backlog`, `lean`, `produkt`, `discovery` (283 Begriffe, `modules/extra/agile/`, keine `VERSION`-Erhöhung) |
| – | Schritt 2 für Agile abgeschlossen: Zusatzinhalte für `orga`, `plan`, `anf`, `kosten`, `risiko`, `komm` (224 Begriffe), damit alle 507 Agile-Begriffe mit Zusatzinhalten (keine `VERSION`-Erhöhung) |
| v13 | **Modulsystem:** ein Ordner pro Modul (`modules/<key>/module.json`, `modules/<key>/extra/`), Moduldateien mit `format`/`version`; `index.json` ist der Katalog (`desc`, `count`, kein `file`). Nutzer wählt seine Module im neuen Katalog „Module verwalten“ (＋ in der Modulleiste und bei Export/Import), Auswahl in `lernapp.chosen`; bestehende Nutzer behalten alle Module mit Lernstand, neue Geräte starten mit dem Katalog. Nur gewählte Module werden geladen und offline gespeichert, beim Hinzufügen auch alle Zusatzdateien. Service Worker mit eigenem Daten-Cache, der App-Updates übersteht; beim Entfernen werden die Dateien gelöscht, der Lernstand bleibt. Keine Tagespflicht-Abzüge für die Zeit, in der ein Modul abgewählt war. Meldungen für fehlende, kaputte oder zu neue Module. Nach dem Update müssen gewählte Module einmal mit Internet geladen werden |
