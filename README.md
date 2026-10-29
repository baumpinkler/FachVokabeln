# Fach-Vokabeln

Lern-App für Fachbegriffe als installierbare Web-App. Module: IT (1.305 Begriffe), Glasfaser & FTTH (500 Begriffe) und Agile & Projekte (507 Begriffe).

Jeder wählt unter „Module verwalten“ (＋ in der Modulleiste) selbst, welche Module er lernt. Nur die gewählten Module werden geladen und offline gespeichert.

## Ein neues Modul hinzufügen
1. Neuen Ordner `modules/<key>/` anlegen, der Ordnername ist der `key` des Moduls, z. B. `modules/bio/`.
2. Darin `module.json` ablegen (Aufbau wie `modules/ftth/module.json`, vorne `"format":"fachvokabeln-modul","version":1`).
   Optional Zusatzinhalte für schwere Fragearten in `modules/<key>/extra/<kategorie>.json`.
3. In `modules/index.json` einen Eintrag ergänzen: `key`, `name`, `short`, `icon`, `desc` (ein Satz für den Katalog),
   `count` (Zahl der Begriffe, optional), `ls`, `doc`, `accent`, `board`.
   Für neue Module: `ls` = `lernapp.progress.<key>`, `doc` = `progress-<key>`. `ls` muss eindeutig sein und darf sich nie ändern, dort wird der Lernstand gespeichert.
4. Hochladen. Das Modul erscheint beim nächsten Öffnen im Katalog. Eine `VERSION`-Erhöhung ist nicht nötig.

## Updates
Geänderte Dateien einfach hochladen. Die App lädt Neuerungen im Hintergrund und zeigt sie beim nächsten Start.
Soll eine Änderung an der App selbst sofort überall ankommen, in `sw.js` die `VERSION` erhöhen (z. B. "v14").
