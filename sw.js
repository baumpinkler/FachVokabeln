/* Service Worker: macht die App offline-fähig.
   Strategie: Antwort sofort aus dem Speicher, im Hintergrund aktualisieren.
   Nach einem Upload neuer Dateien sieht man die Änderungen beim übernächsten Öffnen.
   Wer eine Änderung sofort erzwingen will, erhöht die VERSION.
   Wichtig: GitHub Pages lässt Dateien 10 Minuten im Browser-Zwischenspeicher liegen.
   Deshalb wird hier immer mit cache:"reload" bzw. "no-cache" geladen, sonst landen alte Dateien im neuen Cache. */
const VERSION = "v11";
const CACHE = "fach-vokabeln-" + VERSION;
const CORE = [
  "./", "index.html", "style.css", "app.js", "manifest.json",
  "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png",
  "modules/index.json"
];

self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(CORE.map(u => new Request(u, {cache: "reload"})));
    /* Alle Module gleich mitladen, damit sie auch offline verfügbar sind */
    try {
      const idx = await (await fetch("modules/index.json", {cache: "reload"})).json();
      await cache.addAll(idx.modules.map(m => new Request("modules/" + m.file, {cache: "reload"})));
    } catch (e) {}
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) if (key !== CACHE) await caches.delete(key);
    await self.clients.claim();
  })());
});

/* Zusatzdateien (modules/extra/…) werden nicht vorab geladen: der Fetch-Handler cacht sie beim ersten Abruf.
   Fehlende Dateien (404) landen nicht im Cache, die App ignoriert sie still. */
self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;
  const isFont = url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com";
  if (!sameOrigin && !isFont) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(req, {ignoreSearch: sameOrigin});
    const network = fetch(req, sameOrigin ? {cache: "no-cache"} : undefined).then(res => {
      if (res && (res.ok || res.type === "opaque")) cache.put(req, res.clone());
      return res;
    }).catch(() => null);
    if (cached) { event.waitUntil(network); return cached; }
    const res = await network;
    if (res) return res;
    if (req.mode === "navigate") return (await cache.match("index.html")) || Response.error();
    return Response.error();
  })());
});
