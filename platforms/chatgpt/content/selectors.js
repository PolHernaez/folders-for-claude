// ChatGPT version of selectors.js: everything that depends on chatgpt.com's HTML.
// ChatGPT's class names are generated and change often, so instead of fixed
// classes we locate the chat list from its links (/c/<id>) and walk up to the
// block that contains all of them. Every function returns null/[] instead of
// throwing when something is missing.
(function () {
  "use strict";

  // Matches /c/<uuid> and project chats like /g/g-p-abc-name/c/<uuid>.
  const CHAT_ID_RE = /\/c\/([0-9a-f-]{36})/i;
  const CHAT_LINK = 'a[href*="/c/"]';
  // Links of the main history list (project chats live in another section).
  const HISTORY_LINK = 'a[href^="/c/"]';

  function visible(el) {
    return el && el.getBoundingClientRect().width >= 120;
  }

  function getSidebar() {
    const navs = [...document.querySelectorAll("nav")].filter(visible);
    // Prefer the nav that actually holds the chat history.
    return navs.find((n) => n.querySelector(HISTORY_LINK)) || null;
  }

  // Short text block with no links: the "Chats" / "Your chats" title above the list.
  function looksLikeHeading(el) {
    if (!el || el.querySelector("a")) return false;
    const text = (el.textContent || "").trim();
    return text.length > 0 && text.length <= 40 && el.getBoundingClientRect().height <= 48;
  }

  // Returns { parent, before } to insert our panel above the chat history, or null.
  function getMountPoint() {
    const sidebar = getSidebar();
    if (!sidebar) return null;
    const links = sidebar.querySelectorAll(HISTORY_LINK);
    if (!links.length) return null;
    // Walk up from the first chat link to the smallest block that contains every
    // history link and sits next to other blocks (menu items, headings...).
    let el = links[0];
    while (el.parentElement && el.parentElement !== sidebar) {
      const parent = el.parentElement;
      const holdsAll = el.querySelectorAll(HISTORY_LINK).length === links.length;
      const hostId = "cf-folders-host";
      const siblings = [...parent.children].filter((c) => c !== el && c.id !== hostId);
      if (holdsAll && siblings.length) break;
      el = parent;
    }
    if (!el.parentElement) return null;
    // Put the folders above the list's title ("Recents"/"Chats"), not between the
    // title and the list. Purely structural (no screen positions), so our own panel
    // moving around can never change the answer.
    let before = el;
    let prev = el.previousElementSibling;
    if (prev && prev.id === "cf-folders-host") prev = prev.previousElementSibling;
    if (prev && looksLikeHeading(prev)) before = prev;
    return { parent: before.parentElement, before };
  }

  function chatIdFromHref(href) {
    const m = CHAT_ID_RE.exec(href || "");
    return m ? m[1].toLowerCase() : null;
  }

  function currentChatId() {
    return chatIdFromHref(location.pathname);
  }

  // Tab title is the chat title (sometimes followed by " | ChatGPT").
  function currentChatTitle() {
    const t = (document.title || "").replace(/\s*[-–|]\s*ChatGPT\s*$/i, "").trim();
    return t && !/^chatgpt\b/i.test(t) ? t : "";
  }

  // All chats visible on the page (sidebar, projects, search results), deduplicated.
  function visibleChats(excludeRoot) {
    const out = new Map();
    document.querySelectorAll(CHAT_LINK).forEach((a) => {
      if (excludeRoot && excludeRoot.contains(a)) return;
      const id = chatIdFromHref(a.getAttribute("href"));
      if (!id || out.has(id)) return;
      const title = (a.textContent || "").replace(/\s+/g, " ").trim();
      if (title) out.set(id, title);
    });
    return out;
  }

  function chatHref(id) {
    return "/c/" + id;
  }

  // ChatGPT's own link to a chat (clicking it navigates without reloading).
  function findChatLink(id, excludeRoot) {
    const a = [...document.querySelectorAll('a[href$="/c/' + id + '"]')].find(
      (x) => !(excludeRoot && excludeRoot.contains(x))
    );
    return a || null;
  }

  // ChatGPT has no "all chats" page; older chats load when you scroll the sidebar.
  const CHATS_PAGE = null;

  function isDarkMode() {
    const html = document.documentElement;
    if (html.classList.contains("dark")) return true;
    if (html.classList.contains("light")) return false;
    const theme = html.getAttribute("data-theme");
    if (theme === "dark" || theme === "light") return theme === "dark";
    // Fallback: look at the page background brightness.
    const m = /(\d+),\s*(\d+),\s*(\d+)/.exec(getComputedStyle(document.body).backgroundColor || "");
    if (m) return (+m[1] + +m[2] + +m[3]) / 3 < 128;
    return matchMedia("(prefers-color-scheme: dark)").matches;
  }

  self.CFSel = {
    getSidebar,
    getMountPoint,
    chatIdFromHref,
    currentChatId,
    currentChatTitle,
    visibleChats,
    chatHref,
    findChatLink,
    CHATS_PAGE,
    isDarkMode
  };
})();
