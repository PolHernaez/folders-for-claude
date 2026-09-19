// Data layer shared by the content script, popup and options page.
// Everything lives in chrome.storage.local. Pro users can turn on sync,
// which mirrors the same data into chrome.storage.sync (split in chunks
// because sync allows max ~8 KB per key and ~100 KB in total).
(function () {
  "use strict";

  const LOCAL_KEY = "cf_data";
  const SYNC_PREFIX = "cf_sync_";
  const SYNC_META = "cf_sync_meta";
  const CHUNK_SIZE = 7000;
  const FREE_FOLDER_LIMIT = 3;
  const COLORS = ["#d97757", "#e0a93b", "#5fa35f", "#4a90d9", "#9b6bd6", "#d45d8c", "#8a8a8a"];

  function emptyData() {
    return { v: 1, updatedAt: 0, folders: [] };
  }

  function uid() {
    return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
  }

  function normalize(data) {
    if (!data || typeof data !== "object" || !Array.isArray(data.folders)) return emptyData();
    data.folders = data.folders
      .filter((f) => f && typeof f.name === "string")
      .map((f) => ({
        id: String(f.id || uid()),
        name: f.name.slice(0, 60),
        color: COLORS.includes(f.color) ? f.color : COLORS[0],
        collapsed: !!f.collapsed,
        chats: Array.isArray(f.chats)
          ? f.chats
              .filter((c) => c && /^[0-9a-f-]{36}$/i.test(c.id))
              .map((c) => ({ id: c.id, title: String(c.title || "").slice(0, 120) }))
          : []
      }));
    data.updatedAt = Number(data.updatedAt) || 0;
    data.v = 1;
    return data;
  }

  async function getSettings() {
    const r = await chrome.storage.local.get({ cf_settings: { sync: false } });
    return r.cf_settings;
  }

  async function setSettings(patch) {
    const current = await getSettings();
    await chrome.storage.local.set({ cf_settings: Object.assign({}, current, patch) });
  }

  async function readSync() {
    const meta = (await chrome.storage.sync.get(SYNC_META))[SYNC_META];
    if (!meta || !meta.chunks) return null;
    const keys = [];
    for (let i = 0; i < meta.chunks; i++) keys.push(SYNC_PREFIX + i);
    const parts = await chrome.storage.sync.get(keys);
    try {
      return normalize(JSON.parse(keys.map((k) => parts[k] || "").join("")));
    } catch (e) {
      return null;
    }
  }

  async function writeSync(data) {
    const json = JSON.stringify(data);
    const chunks = [];
    const enc = new TextEncoder();
    // Chrome measures each item as key + JSON.stringify(value) in UTF-8 bytes,
    // so quotes (escaped) and accents take more space: shrink until it fits.
    for (let i = 0; i < json.length; ) {
      let len = CHUNK_SIZE;
      while (len > 200 && enc.encode(JSON.stringify(json.slice(i, i + len))).length > 8000) len -= 500;
      chunks.push(json.slice(i, i + len));
      i += len;
    }
    const oldMeta = (await chrome.storage.sync.get(SYNC_META))[SYNC_META];
    const payload = { [SYNC_META]: { chunks: chunks.length, updatedAt: data.updatedAt } };
    chunks.forEach((c, i) => (payload[SYNC_PREFIX + i] = c));
    await chrome.storage.sync.set(payload);
    if (oldMeta && oldMeta.chunks > chunks.length) {
      const stale = [];
      for (let i = chunks.length; i < oldMeta.chunks; i++) stale.push(SYNC_PREFIX + i);
      await chrome.storage.sync.remove(stale);
    }
  }

  async function load() {
    const local = normalize((await chrome.storage.local.get(LOCAL_KEY))[LOCAL_KEY]);
    const settings = await getSettings();
    if (!settings.sync) return local;
    try {
      const remote = await readSync();
      if (remote && remote.updatedAt > local.updatedAt) {
        await chrome.storage.local.set({ [LOCAL_KEY]: remote });
        return remote;
      }
    } catch (e) {
      console.warn("[Folders] sync read failed", e);
    }
    return local;
  }

  // Returns { ok: true } or { ok: false, error } (e.g. sync quota exceeded).
  async function save(data) {
    data.updatedAt = Date.now();
    await chrome.storage.local.set({ [LOCAL_KEY]: data });
    const settings = await getSettings();
    if (!settings.sync) return { ok: true };
    try {
      await writeSync(data);
      return { ok: true };
    } catch (e) {
      console.warn("[Folders] sync write failed", e);
      return { ok: false, error: "sync" };
    }
  }

  async function getPro() {
    const r = await chrome.storage.local.get({ cf_pro: false });
    return !!r.cf_pro;
  }

  const api = {
    LOCAL_KEY,
    FREE_FOLDER_LIMIT,
    COLORS,
    emptyData,
    uid,
    normalize,
    load,
    save,
    getSettings,
    setSettings,
    writeSync,
    getPro
  };

  (typeof self !== "undefined" ? self : window).CFStore = api;
})();
