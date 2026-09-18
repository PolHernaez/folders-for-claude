// Every piece of knowledge about claude.ai's DOM lives here.
// When Claude changes its interface, this is the only file to fix.
// Each function returns null/[] instead of throwing if something is missing.
(function () {
  "use strict";

  const CHAT_ID_RE = /\/chat\/([0-9a-f-]{36})/i;

  const S = {
    // Sidebar container. Tried in order; first match wins.
    sidebar: ['[data-testid="sidebar"]', "aside", "nav"],
    // The block we insert our folders ABOVE (starred chats, then recents).
    anchor: ['[data-testid="sidebar-pinned"]', '[data-testid="sidebar-recents"]'],
    // Links to conversations, anywhere on the page.
    chatLink: 'a[href^="/chat/"]'
  };

  function first(list, root) {
    for (const sel of list) {
      try {
        const el = (root || document).querySelector(sel);
        if (el) return el;
      } catch (e) {
        /* invalid selector: ignore */
      }
    }
    return null;
  }

  function getSidebar() {
    const el = first(S.sidebar);
    // A collapsed sidebar is still in the DOM but has almost no width.
    if (!el || el.getBoundingClientRect().width < 120) return null;
    return el;
  }

  // Returns { parent, before } to insert our panel, or null.
  function getMountPoint() {
    const sidebar = getSidebar();
    if (!sidebar) return null;
    const anchor = first(S.anchor, sidebar);
    if (anchor && anchor.parentElement) return { parent: anchor.parentElement, before: anchor };
    return null;
  }

  function chatIdFromHref(href) {
    const m = CHAT_ID_RE.exec(href || "");
    return m ? m[1].toLowerCase() : null;
  }

  function currentChatId() {
    return chatIdFromHref(location.pathname);
  }

  // Title of the chat that is open right now (tab title is "<title> - Claude").
  function currentChatTitle() {
    const t = (document.title || "").replace(/\s*[-–|]\s*Claude\s*$/i, "").trim();
    return t && t.toLowerCase() !== "claude" ? t : "";
  }

  // All chats visible on the page (sidebar + /recents list), deduplicated.
  function visibleChats(excludeRoot) {
    const out = new Map();
    document.querySelectorAll(S.chatLink).forEach((a) => {
      if (excludeRoot && excludeRoot.contains(a)) return;
      const id = chatIdFromHref(a.getAttribute("href"));
      if (!id || out.has(id)) return;
      const title = (a.textContent || "").replace(/\s+/g, " ").trim();
      if (title) out.set(id, title);
    });
    return out;
  }

  function isDarkMode() {
    const mode = document.documentElement.getAttribute("data-mode");
    if (mode) return mode === "dark";
    return document.documentElement.classList.contains("dark");
  }

  self.CFSel = {
    getSidebar,
    getMountPoint,
    chatIdFromHref,
    currentChatId,
    currentChatTitle,
    visibleChats,
    isDarkMode
  };
})();
