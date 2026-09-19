// Fake chrome.* API so the content script can run on the mock page
// (tools/harness/claude-mock.html) without installing the extension.
// Only for local testing and store screenshots. Never shipped.
(function () {
  const params = new URLSearchParams(location.search);
  const lang = params.get("lang") || "en";
  const listeners = [];

  function loadMessages(l) {
    const x = new XMLHttpRequest();
    const base = params.get("platform") === "chatgpt" ? "/build/chatgpt/" : "/extension/";
    x.open("GET", base + "_locales/" + l + "/messages.json", false);
    x.send();
    return JSON.parse(x.responseText);
  }
  const messages = loadMessages(lang);

  function area(name) {
    const key = "shim_" + name;
    const read = () => JSON.parse(localStorage.getItem(key) || "{}");
    return {
      async get(keys) {
        const all = read();
        if (keys == null) return all;
        if (typeof keys === "string") return keys in all ? { [keys]: all[keys] } : {};
        if (Array.isArray(keys)) return Object.fromEntries(keys.filter((k) => k in all).map((k) => [k, all[k]]));
        return Object.fromEntries(Object.entries(keys).map(([k, d]) => [k, k in all ? all[k] : d]));
      },
      async set(obj) {
        const all = read();
        const changes = {};
        for (const [k, v] of Object.entries(obj)) {
          changes[k] = { oldValue: all[k], newValue: JSON.parse(JSON.stringify(v)) };
          all[k] = v;
        }
        localStorage.setItem(key, JSON.stringify(all));
        setTimeout(() => listeners.forEach((fn) => fn(changes, name)), 0);
      },
      async remove(keys) {
        const all = read();
        [].concat(keys).forEach((k) => delete all[k]);
        localStorage.setItem(key, JSON.stringify(all));
      }
    };
  }

  window.chrome = {
    storage: {
      local: area("local"),
      sync: area("sync"),
      onChanged: { addListener: (fn) => listeners.push(fn) }
    },
    i18n: {
      getMessage(key, subs) {
        const m = messages[key];
        if (!m) return "";
        let s = m.message;
        [].concat(subs || []).forEach((v, i) => (s = s.split("$" + (i + 1)).join(v)));
        return s;
      }
    },
    runtime: {
      id: "harness",
      getURL: (p) => (params.get("platform") === "chatgpt" ? "/build/chatgpt/" : "/extension/") + p,
      async sendMessage(msg) {
        if (msg.type === "cf-get-pro") return { pro: params.get("pro") === "1" };
        console.log("[shim] message", msg);
        return undefined;
      }
    }
  };
  if (params.get("pro") === "1") area("local").set({ cf_pro: true });
  if (params.get("reset") === "1") {
    localStorage.removeItem("shim_local");
    localStorage.removeItem("shim_sync");
  }
})();
