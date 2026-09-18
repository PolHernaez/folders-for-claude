// Injects the "Folders" section into claude.ai's sidebar.
// UI lives inside Shadow DOM so Claude's CSS and ours never clash.
// If the sidebar can't be found (collapsed, mobile width, or Claude changed
// its HTML) we fall back to a small floating button. If something throws
// repeatedly, the extension switches itself off silently for this tab.
(function () {
  "use strict";

  if (window.__cfLoaded) return;
  window.__cfLoaded = true;

  const Store = self.CFStore;
  const Sel = self.CFSel;
  const LOG = "[Folders for Claude]";

  const t = (key, subs) => {
    try {
      return chrome.i18n.getMessage(key, subs) || key;
    } catch (e) {
      return key;
    }
  };

  const ICON = {
    folder:
      '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M2.5 5.5A1.5 1.5 0 0 1 4 4h3.6l1.6 1.8H16a1.5 1.5 0 0 1 1.5 1.5v7.2A1.5 1.5 0 0 1 16 16H4a1.5 1.5 0 0 1-1.5-1.5z" fill="currentColor"/></svg>',
    plus: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 4v12M4 10h12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    search:
      '<svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="9" cy="9" r="5" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="m13 13 4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    addChat:
      '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M2.5 5.5A1.5 1.5 0 0 1 4 4h3.6l1.6 1.8H16a1.5 1.5 0 0 1 1.5 1.5v7.2A1.5 1.5 0 0 1 16 16H4a1.5 1.5 0 0 1-1.5-1.5z" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M10 8.2v5M7.5 10.7h5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',
    more: '<svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="5" cy="10" r="1.4" fill="currentColor"/><circle cx="10" cy="10" r="1.4" fill="currentColor"/><circle cx="15" cy="10" r="1.4" fill="currentColor"/></svg>',
    close:
      '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="m6 6 8 8M14 6l-8 8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    caret:
      '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="m8 6 4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    check:
      '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="m5 10.5 3.2 3L15 7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };

  const state = {
    data: Store.emptyData(),
    pro: false,
    query: "",
    searchOpen: false,
    sectionCollapsed: false,
    floatingOpen: false,
    lastPath: "",
    mode: null, // "inline" | "floating"
    errors: 0,
    dead: false,
    note: null // { kind, text }
  };

  let panelHost = null;
  let panelRoot = null;
  let panelView = null;
  let overlayHost = null;
  let overlayRoot = null;
  let observer = null;
  let tickTimer = null;

  // ---------- helpers ----------

  function h(tag, attrs, children) {
    const el = document.createElement(tag);
    if (attrs) {
      for (const [k, v] of Object.entries(attrs)) {
        if (v == null || v === false) continue;
        if (k === "class") el.className = v;
        else if (k === "html") el.innerHTML = v;
        else if (k === "text") el.textContent = v;
        else if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
        else el.setAttribute(k, v === true ? "" : v);
      }
    }
    (children || []).forEach((c) => c && el.appendChild(typeof c === "string" ? document.createTextNode(c) : c));
    return el;
  }

  // CSS is fetched once and reused by both shadow roots (no flicker on re-render).
  let cssText = "";
  async function loadCss() {
    try {
      cssText = await fetch(chrome.runtime.getURL("content/content.css")).then((r) => r.text());
    } catch (e) {
      console.warn(LOG, "could not load CSS", e);
    }
  }

  function styleEl() {
    return h("style", { text: cssText });
  }

  // Stop Claude's global keyboard shortcuts from reacting while typing in our inputs.
  function isolateKeys(el) {
    ["keydown", "keyup", "keypress"].forEach((type) =>
      el.addEventListener(type, (e) => {
        if (e.key !== "Escape") e.stopPropagation();
      })
    );
  }

  function guard(fn) {
    return function () {
      if (state.dead) return;
      try {
        const r = fn.apply(this, arguments);
        if (r && typeof r.catch === "function") r.catch(fail);
        return r;
      } catch (e) {
        fail(e);
      }
    };
  }

  function fail(e) {
    state.errors++;
    console.warn(LOG, e);
    if (state.errors >= 5) shutdown();
  }

  // quiet = true when the extension was reloaded/updated (normal, not an error).
  function shutdown(quiet) {
    state.dead = true;
    if (observer) observer.disconnect();
    if (panelHost) panelHost.remove();
    if (overlayHost) overlayHost.remove();
    if (!quiet) console.warn(LOG, "disabled on this tab after repeated errors");
  }

  // The extension was reloaded/updated: this old content script is orphaned.
  function contextAlive() {
    try {
      return !!chrome.runtime.id;
    } catch (e) {
      return false;
    }
  }

  async function persist() {
    const res = await Store.save(state.data);
    if (!res.ok && res.error === "sync") state.note = { kind: "warn", text: t("syncFull") };
  }

  function findFolder(id) {
    return state.data.folders.find((f) => f.id === id);
  }

  function foldersWithChat(chatId) {
    return state.data.folders.filter((f) => f.chats.some((c) => c.id === chatId));
  }

  function canCreateFolder() {
    return state.pro || state.data.folders.length < Store.FREE_FOLDER_LIMIT;
  }

  function openChat(chatId) {
    // Prefer clicking Claude's own link so its router does an in-app navigation.
    const own = document.querySelector('a[href="/chat/' + chatId + '"]');
    if (own && !(panelHost && panelHost.contains(own))) own.click();
    else location.assign("/chat/" + chatId);
  }

  // ---------- actions ----------

  async function createFolder(name, chat) {
    if (!canCreateFolder()) {
      showUpgrade();
      return null;
    }
    name = (name || "").trim();
    if (!name) return null;
    const folder = {
      id: Store.uid(),
      name: name.slice(0, 60),
      color: Store.COLORS[state.data.folders.length % Store.COLORS.length],
      collapsed: false,
      chats: chat ? [chat] : []
    };
    state.data.folders.push(folder);
    await persist();
    render();
    return folder;
  }

  async function toggleChatInFolder(folderId, chat) {
    const f = findFolder(folderId);
    if (!f) return;
    const i = f.chats.findIndex((c) => c.id === chat.id);
    if (i >= 0) f.chats.splice(i, 1);
    else {
      f.chats.unshift(chat);
      countAdded();
    }
    await persist();
    render();
  }

  async function removeChat(folderId, chatId) {
    const f = findFolder(folderId);
    if (!f) return;
    f.chats = f.chats.filter((c) => c.id !== chatId);
    await persist();
    render();
  }

  async function moveChat(chatId, fromId, toId) {
    if (fromId === toId) return;
    const from = findFolder(fromId);
    const to = findFolder(toId);
    if (!from || !to) return;
    const chat = from.chats.find((c) => c.id === chatId);
    if (!chat) return;
    from.chats = from.chats.filter((c) => c.id !== chatId);
    if (!to.chats.some((c) => c.id === chatId)) to.chats.unshift(chat);
    await persist();
    render();
  }

  async function moveFolder(dragId, targetId) {
    const list = state.data.folders;
    const from = list.findIndex((f) => f.id === dragId);
    const to = list.findIndex((f) => f.id === targetId);
    if (from < 0 || to < 0 || from === to) return;
    const [f] = list.splice(from, 1);
    list.splice(to, 0, f);
    await persist();
    render();
  }

  async function countAdded() {
    const r = await chrome.storage.local.get({ cf_stats: { added: 0, rated: false } });
    const s = r.cf_stats;
    s.added++;
    await chrome.storage.local.set({ cf_stats: s });
    // Ask for a review only after real, repeated success — and only once.
    if (s.added === 10 && !s.rated) {
      state.note = { kind: "rate", text: t("rateAsk") };
      render();
    }
  }

  function showUpgrade() {
    const body = h("div", { class: "cf-modal-body" }, [
      h("p", { text: t("upgradeText", [String(Store.FREE_FOLDER_LIMIT)]) }),
      h("ul", { class: "cf-bullets" }, [
        h("li", { text: t("proFeature1") }),
        h("li", { text: t("proFeature2") }),
        h("li", { text: t("proFeature3") })
      ]),
      h("p", { class: "cf-muted", text: t("upgradeCancel") })
    ]);
    openModal(t("upgradeTitle"), body, [
      { label: t("restorePurchase"), onClick: () => chrome.runtime.sendMessage({ type: "cf-login" }) },
      {
        label: t("upgradeButton"),
        primary: true,
        onClick: () => chrome.runtime.sendMessage({ type: "cf-pay" })
      }
    ]);
  }

  // ---------- overlay: menus, prompts, modals ----------

  function ensureOverlay() {
    if (overlayHost && overlayHost.isConnected) return;
    overlayHost = h("div", { id: "cf-overlay-host" });
    overlayHost.style.cssText = "position:fixed;inset:0;z-index:2147483000;pointer-events:none;";
    isolateKeys(overlayHost);
    overlayRoot = overlayHost.attachShadow({ mode: "open" });
    overlayRoot.appendChild(styleEl());
    document.body.appendChild(overlayHost);
  }

  function closeOverlay() {
    if (!overlayRoot) return;
    overlayRoot.querySelectorAll(".cf-layer").forEach((n) => n.remove());
    document.removeEventListener("keydown", onEscape, true);
  }

  function onEscape(e) {
    if (e.key === "Escape") {
      e.stopPropagation();
      closeOverlay();
    }
  }

  function layer(clickOutsideCloses) {
    ensureOverlay();
    closeOverlay();
    const l = h("div", { class: "cf-layer " + themeClass() });
    if (clickOutsideCloses) {
      l.addEventListener("mousedown", (e) => {
        if (e.target === l) closeOverlay();
      });
    }
    overlayRoot.appendChild(l);
    document.addEventListener("keydown", onEscape, true);
    return l;
  }

  // items: [{ label, onClick, danger, checked, swatches }]
  function openMenu(anchorEl, items) {
    const l = layer(true);
    const menu = h("div", { class: "cf-menu", role: "menu" });
    items.forEach((it) => {
      if (it.separator) return menu.appendChild(h("div", { class: "cf-sep" }));
      if (it.swatches) {
        const row = h("div", { class: "cf-swatches" });
        Store.COLORS.forEach((c) =>
          row.appendChild(
            h("button", {
              class: "cf-swatch" + (c === it.current ? " is-on" : ""),
              style: "background:" + c,
              "aria-label": c,
              onclick: () => {
                closeOverlay();
                it.onPick(c);
              }
            })
          )
        );
        return menu.appendChild(row);
      }
      menu.appendChild(
        h(
          "button",
          {
            class: "cf-menu-item" + (it.danger ? " is-danger" : ""),
            role: "menuitem",
            onclick: () => {
              closeOverlay();
              it.onClick();
            }
          },
          [
            it.checked != null ? h("span", { class: "cf-check", html: it.checked ? ICON.check : "" }) : null,
            it.dot ? h("span", { class: "cf-dot", style: "background:" + it.dot }) : null,
            h("span", { class: "cf-menu-label", text: it.label })
          ]
        )
      );
    });
    l.appendChild(menu);
    const r = anchorEl.getBoundingClientRect();
    const mw = 220;
    let left = Math.min(r.left, window.innerWidth - mw - 8);
    menu.style.left = Math.max(8, left) + "px";
    menu.style.top = r.bottom + 4 + "px";
    requestAnimationFrame(() => {
      const mr = menu.getBoundingClientRect();
      if (mr.bottom > window.innerHeight - 8) menu.style.top = Math.max(8, r.top - mr.height - 4) + "px";
      const firstBtn = menu.querySelector("button");
      if (firstBtn) firstBtn.focus();
    });
  }

  function openModal(title, bodyEl, buttons) {
    const l = layer(true);
    l.classList.add("cf-dim");
    const footer = h(
      "div",
      { class: "cf-modal-footer" },
      buttons.map((b) =>
        h("button", {
          class: "cf-btn" + (b.primary ? " cf-btn-primary" : ""),
          text: b.label,
          onclick: async () => {
            const keepOpen = b.onClick && (await b.onClick()) === false;
            if (!keepOpen) closeOverlay();
          }
        })
      )
    );
    const modal = h("div", { class: "cf-modal", role: "dialog", "aria-label": title }, [
      h("div", { class: "cf-modal-head" }, [
        h("div", { class: "cf-modal-title", text: title }),
        h("button", { class: "cf-icon-btn", "aria-label": t("close"), html: ICON.close, onclick: closeOverlay })
      ]),
      bodyEl,
      footer
    ]);
    l.appendChild(modal);
    return modal;
  }

  function prompt(title, initial, onOk) {
    const input = h("input", { class: "cf-input", type: "text", maxlength: "60", value: initial || "" });
    const body = h("form", { class: "cf-modal-body" }, [input]);
    const submit = async () => {
      const v = input.value.trim();
      if (!v) return false;
      closeOverlay();
      await onOk(v);
    };
    body.addEventListener("submit", (e) => {
      e.preventDefault();
      submit();
    });
    openModal(title, body, [
      { label: t("cancel") },
      { label: t("save"), primary: true, onClick: () => submit().then(() => false) }
    ]);
    requestAnimationFrame(() => {
      input.focus();
      input.select();
    });
  }

  function confirmDelete(folder) {
    const body = h("div", { class: "cf-modal-body" }, [h("p", { text: t("deleteConfirm", [folder.name]) })]);
    openModal(t("deleteFolder"), body, [
      { label: t("cancel") },
      {
        label: t("delete"),
        primary: true,
        onClick: async () => {
          state.data.folders = state.data.folders.filter((f) => f.id !== folder.id);
          await persist();
          render();
        }
      }
    ]);
  }

  // Modal to add several chats at once (from what's visible in the sidebar / Chats page).
  function openAddChats(folder) {
    const chats = Sel.visibleChats(panelHost);
    const selected = new Set(folder.chats.map((c) => c.id));
    const list = h("div", { class: "cf-pick-list" });
    const search = h("input", { class: "cf-input", type: "search", placeholder: t("searchChats") });

    function draw() {
      list.textContent = "";
      const q = search.value.trim().toLowerCase();
      let n = 0;
      chats.forEach((title, id) => {
        if (q && !title.toLowerCase().includes(q)) return;
        n++;
        const cb = h("input", { type: "checkbox", checked: selected.has(id) });
        cb.addEventListener("change", () => (cb.checked ? selected.add(id) : selected.delete(id)));
        list.appendChild(h("label", { class: "cf-pick-row" }, [cb, h("span", { text: title })]));
      });
      if (!n) list.appendChild(h("div", { class: "cf-muted cf-pad", text: t("noChatsVisible") }));
    }
    search.addEventListener("input", draw);
    draw();

    const hint = h("p", { class: "cf-muted" }, [t("moreChatsHint") + " "]);
    hint.appendChild(
      h("a", {
        href: "/recents",
        text: t("openChatsPage"),
        onclick: (e) => {
          e.preventDefault();
          closeOverlay();
          const own = document.querySelector('a[href="/recents"]');
          if (own) own.click();
          else location.assign("/recents");
        }
      })
    );

    openModal(t("addChatsTo", [folder.name]), h("div", { class: "cf-modal-body" }, [search, list, hint]), [
      { label: t("cancel") },
      {
        label: t("save"),
        primary: true,
        onClick: async () => {
          const before = new Set(folder.chats.map((c) => c.id));
          const keep = folder.chats.filter((c) => selected.has(c.id));
          const added = [];
          selected.forEach((id) => {
            if (!before.has(id)) added.push({ id, title: chats.get(id) || "" });
          });
          folder.chats = added.concat(keep);
          await persist();
          if (added.length) countAdded();
          render();
        }
      }
    ]);
    requestAnimationFrame(() => search.focus());
  }

  function openFolderMenu(anchor, folder) {
    openMenu(anchor, [
      { label: t("addChats"), onClick: () => openAddChats(folder) },
      {
        label: t("rename"),
        onClick: () =>
          prompt(t("rename"), folder.name, async (v) => {
            folder.name = v;
            await persist();
            render();
          })
      },
      {
        swatches: true,
        current: folder.color,
        onPick: async (c) => {
          folder.color = c;
          await persist();
          render();
        }
      },
      { separator: true },
      { label: t("deleteFolder"), danger: true, onClick: () => confirmDelete(folder) }
    ]);
  }

  function openCurrentChatMenu(anchor) {
    const id = Sel.currentChatId();
    if (!id) return;
    const title = Sel.currentChatTitle() || Sel.visibleChats(panelHost).get(id) || t("untitled");
    const chat = { id, title };
    const items = state.data.folders.map((f) => ({
      label: f.name,
      dot: f.color,
      checked: f.chats.some((c) => c.id === id),
      onClick: () => toggleChatInFolder(f.id, chat)
    }));
    if (items.length) items.push({ separator: true });
    items.push({
      label: t("newFolderWithChat"),
      onClick: () =>
        canCreateFolder()
          ? prompt(t("newFolder"), "", async (v) => {
              await createFolder(v, chat);
              countAdded();
            })
          : showUpgrade()
    });
    openMenu(anchor, items);
  }

  // ---------- panel rendering ----------

  function themeClass() {
    return Sel.isDarkMode() ? "cf-dark" : "cf-light";
  }

  function buildPanel() {
    const current = Sel.currentChatId();
    const q = state.query.trim().toLowerCase();
    const root = h("div", { class: "cf-root " + themeClass() + (state.mode === "floating" ? " is-floating" : "") });

    // Header
    const header = h("div", { class: "cf-header" }, [
      h(
        "button",
        {
          class: "cf-section-title",
          "aria-expanded": String(!state.sectionCollapsed),
          onclick: () => {
            state.sectionCollapsed = !state.sectionCollapsed;
            chrome.storage.local.set({ cf_ui: { sectionCollapsed: state.sectionCollapsed } });
            render();
          }
        },
        [
          h("span", { text: t("folders") }),
          h("span", { class: "cf-caret" + (state.sectionCollapsed ? "" : " is-open"), html: ICON.caret })
        ]
      ),
      h("div", { class: "cf-header-actions" }, [
        current
          ? h("button", {
              class: "cf-icon-btn" + (foldersWithChat(current).length ? " is-active" : ""),
              title: t("addCurrentChat"),
              "aria-label": t("addCurrentChat"),
              html: ICON.addChat,
              onclick: (e) => openCurrentChatMenu(e.currentTarget)
            })
          : null,
        h("button", {
          class: "cf-icon-btn" + (state.searchOpen ? " is-active" : ""),
          title: t("search"),
          "aria-label": t("search"),
          html: ICON.search,
          onclick: () => {
            state.searchOpen = !state.searchOpen;
            if (!state.searchOpen) state.query = "";
            render();
            if (state.searchOpen) {
              const i = panelRoot.querySelector(".cf-search");
              if (i) i.focus();
            }
          }
        }),
        h("button", {
          class: "cf-icon-btn",
          title: t("newFolder"),
          "aria-label": t("newFolder"),
          html: ICON.plus,
          onclick: () => (canCreateFolder() ? prompt(t("newFolder"), "", (v) => createFolder(v)) : showUpgrade())
        })
      ])
    ]);
    root.appendChild(header);

    if (state.sectionCollapsed) return root;

    if (state.searchOpen) {
      const input = h("input", {
        class: "cf-input cf-search",
        type: "search",
        placeholder: t("searchInFolders"),
        value: state.query
      });
      input.addEventListener("input", () => {
        state.query = input.value;
        const pos = input.selectionStart;
        render();
        const again = panelRoot.querySelector(".cf-search");
        if (again) {
          again.focus();
          again.setSelectionRange(pos, pos);
        }
      });
      input.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          state.searchOpen = false;
          state.query = "";
          render();
        }
      });
      root.appendChild(input);
    }

    const list = h("div", { class: "cf-list" });
    let shown = 0;

    state.data.folders.forEach((folder) => {
      const nameMatch = q && folder.name.toLowerCase().includes(q);
      const chats = q && !nameMatch ? folder.chats.filter((c) => c.title.toLowerCase().includes(q)) : folder.chats;
      if (q && !nameMatch && !chats.length) return;
      shown++;
      const open = q ? true : !folder.collapsed;

      const row = h("div", { class: "cf-folder-row", draggable: "true", "data-id": folder.id }, [
        h(
          "button",
          {
            class: "cf-folder-main",
            "aria-expanded": String(open),
            onclick: async () => {
              if (q) return;
              folder.collapsed = !folder.collapsed;
              await persist();
              render();
            }
          },
          [
            h("span", { class: "cf-caret" + (open ? " is-open" : ""), html: ICON.caret }),
            h("span", { class: "cf-folder-icon", style: "color:" + folder.color, html: ICON.folder }),
            h("span", { class: "cf-folder-name", text: folder.name }),
            h("span", { class: "cf-count", text: String(folder.chats.length) })
          ]
        ),
        h("button", {
          class: "cf-icon-btn cf-row-action",
          "aria-label": t("folderOptions"),
          title: t("folderOptions"),
          html: ICON.more,
          onclick: (e) => openFolderMenu(e.currentTarget, folder)
        })
      ]);

      // Drag a folder onto another folder to reorder; drop a chat onto it to move the chat.
      row.addEventListener("dragstart", (e) => {
        if (e.target !== row) return;
        e.dataTransfer.setData("text/cf-folder", folder.id);
        e.dataTransfer.effectAllowed = "move";
      });
      row.addEventListener("dragover", (e) => {
        const types = e.dataTransfer.types;
        if (types.includes("text/cf-folder") || types.includes("text/cf-chat")) {
          e.preventDefault();
          row.classList.add("is-drop");
        }
      });
      row.addEventListener("dragleave", () => row.classList.remove("is-drop"));
      row.addEventListener("drop", (e) => {
        e.preventDefault();
        row.classList.remove("is-drop");
        const fid = e.dataTransfer.getData("text/cf-folder");
        const chat = e.dataTransfer.getData("text/cf-chat");
        if (fid) moveFolder(fid, folder.id);
        else if (chat) {
          const [chatId, fromId] = chat.split("|");
          moveChat(chatId, fromId, folder.id);
        }
      });

      const group = h("div", { class: "cf-folder" }, [row]);

      if (open) {
        const inner = h("div", { class: "cf-chats" });
        if (!chats.length) inner.appendChild(h("div", { class: "cf-empty-folder", text: t("emptyFolder") }));
        chats.forEach((chat) => {
          const isCurrent = chat.id === current;
          const chatRow = h(
            "div",
            { class: "cf-chat-row" + (isCurrent ? " is-current" : ""), draggable: "true" },
            [
              h("a", {
                class: "cf-chat-link",
                href: "/chat/" + chat.id,
                title: chat.title,
                text: chat.title || t("untitled"),
                onclick: (e) => {
                  if (e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return;
                  e.preventDefault();
                  openChat(chat.id);
                }
              }),
              h("button", {
                class: "cf-icon-btn cf-row-action",
                "aria-label": t("removeFromFolder"),
                title: t("removeFromFolder"),
                html: ICON.close,
                onclick: () => removeChat(folder.id, chat.id)
              })
            ]
          );
          chatRow.addEventListener("dragstart", (e) => {
            e.stopPropagation();
            e.dataTransfer.setData("text/cf-chat", chat.id + "|" + folder.id);
            e.dataTransfer.effectAllowed = "move";
          });
          inner.appendChild(chatRow);
        });
        group.appendChild(inner);
      }
      list.appendChild(group);
    });

    if (!state.data.folders.length) {
      list.appendChild(
        h("button", {
          class: "cf-empty",
          text: t("createFirstFolder"),
          onclick: () => prompt(t("newFolder"), "", (v) => createFolder(v))
        })
      );
    } else if (q && !shown) {
      list.appendChild(h("div", { class: "cf-empty-folder", text: t("noResults") }));
    }
    root.appendChild(list);

    if (!state.pro && state.data.folders.length >= Store.FREE_FOLDER_LIMIT) {
      root.appendChild(
        h("button", {
          class: "cf-limit",
          text: t("freeLimitReached", [String(Store.FREE_FOLDER_LIMIT)]),
          onclick: showUpgrade
        })
      );
    }

    if (state.note) root.appendChild(buildNote());
    return root;
  }

  function buildNote() {
    const n = state.note;
    const box = h("div", { class: "cf-note" }, [h("span", { text: n.text })]);
    const dismiss = async (rated) => {
      state.note = null;
      if (n.kind === "rate") {
        const r = await chrome.storage.local.get({ cf_stats: { added: 0, rated: false } });
        r.cf_stats.rated = true;
        await chrome.storage.local.set({ cf_stats: r.cf_stats });
        if (rated) {
          window.open("https://chromewebstore.google.com/detail/" + chrome.runtime.id + "/reviews", "_blank", "noopener");
        }
      }
      render();
    };
    const actions = h("div", { class: "cf-note-actions" });
    if (n.kind === "rate") {
      actions.appendChild(h("button", { class: "cf-link-btn", text: t("rateYes"), onclick: () => dismiss(true) }));
    }
    actions.appendChild(h("button", { class: "cf-link-btn", text: t("dismiss"), onclick: () => dismiss(false) }));
    box.appendChild(actions);
    return box;
  }

  function buildFloating() {
    const root = h("div", { class: "cf-floating " + themeClass() });
    root.appendChild(
      h("button", {
        class: "cf-fab",
        title: t("folders"),
        "aria-label": t("folders"),
        html: ICON.folder,
        onclick: () => {
          state.floatingOpen = !state.floatingOpen;
          render();
        }
      })
    );
    if (state.floatingOpen) {
      const card = h("div", { class: "cf-float-card" });
      card.appendChild(buildPanel());
      root.appendChild(card);
    }
    return root;
  }

  // ---------- mounting ----------

  function ensureHost() {
    if (panelHost) return;
    panelHost = h("div", { id: "cf-folders-host" });
    isolateKeys(panelHost);
    panelRoot = panelHost.attachShadow({ mode: "open" });
    panelView = h("div");
    panelRoot.append(styleEl(), panelView);
  }

  function mount() {
    ensureHost();
    const point = Sel.getMountPoint();
    if (point) {
      if (panelHost.parentElement !== point.parent || panelHost.nextSibling !== point.before) {
        point.parent.insertBefore(panelHost, point.before);
      }
      panelHost.style.cssText = "";
      if (state.mode !== "inline") {
        state.mode = "inline";
        return true;
      }
    } else if (document.body) {
      if (panelHost.parentElement !== document.body) document.body.appendChild(panelHost);
      panelHost.style.cssText = "position:fixed;left:12px;bottom:84px;z-index:2147482000;";
      if (state.mode !== "floating") {
        state.mode = "floating";
        return true;
      }
    }
    return false;
  }

  function render() {
    if (state.dead || !panelRoot) return;
    try {
      panelView.replaceChildren(state.mode === "floating" ? buildFloating() : buildPanel());
    } catch (e) {
      fail(e);
    }
  }

  // Keep stored titles fresh when a chat is renamed in Claude.
  function refreshTitles() {
    const visible = Sel.visibleChats(panelHost);
    const cur = Sel.currentChatId();
    const curTitle = Sel.currentChatTitle();
    if (cur && curTitle) visible.set(cur, curTitle);
    let changed = false;
    state.data.folders.forEach((f) =>
      f.chats.forEach((c) => {
        const title = visible.get(c.id);
        if (title && title !== c.title) {
          c.title = title.slice(0, 120);
          changed = true;
        }
      })
    );
    return changed;
  }

  const tick = guard(async function () {
    if (!contextAlive()) return shutdown(true);
    let needRender = mount();
    if (location.pathname !== state.lastPath) {
      state.lastPath = location.pathname;
      needRender = true;
    }
    if (refreshTitles()) {
      await persist();
      needRender = true;
    }
    if (needRender) render();
    state.errors = 0;
  });

  function scheduleTick() {
    if (tickTimer) return;
    tickTimer = setTimeout(() => {
      tickTimer = null;
      tick();
    }, 400);
  }

  async function refreshPro() {
    try {
      const res = await chrome.runtime.sendMessage({ type: "cf-get-pro" });
      if (res && typeof res.pro === "boolean") state.pro = res.pro;
    } catch (e) {
      state.pro = await Store.getPro();
    }
  }

  async function init() {
    await loadCss();
    state.data = await Store.load();
    state.pro = await Store.getPro();
    const ui = (await chrome.storage.local.get({ cf_ui: { sectionCollapsed: false } })).cf_ui;
    state.sectionCollapsed = !!ui.sectionCollapsed;
    state.lastPath = location.pathname;
    mount();
    render();
    refreshPro().then(render);

    observer = new MutationObserver((muts) => {
      // Ignore mutations caused by our own UI.
      for (const m of muts) {
        if (!panelHost || !panelHost.contains(m.target)) {
          scheduleTick();
          return;
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("popstate", scheduleTick);
    window.addEventListener("resize", scheduleTick);
    // Sidebar collapse can be a pure CSS change (no DOM mutation): check now and then.
    setInterval(() => {
      if (document.visibilityState === "visible") scheduleTick();
    }, 2000);

    chrome.storage.onChanged.addListener(
      guard(async (changes, area) => {
        if (area === "local" && changes[Store.LOCAL_KEY]) {
          const incoming = Store.normalize(changes[Store.LOCAL_KEY].newValue);
          if (incoming.updatedAt !== state.data.updatedAt) {
            state.data = incoming;
            render();
          }
        }
        // Folders changed on another computer (Pro sync): load() keeps the newest copy.
        if (area === "sync" && changes.cf_sync_meta) {
          const fresh = await Store.load();
          if (fresh.updatedAt !== state.data.updatedAt) {
            state.data = fresh;
            render();
          }
        }
        if (area === "local" && changes.cf_pro) {
          state.pro = !!changes.cf_pro.newValue;
          render();
        }
      })
    );
  }

  guard(init)();
})();
