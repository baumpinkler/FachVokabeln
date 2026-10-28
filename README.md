# Fach-Vokabeln

Lern-App für Fachbegriffe als installierbare Web-App. Module: IT (1.305 Begriffe), Glasfaser & FTTH (500 Begriffe) und Agile & Projekte (198 Begriffe, Ausbau auf 507 geplant).

## Ein neues Modul hinzufügen
1. Neue Datei in `modules/` ablegen, z. B. `modules/elektrotechnik.json` (Aufbau wie `glasfaser.json`).
2. In `modules/index.json` einen Eintrag ergänzen (key, file, name, short, icon, ls, doc, accent, board).
   `ls` muss für jedes Modul eindeutig sein, dort wird der Lernstand gespeichert.
3. Hochladen. Die App zeigt das Modul beim nächsten Öffnen an.

## Updates
Geänderte Dateien einfach hochladen. Die App lädt Neuerungen im Hintergrund und zeigt sie beim nächsten Start.
Soll eine Änderung sofort überall ankommen, in `sw.js` die `VERSION` erhöhen (z. B. "v2").
