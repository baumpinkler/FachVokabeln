# Fach-Vokabeln – Projektbeschreibung für Claude

> **Für Claude:** Lies diese Datei zuerst. Sie ersetzt das Durchlesen des gesamten Quellcodes.
> Fordere nur die Dateien an, die für die gewünschte Änderung wirklich nötig sind (siehe „Welche Dateien für welche Änderung“).
> Hochgeladene Dateien liegen unter `/mnt/user-data/uploads/`. Lies sie gezielt mit `grep -n` und `sed -n 'von,bisp'`, statt sie komplett anzuzeigen.
> Liefere am Ende **nur die geänderten Dateien** aus. Bei Änderungen an App-Dateien (`app.js`, `style.css`, `index.html`, `sw.js`, `manifest.json`) `VERSION` in `sw.js` erhöhen; reine Inhaltsänderungen in `modules/` brauchen das nicht. Änderungsprotokoll unten ergänzen.

## Nächste Schritte

> **Für Claude:** Fragt der Nutzer nach den nächsten Schritten, nenne die offenen Punkte (☐) dieser Liste. Neue größere Vorhaben hier einreihen, erledigte abhaken und ihre Ergebnisse in die passenden Abschnitte dieser Datei übernehmen, statt lange Ablaufpläne stehen zu lassen.

1. ☑ **IT-Kategorien aufteilen** (v17): 35 Kategorien mit 30–49 Begriffen, Lernstand bewusst neu gestartet.
2. ☑ **Lernrahmen L1** (v18): Aufräumen, neues Lernstand-Modell, Auswahl-Logik, Teil A. Stand siehe „Umsetzung L1“ im Abschnitt „Vorhaben ‚Lernrahmen‘“.
3. ☐ **Lernrahmen L2**: Teil B mit Bremse. Ein Chat.
4. ☐ **Lernrahmen L3**: Teil C mit KI-Prüfung, Krönchen. Ein Chat.

## Was die App ist

Installierbare Web-App (PWA) zum Lernen englischer Fachbegriffe mit deutscher Übersetzung. Zielgruppe: der Nutzer selbst (Österreich), Android-Handy, Chrome.
Zwei Module: **IT** (`dev`, 1.305 Begriffe, violettes Schema) und **Agile & Projekte** (`agile`, 507 Begriffe, weinrotes Schema), beide mit Zusatzinhalten für alle Begriffe.
Bereiche: Quiz, Karteikarten, Nachschlagen. Dazu Ränge, Kalender, Punkte-Erklärung, Export/Import.
Jeder Nutzer wählt im Katalog „Module verwalten“, welche Module er verwendet; nur diese werden geladen und offline gespeichert (seit v13).

## Hosting und Updates

- GitHub-Repository **`baumpinkler/FachVokabeln`** (öffentlich), GitHub Pages aus Branch `main`, Ordner `/ (root)`.
- Adresse: `https://baumpinkler.github.io/FachVokabeln/`
- Claude kann das Repo selbst klonen (`git clone https://github.com/baumpinkler/FachVokabeln.git`); der Nutzer muss dafür nichts hochladen.
- Update = geänderte Dateien im Repository hochladen („Add file → Upload files“).
- `sw.js` → `VERSION` bei jeder Änderung an App-Dateien erhöhen (`"v16"` → `"v17"` …), damit Handys die Änderung sofort übernehmen. Module brauchen das nicht, sie aktualisieren sich im Hintergrund.
- Alle Pfade sind relativ. Keine Build-Tools, keine Bibliotheken, kein Framework.

## Dateien

| Datei | Größe | Inhalt |
|---|---|---|
| `index.html` | 1 KB | Gerüst (`#modbar` Modulleiste, darunter `#pager` mit `#top` und `#app`), Manifest-Link, Fonts (Google Fonts), setzt gespeichertes Farbschema vor dem Laden |
| `app.js` | 96 KB (~27.000 Tokens) | gesamte Logik |
| `style.css` | 48 KB (~14.000 Tokens) | gesamte Gestaltung, Farben über CSS-Variablen |
| `sw.js` | 3 KB | Service Worker: Offline-Cache, „sofort aus Cache, im Hintergrund aktualisieren“ |
| `manifest.json` | 1 KB | App-Name, Symbole, Startfarbe `#0a0510` |
| `icons/` | – | `icon-192.png`, `icon-512.png`, `icon-maskable-512.png` |
| `modules/index.json` | 1 KB | Katalog aller Module (`desc`, `count` für „Module verwalten“) |
| `modules/<key>/module.json` | – | ein Modul, **genau eine Datei** inkl. Zusatzinhalte (`extra`); der Ordnername ist immer der `key` |
| `modules/dev/module.json` | 2,1 MB (~600.000 Tokens) | Modul IT, **nie komplett lesen oder einfügen** |
| `modules/agile/module.json` | 0,9 MB (~270.000 Tokens) | Modul Agile & Projekte, **nie komplett lesen oder einfügen** |
| `docs/agile-projekte-begriffe.md` | 28 KB | abgesegnete Begriffsliste für Agile & Projekte (Kategorie, Englisch, Deutsch); nicht eigenmächtig ändern |

## Welche Dateien für welche Änderung

| Änderung | Betroffene Dateien |
|---|---|
| Farben eines Moduls | `modules/index.json` + Hinweis, welches Modul. Claude erzeugt ein kleines Skript bzw. die `theme`-Werte; das große JSON wird per Skript geändert, nicht gelesen |
| Aussehen, Abstände, Schriften | `style.css` |
| Spielregeln, Punkte, Quiz, Kalender, neue Funktionen | `app.js` (+ ggf. `style.css`) |
| Neue Begriffe, Zusatzinhalte | die `module.json` nur per Skript bearbeiten (siehe „Inhalte schreiben“), `modules/index.json` (`count` mitpflegen). Keine `VERSION`-Erhöhung |
| Neues Modul | neuer Ordner `modules/<key>/` mit `module.json` + Eintrag in `modules/index.json` (siehe „Neues Modul anlegen“). Keine Code-Änderung, keine `VERSION`-Erhöhung; nur eigene Krönchen-Designs brauchen `app.js` + `style.css` |
| Katalog, Modulauswahl, Laden der Module | `app.js` (Bereich „Module laden“ und „Katalog“), `sw.js` (Daten-Cache) |
| Offline-Verhalten | `sw.js` |

Moduldateien nie in den Chat laden: per Skript nur die nötigen Spalten auslesen (z. B. `[1]` englischer Begriff), Änderungen per Skript zurückschreiben.

## Datenformat

### `modules/index.json` (Katalog)
```json
{"modules":[{"key":"dev","name":"IT","short":"IT","icon":"💻",
  "desc":"Englische Fachbegriffe aus Programmierung, …","count":1305,
  "ls":"devvokabeln.progress.v1","doc":"progress","accent":"#6c3fb8","board":"#0a0510"}]}
```
Reihenfolge in `index.json` = Reihenfolge in Katalog, Modulleiste und beim Wischen. Die Moduldatei liegt immer unter `modules/<key>/module.json` (kein Feld `file` mehr).
- `desc`: ein Satz für den Katalog. `count`: Zahl der Begriffe (per Skript aus `raw`), optional, bei Begriffsänderungen mitpflegen.
- `ls` = Speicherschlüssel des Lernstands, **pro Modul eindeutig, nie ändern** (sonst ist der Fortschritt weg). Neue Module: `ls` = `lernapp.progress.<key>`, `doc` = `progress-<key>`. `agile` behält seinen alten Wert `devvokabeln.progress.agile`. `dev` hat seit v17 `lernapp.progress.dev` (Neustart nach der Kategorie-Aufteilung, der alte Lernstand liegt ungenutzt unter `devvokabeln.progress.v1`).
- Optional `format`/`version` wie in der Moduldatei: Braucht ein Modul eine neuere App, zeigt der Katalog das schon ohne Download an.
- Ab 4 gewählten Modulen wird der Umschalter automatisch zum Auswahlmenü.

### Moduldatei `modules/<key>/module.json`
```
{ format:"fachvokabeln-modul", version:1, key, name, short, icon,
  cats:   { "net": {"name":"Netzwerk","c":"var(--n-sky)"}, … },
  levels: [[0,"Praktikant:in"],[100,"Lehrling"], … 20 Einträge … ,[50000,"IT-Legende"]],
  theme:  { board, board-dot, ink, ink-soft, surface, line, ok, bad, accent, m1, m2, m3 },
  raw:    [ Eintrag, Eintrag, … ],
  extra:  { "<begriffs-id>": {ex, sit, conf, tf}, … } }
```
Kompakt gespeichert (`separators=(",",":")`, `ensure_ascii=False`, ohne Zeilenumbruch am Ende). Die App (`MOD_FORMAT`, `MOD_VERSION` in `app.js`) lädt nur `format` „fachvokabeln-modul“ mit `version` ≤ 1; sonst „braucht eine neuere App-Version“. Ohne gültiges JSON, `raw` oder `cats` gilt das Modul als fehlerhaft.
`extra` (optional, seit v16, direkt nach `raw`): Zusatzinhalte für schwere Fragearten, Schlüssel = Begriffs-ID (Format und Regeln unter „Zusatzinhalte“). Fehlt das Feld, gibt es ab Profi nur `type` und `def2en`. Ändern immer per Skript: JSON laden, `extra[id]` setzen, kompakt zurückschreiben.
`theme`: `board` Hintergrund (fast schwarz), `surface` Flächen, `accent` Modul-Schalter, `m1`/`m2`/`m3` die drei Startseiten-Kärtchen (Karteikarten/Quiz/Nachschlagen).
XP-Grenzen der Ränge (alle Module gleich): 0, 100, 250, 400, 600, 900, 1.300, 1.800, 2.400, 3.200, 4.300, 5.700, 7.600, 10.000, 13.000, 17.000, 22.500, 29.500, 38.500, 50.000.

### Ein Begriff (`raw`-Eintrag, Array)
| Index | Inhalt | Regel |
|---|---|---|
| 0 | Kategorie-Schlüssel | muss in `cats` existieren |
| 1 | englischer Begriff | eindeutig im Modul; die ID wird daraus gebildet (Kleinbuchstaben, Sonderzeichen → `-`). Verben mit „to “ |
| 2 | deutsch, mit Artikel | z. B. `die Datenbank / die DB`; gegendert mit `:in` |
| 3 | Erklärung 1 | darf den englischen Begriff **nicht** enthalten |
| 4 | englischer Beispielsatz | soll den Begriff wörtlich enthalten (ohne „to “), sonst keine Lückentext-Frage |
| 5 | deutscher Beispielsatz | österreichischer Arbeitsalltag |
| 6 | Erklärung 2 | anderer Blickwinkel (Beispiel, Einsatz) – ohne den Begriff |
| 7 | Erklärung 3 | anderer Blickwinkel (Zweck, Abgrenzung) – ohne den Begriff |
| 8 | optional: Lücken im deutschen Satz | Array exakter Teilstrings aus [5], z. B. `["sperrt","aus"]`; nötig, wenn [4] den Begriff enthält |

## Spielregeln (Konstanten in `app.js`)

> **Seit v18 veraltet:** XP, Ränge, Boxen, Meisterrunde, Tagespflicht, Vormerkungen und Verwechslungen gibt es nicht mehr. Es gilt der Lernrahmen (Abschnitt „Vorhaben ‚Lernrahmen‘“, Unterabschnitt „Umsetzung L1“). Weiter gültig sind hier nur Eintippen (`checkTyped`), `conf`-Anzeige (`maskNames`) und die Regeln zu Antwortmöglichkeiten. Dieser Abschnitt, „Code-Landkarte“ und „Gespeicherter Fortschritt“ werden nach L3 neu geschrieben.

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
| Zusatzinhalte | kommen mit der Moduldatei (`MOD.extra`, `ensureModule` setzt `{}`, falls das Feld fehlt), `extraOf` (geprüfte Inhalte eines Begriffs), `nameVariants`, `maskNames`; `BYID` = Begriffe nach ID |
| Begriffe | `buildTerms`, `cloze`, `clozeDe`, `keyLetter`, `shortLabel`, `highlight` |
| Speicher | `freshProgress`, `save`, `fixCats`; Cloud-Funktionen (`pushCloud`, `syncCloud`, `connectCloud`) sind Altlast aus claude.ai und außerhalb inaktiv |
| Punkte & Ränge | `addXP`, `levelInfo`, `levels`, `dailyCheck`, `dayBonus`, `setBox` |
| Auswahl | `pool`, `pickQuizTerms` (Quiz), `pickTerms` (Karteikarten), `distractors`, `gapFor` |
| Meisterrunde | `catTerms`, `catMastered`, `crowned`, `allMastered`, `startMaster`, `masterQ`, `masterTick`/`stopMaster`, `settleMaster` (aus `settle` abgezweigt), `masterTry`/`masterRecord`, `masterEnd`, `renderMasterEnd`, `crownOf` + `CROWN_DESIGNS`/`CROWN_GENERIC`, `clock` |
| Quiz | `startQuiz`, `quizPool`, `repeatFill`, `makeQuestion`, `easyQuestion`, `hardQuestion`, `hardTypes`, `otherConfs`, `renderQuiz`, `answer`/`answerTyped` → `settle` (Punkte, Lernstand), `checkTyped`, `nextQuestion`, `renderQuizDone` |
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

## Inhalte schreiben

Gilt für alle Module. Moduldateien nie komplett lesen: per Skript die nötigen Spalten auslesen, neue Inhalte in Blöcken von etwa 25 Begriffen schreiben und per Skript einfügen, kompakt zurückschreiben (`separators=(",",":")`, `ensure_ascii=False`). Danach das jeweilige Prüfskript laufen lassen und nur die geänderte `module.json` (+ ggf. `index.json`, diese Datei) ausliefern.

### Neue Begriffe

1. Vorhandene Begriffe der Kategorie per Skript auslesen (Index 1, 2, 3), damit Erklärungen zusammenpassen und sich nicht wiederholen.
2. Neue Einträge im vollen Format (Index 0–8, siehe „Ein Begriff“) an `raw` anhängen.
3. Für Agile gilt `docs/agile-projekte-begriffe.md`: neue Begriffe dort zuerst mit dem Nutzer abstimmen, Deutsch aus der Liste übernehmen.
4. `count` in `index.json` anpassen. Neue Begriffe brauchen auch Zusatzinhalte (nächster Abschnitt), sonst gibt es für sie ab Profi nur `type` und `def2en`.

Regeln: Erklärungen 1–3 ohne den englischen Begriff, Beispielsatz enthält ihn wörtlich (ohne „to “), deutscher Satz aus dem österreichischen Arbeitsalltag, Gendern mit `:in`. Die Größenregel für Kategorien (siehe „Größe der Kategorien“) muss danach weiter erfüllt sein.

**Prüfskript** (muss ohne Fehler laufen):
- Gültiges JSON; alle IDs im Modul eindeutig.
- Jeder Eintrag hat 8–9 Felder, Index 0 existiert in `cats`.
- Index 3, 6 und 7 enthalten den englischen Begriff nicht (Groß/Klein egal).
- Index 4 enthält den Begriff (ohne „to “).
- Index 8, falls vorhanden, besteht nur aus exakten Teilstrings von Index 5.
- Größenregel: jede Kategorie 30–50 Begriffe (Ausnahme siehe „Größe der Kategorien“); jede Kategorie aus `cats` hat Begriffe.

### Größe der Kategorien (verbindlich)

**Jede Kategorie hat 30–50 Begriffe.** Ausnahme: Ein Modul mit weniger als 30 Begriffen hat genau eine Kategorie.
Damit sind die Kategorien eines Moduls ungefähr gleich groß. Grund: Meisterrunden dauern überall ähnlich lang, und jedes Thema ist in vernünftiger Zeit zu meistern.

- Wird eine Kategorie zu groß, wird sie geteilt: neue Kategorie mit eigenem Namen und Key, ein Teil behält den alten Key.
- Wird eine Kategorie zu klein, wird sie mit einer passenden zusammengelegt oder aufgefüllt.
- Kategorien dürfen dafür umbenannt werden (`name` in `cats`). Der **Key** bleibt nach Möglichkeit, denn an ihm hängen Krönchen (`P.crowns`), Meisterrunden-Rekorde (`P.mtries`), Themenauswahl (`P.cats`) und das Krönchen-Design. Der Lernstand der Begriffe (`P.boxes` usw.) hängt an der Begriffs-ID und bleibt immer erhalten.
- Neue Kategorie-Keys brauchen eine Farbe in `cats` und sollten ein eigenes Krönchen-Design bekommen (`CROWN_DESIGNS` + `style.css`, dann `VERSION` erhöhen).
- Wechselt ein Begriff die Kategorie, ändert sich nur Index 0; `extra` und die `conf`-Verweise bleiben gültig.

Beide Module erfüllen die Regel: IT 35 Kategorien mit 30–49 Begriffen (seit v17), Agile 13 mit 33–49.

### Zusatzinhalte (Feld `extra`)

Ziel: Profi-Begriffe nicht an immer denselben Texten wiedererkennen, sondern anwenden und abgrenzen. Ablauf: per Skript die Begriffe der Kategorie auslesen (Index 1, 2, 3, 6, 7), Inhalte schreiben, per Skript als `extra[id]` eintragen.

```json
"extra":{
  "latency":{
   "ex":[["High latency made every video call stutter.","Durch die hohe Latenz hat jeder Videocall geruckelt."],["…","…"]],
   "sit":["Situation 1","Situation 2","Situation 3"],
   "conf":[["bandwidth","Latenz ist die Verzögerung pro Paket, Bandbreite die Datenmenge pro Sekunde."]],
   "tf":[[false,"Mehr Bandbreite senkt automatisch die Latenz.","Die Leitung kann breit und trotzdem langsam im Antworten sein."],[true,"…","…"]]
  }}
```
Schlüssel = Begriffs-ID wie in `buildTerms` (Kleinbuchstaben, Sonderzeichen → `-`, z. B. `World Café` → `world-caf-`).

- `ex`: genau 2 neue Satzpaare (englisch, deutsch). Englischer Satz enthält den Begriff wörtlich (ohne „to “), anders als der vorhandene Beispielsatz. Achtung: Die App prüft mit Wortgrenzen (`termRe`), Plural oder angehängte Endungen („tasks“, „user interviews“) zählen **nicht**, der Satz fällt dann still weg. Deutsch: österreichischer Arbeitsalltag.
- `sit`: genau 3 Situationen auf Deutsch, je 2–3 Sätze, aus dem österreichischen Arbeitsalltag (Lehrling, Kolleg:in, Kund:in, Daily, Krankenstand …). Enthalten **weder** den englischen Begriff **noch** die deutsche Übersetzung oder deren Wortstamm. Keine Frage am Ende (die App fragt „Welcher Begriff passt?“). Die Situation muss eindeutig sein, auch gegenüber naheliegenden Begriffen derselben Kategorie. Die drei Situationen zeigen verschiedene Blickwinkel (Ursache, Folge, Einsatz).
- `conf`: 1–2 Verwechslungspartner (ID muss **im selben Modul** existieren, darf aus anderer Kategorie sein) mit **einem** Satz zum Unterschied. Gibt es keinen sinnvollen Partner, leeres Array. Die App ersetzt im Satz beide Begriffe durch „A“ (Begriff selbst) und „B“ (Partner), daher: beide mit dem englischen Begriff oder dem deutschen Hauptwort aus Index 2 nennen (keine Umschreibungen), Begriff zuerst, und der Satz muss auch mit A/B ohne die Namen verständlich sein.
- `tf`: genau 2 Aussagen auf Deutsch, eine wahr, eine falsch. Die falsche greift eine **typische Fehlvorstellung** auf, nicht etwas offensichtlich Absurdes. Begründung ein Satz. Hier darf der Begriff vorkommen.
- Gendern mit `:in`, österreichische Wörter, fachlich korrekt und passend zu den vorhandenen Erklärungen.

**Prüfskript** (muss ohne Fehler laufen; am sichersten mit `termRe`, `buildTerms`, `nameVariants` und `maskNames` direkt aus `app.js` in Node, weil die App mit Wortgrenzen und deklinierten Formen arbeitet): jeder Begriff der Kategorie hat einen Eintrag; `ex` = 2 Paare und englischer Satz enthält den Begriff; `sit` = 3 und keine enthält Begriff oder deutsche Übersetzung (ohne Artikel, Groß/Klein egal); `conf`-IDs existieren im Modul; `tf` = 2 mit genau einem `true`; gültiges JSON.

**Begriffe streichen oder verschieben:** `extra[id]` mitnehmen bzw. löschen und per Skript alle `conf`-Einträge suchen, die auf die ID zeigen. Die bekommen einen neuen Partner mit neuem Satz oder werden gestrichen.

## Neues Modul anlegen

1. Ordner `modules/<key>/` mit `module.json` (Format siehe „Moduldatei“).
2. `cats` mit Pastellfarben `var(--n-…)` (siehe `style.css`), Kategorien nach „Größe der Kategorien“ zuschneiden, `levels` mit den üblichen XP-Grenzen und eigenen Rangnamen passend zum Fach.
3. `theme` im Aufbau wie die anderen Module, gut unterscheidbar von Violett (IT) und Weinrot (Agile). `bad` muss sich deutlich von `accent` abheben, die Pastellkarten müssen auf `board` lesbar bleiben.
4. Eintrag in `modules/index.json` (Felder siehe „Katalog“), `ls` = `lernapp.progress.<key>`, `doc` = `progress-<key>`, `accent`/`board` wie im Theme.
5. Inhalte nach „Inhalte schreiben“, inklusive `extra`.
6. Optional eigene Krönchen-Designs pro Kategorie (`CROWN_DESIGNS` + `style.css`, siehe „Gestaltung“), sonst greifen die allgemeinen. Nur dann `VERSION` erhöhen.

## Modulverwaltung: Verhalten im Detail

- Neues Gerät: Willkommen-Seite mit Katalog und „Importieren“ (Fortschritt von einem anderen Gerät übernehmen, die enthaltenen Module werden gewählt).
- Fehlt `lernapp.chosen` (alte Installation), werden alle Module mit vorhandenem Lernstand gewählt. Gewählte Keys, die nicht mehr im Katalog stehen, fallen still weg.
- Hinzufügen: Modul laden (ohne Netz Meldung), wählen, hinwechseln. Damit liegt es samt Zusatzinhalten offline vor.
- Entfernen: Rückfrage, Lernstand bleibt, Datei wird aus dem Daten-Cache gelöscht. Das letzte Modul kann nicht entfernt werden. Ist das Modul gerade offen, wird zuerst zum nächsten ladbaren gewechselt; geht das nicht (offline), wird nichts entfernt.
- Die Modulleiste ist auch bei nur einem Modul sichtbar (wegen ＋). Ab 4 Modulen: Auswahlknopf mit ＋ daneben, Auswahlmenü unten mit „Module verwalten“.
- Ist kein gewähltes Modul ladbar: Seite „Module nicht geladen“ mit „Nochmal versuchen“ und „Module verwalten“. Ein kaputtes Modul bleibt gewählt; beim Wechseln dorthin kommt eine Meldung, die übrigen laufen weiter.
- Service Worker: App-Cache `fach-vokabeln-<VERSION>` (wird bei jeder Version ersetzt) und Daten-Cache `fach-vokabeln-daten` (alles unter `modules/` außer `index.json`, übersteht App-Updates). Strategie: sofort aus dem Cache, im Hintergrund aktualisieren, Laden immer mit `cache:"no-cache"` wegen der 10-Minuten-Zwischenspeicherung von GitHub Pages.

## Vorhaben „Lernrahmen“ (offen)

Ziel: Statt XP, Rängen und Boxen durchläuft jeder Begriff drei Teile. Die App entscheidet selbst, was als Nächstes gefragt wird. Der Rahmen ist für alle Module gleich und soll auch für Schulmodule (z. B. Biologie) funktionieren, die Claude für den Sohn des Nutzers erstellt. Mit dem Nutzer vollständig abgestimmt; was unten als **Vorschlag** markiert ist, hat Claude festgelegt und darf beim Umsetzen begründet angepasst werden.

### Begriffe

- **Ausgabearten:** Lesen (Text steht da) und Hören (Text wird vorgelesen und steht **nicht** da, 🔊 zum Wiederholen).
- **Eingabearten:** Auswählen (5 Antworten), Schreiben (Textfeld, Prüfung mit `checkTyped`), Sprechen (🎤, siehe unten).
- **Bedeutung** = deutsche Übersetzung (Index 2). Beim Vorlesen „ / “ als Komma sprechen.
- Fehler haben **keine Folgen**: richtige Lösung zeigen, weiter. Es zählen nur richtige Antworten. „Fast richtig“ zählt als richtig.

### Teil A

1. **Bedeutung → Begriff** (wie heute „Wie heißt das auf Englisch?“): jede Ausgabeart (Lesen, Hören) **und** jede Eingabeart (Auswählen, Schreiben, Sprechen) mindestens einmal richtig. Nicht alle Kombinationen; eine Antwort hakt Ausgabe- und Eingabeart zugleich ab (Hören + Sprechen erledigt zwei Häkchen). Mindestens 3 Antworten.
2. **Begriff → Bedeutung** (wie heute `en2de`): einmal Lesen + Auswählen, einmal Hören + Auswählen. Schreiben und Sprechen gibt es in dieser Richtung nicht (deutsche Übersetzungen mit Artikel und Varianten sind nicht zuverlässig prüfbar).

Teil A fertig = alle 7 Häkchen, mindestens 5 Antworten. Die bisherigen Fragearten `def2en`, `en2def` und die Erklärungen als Frage entfallen; die 3 Erklärungen bleiben im Nachschlagen und dienen in Teil C als Vorlage für die KI.

### Teil B (frühestens am Tag nach Abschluss von Teil A)

Die vier Fragearten werden gemischt abgefragt. Teil B fertig, wenn alle Bedingungen erfüllt sind:

- **Lückensatz** (nur Lesen, kein Hören): jeder verfügbare Satz einmal richtig (Index 4 und die 2 `ex`-Sätze; ein Satz, auf den `termRe` nicht passt, fällt weg) und jede Eingabeart einmal.
- **Situation** (`sit`, „Welcher Begriff passt?“): jede der 3 Situationen einmal richtig, jede Ausgabeart (Lesen, Hören; vorgelesen wird auf Deutsch) und jede Eingabeart einmal.
- **Stimmt das?** (`tf`): beide Aussagen einmal richtig, Lesen + Auswählen (Wahr/Falsch), danach Begründung zeigen wie heute.
- **Unterschied** (`conf`, Darstellung wie heute mit `maskNames`): jeder Unterschied-Satz des Begriffs einmal richtig, Lesen + Auswählen. Gibt es keine `conf` oder weniger als 3 andere Paare im Modul, entfällt die Bedingung.

Allgemein: Was ein Begriff an Inhalten nicht hat, wird nicht verlangt. Mindestens etwa 9–10 Antworten.

### Teil C (frühestens am Tag nach Abschluss von Teil B)

Den Begriff in eigenen Worten erklären, Schreiben oder Sprechen (Diktat auf Deutsch, Text darf vor dem Abschicken frei bearbeitet werden). Die KI prüft (Details unter „KI-Prüfung“). Richtig → Teil C fertig, der Begriff ist **gelernt**.

**Kategorie gemeistert**, wenn alle ihre Begriffe Teil C geschafft haben → Krönchen (`P.crowns[kat] = {day}`, Designs wie bisher). Die Meisterrunde entfällt.

### Bremse

Teil B wird frühestens am Kalendertag nach Abschluss von Teil A angeboten, Teil C frühestens am Tag nach Teil B (Vergleich mit `dayStr`). Damit braucht ein Begriff mindestens 3 Tage. Grund: nicht alles an einem Abend aus dem Kurzzeitgedächtnis abhaken.

### Sprechen: erst ins Textfeld, dann manuell abschicken

Gilt für alle Fragen mit Sprechen (heute schickt `answerSpoken` sofort ab). Die erkannte beste Variante kommt ins Textfeld, man kann neu aufnehmen oder korrigieren und schickt mit einem Knopf ab. **Vorschlag:** Wird unverändert abgeschickt, prüft die App wie heute alle erkannten Varianten und hakt Sprechen ab. Wurde der Text von Hand geändert, zählt die Antwort als Schreiben. In Teil C darf frei bearbeitet werden.

### Schalter „Gerade kein Ton“

Gut sichtbar beim Quizstart (**Vorschlag:** Umschalter auf der Quiz-Kachel bzw. am Rundenstart), gespeichert in `localStorage["lernapp.quiet"]`, bleibt bis zum Ausschalten. Ist er an, gibt es kein Hören und kein Sprechen; diese Häkchen werden später nachgeholt. Begriffe, die nur noch Hören/Sprechen brauchen, warten; die App sagt das am Rundenende („3 Begriffe warten auf eine Runde mit Ton“).
Kann das Gerät etwas **gar nicht** (kein `speechSynthesis` oder keine Stimme für die Sprache, kein `SR`), gelten die betroffenen Häkchen als erfüllt. Sonst bliebe ein Begriff für immer hängen.

### Sprache pro Modul

Neues optionales Feld in `module.json`: `"lang":{"term":"en-US","meaning":"de-AT"}` (Standard genau diese Werte, daher bleibt `version` 1). Verwendet für Vorlesen (`speak`), Spracheingabe des Begriffs (`listen`) und das Diktat in Teil C (`meaning`). Situationen und Stimmt-das-Aussagen sind in `meaning`-Sprache. Damit ist ein deutschsprachiges Schulmodul möglich (`term` und `meaning` beide `de-AT`).

### Auswahl der Fragen (App entscheidet selbst)

**Vorschlag:**
- Runde = 10 Fragen (`QUIZ_LEN`), aus den gewählten Themen (`P.cats`, Themenauswahl bleibt).
- Pro Begriff gibt es eine Liste offener Aufgaben (Teil, Frageart, Inhalt, Aus-/Eingabeart), unter Beachtung von Bremse und „Gerade kein Ton“. Die App wählt pro Begriff die Aufgabe, die die meisten offenen Häkchen auf einmal erfüllt, bei Gleichstand zufällig.
- Vorrang: begonnene Begriffe vor neuen, höherer Teil vor niedrigerem (Krönchen sollen erreichbar werden). Höchstens 3 neue Begriffe pro Runde. Neue Begriffe aus dem gewählten Thema, das am weitesten ist (Gleichstand: Reihenfolge in `cats`).
- Nie derselbe Begriff zweimal direkt hintereinander; ein Begriff höchstens 2× pro Runde.
- Teil-C-Fragen höchstens 2 pro Runde und nur, wenn die KI-Prüfung gerade möglich ist.
- Gibt es weniger als 10 Aufgaben, wird die Runde kürzer. Gibt es heute gar keine (alles wartet auf die Bremse), sagt die Startseite das: „Heute alles erledigt, morgen geht's weiter mit X Begriffen“.
- Antwortmöglichkeiten: weiterhin 5, unterschiedliche Anfangsbuchstaben (`keyLetter`), Ablenker zuerst aus derselben Kategorie.

### KI-Prüfung (Teil C)

- **Anbieter:** Google Gemini API, Gratis-Stufe (Nutzer will kein Abo). Aufruf direkt aus dem Browser: `POST https://generativelanguage.googleapis.com/v1beta/models/<MODELL>:generateContent`, Kopfzeile `x-goog-api-key`. Modell als Konstante `AI_MODEL`; vor der Umsetzung in der aktuellen Gemini-Doku ein Flash-Modell wählen, das in der Gratis-Stufe verfügbar ist (Modelle und Grenzen ändern sich). Antwort als JSON anfordern (`generationConfig.responseMimeType = "application/json"`).
- **Schlüssel:** Jeder Nutzer trägt seinen eigenen Schlüssel ein (neues Blatt „KI-Prüfung“, erreichbar bei Export/Import, mit kurzer Anleitung und Link zu Google AI Studio). Gespeichert nur in `localStorage["lernapp.aikey"]`, **nie im Repo, nie im Export**. Knopf „Testen“ und „Entfernen“.
- **Hinweis im Blatt:** In der Gratis-Stufe kann Google die Eingaben zum Verbessern der Modelle verwenden. Nur Erklärungen eingeben, nichts Persönliches.
- **Eingabe an die KI:** Begriff, Bedeutung, die 3 Erklärungen (Index 3, 6, 7) als Musterlösungen, die Antwort. Anweisung (**Vorschlag**): Prüfer:in, die beurteilt, ob die Person den Begriff verstanden hat. Inhaltlich streng, sprachlich großzügig: eigene Worte, Beispiele und Umschreibungen sind gut, Rechtschreib- und Spracherkennungsfehler egal. Nicht richtig: nur die Übersetzung wiederholt, fachlich falsch, zu vage, um den Begriff von verwandten zu unterscheiden. Länge zählt nicht. Ergebnis `{"ok":true|false,"feedback":"1–2 Sätze auf Deutsch, du-Form, freundlich","fehlt":"was gefehlt hat oder leer"}`.
- **Anzeige:** Urteil, Feedback, danach eine der Musterlösungen. Falsch hat keine Folgen, nächster Versuch in einer späteren Runde.
- **Fehlerfälle:** kein Schlüssel, offline, Limit erreicht (HTTP 429), ungültiger Schlüssel, unlesbare Antwort → klare Meldung, Antwort wird **nicht** gewertet, Teil C bleibt offen. Ohne Schlüssel oder Netz bietet die Auswahl keine Teil-C-Fragen an; die Startseite zeigt einen Hinweis „X Begriffe warten auf die KI-Prüfung“ mit Link zum Blatt.
- Der Service Worker greift bei fremden Adressen nicht ein (`fetch`-Handler, nur gleiche Herkunft und Schriften); das muss so bleiben.

### Was wegfällt

XP, Ränge (`levels` in `module.json` wird ignoriert und kann per Skript entfernt werden), Punkte pro Antwort, Tagesbonus, Tagespflicht (ersatzlos, vorerst kein Tagesziel), Boxen/Profi/Meister, Meister-Regel, Pausen (`gapFor`), Verwechslungen (`P.mix`), Vormerkungen (`P.flags`; „Nochmal üben“ bei Karteikarten legt die Karte nur innerhalb des Stapels ans Ende), Meisterrunde samt Rekorden, Ränge-Fenster und Punkte-Erklärung. Karteikarten und Nachschlagen bleiben, beeinflussen den Lernstand nicht.

### Lernstand, Kalender, Oberfläche

- **Kein Übergang:** Bisheriger Lernstand wird verworfen. `P` bekommt `v:2`; ein gespeicherter Lernstand ohne `v:2` wird durch `freshProgress()` ersetzt. Die `ls`-Schlüssel in `index.json` bleiben.
- **Vorschlag für `P`:** `{v:2, terms:{id:{a:[häkchen], aDay, b:[häkchen], bDay, cDay}}, crowns:{kat:{day}}, cats:[], askLog:{tag:anzahl}, updatedAt}`. Häkchen als kurze Strings, z. B. Teil A `o:read`, `o:hear`, `i:pick`, `i:type`, `i:say`, `r:read`, `r:hear`; Teil B `c0`…`c2`, `ci:pick`…, `s0`…`s2`, `so:read`, `so:hear`, `si:…`, `t0`, `t1`, `u0`, `u1`. `aDay`/`bDay`/`cDay` = Tag des Abschlusses.
- **Export/Import:** Format-`version` 2; ein Import mit Version 1 wird mit Meldung abgelehnt. Der KI-Schlüssel ist nie enthalten.
- **Kalender:** zeigt pro Tag nur die Zahl der beantworteten Fragen (richtig und falsch, `P.askLog`), ohne Strafen, Farben nach Menge.
- **Startseite:** statt XP-Balken und Rang ein Fortschritt pro Thema und fürs Modul: wie viele Begriffe neu, in Teil A, B, C und gelernt. Krönchen wie bisher. Kopf zeigt die Fragen von heute.
- **Nachschlagen:** statt Profi/Meister-Abzeichen (`proTag`) der Stand des Begriffs (A/B/C/✓).
- **Rundenende:** wie viele Häkchen gesammelt, welche Begriffe einen Teil abgeschlossen haben, ggf. die Warte-Hinweise.
- **Hilfe** komplett neu schreiben: drei Teile, Bremse, „Gerade kein Ton“, KI-Prüfung.

### Inhalte pro Begriff (unverändert)

Bedeutung, 3 Erklärungen, Beispielsatz + 2 `ex`, 3 `sit`, 2 `tf`, `conf` optional. IT und Agile haben das für alle 1.812 Begriffe; es müssen keine Inhalte geschrieben werden. Neue Module brauchen dasselbe (ohne `levels`).

### Umsetzung L1 (v18, erledigt)

Was L2 und L3 wissen müssen (alles in `app.js`):
- **`P` v2:** `{v:2, terms:{id:{a:[…], na, nm, t, aDay}}, crowns, cats, askLog, updatedAt}`. `na` = richtige Antworten in Teil A, `nm` = davon Bedeutung → Begriff, `t` = zuletzt gefragt (ms, für die Reihenfolge). `freshProgress`, `normProgress` (verwirft alles ohne `v:2`, auch in `syncCloud`), `loadModule` schreibt den verworfenen Stand sofort zurück. Teil B/C ergänzen `b:[…]`, `bDay`, `cDay` im selben Objekt.
- **Stand:** `stageOf(t)` → `new`/`a`/`b` (A geschafft)/`c`/`done`; `stageCount`, `barSegs` (Balken, CSS `i.sb-a` … `i.sb-done`), `stageParts` („A 3 · B 2“), `STAGE_W`.
- **Häkchen Teil A:** `A_CHECKS` (`o:read`, `o:hear`, `i:pick`, `i:type`, `i:say`, `r:read`, `r:hear`), `A_MIN` 5, `A_MIN_M2T` 3, `openChecksA`, `partADone`, `checksHtml(s)` (Chips in Rückmeldung und Nachschlagen).
- **Aufgaben:** `A_TASKS` (`{dir:"m2t"|"t2m", out, inp, gives}`), `doable`, `taskFor(t)` (meiste offene Häkchen, Gleichstand zufällig; `null` = nichts zu tun), `hasTask`, `waitsForSound`, `autoChecks()` (Gerät kann es nicht → gilt als erledigt, wird nicht gespeichert). **Hier hängt L2 Teil B an:** `taskFor` gibt bei `aDay` derzeit `null` zurück.
- **Runde:** `planRound` (begonnene nach `t` aufsteigend, dann `freshTerms(≤3)` aus dem Thema mit höchstem `catScore`; jeder Begriff höchstens 2×, erst alle einmal, dann die zweiten Male), `findNext`/`countAhead`/`goQuestion` (Frage und Aufgabe erst beim Erreichen), `makeQuestion(t, task)`, `renderQuiz`, `answer`/`answerInput`/`heard` → `settle` (Häkchen, `askLog`, `aDay`), `renderQuizDone`, `noTasksText`.
- **Ton:** `quiet`/`setQuiet` (`lernapp.quiet`), `canHear(lang)` → `yes`/`wait`/`no` (Stimmen laden verzögert; ohne Stimmen nach 3 s `no`), `voiceFor` (wählt passende Stimme, `de-AT` fällt auf `de-DE` zurück), `speak`, `sayable` („ / “ → „, “), `listen`. Sprechen: beste erkannte Variante ins Textfeld, unverändert abgeschickt = Sprechen, geändert = Schreiben.
- **Sprache:** `MOD.lang` aus `langOf(d.lang)` in `ensureModule`; `langName(code)` für Texte („auf Englisch“).
- **Behalten für L2:** `cloze`, `clozeDe`, `extraOf`, `nameVariants`, `maskNames`, `otherConfs`, `markTerm`, `highlight` (derzeit ungenutzt).
- **Begründete Abweichungen von den Vorschlägen:** Schreiben und Sprechen erst, wenn der Begriff einmal richtig beantwortet wurde (sonst müsste man einen nie gesehenen Begriff gleich sprechen); Teil A bleibt trotzdem in genau 5 Antworten schaffbar. Antwortmöglichkeiten immer ganz sichtbar (das Anfangsbuchstaben-Spiel hing an den XP-Abzügen). „Gerade kein Ton“ als Schalter direkt unter der Quiz-Kachel. Kopf: gelernt-Zahl, Balken A/B/C, „Fragen heute“ (öffnet Kalender); die Übersicht zeigt pro Thema „A 3 · B 2 / 41“ und einen gestapelten Balken. Kalenderfarben: 1–9, 10–29, ab 30 Fragen.
- **Getestet** (Playwright, Stimmen und Spracherkennung per Init-Skript nachgebildet; Chromium hat `SpeechRecognition` auch ohne Präfix, beide ersetzen): alter Lernstand verworfen; jeder fertige Begriff mit genau 5 Antworten; Runden ohne direkte Wiederholung und höchstens 2× pro Begriff; „Gerade kein Ton“ nur Lesen/Auswählen/Schreiben; ohne `SR` und ohne Stimmen werden die Häkchen automatisch erfüllt; Export v2, Import v1 abgelehnt; Kalender, Nachschlagen, Karteikarten, Modulwechsel; keine Konsolenfehler.

### Umsetzung in drei Chats

Jeder Chat liefert eine lauffähige App, testet mit `python3 -m http.server` und Playwright (keine Konsolenfehler), erhöht `VERSION`, ergänzt das Änderungsprotokoll und hakt seinen Punkt unter „Nächste Schritte“ ab.

- **L1 – Aufräumen, Lernstand, Auswahl, Teil A:** Alles unter „Was wegfällt“ entfernen; neues `P` und `freshProgress`; Aufgabenlisten und Auswahl-Logik; Teil A mit allen Aus- und Eingabearten; Sprechen ins Textfeld; „Gerade kein Ton“; `lang` pro Modul; Kalender, Startseite, Nachschlagen, Rundenende, Export v2, Hilfe. Begriffe stehen danach bei „Teil A geschafft“, Teil B zeigt „kommt bald“. Test: Teil A eines Begriffs mit genau 5 Antworten abschließbar; ohne Ton nur Lesen/Auswählen/Schreiben; Gerät ohne `SR` hakt Sprechen automatisch ab.
- **L2 – Teil B:** vier Fragearten mit Häkchen, Bremse für A → B, Hören der Situationen auf Deutsch. Test: Bremse mit vorgestelltem Datum (Uhr in Playwright verstellen), Begriff ohne `conf`.
- **L3 – Teil C und Krönchen:** Blatt „KI-Prüfung“, Aufruf, Anzeige, Fehlerfälle, Bremse B → C, „gelernt“, Kategorie gemeistert → Krönchen. Test: Gemini-Antworten in Playwright mit `page.route` nachbilden (richtig, falsch, 429, kaputtes JSON, offline); einen echten Aufruf nur, wenn der Nutzer einen Schlüssel zum Testen gibt.
- Danach in dieser Datei „Was die App ist“, „Spielregeln“, „Code-Landkarte“, „Gespeicherter Fortschritt“, „Datenformat“ (`lang`, ohne `levels`) und „Neues Modul anlegen“ (Schritt mit `levels` streichen) an den neuen Stand anpassen und diesen Abschnitt auf das Nötigste kürzen.

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
| v14 | **Vorübergehend:** Vorschau der Krönchen-Designs. Erste Kategorie von IT (`code`) und Agile (`agil`) wird auf Übersicht und Nachschlagen als gemeistert und gekrönt angezeigt (`PREVIEW_CROWN`/`preview` in `app.js`), nur Anzeige, Lernstand unverändert; Meisterrunde-Knopf zeigt nur einen Hinweis. Wird wieder entfernt |
| v15 | Vorschau aus v14 wieder entfernt, `app.js` wie in v13 |
| v16 | Ein Modul aus Katalog und Repo entfernt (inkl. Krönchen-Designs). **Zusatzdateien aufgelöst:** alle `modules/<key>/extra/*.json` stecken jetzt im Feld `extra` der `module.json` (1.305 + 507 Einträge, unverändert), ein Modul = eine Datei. `fetchExtras`/`loadExtras`/`preloadExtras` entfallen, Quiz und Meisterrunde starten ohne Warten. Service Worker räumt alte Einträge aus dem Daten-Cache |
| – | `CLAUDE.md` aufgeräumt: erledigte Ablaufpläne (Ausbau „Verstehen statt Auswendiglernen“, Umbau Agile, Modulsystem) durch die Abschnitte „Inhalte schreiben“, „Neues Modul anlegen“ und „Modulverwaltung“ ersetzt |
| – | Verbindliche Regel „Größe der Kategorien“: 30–50 Begriffe pro Kategorie (Module unter 30 Begriffen: eine Kategorie), Prüfskript ergänzt. IT als bekannte Abweichung, Aufteilung unter „Nächste Schritte“ eingereiht |
| v18 | **Lernrahmen L1:** XP, Ränge, Punkte, Tagesbonus, Tagespflicht, Boxen/Profi/Meister, Meisterrunde, Vormerkungen und Verwechslungen entfernt. Neuer Lernstand `P` v2 (alter Lernstand wird verworfen), Teil A mit Lesen/Hören und Auswählen/Schreiben/Sprechen, Auswahl der Fragen durch die App, Sprechen erst ins Textfeld, Schalter „Gerade kein Ton“, `lang` pro Modul, Kalender mit Fragen pro Tag, neue Startseite und Kopfzeile, Stand im Nachschlagen, Karteikarten ohne Vormerkung, Export v2, Hilfe neu. Teil B zeigt „kommt bald“ |
| v17 | **IT-Kategorien aufgeteilt:** aus 14 werden 35 Kategorien mit 30–49 Begriffen (nur Index 0 der Begriffe geändert, `extra` unverändert). Die alten Keys bleiben beim Teil, zu dem ihr Krönchen passt, und haben teils neue Namen; 21 neue Kategorien mit eigenen Krönchen-Designs. Neuer Speicherschlüssel `lernapp.progress.dev` (`doc` `progress-dev`): IT startet auf Wunsch des Nutzers bei null, Agile unberührt |
