# Builds the Chrome Web Store images into store/screenshots/.
# Needs the local harness server running on port 8765:
#   python -m http.server 8765 --bind 127.0.0.1   (from the project root)
# Then:  python tools/make_store_images.py
import os, sys, urllib.parse
from PIL import Image
sys.path.insert(0, os.path.dirname(__file__))
from shot import shot

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
SRC = os.path.join(ROOT, "store", "src")
OUT = os.path.join(ROOT, "store", "screenshots")
MOCK = "http://127.0.0.1:8765/tools/harness/claude-mock.html?"
os.makedirs(OUT, exist_ok=True)

SHOTS = [
    ("1-folders", "seed=1&pro=1&chat=1",
     "Folders for your Claude chats",
     "Group conversations by project, client or topic — right inside Claude's sidebar."),
    ("2-add", "seed=1&pro=1&chat=4&demo=menu",
     "Add a chat in one click",
     "Open any chat, press the folder button and pick where it goes. A chat can live in several folders."),
    ("3-search", "seed=1&pro=1&chat=2&demo=search&q=re",
     "Find any conversation fast",
     "Search folder names and chat titles instantly. No more scrolling through hundreds of chats."),
    ("4-organize", "seed=1&pro=1&chat=0&demo=folder",
     "Color, rename, reorder",
     "Color-code folders, drag to reorder, and move chats between folders."),
    ("5-private", "seed=1&pro=1&chat=7&light=1",
     "Private by design",
     "Works in light and dark mode. Your folders stay in your browser — we never read your messages."),
]

def ui(name, params, w=1000, h=680):
    raw = os.path.join(SRC, "ui-" + name + ".png")
    shot_url(MOCK + params + "&reset=1", raw, w, h)
    return raw

def shot_url(url, out, w, h):
    # shot() expects a file path; pass the URL through a tiny redirect page.
    redirect = os.path.join(SRC, "_go.html")
    with open(redirect, "w", encoding="utf-8") as f:
        f.write('<meta http-equiv="refresh" content="0;url=' + url + '">')
    shot(redirect, out, w, h)

def frame(params, out, w, h):
    page = os.path.join(SRC, "frame.html")
    tmp = os.path.join(SRC, "_frame.html")
    # Copy frame with the query baked in (file:// URLs can't carry a query via shot()).
    html = open(page, encoding="utf-8").read().replace(
        "new URLSearchParams(location.search)", "new URLSearchParams(" + repr("?" + urllib.parse.urlencode(params)) + ")")
    with open(tmp, "w", encoding="utf-8") as f:
        f.write(html)
    shot(tmp, out, w, h)
    Image.open(out).convert("RGB").save(out)  # store wants no alpha

for name, params, title, sub in SHOTS:
    raw = ui(name, params)
    frame({"img": os.path.basename(raw), "title": title, "sub": sub, "size": "shot"},
          os.path.join(OUT, name + ".png"), 1280, 800)
    print("screenshot", name)

frame({"size": "tile", "title": "Folders for Claude", "sub": "Organize & search your chats"},
      os.path.join(OUT, "promo-small-440x280.png"), 440, 280)
raw = ui("marquee", "seed=1&pro=1&chat=1", 900, 600)
frame({"size": "marquee", "img": os.path.basename(raw), "title": "Folders for Claude",
       "sub": "Organize your Claude chats into folders. Search, color-code and find anything in seconds."},
      os.path.join(OUT, "promo-marquee-1400x560.png"), 1400, 560)

for f in ("_go.html", "_frame.html"):
    try:
        os.remove(os.path.join(SRC, f))
    except OSError:
        pass
print("done ->", OUT)
