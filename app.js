
/* ---------- Module ---------- */
/* Module werden aus modules/*.json geladen */
let MODULES = {};
const norm = s => s.toLowerCase().replace(/[^a-z0-9äöüß]/g, "");
function buildTerms(raw){
  return raw.map(r => {
    const t = {cat:r[0], en:r[1], de:r[2], expl:r[3], exEn:r[4], exDe:r[5], id:r[1].toLowerCase().replace(/[^a-z0-9]+/g,"-")};
    t.expls = [r[3], r[6], r[7]].filter(Boolean);
    t.deCloze = Array.isArray(r[8]) ? r[8] : null;
    t.giveaway = norm(t.de).includes(norm(t.en));
    const m = /^(der|die|das) ([^\/(]+?)\s*(\/|\(|$)/.exec(t.de);
    t.art = (m && !/\(Plural\)/.test(t.de)) ? {a:m[1], noun:m[2].trim()} : null;
    return t;
  });
}
let MODKEY = "dev", MOD, CATS, TERMS;

const levels = () => MOD.levels;
const DAILY_GOAL = 50;

/* ---------- Helfer ---------- */
const $ = s => document.querySelector(s);
const app = $("#app");
const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const escRe = s => s.replace(/[.*+?^${}()|[\]\\\/]/g, "\\$&");
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const dayStr = d => d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
const today = () => dayStr(new Date());
const yesterday = () => { const d = new Date(); d.setDate(d.getDate() - 1); return dayStr(d); };
const termRe = t => new RegExp("(^|[^A-Za-z0-9])(" + escRe(t.en.replace(/^to /, "")) + ")(?![A-Za-z0-9])", "i");
function cloze(t){ const re = termRe(t); return re.test(t.exEn) ? t.exEn.replace(re, "$1_____") : null; }
function clozeDe(t){
  if (!t.deCloze) return t.exDe;
  let out = "", rest = t.exDe;
  for (const part of t.deCloze) { const i = rest.indexOf(part); if (i < 0) return t.exDe; out += rest.slice(0, i) + "_____"; rest = rest.slice(i + part.length); }
  return out + rest;
}
/* Anfangsbuchstabe einer Antwort: Artikel und „to“ zählen nicht mit */
const KEY_RE = /^((?:(?:der|die|das)(?:\/(?:der|die|das))?\s+)|(?:to\s+))?([^A-Za-zÄÖÜäöüß0-9]*)(.)/i;
function keyLetter(label){ const m = String(label).match(KEY_RE); return m ? m[3].normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : ""; }
function shortLabel(label){ const m = String(label).match(KEY_RE); return m ? (m[1] || "") + m[2] + m[3] + "…" : label; }
function highlight(t){ return esc(t.exEn).replace(termRe(t), "$1<mark>$2</mark>"); }
const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Fortschritt (pro Modul getrennt) ---------- */
const MODULE_KEY = "devvokabeln.module";
function freshProgress(){ return {xp:0, boxes:{}, streak:0, lastDay:null, day:null, dayXp:0, cats:Object.keys(CATS), flags:{}, quizLog:{}, xpLog:{}, penaltyLog:{}, checkedUntil:null, updatedAt:0}; }
function fixCats(){ P.cats = (P.cats || []).filter(k => CATS[k]); if (!P.cats.length) P.cats = Object.keys(CATS); }
let P;
let cloudBase = null, cloudRef = null, saveTimer = null, cloud = false;

/* ---------- Module laden (PWA: jedes Modul ist eine eigene JSON-Datei) ---------- */
const MODULE_ORDER = [];
async function loadIndex(){
  const r = await fetch("modules/index.json", {cache:"no-cache"});
  const idx = await r.json();
  for (const m of idx.modules) { MODULES[m.key] = Object.assign(MODULES[m.key] || {}, m); if (!MODULE_ORDER.includes(m.key)) MODULE_ORDER.push(m.key); }
}
async function ensureModule(key){
  const m = MODULES[key];
  if (!m) throw new Error("Unbekanntes Modul: " + key);
  if (!m.raw) { const r = await fetch("modules/" + m.file); Object.assign(m, await r.json()); }
  return m;
}
function applyTheme(t){
  const root = document.documentElement;
  for (const [k, v] of Object.entries(t || {})) root.style.setProperty("--" + k, v);
  const meta = document.querySelector('meta[name="theme-color"]'); if (meta && t && t.board) meta.content = t.board;
  try { localStorage.setItem("lernapp.theme", JSON.stringify(t || {})); } catch (e) {}
}
function loadModule(key){
  MODKEY = MODULES[key] && MODULES[key].raw ? key : MODULE_ORDER.find(k => MODULES[k].raw); MOD = MODULES[MODKEY]; CATS = MOD.cats;
  document.documentElement.dataset.mod = MODKEY; applyTheme(MOD.theme);
  TERMS = MOD.terms || (MOD.terms = buildTerms(MOD.raw));
  P = freshProgress();
  try { const s = localStorage.getItem(MOD.ls); if (s) P = Object.assign(freshProgress(), JSON.parse(s)); } catch(e) {}
  fixCats();
  try { localStorage.setItem(MODULE_KEY, MODKEY); } catch(e) {}
  cloudRef = cloudBase ? cloudBase.db.doc("data/users/" + cloudBase.id + "/" + MOD.doc) : null;
}
async function switchModule(key){
  if (key === MODKEY) return;
  clearTimeout(saveTimer); pushCloud();
  try { await ensureModule(key); } catch (e) { toast("Modul konnte nicht geladen werden. Bist du offline?"); return; }
  loadModule(key); renderTop(); renderHome(); window.scrollTo(0,0);
  syncCloud();
}
function save(){
  P.updatedAt = Date.now();
  try { localStorage.setItem(MOD.ls, JSON.stringify(P)); } catch(e) {}
  clearTimeout(saveTimer); saveTimer = setTimeout(pushCloud, 1200);
}
async function pushCloud(retry, ref, data){
  ref = ref || cloudRef; if (!ref) return;
  data = data || JSON.parse(JSON.stringify(P));
  try { await ref.set(data); }
  catch(e){
    if (e && e.code === "unavailable" && !retry) setTimeout(() => pushCloud(true, ref, data), 700 + Math.random()*1200);
    else if (e && ["invalid_argument","revoked","not_granted","capability_disabled"].includes(e.code)) { cloudBase = null; cloudRef = null; cloud = false; }
  }
}
async function syncCloud(){
  const ref = cloudRef, key = MODKEY; if (!ref) return;
  try {
    const snap = await ref.get();
    if (key !== MODKEY) return;
    if (snap.exists) {
      const r = snap.data() || {};
      if ((r.updatedAt || 0) > (P.updatedAt || 0)) {
        P = Object.assign(freshProgress(), r); fixCats();
        try { localStorage.setItem(MOD.ls, JSON.stringify(P)); } catch(e) {}
        renderTop(); if (screen === "home") renderHome();
      } else if ((P.updatedAt || 0) > (r.updatedAt || 0)) pushCloud();
    } else if (P.updatedAt) pushCloud();
  } catch(e) {}
}
async function connectCloud(){
  try {
    if (!window.claude || !window.claude.use) return;
    const [db, user] = await Promise.all([window.claude.use("db"), window.claude.use("user")]);
    if (!db || !user) return;
    const id = await user.id(); if (!id) return;
    cloudBase = {db, id}; cloud = true;
    cloudRef = db.doc("data/users/" + id + "/" + MOD.doc);
    await syncCloud();
    if (screen === "home") renderHome();
  } catch(e) {}
}

/* Tagespflicht: mindestens 3 abgeschlossene Quiz pro Tag (pro Modul), sonst −200 XP */
const QUIZ_GOAL = 3, QUIZ_PENALTY = 200;
/* Tagesbonus für fleißige Tage: 4.–9. Quiz +25, 10. Quiz +50, ab dem 11. +20 */
const dayBonus = n => n >= 11 ? 20 : n === 10 ? 50 : n >= 4 ? 25 : 0;
const parseDay = d => { const [y, m, dd] = d.split("-").map(Number); return new Date(y, m - 1, dd); };
const quizzesToday = () => (P.quizLog && P.quizLog[today()]) || 0;
function dailyCheck(){
  P.quizLog = P.quizLog || {};
  const y = yesterday();
  if (!P.checkedUntil) { P.checkedUntil = y; save(); return; }
  if (P.checkedUntil === y || parseDay(P.checkedUntil) >= parseDay(y)) return;
  const d = parseDay(P.checkedUntil); d.setDate(d.getDate() + 1);
  const missed = [];
  for (let n = 0; n < 400 && d <= parseDay(y); n++, d.setDate(d.getDate() + 1)) {
    const key = dayStr(d), cnt = P.quizLog[key] || 0;
    if (cnt < QUIZ_GOAL) missed.push({day:key, cnt});
  }
  P.checkedUntil = y;
  P.penaltyLog = P.penaltyLog || {};
  for (const m of missed) P.penaltyLog[m.day] = QUIZ_PENALTY;
  if (missed.length) {
    const loss = missed.length * QUIZ_PENALTY;
    P.xp = Math.max(0, P.xp - loss);
    const one = missed.length === 1 && missed[0].day === y;
    P.penalty = {on:today(), text: one
      ? `Gestern ${missed[0].cnt} von ${QUIZ_GOAL} Quiz gemacht: −${loss} XP.`
      : `An ${missed.length} Tagen weniger als ${QUIZ_GOAL} Quiz gemacht: −${loss} XP.`};
  }
  save();
}
function levelInfo(xp){
  const LV = levels();
  let i = 0; while (i + 1 < LV.length && xp >= LV[i+1][0]) i++;
  const cur = LV[i][0], next = LV[i+1] ? LV[i+1][0] : null;
  return {i, name:LV[i][1], cur, next, pct: next ? (xp - cur) / (next - cur) * 100 : 100};
}
/* Kalender: Quiz und XP pro Tag (pro Modul, unbegrenzt gespeichert) */
let calMonth = null, calSel = null;
function showCalendar(){
  let dlg = $("#cal");
  if (!dlg) { dlg = document.createElement("dialog"); dlg.id = "cal"; dlg.className = "sheet"; document.body.appendChild(dlg);
    dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); }); }
  if (!calMonth) { const n = new Date(); calMonth = new Date(n.getFullYear(), n.getMonth(), 1); }
  calSel = calSel || today();
  renderCalendar(dlg);
  openDialog(dlg);
}
function dayInfo(key){
  const q = (P.quizLog || {})[key] || 0, xp = (P.xpLog || {})[key] || 0, pen = (P.penaltyLog || {})[key] || 0;
  const isToday = key === today(), future = parseDay(key) > parseDay(today());
  const state = future ? "future" : pen ? "miss" : q >= QUIZ_GOAL ? "ok" : isToday ? "open" : q ? "partial" : "none";
  return {q, xp, pen, isToday, future, state};
}
function renderCalendar(dlg){
  const y = calMonth.getFullYear(), m = calMonth.getMonth();
  const first = new Date(y, m, 1), days = new Date(y, m + 1, 0).getDate();
  const lead = (first.getDay() + 6) % 7;
  const fmt = n => (n > 0 ? "+" : n < 0 ? "−" : "±") + Math.abs(n);
  let sumQ = 0, sumXP = 0, okDays = 0, missDays = 0, cells = "";
  for (let i = 0; i < lead; i++) cells += `<div class="cal-cell empty"></div>`;
  for (let d = 1; d <= days; d++) {
    const key = dayStr(new Date(y, m, d)), I = dayInfo(key);
    sumQ += I.q; sumXP += I.xp - I.pen; if (I.state === "ok") okDays++; if (I.state === "miss") missDays++;
    const net = I.xp - I.pen;
    cells += `<button class="cal-cell ${I.state}${I.isToday ? " today" : ""}${key === calSel ? " sel" : ""}" data-day="${key}" ${I.future ? "disabled" : ""}
      aria-label="${d}. ${I.q} Quiz, ${fmt(net)} XP">
      <span class="cal-d">${d}</span>${I.future || (!I.q && !net) ? "" : `<span class="cal-q">${I.q}×</span><span class="cal-x">${fmt(net)}</span>`}</button>`;
  }
  const monthName = first.toLocaleDateString("de-AT", {month:"long", year:"numeric"});
  const now = new Date(), isCur = y === now.getFullYear() && m === now.getMonth();
  const S = calSel ? dayInfo(calSel) : null;
  const selText = S ? `<b>${parseDay(calSel).toLocaleDateString("de-AT", {weekday:"long", day:"numeric", month:"long"})}</b>: ${S.q} Quiz · ${fmt(S.xp)} XP verdient${S.pen ? ` · −${S.pen} XP Abzug (Tagespflicht verfehlt)` : ""}${S.state === "ok" ? " · Pflicht erfüllt ✓" : S.state === "open" ? ` · heute noch ${Math.max(0, QUIZ_GOAL - S.q)} Quiz offen` : ""}` : "";
  dlg.innerHTML = `<div class="lv-head"><h2>Kalender</h2><button class="back" id="calClose" aria-label="Schließen">✕</button></div>
    <p class="lv-sub">${esc(MOD.name)} · Quiz und XP pro Tag</p>
    <div class="cal-nav"><button class="back" id="calPrev" aria-label="Voriger Monat">‹</button><b>${esc(monthName)}</b><button class="back" id="calNext" aria-label="Nächster Monat" ${isCur ? "disabled" : ""}>›</button></div>
    <div class="cal-grid">${["Mo","Di","Mi","Do","Fr","Sa","So"].map(w => `<div class="cal-wd">${w}</div>`).join("")}${cells}</div>
    <p class="cal-sel" role="status">${selText}</p>
    <div class="cal-sum"><span><b>${sumQ}</b> Quiz</span><span><b>${fmt(sumXP)}</b> XP</span><span><b>${okDays}</b> Tage erfüllt</span><span><b>${missDays}</b> verfehlt</span></div>
    <div class="cal-legend"><span><i class="lg-ok"></i>Pflicht erfüllt</span><span><i class="lg-miss"></i>verfehlt (−${QUIZ_PENALTY})</span><span><i class="lg-today"></i>heute</span></div>`;
  dlg.querySelector("#calClose").onclick = () => dlg.close();
  dlg.querySelector("#calPrev").onclick = () => { calMonth = new Date(y, m - 1, 1); renderCalendar(dlg); };
  dlg.querySelector("#calNext").onclick = () => { if (!isCur) { calMonth = new Date(y, m + 1, 1); renderCalendar(dlg); } };
  dlg.querySelectorAll("[data-day]").forEach(b => b.onclick = () => { calSel = b.dataset.day; renderCalendar(dlg); });
}
/* ---------- Fortschritt exportieren / importieren (beide Module in einer Datei) ---------- */
const EXPORT_FORMAT = "lernapp-fortschritt";
async function readModuleProgress(k){
  if (k === MODKEY) return JSON.parse(JSON.stringify(P));
  let local = null, remote = null;
  try { const s = localStorage.getItem(MODULES[k].ls); if (s) local = JSON.parse(s); } catch(e) {}
  if (cloudBase) { try { const snap = await cloudBase.db.doc("data/users/" + cloudBase.id + "/" + MODULES[k].doc).get(); if (snap.exists) remote = snap.data(); } catch(e) {} }
  if (local && remote) return (remote.updatedAt || 0) > (local.updatedAt || 0) ? remote : local;
  return local || remote || null;
}
async function buildExport(){
  const modules = {};
  for (const k of Object.keys(MODULES)) { const d = await readModuleProgress(k); if (d) modules[k] = d; }
  return {format:EXPORT_FORMAT, version:1, exportedAt:new Date().toISOString(),
    modules, summary:Object.fromEntries(Object.entries(modules).map(([k, d]) => [k, {name:MODULES[k].name, xp:d.xp || 0, terms:Object.keys(d.boxes || {}).length}]))};
}
function sheet(id){
  let dlg = $("#" + id);
  if (!dlg) { dlg = document.createElement("dialog"); dlg.id = id; dlg.className = "sheet"; document.body.appendChild(dlg);
    dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); }); }
  return dlg;
}
async function showExport(){
  const dlg = sheet("exportDlg");
  dlg.innerHTML = `<div class="lv-head"><h2>Fortschritt exportieren</h2><button class="back" data-x aria-label="Schließen">✕</button></div><p class="lv-sub">Wird vorbereitet …</p>`;
  dlg.querySelector("[data-x]").onclick = () => dlg.close();
  openDialog(dlg);
  const data = await buildExport(), json = JSON.stringify(data);
  const fname = "lernapp-fortschritt-" + today() + ".json";
  const sum = Object.values(data.summary).map(m => `<li><b>${esc(m.name)}</b>: ${m.xp.toLocaleString("de-DE")} XP, ${m.terms} Begriffe mit Lernstand</li>`).join("");
  dlg.innerHTML = `<div class="lv-head"><h2>Fortschritt exportieren</h2><button class="back" data-x aria-label="Schließen">✕</button></div>
    <p class="lv-sub">Enthält Lernstand, XP, Kalender, Vormerkungen und Themenauswahl aller Module.</p>
    <ul class="exp-sum">${sum || "<li>Noch kein Fortschritt vorhanden.</li>"}</ul>
    <div class="backup-row"><button class="btn primary" id="expSave">Als Datei speichern</button><button class="btn" id="expCopy">Text kopieren</button></div>
    <p class="exp-status" role="status"></p>
    <details class="exp-raw"><summary>Text anzeigen (zum manuellen Kopieren)</summary><textarea readonly rows="6">${esc(json)}</textarea></details>`;
  const status = t => { dlg.querySelector(".exp-status").textContent = t; };
  dlg.querySelector("[data-x]").onclick = () => dlg.close();
  dlg.querySelector("#expSave").onclick = async () => {
    try {
      const dl = window.claude && window.claude.use ? await window.claude.use("downloads") : null;
      if (dl) { await dl.save({filename:fname, data:json}); status("Gespeichert: " + fname); return; }
    } catch (e) { if (e && e.code === "declined") { status("Speichern abgebrochen."); return; } }
    try {
      const url = URL.createObjectURL(new Blob([json], {type:"application/json"}));
      const a = document.createElement("a"); a.href = url; a.download = fname; document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
      status("Download gestartet: " + fname + ". Falls nichts passiert, nutze „Text kopieren“.");
    } catch (e) { status("Speichern ist hier nicht möglich. Nutze „Text kopieren“."); }
  };
  dlg.querySelector("#expCopy").onclick = async () => {
    try { await navigator.clipboard.writeText(json); status("Kopiert. Füge den Text z. B. in eine Notiz oder Mail an dich selbst ein."); }
    catch (e) { const ta = dlg.querySelector("textarea"); dlg.querySelector(".exp-raw").open = true; ta.focus(); ta.select(); status("Automatisches Kopieren ist hier gesperrt: Der Text ist markiert, kopiere ihn manuell."); }
  };
}
function showImport(){
  const dlg = sheet("importDlg");
  dlg.innerHTML = `<div class="lv-head"><h2>Fortschritt importieren</h2><button class="back" data-x aria-label="Schließen">✕</button></div>
    <p class="lv-sub">Wähle eine Exportdatei oder füge den exportierten Text ein. Der aktuelle Fortschritt der enthaltenen Module wird ersetzt.</p>
    <label class="btn file-btn">Datei auswählen<input type="file" accept=".json,application/json" hidden></label>
    <textarea rows="5" placeholder="… oder exportierten Text hier einfügen"></textarea>
    <div class="backup-row"><button class="btn primary" id="impGo">Importieren</button></div>
    <p class="exp-status" role="status"></p>`;
  const status = t => { dlg.querySelector(".exp-status").textContent = t; };
  const ta = dlg.querySelector("textarea");
  dlg.querySelector("[data-x]").onclick = () => dlg.close();
  dlg.querySelector("input[type=file]").onchange = async e => { const f = e.target.files[0]; if (f) { ta.value = await f.text(); status("Datei geladen: " + f.name); } };
  dlg.querySelector("#impGo").onclick = () => {
    let data; try { data = JSON.parse(ta.value); } catch (e) { status("Das ist kein gültiger Export."); return; }
    if (!data || data.format !== EXPORT_FORMAT || !data.modules) { status("Das ist kein Export dieser Lern-App."); return; }
    const ks = Object.keys(data.modules).filter(k => MODULES[k]);
    if (!ks.length) { status("Der Export enthält keine bekannten Module."); return; }
    const names = ks.map(k => `${MODULES[k].name} (${(data.modules[k].xp || 0).toLocaleString("de-DE")} XP)`).join(", ");
    if (!confirm(`Fortschritt ersetzen durch: ${names}?`)) return;
    const now = Date.now();
    for (const k of ks) {
      const d = Object.assign({}, data.modules[k], {updatedAt:now});
      try { localStorage.setItem(MODULES[k].ls, JSON.stringify(d)); } catch (e) {}
      if (cloudBase) { try { cloudBase.db.doc("data/users/" + cloudBase.id + "/" + MODULES[k].doc).set(d); } catch (e) {} }
    }
    loadModule(MODKEY); renderTop(); dlg.close(); renderHome(); toast("Fortschritt importiert ✅");
  };
  openDialog(dlg);
}
function showModulePicker(){
  const dlg = sheet("modDlg");
  dlg.innerHTML = `<div class="lv-head"><h2>Lernmodul wählen</h2><button class="back" data-x aria-label="Schließen">✕</button></div>
    <div class="mod-list">${MODULE_ORDER.map(k => { const m = MODULES[k];
      return `<button class="mod-item${k === MODKEY ? " cur" : ""}" data-pick="${k}" style="--ac:${m.accent || "var(--accent)"}"><span class="mod-ic" aria-hidden="true">${m.icon}</span><span>${esc(m.name)}</span></button>`; }).join("")}</div>`;
  dlg.querySelector("[data-x]").onclick = () => dlg.close();
  dlg.querySelectorAll("[data-pick]").forEach(b => b.onclick = () => { dlg.close(); switchModule(b.dataset.pick); });
  openDialog(dlg);
}
function showHelp(){
  let dlg = $("#help");
  if (!dlg) { dlg = document.createElement("dialog"); dlg.id = "help"; document.body.appendChild(dlg);
    dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); }); }
  const row = (a, b, cls = "") => `<div class="hp-row ${cls}"><span>${a}</span><b>${b}</b></div>`;
  dlg.innerHTML = `<div class="lv-head"><h2>So funktionieren die Punkte</h2><button class="back" id="helpClose" aria-label="Schließen">✕</button></div>
    <p class="lv-sub">XP gibt es nur im Quiz. Jedes Modul hat eigene XP, eigene Ränge und eine eigene Tagespflicht.</p>
    <section class="hp"><h3>Pro Antwort im Quiz</h3>
      ${row("Richtige Antwort", "+5 XP", "plus")}
      ${row("Falsche Antwort", "−2 XP", "minus")}
      ${row("Falsche Antwort bei einem Profi-Begriff ⭐", "−10 XP", "minus")}
      ${row("„Ganz anzeigen“ antippen", "−1 XP", "minus")}
      ${row("Falsch, ohne vorher „Ganz anzeigen“ zu nutzen", "zusätzlich −2 XP", "minus")}
      <p class="hp-note">Bei „Welche Erklärung passt?“ sind die Antworten immer ganz sichtbar, daher gibt es dort keinen Zusatzabzug.</p></section>
    <section class="hp"><h3>Pro Tag</h3>
      ${row(`Tagespflicht: mindestens ${QUIZ_GOAL} abgeschlossene Quiz`, "sonst −" + QUIZ_PENALTY + " XP", "minus")}
      ${row("4. bis 9. Quiz des Tages", "je +25 XP", "plus")}
      ${row("10. Quiz des Tages", "+50 XP", "plus")}
      ${row("Ab dem 11. Quiz des Tages", "je +20 XP", "plus")}
      <p class="hp-note">Nur Quiz, die bis zum Ergebnis gespielt werden, zählen. Versäumte Tage werden beim nächsten Öffnen abgezogen, jeder Tag einzeln. Zehn Quiz an einem Tag bringen 200 XP Bonus und gleichen damit einen versäumten Tag aus. Der Kreis „Quiz heute“ öffnet den Kalender.</p></section>
    <section class="hp"><h3>Lernstand eines Begriffs</h3>
      ${row("Fünfmal richtig beantwortet", "sitzt → Profi-Begriff ⭐")}
      ${row("Profi-Begriff zehnmal in Folge richtig", "gemeistert 🏆")}
      ${row("Fehler bei einem Profi-Begriff", "Profi-Fortschritt auf 0")}
      <p class="hp-note">Karteikarten bringen keine XP und ändern den Lernstand nicht. Mit „Nochmal üben 📌“ kommt ein Begriff im nächsten Quiz bevorzugt dran.</p></section>
    <section class="hp"><h3>Ränge</h3>
      ${row("Anzahl Ränge", "20")}
      ${row("Höchster Rang", "ab 50.000 XP")}
      <p class="hp-note">XP fallen nie unter 0, aber man kann durch Abzüge einen Rang absteigen. Ein Tipp auf den Rang oder den XP-Balken zeigt alle Ränge.</p></section>`;
  dlg.querySelector("#helpClose").onclick = () => dlg.close();
  openDialog(dlg); dlg.scrollTop = 0;
}
function showLevels(){
  let dlg = $("#levels");
  if (!dlg) { dlg = document.createElement("dialog"); dlg.id = "levels"; document.body.appendChild(dlg);
    dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); }); }
  const L = levelInfo(P.xp), LV = levels();
  dlg.innerHTML = `<div class="lv-head"><h2>Alle Ränge</h2><button class="back" id="lvClose" aria-label="Schließen">✕</button></div>
    <p class="lv-sub">${esc(MOD.name)} · du hast <b>${P.xp} XP</b>${L.next ? ` · noch ${L.next - P.xp} XP bis „${esc(LV[L.i + 1][1])}“` : " · höchster Rang erreicht"}</p>
    <ol class="lv-list">${LV.map(([x, n], k) => `<li class="${k < L.i ? "done" : k === L.i ? "cur" : ""}">
      <span class="lv-num">${k + 1}</span><span class="lv-name">${esc(n)}${k === L.i ? ` <span class="lv-you">du</span>` : ""}</span>
      <span class="lv-xp">${k < L.i ? "✓ " : ""}${x.toLocaleString("de-DE")} XP</span></li>`).join("")}</ol>`;
  dlg.querySelector("#lvClose").onclick = () => dlg.close();
  openDialog(dlg);
  dlg.scrollTop = 0;
}
function addXP(n){
  const before = levelInfo(P.xp).i;
  const t = today();
  if (P.day !== t) { P.day = t; P.dayXp = 0; }
  if (P.lastDay !== t) { P.streak = (P.lastDay === yesterday()) ? P.streak + 1 : 1; P.lastDay = t; }
  const old = P.xp;
  P.xp = Math.max(0, P.xp + n); P.dayXp = Math.max(0, P.dayXp + n);
  P.xpLog = P.xpLog || {}; P.xpLog[t] = (P.xpLog[t] || 0) + (P.xp - old);
  const after = levelInfo(P.xp);
  if (after.i > before) { confetti(); toast("Aufgestiegen: " + after.name + " 🎉"); }
  else if (after.i < before) toast("Abgestiegen: " + after.name);
  renderTop();
}
const own = (o, k) => !!o && Object.prototype.hasOwnProperty.call(o, k);
const box = t => (own(P.boxes, t.id) && +P.boxes[t.id]) || 0;
const seen = t => Object.prototype.hasOwnProperty.call(P.boxes, t.id);
function setBox(t, v){ P.boxes[t.id] = Math.max(0, Math.min(MAX_BOX, v)); }
/* Lernstand: 0–4 = lernen, 5 = sitzt → Profi-Begriff, 5–14 = Profi-Fortschritt, 15 = Profi gemeistert */
const SIT = 5, PRO_GOAL = 10, MAX_BOX = SIT + PRO_GOAL;
const isPro = t => box(t) >= SIT;
const proProg = t => Math.max(0, box(t) - SIT);
const isMaster = t => box(t) >= MAX_BOX;
function setFocus(on){ document.body.classList.toggle("focus", on); }

function pool(){ return TERMS.filter(t => P.cats.includes(t.cat)); }
function weighted(list, weight, n){
  let cand = list.map(t => ({t, w:weight(t)})); const out = [];
  while (out.length < n && cand.length) {
    let r = Math.random() * cand.reduce((s,c) => s + c.w, 0), k = 0;
    while (k < cand.length - 1 && r > cand[k].w) { r -= cand[k].w; k++; }
    out.push(cand[k].t); cand.splice(k, 1);
  }
  return out;
}
/* Mischung pro Runde: Wiederholung von noch nicht sicheren Begriffen, ein bereits sicherer, Rest neu. */
/* Vormerkungen aus den Karteikarten: kommen im nächsten Quiz bevorzugt, bis sie dort richtig beantwortet werden. */
const isFlagged = t => own(P.flags, t.id);
function setFlag(t, on){ P.flags = P.flags || {}; if (on) P.flags[t.id] = 1; else delete P.flags[t.id]; }
/* Quiz-Auswahl mit Abständen: jeder Begriff merkt sich, in welcher Quizrunde er zuletzt dran war */
const lastRound = t => (P.last && own(P.last, t.id)) ? P.last[t.id] : null;
const sinceAsked = t => { const l = lastRound(t); return l === null ? Infinity : (P.round || 0) - l; };
function gapFor(t){
  if (isMaster(t)) return 25;                       /* gemeistert: nur gelegentlich zur Auffrischung */
  if (isPro(t)) return 2 + Math.floor(proProg(t) / 2); /* Profi: 2 bis 6 Runden Pause, wächst mit dem Fortschritt */
  return 2;                                         /* in Arbeit: frühestens jede zweite Runde */
}
const isDue = t => sinceAsked(t) >= gapFor(t);
function pickQuizTerms(n){
  const p = pool(), out = [];
  const take = (list, k) => { for (const t of list) { if (k <= 0 || out.length >= n) break; if (!out.includes(t)) { out.push(t); k--; } } };
  const oldestFirst = list => shuffle(list).sort((a, b) => sinceAsked(b) - sinceAsked(a));
  const fresh = shuffle(p.filter(t => lastRound(t) === null && !isFlagged(t)));
  const reserveFresh = Math.min(fresh.length, 3);   /* mindestens 3 neue Begriffe pro Runde, solange es welche gibt */
  const cap = n - reserveFresh;
  const takeCapped = (list, k) => take(list, Math.max(0, Math.min(k, cap - out.length)));
  takeCapped(shuffle(p.filter(isFlagged)), 3);
  takeCapped(oldestFirst(p.filter(t => lastRound(t) !== null && !isPro(t) && isDue(t))), 4);
  takeCapped(oldestFirst(p.filter(t => isPro(t) && !isMaster(t) && isDue(t))), 2);
  takeCapped(oldestFirst(p.filter(t => isMaster(t) && isDue(t))), 1);
  take(fresh, n - out.length);
  take(oldestFirst(p.filter(t => !isMaster(t) && isDue(t))), n - out.length);
  take(oldestFirst(p.filter(t => !isMaster(t))), n - out.length);
  take(oldestFirst(p), n - out.length);
  return shuffle(out);
}
function pickTerms(n, preferFlagged){
  const p = pool();
  const out = preferFlagged ? weighted(p.filter(isFlagged), () => 1, Math.ceil(n * .5)) : [];
  const rest = a => a.filter(t => !out.includes(t));
  const learning = rest(p).filter(t => seen(t) && box(t) < SIT);
  const pro = rest(p).filter(t => isPro(t) && !isMaster(t));
  const master = rest(p).filter(isMaster);
  const fresh = rest(p).filter(t => !seen(t));
  out.push(...weighted(learning, t => SIT + 1 - box(t), Math.min(learning.length, Math.ceil(n * .5))));
  out.push(...weighted(pro, () => 1, Math.min(pro.length, Math.ceil(n * .3))));
  out.push(...weighted(master, () => 1, Math.min(master.length, 1)));
  out.push(...shuffle(fresh).slice(0, Math.max(0, n - out.length)));
  if (out.length < n) out.push(...weighted(p.filter(t => !out.includes(t)), t => MAX_BOX + 1 - box(t), n - out.length));
  return shuffle(out);
}
function distractors(t, field){
  const clash = c => { const a = c.en.toLowerCase(), b = t.en.toLowerCase(); return a.includes(b) || b.includes(a); };
  const same = shuffle(TERMS.filter(c => c.cat === t.cat));
  const other = shuffle(TERMS.filter(c => c.cat !== t.cat));
  const out = [], used = new Set([keyLetter(t[field])]);
  for (const c of same.concat(other)) {
    if (out.length >= 4) break;
    const k = keyLetter(c[field]);
    if (c.id === t.id || clash(c) || used.has(k) || c[field] === t[field] || out.some(o => o[field] === c[field])) continue;
    out.push(c); used.add(k);
  }
  return out;
}

/* ---------- Sprachausgabe ---------- */
const canSpeak = "speechSynthesis" in window;
function speak(text, lang){
  if (!canSpeak) return;
  try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text); u.lang = lang || "en-US"; u.rate = .9; speechSynthesis.speak(u); } catch(e) {}
}
const speakBtn = (text, label, lang) => canSpeak ? `<button class="speak" data-speak="${esc(text)}" data-lang="${lang || "en-US"}" aria-label="Vorlesen">🔊 ${label || "anhören"}</button>` : "";
document.addEventListener("click", e => { const b = e.target.closest("[data-speak]"); if (b) { e.stopPropagation(); speak(b.dataset.speak, b.dataset.lang); } });

/* ---------- UI-Effekte ---------- */
function toast(msg){
  const old = document.querySelector(".toast"); if (old) old.remove();
  const d = document.createElement("div"); d.className = "toast"; d.textContent = msg; document.body.appendChild(d);
  setTimeout(() => d.remove(), 2400);
}
function confetti(){
  if (reduced()) return;
  const cols = ["#FFDA5C","#FFA3BA","#8FE3C3","#A2CDFF","#CDB9FF","#FFB677"];
  for (let i = 0; i < 44; i++) {
    const c = document.createElement("div"); c.className = "confetti";
    c.style.left = Math.random() * 100 + "vw"; c.style.background = cols[i % cols.length];
    c.style.animationDelay = Math.random() * .4 + "s"; c.style.animationDuration = 1.2 + Math.random() * .9 + "s";
    document.body.appendChild(c); setTimeout(() => c.remove(), 2600);
  }
}

/* ---------- Kopfzeile ---------- */
function renderTop(){
  const L = levelInfo(P.xp);
  const dayXp = P.day === today() ? P.dayXp : 0;
  const qd = quizzesToday(), pct = Math.min(100, Math.round(qd / QUIZ_GOAL * 100));
  $("#top").innerHTML = `
    ${MODULE_ORDER.length <= 3
      ? `<div class="modswitch" role="tablist" aria-label="Lernmodul wählen" style="grid-template-columns:repeat(${MODULE_ORDER.length},1fr)">${MODULE_ORDER.map(k => { const m = MODULES[k];
          return `<button role="tab" aria-selected="${k === MODKEY}" data-mod="${k}"><span aria-hidden="true">${m.icon}</span> ${esc(m.short)}</button>`; }).join("")}</div>`
      : `<button class="modpick" id="modPick" aria-haspopup="dialog"><span aria-hidden="true">${MOD.icon}</span> ${esc(MOD.name)} <span class="rank-more" aria-hidden="true">▾</span></button>`}
    <button class="help-btn" id="helpBtn" aria-haspopup="dialog" aria-label="So funktioniert das Punkte-System" title="So funktioniert das Punkte-System">?</button>
    <button class="rank" id="rankBtn" aria-haspopup="dialog" title="Alle Ränge anzeigen">
      <div class="rank-name">${esc(L.name)} <span class="rank-more" aria-hidden="true">›</span></div>
      <div class="xpbar" role="progressbar" aria-valuenow="${Math.round(L.pct)}" aria-valuemin="0" aria-valuemax="100" aria-label="Fortschritt zum nächsten Level"><i style="width:${L.pct}%"></i></div>
      <div class="xp-text">${P.xp} XP${L.next ? " · noch " + (L.next - P.xp) + " bis zum nächsten Level" : " · Höchstes Level erreicht"}</div>
    </button>
    <button class="badge" id="calBtn" aria-haspopup="dialog" title="Kalender öffnen · Tagespflicht: ${QUIZ_GOAL} Quiz, sonst −${QUIZ_PENALTY} XP"><div class="ring" style="--p:${pct}"><span>${Math.min(qd, 99)}/${QUIZ_GOAL}</span></div>Quiz heute</button>`;
  $("#top").querySelectorAll("[data-mod]").forEach(b => b.onclick = () => switchModule(b.dataset.mod));
  const mp = $("#modPick"); if (mp) mp.onclick = showModulePicker;
  $("#rankBtn").onclick = showLevels;
  $("#helpBtn").onclick = showHelp;
  $("#calBtn").onclick = () => showCalendar();
}

/* ---------- Startseite ---------- */
let screen = "home";
/* Zurück-Taste (Android/Browser): Fenster und Bereiche bekommen einen Verlaufseintrag */
let ignorePop = 0;
function navPush(kind){ try { history.pushState({nav:kind}, ""); } catch (e) {} }
function navEnterScreen(){ if (!(history.state && history.state.nav)) navPush("screen"); }
function openDialog(dlg){
  if (!dlg.open) { dlg.showModal(); navPush("dialog"); }
  if (!dlg.dataset.nav) {
    dlg.dataset.nav = "1";
    dlg.addEventListener("close", () => { if (dlg.dataset.popClose) { delete dlg.dataset.popClose; return; } if (history.state && history.state.nav === "dialog") { ignorePop++; history.back(); } });
  }
}
window.addEventListener("popstate", () => {
  if (ignorePop > 0) { ignorePop--; return; }
  const open = [...document.querySelectorAll("dialog[open]")];
  if (open.length) { open.forEach(d => { d.dataset.popClose = "1"; d.close(); }); return; }
  if (screen !== "home") renderHome(true);
});
function renderHome(fromPop){
  if (fromPop !== true && history.state && history.state.nav === "screen") { ignorePop++; try { history.back(); } catch (e) { ignorePop--; } }
  screen = "home";
  setFocus(false); dailyCheck(); renderTop();
  const all = TERMS.length, known = TERMS.filter(isPro).length, masters = TERMS.filter(isMaster).length, started = TERMS.filter(seen).length;
  const rows = Object.entries(CATS).map(([k,c]) => {
    const ts = TERMS.filter(t => t.cat === k), m = ts.filter(isPro).length;
    return `<div class="mrow" style="--c:${c.c}"><div>${esc(c.name)}<div class="mbar"><i style="width:${m/ts.length*100}%"></i></div></div><div class="mnum">${m} / ${ts.length}</div></div>`;
  }).join("");
  const allOn = P.cats.length === Object.keys(CATS).length;
  app.innerHTML = `
    <h1>${esc(MOD.name)}</h1>
    <p class="lead">${known} von ${all} Begriffen sitzen, davon ${masters} als gemeisterte Profi-Begriffe. ${started} hast du schon gesehen. Ein Begriff sitzt, wenn du ihn im Quiz fünfmal richtig hattest. Dann wird er zum Profi-Begriff und braucht zehn richtige Antworten in Folge; ein Fehler setzt diesen Fortschritt auf null.</p>
    ${P.penalty && P.penalty.on === today() ? `<div class="penalty" role="status">⚠️ ${esc(P.penalty.text)}</div>` : ""}
    <div class="modes">
      <button class="note mode" style="--c:var(--m2);--r:.9deg" data-go="quiz"><span class="emoji" aria-hidden="true">⚡</span><h2>Quiz</h2><p>10 Fragen mit je 5 Antworten, meist zuerst nur die Anfangsbuchstaben.</p></button>
      <button class="note mode" style="--c:var(--m1);--r:-1.2deg" data-go="cards"><span class="emoji" aria-hidden="true">🗂️</span><h2>Karteikarten</h2><p>Begriff ansehen, umdrehen, ehrlich einschätzen. Zum Üben, ohne XP.</p></button>
      <button class="note mode" style="--c:var(--m3);--r:-.6deg" data-go="lex"><span class="emoji" aria-hidden="true">📖</span><h2>Nachschlagen</h2><p>Alle ${all} Begriffe mit Artikel, Erklärung und Beispielsätzen.</p></button>
    </div>
    <div class="section-title">Themen zum Üben</div>
    <div class="chips">${Object.entries(CATS).map(([k,c]) => `<button class="chip" style="--c:${c.c}" aria-pressed="${P.cats.includes(k)}" data-cat="${k}"><span class="dot"></span>${esc(c.name)}</button>`).join("")}
      <button class="chip-all" id="allcats">${allOn ? "Nur eines wählen" : "Alle auswählen"}</button></div>
    <div class="section-title">Was schon sitzt</div>
    <div class="mastery">${rows}</div>
    <div class="section-title">Fortschritt sichern</div>
    <div class="backup-row"><button class="btn" id="expBtn">⬇️ Exportieren</button><button class="btn" id="impBtn">⬆️ Importieren</button></div>
    <p class="foot">${cloud ? "Dein Fortschritt wird in deinem Konto gespeichert." : "Dein Fortschritt wird auf diesem Gerät gespeichert."} Der Export enthält alle Module.</p>`;
  $("#expBtn").onclick = showExport;
  $("#impBtn").onclick = showImport;
  app.querySelectorAll("[data-go]").forEach(b => b.onclick = () => ({cards:startCards, quiz:startQuiz, lex:renderLex})[b.dataset.go]());
  app.querySelectorAll("[data-cat]").forEach(b => b.onclick = () => {
    const k = b.dataset.cat, on = P.cats.includes(k);
    if (on && P.cats.length === 1) { toast("Mindestens ein Thema muss aktiv bleiben."); return; }
    P.cats = on ? P.cats.filter(x => x !== k) : P.cats.concat(k);
    save(); renderHome();
  });
  $("#allcats").onclick = () => { P.cats = allOn ? [Object.keys(CATS)[0]] : Object.keys(CATS); save(); renderHome(); if (allOn) toast("Tippe jetzt die Themen an, die du üben willst."); };
}

/* ---------- Karteikarten ---------- */
let F = null;
function startCards(){
  const ts = pickTerms(10);
  F = {queue:ts, total:ts.length, done:0, known:0, again:new Set(), flipped:false, anim:""};
  screen = "cards"; setFocus(true); navEnterScreen(); renderCard(); window.scrollTo(0,0);
}
function renderCard(){
  if (!F.queue.length) return renderCardsDone();
  const t = F.queue[0], c = CATS[t.cat];
  const face = F.flipped ? `
      <div class="cat-label">${esc(t.en)}</div>
      <div class="de">${esc(t.de)}</div>
      <p class="expl">${esc(t.expl)}</p>
      <div class="ex">
        <div class="ex-label">Englisch</div>
        <div class="en">${highlight(t)}</div>
        <div class="ex-label">So sagt man es im deutschen Arbeitsalltag</div>
        <div class="tr">${esc(t.exDe)}</div>
        <div>${speakBtn(t.exEn, "Englisch")} ${speakBtn(t.exDe, "Deutsch", "de-DE")}</div>
      </div>
      <div class="hint">↺ Tippe auf die Karte, um sie zurückzudrehen.</div>` : `
      <div class="cat-label">${esc(c.name)}${seen(t) ? "" : " · neu"}${isFlagged(t) ? " · 📌 fürs Quiz vorgemerkt" : ""}</div>
      <div class="term">${esc(t.en)}</div>
      <div>${speakBtn(t.en)}</div>
      <div class="hint">Was bedeutet das, und welcher Artikel passt im Deutschen? Überleg kurz und tippe dann auf die Karte.</div>`;
  app.innerHTML = `
    <div class="bar"><button class="back" aria-label="Zurück zur Übersicht" data-home>✕</button>
      <div class="progress" aria-label="Fortschritt"><i style="width:${F.done/F.total*100}%"></i></div></div>
    <div class="note card ${F.flipped ? "is-back" : ""} ${F.anim}" style="--c:${c.c}" id="card" role="button" tabindex="0" aria-label="${F.flipped ? "Karte zurückdrehen" : "Karte umdrehen"}">${face}</div>
    ${F.flipped ? `<div class="actions"><button class="btn warn" id="again">Nochmal üben 📌</button><button class="btn primary" id="knew">Wusste ich</button></div>` : ""}`;
  F.anim = "";
  const flip = () => {
    const toBack = !F.flipped;
    const go = () => { F.flipped = toBack; F.anim = reduced() ? "" : "turn-in"; renderCard(); const k = $(toBack ? "#knew" : "#card"); if (k) k.focus({preventScroll:true}); };
    if (reduced()) return go();
    const el = $("#card"); el.classList.add("turn-out"); setTimeout(go, 160);
  };
  $("#card").onclick = e => { if (!e.target.closest("[data-speak]")) flip(); };
  $("#card").onkeydown = e => { if (e.target.id === "card" && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); flip(); } };
  if ($("#knew")) $("#knew").onclick = () => {
    const first = !F.again.has(t.id);
    if (!seen(t)) setBox(t, 0); if (first) F.known++;
    F.queue.shift(); F.done++; F.flipped = false; save(); renderCard();
  };
  if ($("#again")) $("#again").onclick = () => {
    if (!seen(t)) setBox(t, 0); setFlag(t, true);
    F.queue.shift();
    if (!F.again.has(t.id)) { F.again.add(t.id); F.total++; F.queue.push(t); }
    F.done++; F.flipped = false; save(); renderCard();
  };
  app.querySelector("[data-home]").onclick = renderHome;
}
function renderCardsDone(){
  const missed = TERMS.filter(t => F.again.has(t.id));
  app.innerHTML = `<div class="result">
    <h1>Stapel durch!</h1>
    <div class="note" style="--c:var(--m1);--r:-1deg"><div class="big-num">${F.known}</div><div>Begriffe auf Anhieb gewusst</div></div>
    ${missed.length ? `<div class="missed"><strong>Fürs nächste Quiz vorgemerkt 📌</strong><p style="margin:4px 0 6px;font-size:.9rem">Sie kommen dort bevorzugt dran, bis du sie richtig beantwortest.</p><ul>${missed.map(t => `<li><b>${esc(t.en)}</b> = ${esc(t.de)}</li>`).join("")}</ul></div>` : ""}
    <div class="stack"><button class="btn primary wide" id="more">Neuen Stapel ziehen</button><button class="btn wide" data-home>Zur Übersicht</button></div></div>`;
  $("#more").onclick = startCards; app.querySelector("[data-home]").onclick = renderHome; window.scrollTo(0,0);
}

/* ---------- Quiz ---------- */
let Q = null;
function makeQuestion(t){
  const types = ["def2en", "en2def"];
  if (!t.giveaway) types.push("en2de","de2en");
  if (cloze(t)) types.push("cloze","cloze");
  const type = types[Math.floor(Math.random() * types.length)];
  const field = type === "en2de" ? "de" : "en";
  const pick = o => o.expls[Math.floor(Math.random() * o.expls.length)];
  const expl = pick(t);
  /* en2def: Begriff wird gezeigt, die passende Erklärung ist zu wählen – Antworten sind immer vollständig sichtbar */
  if (type === "en2def") return {t, type, expl, full:true,
    opts:shuffle([t].concat(distractors(t, "en"))).map(o => ({id:o.id, label:o.id === t.id ? expl : pick(o)})), answer:t.id};
  return {t, type, expl, opts:shuffle([t].concat(distractors(t, field))).map(o => ({id:o.id, label:o[field]})), answer:t.id};
}
function startQuiz(){
  const ts = pickQuizTerms(10);
  if (ts.length < 5) { toast("Wähle Themen mit mindestens 5 Begriffen."); return; }
  P.round = (P.round || 0) + 1; save();
  Q = {items:ts.map(makeQuestion), i:0, combo:0, best:0, xp:0, right:0, missed:[], answered:null, hint:false, revealed:false, counted:false};
  screen = "quiz"; setFocus(true); navEnterScreen(); renderQuiz(); window.scrollTo(0,0);
}
function renderQuiz(){
  const q = Q.items[Q.i], t = q.t, c = CATS[t.cat];
  let ask, body;
  if (q.type === "en2de") { ask = "Wie sagt man das im Deutschen?"; body = `<div class="q-big">${esc(t.en)}</div>${speakBtn(t.en)}`; }
  else if (q.type === "de2en") { ask = "Wie heißt das auf Englisch?"; body = `<div class="q-big">${esc(t.de)}</div>`; }
  else if (q.type === "def2en") { ask = "Welcher Begriff ist gemeint?"; body = `<div class="q-mid">${esc(q.expl)}</div>`; }
  else if (q.type === "en2def") { ask = "Welche Erklärung passt?"; body = `<div class="q-big">${esc(t.en)}</div>${speakBtn(t.en)}`; }
  else { ask = "Welches Wort fehlt im Satz?"; body = `<div class="q-mid">${esc(cloze(t))}</div><div class="q-hint">${Q.hint ? esc(clozeDe(t)) : `<button id="hint">Deutschen Satz zeigen</button>`}</div>`; }
  const a = Q.answered;
  const opts = q.opts.map((o, k) => {
    let cls = "opt";
    if (a) { if (o.id === q.answer) cls += " right"; else if (a.pick === k) cls += " wrong"; else cls += " dim"; }
    const full = a || Q.revealed || q.full;
    return `<button class="${cls}${full ? "" : " short"}${q.full ? " long" : ""}" data-k="${k}" ${a ? 'aria-disabled="true"' : ""} aria-label="${esc(full ? o.label : "Antwort mit " + shortLabel(o.label))}">${esc(full ? o.label : shortLabel(o.label))}</button>`;
  }).join("");
  const last = Q.i === Q.items.length - 1;
  const fb = a ? `<div class="feedback tap-next" id="fbox" style="--fb:var(${a.ok ? "--ok" : "--bad"})">
      <h3>${a.ok ? `Richtig! +${a.gain} XP` : `Leider nicht. −${-a.gain} XP`}</h3>
      ${a.note ? `<p><b>${esc(a.note)}</b></p>` : ""}
      <p><b>${esc(t.en)}</b> = ${esc(t.de)}</p>
      <p>${esc(q.type === "def2en" || q.type === "en2def" ? q.expl : t.expl)}</p>
      <p class="fb-ex"><i>${highlight(t)}</i><br>${esc(t.exDe)}</p>
      <div>${speakBtn(t.exEn, "Englisch")} ${speakBtn(t.exDe, "Deutsch", "de-DE")}</div>
    </div>
    <button class="btn primary wide" id="next">${last ? "Ergebnis ansehen" : "Weiter"}</button>` : "";
  app.innerHTML = `
    <div class="bar"><button class="back" aria-label="Quiz beenden" data-home>✕</button>
      <div class="progress"><i style="width:${(Q.i + (a ? 1 : 0)) / Q.items.length * 100}%"></i></div>
      <span class="xp-chip" aria-label="XP in dieser Runde">${Q.xp >= 0 ? "+" : "−"}${Math.abs(Q.xp)} XP</span>
</div>
    <div class="note${a ? " tap-next" : ""}${(a ? a.wasPro : isPro(t)) ? " pro-card" : ""}${(a ? a.wasMaster : isMaster(t)) ? " master-card" : ""}" id="qcard" style="--c:${c.c};--r:${Q.i % 2 ? .8 : -.8}deg"${a ? ` title="Weiter zur nächsten Frage"` : ""}>
      <div class="cat-label">${esc(c.name)} · Frage ${Q.i + 1} von ${Q.items.length}</div>
      <div class="q-ask">${ask}</div>${body}
    </div>
    ${!a && !Q.revealed && !q.full ? `<div class="reveal-row"><button class="btn" id="reveal">Ganz anzeigen <span class="cost">−1 XP</span></button></div>` : ""}
    <div class="opts">${opts}</div>${fb}`;
  app.querySelector("[data-home]").onclick = () => { if (Q.xp || Q.i) save(); renderHome(); };
  const h = $("#hint"); if (h) h.onclick = () => { Q.hint = true; renderQuiz(); };
  const rv = $("#reveal"); if (rv) rv.onclick = () => { Q.revealed = true; Q.xp -= 1; addXP(-1); save(); renderQuiz(); };
  if (!a) app.querySelectorAll(".opt").forEach(b => b.onclick = () => answer(+b.dataset.k));

  else {
    const n = $("#next"); n.onclick = nextQuestion; n.focus({preventScroll:true});
    /* Klick auf die Quizkarte = Weiter; Knöpfe in der Karte (Deutschen Satz zeigen, Anhören) behalten ihre Funktion */
    /* Nach der Antwort: Karte, Antworten und Info-Box führen ebenfalls weiter (kurze Sperre gegen Doppeltipps) */
    const go = e => { if (Date.now() - (a.at || 0) < 350) return; nextQuestion(); };
    $("#qcard").onclick = e => { if (e.target.closest("button, a, [data-speak]")) return; go(e); };
    $("#fbox").onclick = e => { if (e.target.closest("button, a, [data-speak]")) return; go(e); };
    app.querySelectorAll(".opt").forEach(b => b.onclick = go);
  }
}
function answer(k){
  const q = Q.items[Q.i], ok = q.opts[k].id === q.answer;
  const t = q.t, wasPro = isPro(t), wasMaster = isMaster(t);
  P.last = P.last || {}; P.last[t.id] = P.round || 0;
  let gain, note = "";
  if (ok) {
    Q.combo++; Q.best = Math.max(Q.best, Q.combo); Q.right++; setFlag(t, false);
    gain = 5;
    if (!seen(t)) setBox(t, 0);
    if (!isMaster(t)) setBox(t, box(t) + 1);
    if (!wasPro && isPro(t)) { note = "Der Begriff sitzt und ist jetzt ein Profi-Begriff ⭐"; toast("Neuer Profi-Begriff ⭐"); }
    else if (wasPro && !wasMaster && isMaster(t)) { note = "Profi-Begriff gemeistert! 🏆"; confetti(); }
    else if (wasPro && !isMaster(t)) note = `Profi-Fortschritt: ${proProg(t)} / ${PRO_GOAL}`;
    else if (!wasPro) note = `Lernstand: ${box(t)} / ${SIT}`;
  } else {
    Q.combo = 0; Q.missed.push(t);
    if (wasPro) { gain = -10; setBox(t, SIT); note = `Profi-Fortschritt zurück auf 0 / ${PRO_GOAL}.`; }
    else { gain = -2; if (!seen(t)) setBox(t, 0); }
    if (!Q.revealed && !q.full) { gain -= 2; note = (note ? note + " " : "") + "Inklusive −2 XP, weil ohne „Ganz anzeigen“ geantwortet."; }
  }
  Q.xp += gain; addXP(gain);
  Q.answered = {pick:k, ok, gain, note, wasPro, wasMaster, at:Date.now()}; save(); renderQuiz();
}
function nextQuestion(){
  if (Q.i === Q.items.length - 1) return renderQuizDone();
  Q.i++; Q.answered = null; Q.hint = false; Q.revealed = false; renderQuiz(); window.scrollTo(0,0);
}
function renderQuizDone(){
  const asked = Q.i + 1, perfect = Q.right === Q.items.length;
  if (perfect) confetti();
  if (!Q.counted) {
    Q.counted = true; P.quizLog = P.quizLog || {};
    P.quizLog[today()] = quizzesToday() + 1;
    Q.bonus = dayBonus(quizzesToday());
    if (Q.bonus) addXP(Q.bonus);
    save();
    if (quizzesToday() === QUIZ_GOAL) { confetti(); toast(`Tagespflicht erfüllt: ${QUIZ_GOAL} Quiz ✅`); }
    else if (quizzesToday() === 10) { confetti(); toast("10 Quiz an einem Tag! +50 XP 🎉"); }
  }
  const nb = dayBonus(quizzesToday() + 1);
  const qd = quizzesToday();
  const title = perfect ? "Fehlerfrei!" : "Runde geschafft";
  app.innerHTML = `<div class="result">
    <h1>${title}</h1>
    <div class="note" style="--c:var(--m2);--r:1deg"><div class="big-num">${Q.right} / ${asked}</div>
      <div>richtig · ${Q.xp >= 0 ? "+" : "−"}${Math.abs(Q.xp)} XP · längste Serie ${Q.best}</div>
      <div>${qd >= QUIZ_GOAL ? `Tagespflicht erfüllt (${qd} Quiz heute).` : `Quiz heute: ${qd} von ${QUIZ_GOAL}. Noch ${QUIZ_GOAL - qd}, sonst morgen −${QUIZ_PENALTY} XP.`}</div>
      ${Q.bonus ? `<div><b>Tagesbonus für dein ${qd}. Quiz: +${Q.bonus} XP</b></div>` : ""}
      ${nb ? `<div>Nächste Runde bringt +${nb} XP Tagesbonus.</div>` : ""}</div>
    ${Q.missed.length ? `<div class="missed"><strong>Diese Begriffe kommen bald wieder:</strong><ul>${Q.missed.map(t => `<li><b>${esc(t.en)}</b> = ${esc(t.de)}</li>`).join("")}</ul></div>` : ""}
    <div class="stack"><button class="btn primary wide" id="more">Noch eine Runde</button><button class="btn wide" data-home>Zur Übersicht</button></div></div>`;
  $("#more").onclick = startQuiz; app.querySelector("[data-home]").onclick = renderHome; window.scrollTo(0,0);
}

/* ---------- Nachschlagen ---------- */
function proTag(t){
  if (!isPro(t)) return "";
  return isMaster(t) ? `<span class="pro-tag done">🏆 Profi gemeistert</span>` : `<span class="pro-tag">⭐ Profi ${proProg(t)}/${PRO_GOAL}</span>`;
}
const lexDots = t => isPro(t)
  ? `<span class="prodots" aria-label="Profi-Fortschritt ${proProg(t)} von ${PRO_GOAL}">${Array.from({length:PRO_GOAL}, (_, n) => `<i class="${proProg(t) > n ? "f" : ""}"></i>`).join("")}</span>`
  : `<span class="boxdots" aria-label="Lernstand ${box(t)} von ${SIT}">${[1,2,3,4,5].map(n => `<i class="${box(t) >= n ? "f" : ""}"></i>`).join("")}</span>`;
const lexItem = t => `
  <details class="${isPro(t) ? "is-pro" : ""} ${isMaster(t) ? "is-master" : ""}"><summary><span class="s-en">${isFlagged(t) ? `<span aria-label="fürs Quiz vorgemerkt">📌 </span>` : ""}${esc(t.en)}${proTag(t)}${lexDots(t)}</span><span class="s-de">${esc(t.de)}</span></summary>
  <div class="lex-body">${t.expls.length > 1 ? `<ol class="expls">${t.expls.map(e => `<li>${esc(e)}</li>`).join("")}</ol>` : `<p>${esc(t.expl)}</p>`}<div class="ex"><div class="en">${highlight(t)}</div><div class="tr">${esc(t.exDe)}</div>${speakBtn(t.exEn, "Englisch")} ${speakBtn(t.exDe, "Deutsch", "de-DE")}</div></div></details>`;
function renderLex(){
  screen = "lex"; setFocus(true); navEnterScreen();
  app.innerHTML = `
    <div class="bar"><button class="back" aria-label="Zurück zur Übersicht" data-home>✕</button><h2 style="font-size:1.4rem">Nachschlagen</h2></div>
    <input class="search" id="q" type="search" placeholder="Suchen, englisch oder deutsch" aria-label="Begriffe durchsuchen">
    <div id="lexlist"></div>`;
  app.querySelector("[data-home]").onclick = renderHome;
  const draw = () => {
    const s = $("#q").value.trim().toLowerCase();
    let html;
    if (!s) {
      html = Object.entries(CATS).map(([k,c]) => {
        const ts = TERMS.filter(t => t.cat === k), n = ts.length, pn = ts.filter(isPro).length;
        return `<div class="lex-group" style="--c:${c.c}"><details data-lexcat="${k}"><summary><h3><span class="dot"></span>${esc(c.name)}<span class="lex-count">${pn ? `⭐ ${pn} · ` : ""}${n}</span></h3></summary><div class="lex-items"></div></details></div>`;
      }).join("");
    } else {
      const hits = TERMS.filter(t => (t.en + " " + t.de + " " + t.expls.join(" ")).toLowerCase().includes(s));
      html = hits.length ? `<div class="lex-group">${hits.slice(0, 80).map(lexItem).join("")}${hits.length > 80 ? `<p class="empty">${hits.length - 80} weitere Treffer. Such genauer, um sie zu sehen.</p>` : ""}</div>`
                         : `<p class="empty">Kein Begriff passt zu „${esc(s)}“.</p>`;
    }
    $("#lexlist").innerHTML = html;
    app.querySelectorAll("[data-lexcat]").forEach(d => d.addEventListener("toggle", () => {
      const box = d.querySelector(".lex-items");
      if (d.open && !box.innerHTML) box.innerHTML = TERMS.filter(t => t.cat === d.dataset.lexcat).sort((a,b) => (isPro(b) - isPro(a)) || a.en.localeCompare(b.en)).map(lexItem).join("");
    }));
  };
  $("#q").oninput = draw; draw(); window.scrollTo(0,0);
}

/* ---------- Start ---------- */
async function boot(){
  try {
    await loadIndex();
    let startKey = MODULE_ORDER[0];
    try { const s = localStorage.getItem(MODULE_KEY); if (s && MODULES[s]) startKey = s; } catch (e) {}
    await ensureModule(startKey);
    loadModule(startKey);
    renderTop(); renderHome();
  } catch (e) {
    $("#app").innerHTML = `<div class="boot-error"><h1>Laden fehlgeschlagen</h1><p>Die Lerndaten konnten nicht geladen werden. Prüfe die Internetverbindung und öffne die App erneut. Beim allerersten Start ist eine Verbindung nötig, danach funktioniert sie auch offline.</p></div>`;
    console.error(e);
  }
}
boot();
/* Offline-Fähigkeit: Service Worker registrieren und nach einem Update einmal neu laden */
if ("serviceWorker" in navigator && location.protocol !== "file:") {
  /* Nur bei einem echten Update neu laden, nicht bei der allerersten Installation */
  const hadController = !!navigator.serviceWorker.controller;
  let reloaded = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => { if (hadController && !reloaded && screen === "home") { reloaded = true; location.reload(); } });
  window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
}

