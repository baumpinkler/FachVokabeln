# Fach-Vokabeln – Projektbeschreibung für Claude

> **Für Claude:** Lies diese Datei zuerst. Sie ersetzt das Durchlesen des gesamten Quellcodes.
> Fordere nur die Dateien an, die für die gewünschte Änderung wirklich nötig sind (siehe „Welche Dateien für welche Änderung“).
> Hochgeladene Dateien liegen unter `/mnt/user-data/uploads/`. Lies sie gezielt mit `grep -n` und `sed -n 'von,bisp'`, statt sie komplett anzuzeigen.
> Liefere am Ende **nur die geänderten Dateien** aus (Claude kann das Repo auch selbst klonen, siehe „Hosting“). Bei Änderungen an App-Dateien (`app.js`, `style.css`, `index.html`, `sw.js`, `manifest.json`) `VERSION` in `sw.js` erhöhen; reine Inhaltsänderungen in `modules/` brauchen das nicht. Änderungsprotokoll unten ergänzen.

## Nächste Schritte

> **Für Claude:** Fragt der Nutzer nach den nächsten Schritten, nenne die offenen Punkte (☐) dieser Liste. Neue größere Vorhaben hier einreihen, erledigte abhaken und ihre Ergebnisse in die passenden Abschnitte dieser Datei übernehmen, statt lange Ablaufpläne stehen zu lassen.

1. ☑ **IT-Kategorien aufteilen** (v17): 35 Kategorien mit 30–49 Begriffen, Lernstand bewusst neu gestartet.
2. ☑ **Lernrahmen L1–L3** (v18–v21): drei Teile pro Begriff, Bremse, KI-Prüfung, Krönchen. Regeln unter „Spielregeln“, Hintergrund unter „Lernrahmen: Hintergrund und Entscheidungen“.
3. ☑ **CLAUDE.md nachgezogen**: alle Abschnitte auf dem Stand des Lernrahmens.
4. ☑ **Echter Test der KI-Prüfung** (mit `tools/ki-test.html`): alle 16 Testfälle mit dem erwarteten Urteil, `AI_RULES` bleibt unverändert. Bei späteren Änderungen an `AI_RULES` oder `AI_MODEL` die Testseite erneut laufen lassen.
5. ☑ **`levels` aus den Moduldateien gestrichen** (per Skript, beide Module).

## Was die App ist

Installierbare Web-App (PWA) zum Lernen englischer Fachbegriffe mit deutscher Übersetzung. Zielgruppe: der Nutzer selbst (Österreich), Android-Handy, Chrome. Später sollen auch Schulmodule (z. B. Biologie, auch rein deutschsprachig) für den Sohn des Nutzers dazukommen; der Lernrahmen ist dafür für alle Module gleich.
Zwei Module: **IT** (`dev`, 1.305 Begriffe, violettes Schema) und **Agile & Projekte** (`agile`, 507 Begriffe, weinrotes Schema), beide mit Zusatzinhalten für alle Begriffe.
Jeder Begriff durchläuft drei Teile: **A** (Begriff und Bedeutung), **B** (anwenden), **C** (in eigenen Worten erklären, eine KI prüft). Danach ist er **gelernt**; sind alle Begriffe eines Themas gelernt, bekommt das Thema ein **Krönchen**. Die App entscheidet selbst, was als Nächstes gefragt wird. Keine Punkte, Ränge oder Strafen.
Bereiche: Quiz (ändert den Lernstand), Karteikarten und Nachschlagen (ändern ihn nicht). Dazu Kalender (Fragen pro Tag), Schalter „Gerade kein Ton“, Blatt „KI-Prüfung“, Hilfe, Export/Import.
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
| `app.js` | 121 KB (~34.000 Tokens) | gesamte Logik |
| `style.css` | 60 KB (~17.000 Tokens) | gesamte Gestaltung, Farben über CSS-Variablen |
| `sw.js` | 3 KB | Service Worker: Offline-Cache, „sofort aus Cache, im Hintergrund aktualisieren“ |
| `manifest.json` | 1 KB | App-Name, Symbole, Startfarbe `#0a0510` |
| `icons/` | – | `icon-192.png`, `icon-512.png`, `icon-maskable-512.png` |
| `modules/index.json` | 1 KB | Katalog aller Module (`desc`, `count` für „Module verwalten“) |
| `modules/<key>/module.json` | – | ein Modul, **genau eine Datei** inkl. Zusatzinhalte (`extra`); der Ordnername ist immer der `key` |
| `modules/dev/module.json` | 2,1 MB (~600.000 Tokens) | Modul IT, **nie komplett lesen oder einfügen** |
| `modules/agile/module.json` | 0,9 MB (~270.000 Tokens) | Modul Agile & Projekte, **nie komplett lesen oder einfügen** |
| `tools/ki-test.html` | 18 KB | Testseite für die KI-Prüfung: `https://baumpinkler.github.io/FachVokabeln/tools/ki-test.html`. Liest `AI_RULES`, `AI_MODEL` und `AI_MODEL_FALLBACK` per Regex aus `app.js` und die Musterlösungen aus den Moduldateien, nimmt den Schlüssel aus `lernapp.aikey` (gleiche Herkunft), schickt 16 Testfälle (gut, knapp, Beispiel, Diktat, Englisch, nur Übersetzung, vage, falsch, verwechselt, halb richtig, Anweisung an die KI; 3 Grenzfälle) plus eigene Fälle, 1–3 Durchläufe, wartet bei 429 65 s, „Ergebnis kopieren“ liefert Text für den Chat. Nachricht und Auswertung sind aus `aiJudge`/`aiParse` kopiert: **bei Änderungen dort mitziehen**. Ändert den Lernstand nicht, ist nicht im Service-Worker-Cache vorgesehen |
| `docs/agile-projekte-begriffe.md` | 28 KB | abgesegnete Begriffsliste für Agile & Projekte (Kategorie, Englisch, Deutsch); nicht eigenmächtig ändern |

## Welche Dateien für welche Änderung

| Änderung | Betroffene Dateien |
|---|---|
| Farben eines Moduls | `modules/index.json` + Hinweis, welches Modul. Claude erzeugt ein kleines Skript bzw. die `theme`-Werte; das große JSON wird per Skript geändert, nicht gelesen |
| Aussehen, Abstände, Schriften | `style.css` |
| Lernrahmen, Auswahl, Quiz, KI-Prüfung, Kalender, neue Funktionen | `app.js` (+ ggf. `style.css`) |
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
  lang:   { term:"en-US", meaning:"de-AT" },          // optional, Standard genau diese Werte
  theme:  { board, board-dot, ink, ink-soft, surface, line, ok, bad, accent, m1, m2, m3 },
  raw:    [ Eintrag, Eintrag, … ],
  extra:  { "<begriffs-id>": {ex, sit, conf, tf}, … } }
```
Kompakt gespeichert (`separators=(",",":")`, `ensure_ascii=False`, ohne Zeilenumbruch am Ende). Die App (`MOD_FORMAT`, `MOD_VERSION` in `app.js`) lädt nur `format` „fachvokabeln-modul“ mit `version` ≤ 1; sonst „braucht eine neuere App-Version“. Ohne gültiges JSON, `raw` oder `cats` gilt das Modul als fehlerhaft.
`extra` (optional, seit v16, direkt nach `raw`): Zusatzinhalte für schwere Fragearten, Schlüssel = Begriffs-ID (Format und Regeln unter „Zusatzinhalte“). Fehlt das Feld oder fehlt ein Inhalt, entfallen die betreffenden Fragearten und Häkchen in Teil B. Ändern immer per Skript: JSON laden, `extra[id]` setzen, kompakt zurückschreiben.
`theme`: `board` Hintergrund (fast schwarz), `surface` Flächen, `accent` Modul-Schalter, `m1`/`m2`/`m3` die drei Startseiten-Kärtchen (Karteikarten/Quiz/Nachschlagen).
`lang` (optional, seit v18): Sprache der Begriffe (`term`, Vorlesen und Sprechen des Begriffs) und der Bedeutung (`meaning`, Vorlesen der Bedeutung und Situationen, Diktat in Teil C). Ein deutschsprachiges Schulmodul hat beide auf `de-AT`. Situationen und Stimmt-das-Aussagen sind in `meaning`-Sprache. `version` bleibt 1.
`levels` (XP-Ränge) gibt es seit dem Lernrahmen nicht mehr; aus IT und Agile entfernt, die App ignoriert das Feld, falls es noch irgendwo steht.

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

## Spielregeln: der Lernrahmen

Grundsätze: Fehler haben **keine Folgen** (richtige Lösung zeigen, weiter), es zählen nur richtige Antworten, „fast richtig“ zählt als richtig. Was ein Begriff an Inhalten nicht hat, wird nicht verlangt. Kann ein Gerät etwas **gar nicht** (kein `speechSynthesis` oder keine Stimme für die Sprache, kein `SR`), gelten die betroffenen Häkchen als erfüllt (`autoChecks`, nicht gespeichert), sonst bliebe ein Begriff für immer hängen.

**Begriffe:** Ausgabearten Lesen (Text steht da) und Hören (wird vorgelesen, steht nicht da, 🔊 zum Wiederholen). Eingabearten Auswählen (5 Antworten), Schreiben (`checkTyped`), Sprechen (🎤). Bedeutung = deutsche Übersetzung (Index 2), beim Vorlesen wird „ / “ zum Komma (`sayable`).

### Teil A: Begriff und Bedeutung
- **Bedeutung → Begriff** (`m2t`): jede Ausgabeart (`o:read`, `o:hear`) und jede Eingabeart (`i:pick`, `i:type`, `i:say`) mindestens einmal richtig; eine Antwort hakt beides zugleich ab.
- **Begriff → Bedeutung** (`t2m`): einmal Lesen + Auswählen (`r:read`), einmal Hören + Auswählen (`r:hear`). Kein Schreiben/Sprechen in dieser Richtung (deutsche Übersetzungen nicht zuverlässig prüfbar).
- Fertig (`partADone`): alle 7 Häkchen (`A_CHECKS`), mindestens 5 richtige Antworten (`A_MIN`), davon 3 in Richtung Bedeutung → Begriff (`A_MIN_M2T`). Schreiben und Sprechen erst, wenn der Begriff einmal richtig beantwortet wurde (`doable`).

### Teil B: anwenden (frühestens am Tag nach Teil A)
Vier Fragearten, gemischt (erst Frageart zufällig unter denen mit offenen Häkchen, darin die Aufgabe mit den meisten offenen Häkchen):
- **Lückensatz** (nur Lesen): jeder Satz einmal (`c0` = Beispielsatz Index 4, nur wenn `termRe` passt; `c1`/`c2` = `ex`-Sätze) und jede Eingabeart einmal (`ci:pick/type/say`). „Satz auf Deutsch zeigen“ als Hilfe.
- **Situation** („Welcher Begriff passt?“): jede der 3 Situationen (`s0`–`s2`), Lesen und Hören (`so:read/hear`, vorgelesen in `MOD.lang.meaning`), jede Eingabeart (`si:…`).
- **Stimmt das?**: beide Aussagen (`t0`, `t1`), Stimmt/Stimmt nicht, danach Begründung.
- **Unterschied** (`u0`, `u1`): maskierte Sätze mit A/B (`maskNames`); zählt nur, wenn `confWrong` mindestens 3 verschiedene falsche Sätze findet.
- Fertig: alle vorhandenen Häkchen (mit allen Inhalten 10 Antworten, ohne `conf` 8). `autoFinishB` schließt Teil B ab, wenn nach der Bremse nichts offen ist.

### Teil C: in eigenen Worten (frühestens am Tag nach Teil B)
- Begriff erklären, schreiben oder diktieren (🎤 in `MOD.lang.meaning`, wird angehängt, frei bearbeitbar). Gemini prüft (Details unter „KI-Prüfung“). Richtig → `cDay`, der Begriff ist **gelernt**. Falsch hat keine Folgen, neuer Versuch in einer späteren Runde. „Weiß ich nicht“ zeigt die Musterlösung ohne KI.
- **Krönchen:** Sobald alle Begriffe einer Kategorie `cDay` haben, `P.crowns[kat] = {day}` (`crownCheck`); Anzeige als `crownCard` in Rückmeldung und Rundenende, danach dauerhaft auf Übersicht und Nachschlagen.

### Bremse
Teil B frühestens am Kalendertag nach Teil A, Teil C frühestens am Tag nach Teil B (`afterDay`, Vergleich mit `dayStr`). Ein Begriff braucht also mindestens 3 Tage, damit nicht alles an einem Abend aus dem Kurzzeitgedächtnis abgehakt wird.

### Auswahl der Fragen (`planRound`)
- Runde = bis zu 10 Fragen (`QUIZ_LEN`) aus den angehakten Themen (`P.cats`). Pro Begriff wählt `taskFor` die Aufgabe mit den meisten offenen Häkchen (Gleichstand zufällig), unter Beachtung von Bremse, „Gerade kein Ton“ und KI-Verfügbarkeit.
- Begonnene Begriffe vor neuen, höherer Teil vor niedrigerem, dann am längsten nicht gefragt (`t`). Neue Begriffe aus dem angehakten Thema, das am weitesten ist (`catScore`, Gleichstand: Reihenfolge in `cats`): höchstens 3 (`NEW_PER_ROUND`), aber so viele, dass die Runde voll wird.
- Jeder Begriff höchstens 2× pro Runde (erst alle einmal, dann die zweiten Male), nie zweimal direkt hintereinander. Teil C: höchstens 2 Begriffe (`C_PER_ROUND`), jeder nur einmal.
- Frage und Aufgabe werden erst beim Erreichen gebaut (`findNext`/`goQuestion`), damit der Lernstand aktuell ist. Gibt es weniger Aufgaben, wird die Runde kürzer; gibt es keine, sagt `noTasksText` warum („Heute alles erledigt, morgen geht's weiter mit X Begriffen“, warten auf Ton, warten auf die KI-Prüfung, alles gelernt).
- Antwortmöglichkeiten: 5, unterschiedliche Anfangsbuchstaben (`keyLetter`, Artikel/„to“ zählen nicht), Ablenker zuerst aus derselben Kategorie (`distractors`), immer ganz sichtbar.

### Eingabe und Ton
- **Schreiben** (`checkTyped`, `typeNorm`, `lev`): Groß/Klein, führendes „to “, Bindestrich/Leerzeichen/Unterstrich egal; Levenshtein ≤ 1 je angefangene 6 Buchstaben = „fast richtig“ (zählt als richtig). Exakt ein anderer Begriff des Moduls = falsch.
- **Sprechen:** Pro Frage nur eine Eingabeart, Hinweis „✍️ Schreib …“ bzw. „🎤 Sprich …“ über dem Feld. Beim Sprechen ist das Feld bis zur ersten Erkennung gesperrt; `listen` liefert bis zu 5 Varianten, die beste (richtig > fast richtig > Verwechslung > falsch, `heard`) kommt ins Feld. Unverändert abgeschickt = Sprechen, von Hand geändert = Schreiben. Spracherkennung braucht in Chrome meist Internet.
- **„Gerade kein Ton“** (Schalter unter der Quiz-Kachel, `lernapp.quiet`): kein Hören, kein Sprechen, bis zum Ausschalten. Diese Häkchen werden später nachgeholt; Begriffe, die nur noch sie brauchen, warten (`waitsForSound`), Übersicht und Rundenende sagen das. Teil C geht dann nur schriftlich.
- **Sprache pro Modul:** `MOD.lang = {term, meaning}` (Standard `en-US`/`de-AT`). Begriff vorlesen und sprechen in `term`, Bedeutung, Situationen und Diktat in `meaning` (`outLang`). `voiceFor` fällt von `de-AT` auf `de-DE` zurück.
- **`conf`-Anzeige:** `maskNames` ersetzt englischen Begriff und deutsche Hauptwörter (ohne Artikel, `:in`, kleine Endungen) durch „A“/„B“.

### KI-Prüfung (Teil C)
- **Anbieter:** Google Gemini API, Gratis-Stufe, direkt aus dem Browser: `POST https://generativelanguage.googleapis.com/v1beta/models/<AI_MODEL>:generateContent`, Kopfzeile `x-goog-api-key`, `generationConfig.responseMimeType = "application/json"`. `AI_MODEL` = `gemini-3.5-flash-lite` (Stand Oktober 2026), bei 404 Rückfall auf `gemini-flash-lite-latest`. Modelle und Grenzen ändern sich: bei Problemen in der aktuellen Gemini-Doku (Preisliste, Spalte „Free Tier“) ein Flash-Modell der Gratis-Stufe wählen.
- **Schlüssel:** jeder Nutzer seinen eigenen, Blatt „KI-Prüfung“ (🤖 neben „Module verwalten“, Link zu Google AI Studio, „Speichern und testen“, „Testen“, „Entfernen“). Nur in `localStorage["lernapp.aikey"]`, **nie im Repo, nie im Export**. Hinweis im Blatt: In der Gratis-Stufe darf Google die Eingaben zum Verbessern der Modelle verwenden, also nur Erklärungen, nichts Persönliches.
- **Eingabe an die KI:** Begriff, Bedeutung, die 3 Erklärungen (Index 3, 6, 7) als Musterlösungen, die Antwort zwischen `<antwort>`-Marken. Anweisung `AI_RULES`: inhaltlich streng, sprachlich großzügig; nicht richtig sind bloße Übersetzung, fachlich Falsches, zu Vages. Ergebnis `{"ok", "feedback" (1–2 Sätze, du-Form), "fehlt"}`.
- **Anzeige:** Urteil, Feedback, was gefehlt hat, eine zufällige Musterlösung.
- **Fehlerfälle** (kein Schlüssel, offline, Zeitüberschreitung, 429, ungültiger Schlüssel, Region, Modell weg, Serverfehler, unlesbare Antwort): klare Meldung, Antwort wird **nicht** gewertet, Text bleibt stehen, „Nochmal prüfen“/„Überspringen“. Nach 429 90 s Pause. Ohne Schlüssel, Netz oder während der Pause bietet die Auswahl keine Teil-C-Fragen an (`aiReady`); Übersicht und Rundenende zeigen „X Begriffe warten auf die KI-Prüfung“ mit Grund und Knopf zum Blatt.
- **Testen mit echtem Gemini:** `tools/ki-test.html` (siehe „Dateien“).
- Der Service Worker greift bei fremden Adressen nicht ein (`fetch`-Handler nur gleiche Herkunft und Schriften, POST nie); das muss so bleiben.

### Oberfläche
- **Kopf:** gelernt-Zahl, gestapelter Balken A/B/C/gelernt, „Fragen heute“ (öffnet den Kalender).
- **Übersicht:** Quiz-Kachel, „Gerade kein Ton“, Karteikarten, Nachschlagen; Hinweise (nichts zu tun, warten auf Ton, warten auf KI); Themen mit Häkchen zum An-/Abwählen, „A 3 · B 2 · C 1 · ✓ 4 / 41“ und gestapeltem Balken, gekrönte Themen im Krönchen-Design.
- **Quiz:** Kartenkopf mit Kategorie-Punkt, „· neu“ bzw. „· Teil B/C“, Frage x von y; oben rechts die Häkchen der Runde. Rückmeldung mit „Neu abgehakt“, den Häkchen-Chips (`checksHtml`, `checksHtmlB`) und „Teil … geschafft“. Rundenende: richtig/gefragt, neue Häkchen, neue Krönchen, gelernte Begriffe, Teil B/A geschafft, daneben gegangene Begriffe, Warte-Hinweise.
- **Nachschlagen:** Stand pro Begriff (`stageTag`: „A 3/7“, „B 5/16“, „C“, „✓ gelernt“) und im aufgeklappten Eintrag Häkchen bzw. Datum („ab morgen“, „Jetzt ist Teil C dran“, „Gelernt am …“).
- **Karteikarten:** 10 Karten (bis zu 5 aus Teil A), „Nochmal“ legt die Karte nur ans Ende des Stapels.
- **Kalender:** Fragen pro Tag (richtig und falsch, `P.askLog`), Farben 1–9, 10–29, ab 30.

## Code-Landkarte `app.js`

| Bereich | Funktionen |
|---|---|
| Helfer, Begriffe | `buildTerms` (Begriffe aus `raw`, `t.expls` = Index 3/6/7), `esc`, `shuffle`, `dayStr`/`today`, `termRe`, `cloze`, `clozeDe`, `keyLetter`, `highlight`, `markTerm`, `num`, `pickOne`, `arr`, `own` |
| Lernstand & Speicher | `P_VERSION`, `freshProgress`, `normProgress` (verwirft alles ohne `v:2`), `fixCats`, `save`; Cloud-Funktionen (`pushCloud`, `syncCloud`, `connectCloud`) sind Altlast aus claude.ai und außerhalb inaktiv |
| Sprache | `LANG_DEFAULT`, `langOf`, `langName` |
| Module laden | `CATALOG_ORDER` (alle aus dem Index), `MODULE_ORDER` (nur gewählte), `INDEX`, `loadIndex`, `ensureModule` (merkt laufende Downloads, prüft Format, setzt `extra` und `lang`, Fehler mit `code` `offline`/`missing`/`broken`/`newer`), `needsNewerApp`, `modErrText`, `applyTheme`, `loadModule`, `switchModule` (= `swipeTo`) |
| Modulauswahl | `initChosen`, `setChosen`, `hasProgress`, `unloadModule`, `dropModuleCache` |
| Katalog | `showCatalog`, `mountCatalog`/`catalogItems` (auch Willkommen-Seite), `enterModule`, `removeModule`, `showModulePicker` |
| Modulwechsel & Wischen | `renderModbar`, `initSwipe`, `swipeTo`, `snapBack`, `slide`, `settleAnim`; Hinweis einmalig über `lernapp.swipehint` |
| Übergänge | `transit(fn)`, `goHome` |
| Zusatzinhalte | `MOD.extra`, `extraOf` (geprüfte Inhalte), `nameVariants`, `maskNames`; `BYID` = Begriffe nach ID |
| Stand eines Begriffs | `stateOf`, `touch`, `stageOf` (`new`/`a`/`b`/`c`/`done`), `STAGE_W`, `stageCount`, `barSegs`, `stageParts`, `stageAria`, `catTerms`, `crowned`, `crownOf` + `CROWN_DESIGNS`/`CROWN_GENERIC` |
| Teil A | `A_CHECKS`, `A_TASKS`, `A_MIN`, `A_MIN_M2T`, `outLang`, `autoChecks`, `doable`, `openChecksA`, `partADone`, `checksHtml` |
| Teil B | `bContent` (Inhalte, Häkchen, Aufgaben; gemerkt in `BCACHE`), `openChecksB`, `checkNameB`, `taskForB`, `autoFinishB`, `confPairs`, `confWrong`, `checksHtmlB` |
| Teil C & KI | `AI_KEY`, `AI_MODEL`/`AI_MODEL_FALLBACK`, `aiKey`/`setAiKey`, `aiBlock`/`aiReady`, `aiWaitText`, `taskForC`, `crownCheck`, `aiCall` (Fehlercodes `AI_ERR`, `aiErrText`), `aiParse`, `AI_RULES`, `aiJudge`, `aiTest`, `showAiSheet`, `aiNotice`/`wireAiNotice` |
| Auswahl | `taskFor` (A/B/C), `hasTask`, `waitsForSound`, `waitsForDay`, `waitsForAi`, `pool`, `catScore`, `freshTerms`, `planRound`, `distractors`, `noTasksText` |
| Ton | `quiet`/`setQuiet`, `canHear` (`yes`/`wait`/`no`), `voiceFor`, `speak`, `sayable`, `speakBtn`, `SR`, `listen`/`stopListen` |
| Quiz | `startQuiz`, `findNext`/`countAhead`/`goQuestion`, `makeQuestion`/`makeQuestionB`, `renderQuiz` (A und B), `renderQuizC`, `answer`, `heard`, `answerInput` → `settle` (A/B: Häkchen, `askLog`, `aDay`/`bDay`); `checkC` → `settleC` (C: `nc`, `cDay`, Krönchen), `crownCard`, `nextQuestion`, `renderQuizDone`; Eintippen `checkTyped`, `typeNorm`, `lev` |
| Karteikarten | `startCards`, `renderCard`, `renderCardsDone` |
| Nachschlagen | `renderLex`, `lexItem`, `stageTag` |
| Startseite & Kopf | `renderHome`, `renderTop` |
| Fenster | `sheet`, `openDialog`, `showHelp`, `showCalendar`/`renderCalendar`, `showExport`/`buildExport`, `showImport`, `showAiSheet` |
| Zurück-Taste | `navPush`, `navEnterScreen`, `popstate`-Handler, `renderHome(fromPop)` |
| Sonstiges | `toast(msg, ms)`, `confetti`, `setFocus` (blendet Modulleiste und Kopf in Quiz/Karten/Nachschlagen aus) |
| Start | `boot` (ganz unten): `loadIndex` → `initChosen` → `renderWelcome` (nichts gewählt) oder `startChosen` (Startmodul, kaputte überspringen, sonst `renderNoModule`) → `startApp` (lädt nach 1,5 s die übrigen gewählten Module vor) |

## Gespeicherter Fortschritt (`P`, pro Modul in `localStorage[ls]`)

```
{v:2, terms:{id:{a:[…], na, nm, t, aDay, b:[…], nb, bDay, nc, cDay}}, crowns:{kat:{day}}, cats:[…], askLog:{tag:anzahl}, updatedAt}
```
- `a`/`b` = Häkchen von Teil A/B (Strings wie oben), `na`/`nb` = richtige Antworten in Teil A/B, `nm` = davon Bedeutung → Begriff, `nc` = Versuche in Teil C, `t` = zuletzt gefragt (ms), `aDay`/`bDay`/`cDay` = Tag des Abschlusses (`cDay` = gelernt). `b` wird beim Abschluss von Teil A angelegt.
- Ein Begriff ohne Eintrag ist neu. Ein gespeicherter Lernstand ohne `v:2` (alte Version mit XP und Boxen) wird verworfen und sofort überschrieben.
- Tagesformat: `JJJJ-M-T` (ohne führende Nullen, siehe `dayStr`).
- Export: `{"format":"lernapp-fortschritt","version":2,"modules":{key:P},"summary":…}`. Import mit Version 1 wird mit Meldung abgelehnt, höhere Versionen ebenfalls.
- Weitere Schlüssel: `lernapp.aikey` (KI-Schlüssel, nie im Export), `lernapp.quiet` („Gerade kein Ton“), `lernapp.chosen` (Array der gewählten Modul-Keys), `devvokabeln.module` (zuletzt offenes Modul), `lernapp.theme` (Farbschema für den Start), `lernapp.swipehint`.
- Entfernen eines Moduls löscht nur den `lernapp.chosen`-Eintrag und den Daten-Cache, nie den Lernstand. Der Export enthält alle Module mit Lernstand, auch abgewählte; ein Import nimmt nicht gewählte Module in die Auswahl auf.

## Gestaltung und Konventionen

- Dunkle Modul-Schemata (Hintergrund fast schwarz mit Farbstich) mit weichem Schein der Modulfarbe oben (`body::before`); gedämpfte Pastellkarten für Kategorien (`--n-*` in `style.css`), abgerundet, ohne Drehung und Klebestreifen.
- Theme-Farben sind mit `@property` registriert und blenden beim Modulwechsel in 0,45 s über. Maße: `--r-lg/--r-md/--r-sm`, Kurven `--ease`/`--spring`, Flächen `--raise`, `--edge`, `--shadow`.
- Alles Tippbare federt beim Antippen (`scale(.965)`). Fenster (`dialog`) kommen als Blatt von unten, ab 700 px Breite mittig. Seitenwechsel blenden aus und wieder ein (`transit`: `#modbar` und `#pager` 130 ms aus, 220 ms ein, nichts verschiebt sich; Wechsel während des Ausblendens werden gesammelt). Keine View Transitions mehr (seit v20). `prefers-reduced-motion` schaltet alle Bewegungen ab.
- `#pager` hat `touch-action: pan-y pinch-zoom`, damit senkrechtes Scrollen beim Browser bleibt und waagrechtes Wischen bei der App.
- Schriften: Bricolage Grotesque (Überschriften), Atkinson Hyperlegible (Text).
- Farben der Teile: A `--m1`, B `--gold`, C `--m3`, gelernt `--ok` (Balken `i.sb-*`, `.st-tag`); gelernte Begriffe im Nachschlagen mit grünem Rand. Quiz: Lichtfäden wie in der Teamauswahl von FIFA 10 nur hinter der Frage. Eigenes Element `#qfx` direkt in `<body>` (angelegt von `qfxEl`), damit es beim Fragenwechsel nicht mit `#pager` ausgeblendet wird; nur im Quiz sichtbar (`.on`). Feste Höhe ab Seitenanfang (`--qfx-h`, 300 px), weich ausgeblendet links, rechts und unten (Maske auf `#qfx`). Drei weiße Lagen und eine Lage in der Akzentfarbe `--qa` (`.qfx-l`, bewegt per `transform`, nahtlose SVG-Kacheln) plus Nebel. Quiz-Frage `.note.qc` und Antworten `.opt` ohne Fläche und Rand, frei schwebend; nach der Antwort richtige Antwort hell mit grünem Schein, falsch gewählte rot und durchgestrichen, übrige ausgeblendet (`.dim`). `qfxShow(a)` nach jedem Aufbau der Quiz-Karte: `is-ok`/`is-bad` blenden `--qa` nach `--ok`/`--bad` und die Fäden voller (`--qfx-o` .28 → .5), bei der nächsten Frage zurück; `--qc-b` zählt die Antworten hoch und gibt per Übergang einen Schub (`translate` mit `mod()`, kein Zurückspringen). `qfxOff` in `renderHome` und `renderQuizDone`. Glas-Look (am Ende von `style.css`, nur bei `:root[data-mod]`): Flächen halbdurchsichtig mit feinem hellem Rand und schrägem Glanz (`--raise`, `--glass`, `--glass-line`), Karten `.note` als Glas in ihrer Farbe `--c` mit heller Schrift, Haupt- und Warn-Button sowie Etiketten als getöntes Glas. Bewusst ohne `backdrop-filter` (Leistung am Handy).
- Gekrönte Themen bekommen `.crown` mit `data-crown="<Kategorie>"` (Übersicht und Nachschlagen). Jede Kategorie hat ein eigenes Muster in `style.css` (`.crown[data-crown="code"]` usw., alles CSS-Verläufe, ein Lichtstreif läuft über alle) und Name + Symbol in `CROWN_DESIGNS`. **Neue Kategorie:** dort und in `style.css` ein eigenes Design ergänzen, sonst bekommt sie eines der 6 allgemeinen (`g0`–`g5`, nach Position im Modul). Designs nicht vorab zeigen, sie sind die Belohnung (erstmals sichtbar als `.crown-card` beim Verdienen).
- Texte auf Deutsch (Österreich: Lehrling, Gehsteig, Stiegenhaus, Krankenstand), Gendern mit `:in`.
- Fenster immer über `sheet(id)` + `openDialog(dlg)` öffnen, damit die Zurück-Taste funktioniert.
- Testen: lokal mit `python3 -m http.server` im Projektordner und Playwright; `file://` funktioniert wegen `fetch` nicht.

## Inhalte schreiben

Gilt für alle Module. Moduldateien nie komplett lesen: per Skript die nötigen Spalten auslesen, neue Inhalte in Blöcken von etwa 25 Begriffen schreiben und per Skript einfügen, kompakt zurückschreiben (`separators=(",",":")`, `ensure_ascii=False`). Danach das jeweilige Prüfskript laufen lassen und nur die geänderte `module.json` (+ ggf. `index.json`, diese Datei) ausliefern.

### Neue Begriffe

1. Vorhandene Begriffe der Kategorie per Skript auslesen (Index 1, 2, 3), damit Erklärungen zusammenpassen und sich nicht wiederholen.
2. Neue Einträge im vollen Format (Index 0–8, siehe „Ein Begriff“) an `raw` anhängen.
3. Hat das Modul eine abgestimmte Begriffsliste (`docs/<key>-begriffe.md`, für Agile `docs/agile-projekte-begriffe.md`): neue Begriffe dort zuerst mit dem Nutzer abstimmen, Bedeutung aus der Liste übernehmen.
4. `count` in `index.json` anpassen. Neue Begriffe brauchen auch Zusatzinhalte (nächster Abschnitt), sonst fällt Teil B für sie fast ganz weg.

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
Damit sind die Kategorien eines Moduls ungefähr gleich groß. Grund: Jedes Thema ist in vernünftiger Zeit zu meistern, die Krönchen bleiben vergleichbar.

- Wird eine Kategorie zu groß, wird sie geteilt: neue Kategorie mit eigenem Namen und Key, ein Teil behält den alten Key.
- Wird eine Kategorie zu klein, wird sie mit einer passenden zusammengelegt oder aufgefüllt.
- Kategorien dürfen dafür umbenannt werden (`name` in `cats`). Der **Key** bleibt nach Möglichkeit, denn an ihm hängen Krönchen (`P.crowns`), Themenauswahl (`P.cats`) und das Krönchen-Design. Der Lernstand der Begriffe (`P.terms`) hängt an der Begriffs-ID und bleibt immer erhalten.
- Neue Kategorie-Keys brauchen eine Farbe in `cats` und sollten ein eigenes Krönchen-Design bekommen (`CROWN_DESIGNS` + `style.css`, dann `VERSION` erhöhen).
- Wechselt ein Begriff die Kategorie, ändert sich nur Index 0; `extra` und die `conf`-Verweise bleiben gültig.

Beide Module erfüllen die Regel: IT 35 Kategorien mit 30–49 Begriffen (seit v17), Agile 13 mit 33–49.

### Zusatzinhalte (Feld `extra`)

Ziel: Begriffe in Teil B nicht an immer denselben Texten wiedererkennen, sondern anwenden und abgrenzen. Ablauf: per Skript die Begriffe der Kategorie auslesen (Index 1, 2, 3, 6, 7), Inhalte schreiben, per Skript als `extra[id]` eintragen.

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

> **Für Claude:** Will der Nutzer ein neues Modul, zuerst diesen Abschnitt und „Inhalte schreiben“ lesen. Nichts schreiben, bevor Schritt 1 mit dem Nutzer geklärt ist.

1. **Mit dem Nutzer klären:** Fach und Zielgruppe (wer lernt, Vorwissen, bei Schulmodulen Schulstufe/Lehrplan), Sprachen (`lang`), Kategorien und **Begriffsliste** (Kategorie, Begriff, Bedeutung). Die abgestimmte Liste als `docs/<key>-begriffe.md` ablegen (Vorbild `docs/agile-projekte-begriffe.md`); sie gilt danach als verbindlich, Änderungen nur nach Rücksprache. Bei einem rein deutschsprachigen Modul zuerst „Deutschsprachige Module“ unten klären.
2. Ordner `modules/<key>/` mit `module.json` (Format siehe „Moduldatei“), `format`/`version` wie oben. Kein `levels`.
3. `cats` mit Pastellfarben `var(--n-…)` (siehe `style.css`), Kategorien nach „Größe der Kategorien“ zuschneiden. `lang` nur angeben, wenn die Sprachen von `en-US`/`de-AT` abweichen.
4. `theme` mit allen Feldern (`board`, `board-dot`, `ink`, `ink-soft`, `surface`, `line`, `ok`, `bad`, `accent`, `m1`, `m2`, `m3`) im Aufbau wie die anderen Module, gut unterscheidbar von Violett (IT) und Weinrot (Agile). `bad` muss sich deutlich von `accent` abheben, die Pastellkarten müssen auf `board` lesbar bleiben.
5. Inhalte nach „Inhalte schreiben“ in Blöcken pro Kategorie: erst `raw`, dann `extra`. Jeder Begriff braucht alles aus der Checkliste unten; nach jeder Kategorie beide Prüfskripte.
6. Eintrag in `modules/index.json` (Felder siehe „Katalog“): `ls` = `lernapp.progress.<key>`, `doc` = `progress-<key>`, `accent`/`board` wie im Theme, `desc`, `count`.
7. Optional eigene Krönchen-Designs pro Kategorie (`CROWN_DESIGNS` + `style.css`, siehe „Gestaltung“), sonst greifen die allgemeinen. Nur dann `VERSION` erhöhen.
8. Testen: Modul im Katalog hinzufügen, Quiz, Nachschlagen, Karteikarten (Playwright, siehe „Lernrahmen: Hintergrund und Entscheidungen“).

### Checkliste: was jeder Begriff braucht und wofür

| Inhalt | Feld | Wofür in der App | Worauf achten |
|---|---|---|---|
| Begriff | `raw[1]` | Teil A/B Antwort (auswählen, schreiben, sprechen), Vorlesen in `lang.term`, ID | eindeutig; Verben mit „to “; so schreiben, wie man ihn eintippt/spricht |
| Bedeutung | `raw[2]` | Teil A in beide Richtungen, Vorlesen in `lang.meaning`, `maskNames` | mit Artikel, Varianten mit „ / “, gegendert mit `:in`; kurz |
| 3 Erklärungen | `raw[3]`, `[6]`, `[7]` | Nachschlagen, Rückmeldung, **Musterlösungen der KI in Teil C** | je ein präziser Satz, drei Blickwinkel (was, Beispiel/Einsatz, Zweck/Abgrenzung); genau genug, um den Begriff von verwandten zu unterscheiden; ohne den Begriff |
| Beispielsatz + Übersetzung | `raw[4]`, `[5]`, ggf. `[8]` | Lückensatz `c0`, Karteikarten | `[4]` enthält den Begriff wörtlich in Grundform (Wortgrenzen!), sonst entfällt `c0` |
| 2 weitere Satzpaare | `extra.ex` | Lückensätze `c1`, `c2` | wie oben, anders als `[4]` |
| 3 Situationen | `extra.sit` | „Welcher Begriff passt?“, lesen und hören | ohne Begriff und Übersetzung, eindeutig, keine Frage am Ende |
| 2 Aussagen | `extra.tf` | „Stimmt das?“ | eine wahr, eine typische Fehlvorstellung, je mit Begründung |
| 1–2 Unterschiede | `extra.conf` | „Unterschied“ mit A/B | Partner im selben Modul, beide beim Namen nennen; im Modul braucht es genug Paare (mind. 3 andere) |

Was fehlt, wird nicht abgefragt, aber der Begriff verliert dann Übung: ohne `extra` bleibt von Teil B fast nichts. Die Kategorien brauchen genug Begriffe mit verschiedenen Anfangsbuchstaben für die 5 Antwortmöglichkeiten (mit 30–50 Begriffen pro Kategorie kein Problem).

### Deutschsprachige Module (z. B. Schulmodule): vor dem ersten klären

Der Rahmen ist dafür gedacht (`lang` beide `de-AT`), aber noch nie ausprobiert. Vor dem ersten solchen Modul mit dem Nutzer festlegen und ggf. den Code anpassen (`VERSION` erhöhen, Testseite nicht nötig):
- **Was ist die „Bedeutung“?** Vorschlag: eine kurze Umschreibung (z. B. Begriff „Fotosynthese“, Bedeutung „Pflanzen machen aus Licht, Wasser und CO₂ Zucker“). Sie muss kurz genug für Antwortmöglichkeiten sein und darf den Begriff nicht enthalten.
- **Artikel beim Begriff:** `checkTyped` ignoriert nur „to “, keine Artikel. Entweder Begriffe ohne Artikel in `raw[1]` (Artikel dann nur in Erklärungen) oder `typeNorm` um führende Artikel erweitern.
- **Beugung:** `termRe` und `maskNames` suchen die Grundform mit Wortgrenzen. Deutsche Sätze beugen oft („der Zellen“), dann fällt der Lückensatz weg. Sätze bewusst mit der Grundform schreiben oder `[8]`-artige Lücken auch für `raw[4]`/`ex` einführen.
- **Satzpaare:** `raw[4]`/`[5]` und `ex` sind als Übersetzungspaar gedacht. Vorschlag: `[4]` Satz mit dem Begriff, `[5]` derselbe Satz als Hilfe umschrieben ohne den Begriff (er erscheint bei „Satz zeigen“).
- **Ton und Alltag:** Situationen, Beispiele und Erklärungen aus dem Alltag der Zielgruppe (bei Kindern: Schule, Familie, Freizeit), Sprache passend zum Alter. `AI_RULES` prüft „Fachbegriffe“ inhaltlich streng; für Kinder evtl. eine mildere Anweisung pro Modul (dann `AI_RULES` modulabhängig machen und mit `tools/ki-test.html` neue Testfälle anlegen).

## Modulverwaltung: Verhalten im Detail

- Neues Gerät: Willkommen-Seite mit Katalog und „Importieren“ (Fortschritt von einem anderen Gerät übernehmen, die enthaltenen Module werden gewählt).
- Fehlt `lernapp.chosen` (alte Installation), werden alle Module mit vorhandenem Lernstand gewählt. Gewählte Keys, die nicht mehr im Katalog stehen, fallen still weg.
- Hinzufügen: Modul laden (ohne Netz Meldung), wählen, hinwechseln. Damit liegt es samt Zusatzinhalten offline vor.
- Entfernen: Rückfrage, Lernstand bleibt, Datei wird aus dem Daten-Cache gelöscht. Das letzte Modul kann nicht entfernt werden. Ist das Modul gerade offen, wird zuerst zum nächsten ladbaren gewechselt; geht das nicht (offline), wird nichts entfernt.
- Die Modulleiste ist auch bei nur einem Modul sichtbar (wegen ＋). Ab 4 Modulen: Auswahlknopf mit ＋ daneben, Auswahlmenü unten mit „Module verwalten“.
- Ist kein gewähltes Modul ladbar: Seite „Module nicht geladen“ mit „Nochmal versuchen“ und „Module verwalten“. Ein kaputtes Modul bleibt gewählt; beim Wechseln dorthin kommt eine Meldung, die übrigen laufen weiter.
- Service Worker: App-Cache `fach-vokabeln-<VERSION>` (wird bei jeder Version ersetzt) und Daten-Cache `fach-vokabeln-daten` (alles unter `modules/` außer `index.json`, übersteht App-Updates). Strategie: sofort aus dem Cache, im Hintergrund aktualisieren, Laden immer mit `cache:"no-cache"` wegen der 10-Minuten-Zwischenspeicherung von GitHub Pages.

## Lernrahmen: Hintergrund und Entscheidungen

Der Lernrahmen (v18–v21, in drei Chats L1–L3 umgesetzt) hat XP, Ränge, Punkte, Tagesbonus, Tagespflicht, Boxen/Profi/Meister, Meister-Regel, Pausen, Verwechslungen, Vormerkungen, Meisterrunde, Ränge-Fenster und Punkte-Erklärung ersetzt. Die Regeln stehen unter „Spielregeln“; hier nur, was beim Weiterbauen wichtig ist:
- **Warum so:** Begriffe sollen verstanden und angewendet werden, nicht an immer denselben Texten wiedererkannt. Die Bremse verhindert Abhaken aus dem Kurzzeitgedächtnis. Keine Strafen, damit Fehler nicht abschrecken.
- **Kein Übergang:** Der alte Lernstand wurde bewusst verworfen. Die `ls`-Schlüssel in `index.json` sind unverändert.
- **Begründete Abweichungen vom ursprünglichen Plan:** Schreiben und Sprechen in Teil A erst nach einer richtigen Antwort (sonst müsste man einen nie gesehenen Begriff sprechen); Teil A bleibt in genau 5 Antworten schaffbar. Antwortmöglichkeiten immer ganz sichtbar (das Anfangsbuchstaben-Spiel hing an den XP-Abzügen). Teil B ohne eigenes Minimum, es ergibt sich aus den Häkchen. Teil-C-Begriffe kommen nur einmal pro Runde. Die KI-Anfrage nutzt kein `responseSchema`, nur den JSON-Modus.
- **Tests** (Muster für künftige Änderungen, Playwright mit `python3 -m http.server`, `service_workers="block"`, Google Fonts blockieren): Stimmen (`speechSynthesis.getVoices`) und Spracherkennung (`SpeechRecognition` **und** `webkitSpeechRecognition`, Chromium hat beide) per Init-Skript nachbilden; Lernstand per Init-Skript in `localStorage` setzen; Bremse mit Lernstand von gestern bzw. `page.clock.install` testen; Gemini mit `context.route` auf `generativelanguage.googleapis.com` nachbilden (richtig, falsch, 429, 400 `API_KEY_INVALID`, kaputtes JSON, `route.abort`, 404 fürs Modell); offline mit `context.set_offline`. Erwartet: keine JS-Fehler (Meldungen zu absichtlich nachgebildeten HTTP-Fehlern und blockierten Schriften sind normal).
- **Inhalte pro Begriff:** Bedeutung, 3 Erklärungen, Beispielsatz + 2 `ex`, 3 `sit`, 2 `tf`, `conf` optional. IT und Agile haben das für alle 1.812 Begriffe. Neue Module brauchen dasselbe (ohne `levels`).

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
| v20 | Pro Frage nur eine Eingabeart (Schreiben ohne 🎤, Sprechen mit gesperrtem Feld bis zur Erkennung, Hinweis über dem Feld). Runde in neuer Kategorie hat 10 Fragen (so viele neue Begriffe wie nötig). Quiz-Karte dunkel im Modul-Schema mit wanderndem Farbschein, Kategorie als Punkt, Rand grün/rot nach der Antwort. Seitenwechsel blenden nur aus und ein statt zu gleiten. Hilfe angepasst |
| v19 | **Lernrahmen L2:** Teil B mit Lückensatz (nur Lesen; jeder Satz, jede Eingabeart), Situation (Lesen/Hören auf Deutsch, jede Eingabeart), Stimmt das? und Unterschied, gemischt abgefragt. Bremse: Teil B frühestens am Tag nach Teil A, Startseite sagt „Heute alles erledigt, morgen geht's weiter mit X Begriffen“. Häkchen von Teil B in Rückmeldung und Nachschlagen, Rundenende mit „Teil B geschafft“, Hilfe ergänzt. Teil C zeigt „kommt bald“ |
| v17 | **IT-Kategorien aufgeteilt:** aus 14 werden 35 Kategorien mit 30–49 Begriffen (nur Index 0 der Begriffe geändert, `extra` unverändert). Die alten Keys bleiben beim Teil, zu dem ihr Krönchen passt, und haben teils neue Namen; 21 neue Kategorien mit eigenen Krönchen-Designs. Neuer Speicherschlüssel `lernapp.progress.dev` (`doc` `progress-dev`): IT startet auf Wunsch des Nutzers bei null, Agile unberührt |
| v21 | **Lernrahmen L3:** Teil C: Begriff in eigenen Worten erklären (schreiben oder diktieren), Google Gemini prüft mit eigenem Schlüssel (Blatt „KI-Prüfung“, Schlüssel nur in `lernapp.aikey`). Bremse B → C, höchstens 2 Teil-C-Fragen pro Runde, Fehlerfälle ohne Wertung, Hinweis auf der Übersicht, wenn Begriffe auf die KI-Prüfung warten. Begriff gelernt, Kategorie gemeistert → Krönchen. Hilfe und Nachschlagen angepasst |
| – | `CLAUDE.md` an den Lernrahmen angepasst: „Was die App ist“, „Spielregeln“ (jetzt der Lernrahmen samt KI-Prüfung), „Code-Landkarte“, „Gespeicherter Fortschritt“, „Datenformat“ (`lang`, `levels` bedeutungslos), „Gestaltung“, „Inhalte schreiben“ und „Neues Modul anlegen“ neu; Abschnitt „Vorhaben ‚Lernrahmen‘“ samt Umsetzungsnotizen L1–L3 zu „Lernrahmen: Hintergrund und Entscheidungen“ gekürzt (keine `VERSION`-Erhöhung) |
| – | Neue Testseite `tools/ki-test.html` für die KI-Prüfung mit echtem Schlüssel (16 Testfälle, eigene Fälle, Ergebnis zum Kopieren). `levels` per Skript aus `modules/dev/module.json` und `modules/agile/module.json` entfernt, sonst unverändert (keine `VERSION`-Erhöhung) |
| – | KI-Prüfung mit echtem Schlüssel getestet: alle 16 Testfälle wie erwartet. „Neues Modul anlegen“ ausgebaut: Ablauf ab der Abstimmung mit dem Nutzer, Checkliste „was jeder Begriff braucht und wofür“, offene Punkte für deutschsprachige Module (keine `VERSION`-Erhöhung) |
| v22 | Quiz-Karte: statt des wandernden Farbscheins graue Wellen im Hintergrund und unten eine Welle in der Modulfarbe (nur `style.css`) |
| v23 | Quiz-Karte nach Vorbild FIFA 10 (Teamauswahl): Band aus sich kreuzenden, langsam wandernden Lichtfäden in Silber und Modulfarbe mit Farbnebel statt der Wellen aus v22 (nur `style.css`) |
| v24 | Quiz-Karte schwebt frei (keine Fläche, kein Rand), Lichtfäden blenden links und rechts weich aus. Nach der Antwort kurzer Schub der Fäden und Übergang der Akzentfarbe nach Grün bzw. Rot. Fäden laufen beim Neuaufbau der Karte nahtlos weiter (`qcDelay`, `qcBurst` in `app.js`) |
| v25 | Lichtfäden als eigenes Element `#qfx` vom Seitenanfang bis unter die Frage; bleiben beim Fragenwechsel stehen, Farbe wechselt per Übergang zu Grün/Rot und wieder zurück, Schub ohne Zurückspringen (`qfxEl`, `qfxFit`, `qfxShow`, `qfxOff` in `app.js`) |
| v26 | Lichtfäden mit fester Höhe (300 px, `--qfx-h`) statt bis unter die Frage (`qfxFit` entfernt); im Normalzustand durchsichtiger (`--qfx-o`), bei richtig/falsch volle Stärke |
| v27 | Lichtfäden als Hintergrund der ganzen App (fest, ganzer Bildschirm, per `transform`); Antworten im Quiz frei schwebend ohne Fläche, nach der Antwort leuchten Fäden hinter richtig (grün) und falsch (rot) auf |
| v28 | Lichtfäden als ein durchgehendes Geflecht statt drei Bündeln, halb so deckend. Hinter richtiger/falscher Antwort färben sich jetzt die Hintergrundfäden selbst (`.qfx-hl`, `qfxTrack`, folgt beim Scrollen) statt eigener Fäden |
| v29 | Lichtfäden wieder nur hinter der Frage (300 px, nur im Quiz), sparsam per `transform`, halbe Deckkraft; Antworten schwebend mit grünem/rotem Schein statt gefärbter Hintergrundfäden. Neuer Glas-Look für alle Flächen und Karten (ohne `backdrop-filter`) |
