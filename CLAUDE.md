# Fach-Vokabeln – Projektbeschreibung für Claude

> **Für Claude:** Lies diese Datei zuerst. Sie ersetzt das Durchlesen des gesamten Quellcodes.
> Fordere nur die Dateien an, die für die gewünschte Änderung wirklich nötig sind (siehe „Welche Dateien für welche Änderung“).
> Hochgeladene Dateien liegen unter `/mnt/user-data/uploads/`. Lies sie gezielt mit `grep -n` und `sed -n 'von,bisp'`, statt sie komplett anzuzeigen.
> Liefere am Ende **nur die geänderten Dateien** aus, erhöhe `VERSION` in `sw.js` und ergänze das Änderungsprotokoll unten.

## Was die App ist

Installierbare Web-App (PWA) zum Lernen englischer Fachbegriffe mit deutscher Übersetzung. Zielgruppe: der Nutzer selbst (Österreich), Android-Handy, Chrome.
Zwei Module: **IT & Scrum** (`dev`, 1.507 Begriffe, violettes Schema) und **Glasfaser & FTTH** (`ftth`, 500 Begriffe, grünes Schema).
Bereiche: Quiz, Karteikarten, Nachschlagen. Dazu Ränge, Kalender, Punkte-Erklärung, Export/Import.

## Hosting und Updates

- GitHub-Repository **`pwa`** (öffentlich), GitHub Pages aus Branch `main`, Ordner `/ (root)`.
- Adresse: `https://<benutzername>.github.io/pwa/`
- Update = geänderte Dateien im Repository hochladen („Add file → Upload files“).
- `sw.js` → `VERSION` bei jeder Auslieferung erhöhen (`"v2"` → `"v3"` …), damit Handys die Änderung sofort übernehmen.
- Alle Pfade sind relativ. Keine Build-Tools, keine Bibliotheken, kein Framework.

## Dateien

| Datei | Größe | Inhalt |
|---|---|---|
| `index.html` | 1 KB | Gerüst, Manifest-Link, Fonts (Google Fonts), setzt gespeichertes Farbschema vor dem Laden |
| `app.js` | 53 KB (~15.000 Tokens) | gesamte Logik |
| `style.css` | 20 KB (~6.000 Tokens) | gesamte Gestaltung, Farben über CSS-Variablen |
| `sw.js` | 2 KB | Service Worker: Offline-Cache, „sofort aus Cache, im Hintergrund aktualisieren“ |
| `manifest.json` | 1 KB | App-Name, Symbole, Startfarbe `#0a0510` |
| `icons/` | – | `icon-192.png`, `icon-512.png`, `icon-maskable-512.png` |
| `modules/index.json` | 1 KB | Liste aller Module |
| `modules/it-scrum.json` | 508 KB (~150.000 Tokens) | **nie komplett lesen oder einfügen** |
| `modules/glasfaser.json` | 172 KB (~50.000 Tokens) | **nie komplett lesen oder einfügen** |

## Welche Dateien für welche Änderung

| Änderung | Mitschicken |
|---|---|
| Farben eines Moduls | `modules/index.json` + Hinweis, welches Modul. Claude erzeugt ein kleines Skript bzw. die `theme`-Werte; das große JSON wird per Skript geändert, nicht gelesen |
| Aussehen, Abstände, Schriften | `style.css` |
| Spielregeln, Punkte, Quiz, Kalender, neue Funktionen | `app.js` (+ ggf. `style.css`) |
| Neue Begriffe / neues Modul | `modules/index.json` + **nur die Liste der vorhandenen englischen Begriffe** (nicht die ganze Datei, siehe unten) |
| Offline-Verhalten | `sw.js` |

Begriffsliste ohne ganze Datei erzeugen: Claude kann die Moduldatei hochgeladen bekommen und per Skript nur Spalte `[1]` (englischer Begriff) auslesen. Das kostet kaum Tokens, weil die Datei nicht in den Chat geladen wird.

## Datenformat

### `modules/index.json`
```json
{"modules":[{"key":"dev","file":"it-scrum.json","name":"IT & Scrum","short":"IT & Scrum","icon":"💻",
  "ls":"devvokabeln.progress.v1","doc":"progress","accent":"#6c3fb8","board":"#0a0510"}]}
```
`ls` = Speicherschlüssel des Lernstands, **pro Modul eindeutig, nie ändern** (sonst ist der Fortschritt weg).
Ab 4 Modulen wird der Umschalter automatisch zum Auswahlmenü.

### Moduldatei, z. B. `modules/glasfaser.json`
```
{ key, name, short, icon,
  cats:   { "fgrund": {"name":"Glasfaser-Grundlagen","c":"var(--n-yellow)"}, … },
  levels: [[0,"Praktikant:in"],[100,"Lehrling"], … 20 Einträge … ,[50000,"Glasfaser-Legende"]],
  theme:  { board, board-dot, ink, ink-soft, surface, line, ok, bad, accent, m1, m2, m3 },
  raw:    [ Eintrag, Eintrag, … ] }
```
`theme`: `board` Hintergrund (fast schwarz), `surface` Flächen, `accent` Modul-Schalter, `m1`/`m2`/`m3` die drei Startseiten-Kärtchen (Karteikarten/Quiz/Nachschlagen).
XP-Grenzen der Ränge (beide Module gleich): 0, 100, 250, 400, 600, 900, 1.300, 1.800, 2.400, 3.200, 4.300, 5.700, 7.600, 10.000, 13.000, 17.000, 22.500, 29.500, 38.500, 50.000.

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

- **Quiz:** 10 Fragen, 5 Antworten mit unterschiedlichen Anfangsbuchstaben (`keyLetter`, Artikel/„to“ zählen nicht).
- **Fragearten** (`makeQuestion`): `en2de`, `de2en`, `def2en` (Erklärung → Begriff), `en2def` (Begriff → Erklärung, Antworten immer ganz sichtbar), `cloze` (Lückensatz, doppelt gewichtet).
- **Punkte pro Antwort:** richtig +5, falsch −2, Profi-Begriff falsch −10, „Ganz anzeigen“ −1, falsch ohne „Ganz anzeigen“ zusätzlich −2 (nicht bei `en2def`). XP nie unter 0.
- **Lernstand** (`P.boxes`, 0–15): 0–4 in Arbeit, ab 5 (`SIT`) Profi ⭐, 15 (`MAX_BOX`) gemeistert 🏆. Profi braucht 10 richtige in Folge (`PRO_GOAL`), ein Fehler setzt auf 5 zurück. Nur das Quiz verändert den Lernstand.
- **Tagespflicht** (`QUIZ_GOAL` = 3, `QUIZ_PENALTY` = 200): pro Modul; versäumte Tage werden in `dailyCheck` beim nächsten Öffnen abgezogen.
- **Tagesbonus** (`dayBonus`): 4.–9. Quiz +25, 10. +50, ab 11. +20.
- **Auswahl** (`pickQuizTerms`): Pausen nach `gapFor` (in Arbeit 2 Runden, Profi 2–6, gemeistert 25), mind. 3 neue Begriffe pro Runde, max. 3 Vormerkungen (📌).
- **Karteikarten:** keine XP; „Nochmal üben“ setzt eine Vormerkung (`P.flags`).

## Code-Landkarte `app.js`

| Bereich | Funktionen |
|---|---|
| Module laden | `loadIndex`, `ensureModule`, `applyTheme`, `loadModule`, `switchModule`, `boot` (ganz unten) |
| Begriffe | `buildTerms`, `cloze`, `clozeDe`, `keyLetter`, `shortLabel`, `highlight` |
| Speicher | `freshProgress`, `save`, `fixCats`; Cloud-Funktionen (`pushCloud`, `syncCloud`, `connectCloud`) sind Altlast aus claude.ai und außerhalb inaktiv |
| Punkte & Ränge | `addXP`, `levelInfo`, `levels`, `dailyCheck`, `dayBonus`, `setBox` |
| Auswahl | `pool`, `pickQuizTerms` (Quiz), `pickTerms` (Karteikarten), `distractors`, `gapFor` |
| Quiz | `startQuiz`, `makeQuestion`, `renderQuiz`, `answer`, `nextQuestion`, `renderQuizDone` |
| Karteikarten | `startCards`, `renderCard`, `renderCardsDone` |
| Nachschlagen | `renderLex`, `proTag` |
| Startseite & Kopf | `renderHome`, `renderTop` |
| Fenster | `sheet`, `openDialog`, `showLevels`, `showHelp`, `showCalendar`/`renderCalendar`, `showExport`, `showImport`, `showModulePicker` |
| Zurück-Taste | `navPush`, `navEnterScreen`, `popstate`-Handler, `renderHome(fromPop)` |
| Sonstiges | `speak` (Vorlesen), `toast`, `confetti`, `setFocus` (blendet Kopf in Quiz/Karten/Nachschlagen aus) |

## Gespeicherter Fortschritt (`P`, pro Modul in `localStorage[ls]`)

`xp`, `boxes{id:0–15}`, `last{id:runde}`, `round`, `flags{id:1}`, `cats[]`, `quizLog{tag:anzahl}`, `xpLog{tag:netto}`, `penaltyLog{tag:200}`, `checkedUntil`, `penalty`, `updatedAt`.
Tagesformat: `JJJJ-M-T` (ohne führende Nullen, siehe `dayStr`). Export-Format: `{"format":"lernapp-fortschritt","version":1,"modules":{key:P}}`.
Weitere Schlüssel: `devvokabeln.module` (zuletzt offenes Modul), `lernapp.theme` (Farbschema für den Start).

## Gestaltung und Konventionen

- Dunkle Modul-Schemata (Hintergrund fast schwarz mit Farbstich), gedämpfte Pastell-„Notizzettel“ für Kategorien (`--n-*` in `style.css`).
- Schriften: Bricolage Grotesque (Überschriften), Atkinson Hyperlegible (Text).
- Profi-Begriffe: goldener Rahmen (Quiz-Karte und Nachschlagen), gemeistert: grüner Rahmen.
- Texte auf Deutsch (Österreich: Lehrling, Gehsteig, Stiegenhaus, Krankenstand), Gendern mit `:in`.
- Fenster immer über `sheet(id)` + `openDialog(dlg)` öffnen, damit die Zurück-Taste funktioniert.
- Testen: lokal mit `python3 -m http.server` im Projektordner und Playwright; `file://` funktioniert wegen `fetch` nicht.

## Änderungsprotokoll

| Version | Änderung |
|---|---|
| v1 | Umbau zur PWA: Module als JSON, Service Worker, Manifest, Icons, Modulauswahl |
| v2 | IT & Scrum mit violettem Farbschema |
| v3 | Startseite: Lernstand als ein Balken statt Erklärtext; „Themen zum Üben“ und „Was schon sitzt“ zu einer Themenliste mit Häkchen und Fortschritt zusammengelegt; Kopf zeigt „noch X bis <nächster Rang>“; Zahlen mit Tausenderpunkt (`num`) |
| v4 | `sw.js`: lädt beim Installieren und Aktualisieren am Browser-Zwischenspeicher vorbei (`cache:"reload"`/`"no-cache"`). Vorher landeten wegen der 10-Minuten-Zwischenspeicherung von GitHub Pages alte Dateien im neuen Cache |
