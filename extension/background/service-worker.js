// Background service worker.
// - Talks to ExtensionPay (Stripe) to know if the user paid.
// - Caches the result in chrome.storage.local ("cf_pro") so the content
//   script works offline and doesn't hit the network on every page load.
// - Opens the payment / login pages when the UI asks for them.
importScripts("../lib/ExtPay.js");

// ⚠️ Must match the extension ID you register at https://extensionpay.com
const EXTPAY_ID = "mapph-claude-folders";

const extpay = ExtPay(EXTPAY_ID);
extpay.startBackground();

const PRO_CACHE_MS = 6 * 60 * 60 * 1000; // re-check every 6 hours

async function refreshPro(force) {
  const { cf_pro_checked = 0, cf_pro = false } = await chrome.storage.local.get(["cf_pro_checked", "cf_pro"]);
  if (!force && Date.now() - cf_pro_checked < PRO_CACHE_MS) return cf_pro;
  try {
    const user = await ExtPay(EXTPAY_ID).getUser();
    const pro = !!user.paid;
    await chrome.storage.local.set({ cf_pro: pro, cf_pro_checked: Date.now() });
    if (!pro) {
      // Sync is a Pro feature: switch it off if the subscription ended.
      const { cf_settings } = await chrome.storage.local.get("cf_settings");
      if (cf_settings && cf_settings.sync) {
        await chrome.storage.local.set({ cf_settings: Object.assign({}, cf_settings, { sync: false }) });
      }
    }
    return pro;
  } catch (e) {
    // Offline or ExtensionPay down: keep the last known value.
    console.warn("[Folders for Claude] could not reach ExtensionPay", e);
    return cf_pro;
  }
}

extpay.onPaid.addListener(async () => {
  await chrome.storage.local.set({ cf_pro: true, cf_pro_checked: Date.now() });
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (!msg || typeof msg.type !== "string") return;
  const pay = ExtPay(EXTPAY_ID);
  if (msg.type === "cf-get-pro") {
    refreshPro(!!msg.force).then((pro) => sendResponse({ pro }));
    return true; // async response
  }
  if (msg.type === "cf-pay") pay.openPaymentPage();
  if (msg.type === "cf-login") pay.openLoginPage();
});

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    // Show the user where the feature lives right after installing.
    chrome.tabs.create({ url: "https://claude.ai/recents" });
  }
});
