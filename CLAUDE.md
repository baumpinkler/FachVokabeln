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

- GitHub-Repository **`baumpinkler/FachVokabeln`** (öffentlich), GitHub Pages aus Branch `main`, Ordner `/ (root)`.
- Adresse: `https://baumpinkler.github.io/FachVokabeln/`
- Claude kann das Repo selbst klonen (`git clone https://github.com/baumpinkler/FachVokabeln.git`); der Nutzer muss dafür nichts hochladen.
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
- **Fragearten** (`makeQuestion`): Box 0–4 (`easyQuestion`): `en2de`, `de2en`, `def2en` (Erklärung → Begriff), `en2def` (Begriff → Erklärung, Antworten immer ganz sichtbar), `cloze` (Lückensatz, doppelt gewichtet). Ab Box 5 (`hardQuestion`/`hardTypes`): `type` (eintippen, doppelt gewichtet), `def2en` mit Verwechslungs-Ablenkern, `sit` (doppelt), `conf`, `tf`, `cloze` mit Zusatzsatz; ohne Zusatzinhalte nur `type` und `def2en`.
- **Eintippen** (`checkTyped`, `typeNorm`, `lev`): Groß/Klein, führendes „to “, Bindestrich/Leerzeichen/Unterstrich egal; Levenshtein ≤ 1 je angefangene 6 Buchstaben = richtig mit Hinweis „Fast richtig“. Exakt ein anderer Begriff des Moduls = falsch (Verwechslung).
- **`conf`-Anzeige**: Die Unterschied-Sätze werden maskiert (`maskNames`): englischer Begriff und deutsche Hauptwörter (ohne Artikel, `:in`, kleine Endungen) → „A“/„B“. Falsche Antworten = maskierte Sätze anderer Paare (gleiche Kategorie zuerst); unter 3 anderen Paaren gibt es keine `conf`-Frage.
- **Punkte pro Antwort:** richtig +5, falsch −2, Profi-Begriff falsch −10, „Ganz anzeigen“ −1, falsch ohne „Ganz anzeigen“ zusätzlich −2 (nicht bei `en2def`, `type`, `conf`, `tf`, alle `full:true`). Ausnahme `tf`: richtig +3, falsch −2 (auch bei Profi). XP nie unter 0.
- **Lernstand** (`P.boxes`, 0–15): 0–4 in Arbeit, ab 5 (`SIT`) Profi ⭐, 15 (`MAX_BOX`) gemeistert 🏆. Profi braucht 10 richtige in Folge (`PRO_GOAL`), ein Fehler setzt auf 5 zurück. Nur das Quiz verändert den Lernstand.
- **Meister-Regel** (`settle`, `HARD`, `HARD_NEED` = 3): Box 15 nur mit mindestens 3 richtigen `type`/`sit`/`conf`-Antworten seit dem letzten Fehler (`P.hard`), sonst bleibt der Begriff auf 14. Auf Box 14 ohne erfüllte Regel kommen nur diese Fragearten.
- **Verwechslungen** (`P.mix`): bei falscher Antwort wird der gewählte Begriff gespeichert (bei `conf` der Partner, beim Eintippen ein exakt getippter anderer Begriff). `distractors` nimmt bei Profi-Begriffen zuerst diese, dann `conf`-Partner (beide Richtungen), dann wie bisher; die Anfangsbuchstaben-Regel gilt weiter.
- **Tagespflicht** (`QUIZ_GOAL` = 3, `QUIZ_PENALTY` = 200): pro Modul; versäumte Tage werden in `dailyCheck` beim nächsten Öffnen abgezogen.
- **Tagesbonus** (`dayBonus`): 4.–9. Quiz +25, 10. +50, ab 11. +20.
- **Auswahl** (`pickQuizTerms`): Pausen nach `gapFor` (in Arbeit 2 Runden, Profi 2–6, gemeistert 25), mind. 3 neue Begriffe pro Runde, max. 3 Vormerkungen (📌).
- **Karteikarten:** keine XP; „Nochmal üben“ setzt eine Vormerkung (`P.flags`).

## Code-Landkarte `app.js`

| Bereich | Funktionen |
|---|---|
| Module laden | `loadIndex`, `ensureModule`, `applyTheme`, `loadModule`, `switchModule`, `boot` (ganz unten) |
| Zusatzinhalte | `loadExtras` (beim Quizstart, max. 2,5 s warten, 404 still), `extraOf` (geprüfte Inhalte eines Begriffs), `nameVariants`, `maskNames`; im Speicher `MOD.extra`, `MOD.extraDone`; `BYID` = Begriffe nach ID |
| Begriffe | `buildTerms`, `cloze`, `clozeDe`, `keyLetter`, `shortLabel`, `highlight` |
| Speicher | `freshProgress`, `save`, `fixCats`; Cloud-Funktionen (`pushCloud`, `syncCloud`, `connectCloud`) sind Altlast aus claude.ai und außerhalb inaktiv |
| Punkte & Ränge | `addXP`, `levelInfo`, `levels`, `dailyCheck`, `dayBonus`, `setBox` |
| Auswahl | `pool`, `pickQuizTerms` (Quiz), `pickTerms` (Karteikarten), `distractors`, `gapFor` |
| Quiz | `startQuiz` (async), `makeQuestion`, `easyQuestion`, `hardQuestion`, `hardTypes`, `otherConfs`, `renderQuiz`, `answer`/`answerTyped` → `settle` (Punkte, Lernstand), `checkTyped`, `nextQuestion`, `renderQuizDone` |
| Karteikarten | `startCards`, `renderCard`, `renderCardsDone` |
| Nachschlagen | `renderLex`, `proTag` |
| Startseite & Kopf | `renderHome`, `renderTop` |
| Fenster | `sheet`, `openDialog`, `showLevels`, `showHelp`, `showCalendar`/`renderCalendar`, `showExport`, `showImport`, `showModulePicker` |
| Zurück-Taste | `navPush`, `navEnterScreen`, `popstate`-Handler, `renderHome(fromPop)` |
| Sonstiges | `speak` (Vorlesen), `toast`, `confetti`, `setFocus` (blendet Kopf in Quiz/Karten/Nachschlagen aus) |

## Gespeicherter Fortschritt (`P`, pro Modul in `localStorage[ls]`)

`xp`, `boxes{id:0–15}`, `last{id:runde}`, `round`, `flags{id:1}`, `mix{id:{andereId:anzahl}}`, `hard{id:anzahl}`, `cats[]`, `quizLog{tag:anzahl}`, `xpLog{tag:netto}`, `penaltyLog{tag:200}`, `checkedUntil`, `penalty`, `updatedAt`.
Tagesformat: `JJJJ-M-T` (ohne führende Nullen, siehe `dayStr`). Export-Format: `{"format":"lernapp-fortschritt","version":1,"modules":{key:P}}`.
Weitere Schlüssel: `devvokabeln.module` (zuletzt offenes Modul), `lernapp.theme` (Farbschema für den Start).

## Gestaltung und Konventionen

- Dunkle Modul-Schemata (Hintergrund fast schwarz mit Farbstich), gedämpfte Pastell-„Notizzettel“ für Kategorien (`--n-*` in `style.css`).
- Schriften: Bricolage Grotesque (Überschriften), Atkinson Hyperlegible (Text).
- Profi-Begriffe: goldener Rahmen (Quiz-Karte und Nachschlagen), gemeistert: grüner Rahmen.
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

### Schritt 2: Inhalte-Chats (nur IT & Scrum, ein Chat pro Kategorie)

Ablauf: Repo klonen, per Skript nur die Begriffe der Kategorie auslesen (Index 1, 2, 3, 6, 7 – Begriff, Deutsch, Erklärungen), Inhalte in Blöcken von ca. 25 Begriffen schreiben, Datei per Skript prüfen (siehe unten), nur `modules/extra/dev/<kategorie>.json` und diese Datei (Status abhaken) ausliefern. **Keine** `VERSION`-Erhöhung nötig.

**Dateiformat** `modules/extra/dev/<kategorie>.json`:
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
- `ex`: genau 2 neue Satzpaare (englisch, deutsch). Englischer Satz enthält den Begriff wörtlich (ohne „to “), anders als der vorhandene Beispielsatz. Deutsch: österreichischer Arbeitsalltag.
- `sit`: genau 3 Situationen auf Deutsch, je 2–3 Sätze, aus dem österreichischen Arbeitsalltag (Lehrling, Kolleg:in, Kund:in, Daily, Krankenstand …). Enthalten **weder** den englischen Begriff **noch** die deutsche Übersetzung oder deren Wortstamm. Keine Frage am Ende (die App fragt „Welcher Begriff passt?“). Die Situation muss eindeutig sein, auch gegenüber naheliegenden Begriffen derselben Kategorie. Die drei Situationen zeigen verschiedene Blickwinkel (Ursache, Folge, Einsatz).
- `conf`: 1–2 Verwechslungspartner (ID muss im Modul existieren, darf aus anderer Kategorie sein) mit **einem** Satz zum Unterschied, in dem beide Begriffe vorkommen dürfen. Gibt es keinen sinnvollen Partner, leeres Array. Die App ersetzt im Satz beide Begriffe durch „A“ (Begriff selbst) und „B“ (Partner), daher: beide mit dem englischen Begriff oder dem deutschen Hauptwort aus Index 2 nennen (keine Umschreibungen), Begriff zuerst, und der Satz muss auch mit A/B ohne die Namen verständlich sein.
- `tf`: genau 2 Aussagen auf Deutsch, eine wahr, eine falsch. Die falsche greift eine **typische Fehlvorstellung** auf, nicht etwas offensichtlich Absurdes. Begründung ein Satz. Hier darf der Begriff vorkommen.
- Gendern mit `:in`, österreichische Wörter, fachlich korrekt und passend zu den vorhandenen Erklärungen.

**Prüfskript vor der Auslieferung** (muss ohne Fehler laufen): jede Begriffs-ID der Kategorie vorhanden; `ex` = 2 Paare und englischer Satz enthält den Begriff; `sit` = 3 und keine enthält Begriff oder deutsche Übersetzung (ohne Artikel, Groß/Klein egal); `conf`-IDs existieren im Modul; `tf` = 2 mit genau einem `true`; gültiges JSON.

### Status

| Schritt | Begriffe | Erledigt |
|---|---|---|
| Code-Chat | – | ☑ (v6) |
| `code` Programmiergrundlagen | 122 | ☑ |
| `oop` Objektorientierung & Muster | 84 | ☐ |
| `algo` Algorithmen & Datenstrukturen | 74 | ☐ |
| `web` Web, UI & Apps | 105 | ☐ |
| `arch` Architektur & APIs | 103 | ☐ |
| `data` Datenbanken & Daten | 90 | ☐ |
| `net` Netzwerk | 80 | ☐ |
| `sec` IT-Sicherheit | 92 | ☐ |
| `ops` Betrieb, Cloud & DevOps | 104 | ☐ |
| `git` Git & Werkzeuge | 76 | ☐ |
| `test` Testen & Qualität | 81 | ☐ |
| `ai` KI & Machine Learning | 66 | ☐ |
| `scrum` Scrum & Agile | 96 | ☐ |
| `pm` Projektmanagement | 104 | ☐ |
| `talk` Kommunikation im Job | 125 | ☐ |
| `it` IT-Alltag & Hardware | 105 | ☐ |

## Änderungsprotokoll

| Version | Änderung |
|---|---|
| v1 | Umbau zur PWA: Module als JSON, Service Worker, Manifest, Icons, Modulauswahl |
| v2 | IT & Scrum mit violettem Farbschema |
| v3 | Startseite: Lernstand als ein Balken statt Erklärtext; „Themen zum Üben“ und „Was schon sitzt“ zu einer Themenliste mit Häkchen und Fortschritt zusammengelegt; Kopf zeigt „noch X bis <nächster Rang>“; Zahlen mit Tausenderpunkt (`num`) |
| v4 | `sw.js`: lädt beim Installieren und Aktualisieren am Browser-Zwischenspeicher vorbei (`cache:"reload"`/`"no-cache"`). Vorher landeten wegen der 10-Minuten-Zwischenspeicherung von GitHub Pages alte Dateien im neuen Cache |
| v5 | Neues App-Icon (Karteikarten mit Übersetzungs-Sprechblase, violett); Hintergrund auf `#0a0510` angepasst, maskierbare Variante mit Sicherheitsrand |
| v6 | Ausbau Schritt 1: ab Profi nur schwere Fragearten (Eintippen, Situation, Unterschied, Stimmt das?, Lückensatz mit Zusatzsatz, Erklärung mit Verwechslungs-Ablenkern); Zusatzdateien `modules/extra/<modul>/<kategorie>.json` werden beim Quizstart geladen; Ablenker aus eigenen Fehlern (`P.mix`); Meister-Regel (`P.hard`); `tf` +3/−2; Hilfe-Fenster ergänzt |
