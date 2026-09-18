// Toolbar popup: shows Free/Pro status, how many folders you have,
// and buttons to open Claude, upgrade, restore a purchase or open settings.
(async function () {
  "use strict";
  const t = (k, s) => chrome.i18n.getMessage(k, s) || k;
  document.querySelectorAll("[data-i18n]").forEach((el) => (el.textContent = t(el.dataset.i18n)));

  const data = await CFStore.load();
  const chats = data.folders.reduce((n, f) => n + f.chats.length, 0);
  document.getElementById("stats").textContent = t("popupStats", [String(data.folders.length), String(chats)]);

  function showPlan(pro) {
    const plan = document.getElementById("plan");
    plan.textContent = pro ? "Pro" : t("free");
    plan.classList.toggle("pro", pro);
    document.getElementById("free-box").hidden = pro;
    document.getElementById("pro-box").hidden = !pro;
    document.getElementById("limit-text").textContent = t("popupFreeLimit", [String(CFStore.FREE_FOLDER_LIMIT)]);
  }

  showPlan(await CFStore.getPro());
  chrome.runtime.sendMessage({ type: "cf-get-pro", force: true }).then(
    (res) => res && showPlan(res.pro),
    () => {}
  );

  document.getElementById("open").onclick = () => chrome.tabs.create({ url: "https://claude.ai/recents" });
  document.getElementById("upgrade").onclick = () => chrome.runtime.sendMessage({ type: "cf-pay" });
  document.getElementById("manage").onclick = () => chrome.runtime.sendMessage({ type: "cf-pay" });
  document.getElementById("login").onclick = () => chrome.runtime.sendMessage({ type: "cf-login" });
  document.getElementById("options").onclick = () => chrome.runtime.openOptionsPage();
})();
