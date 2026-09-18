// Settings page: turn on cross-device sync (Pro), and export/import a JSON
// backup of your folders (free for everyone — your data is yours).
(async function () {
  "use strict";
  const t = (k, s) => chrome.i18n.getMessage(k, s) || k;
  document.querySelectorAll("[data-i18n]").forEach((el) => (el.textContent = t(el.dataset.i18n)));
  const $ = (id) => document.getElementById(id);
  const status = (msg) => {
    $("status").textContent = msg;
    setTimeout(() => ($("status").textContent = ""), 4000);
  };

  let pro = await CFStore.getPro();
  try {
    const res = await chrome.runtime.sendMessage({ type: "cf-get-pro", force: true });
    if (res) pro = res.pro;
  } catch (e) {
    /* offline: keep cached value */
  }

  $("plan").textContent = pro ? "Pro" : t("free");
  $("plan").classList.toggle("pro", pro);

  const settings = await CFStore.getSettings();
  $("sync").checked = pro && settings.sync;
  $("sync").disabled = !pro;
  $("upgrade").hidden = pro;
  $("upgrade").onclick = () => chrome.runtime.sendMessage({ type: "cf-pay" });

  $("sync").onchange = async () => {
    const on = $("sync").checked;
    await CFStore.setSettings({ sync: on });
    if (on) {
      try {
        // Merge: whichever copy is newer wins (load() handles that), then push it.
        const data = await CFStore.load();
        await CFStore.writeSync(data);
        status(t("syncOn"));
      } catch (e) {
        $("sync").checked = false;
        await CFStore.setSettings({ sync: false });
        status(t("syncFull"));
      }
    } else {
      status(t("syncOff"));
    }
  };

  $("export").onclick = async () => {
    const data = await CFStore.load();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "folders-for-claude-backup-" + new Date().toISOString().slice(0, 10) + ".json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };

  $("import").onclick = () => $("file").click();
  $("file").onchange = async () => {
    const file = $("file").files[0];
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      const data = CFStore.normalize(parsed);
      if (!pro && data.folders.length > CFStore.FREE_FOLDER_LIMIT) {
        status(t("importTooMany", [String(CFStore.FREE_FOLDER_LIMIT)]));
        data.folders = data.folders.slice(0, CFStore.FREE_FOLDER_LIMIT);
      }
      await CFStore.save(data);
      status(t("importDone", [String(data.folders.length)]));
    } catch (e) {
      status(t("importError"));
    }
    $("file").value = "";
  };
})();
