# Builds the store zips:  python tools/build_zip.py [claude|chatgpt|all]   (default: all)
#
# - claude  → zips extension/ as is                → dist/folders-for-claude-<v>.zip
# - chatgpt → copies extension/ to build/chatgpt/, overlays platforms/chatgpt/
#             (manifest, config, selectors, locales, icons), appends theme.css
#             to content.css                        → dist/folders-for-chatgpt-<v>.zip
# Load build/chatgpt/ unpacked in chrome://extensions to test the ChatGPT version.
#
# Each build is checked: valid JSON, same i18n keys in every locale, every key
# used in code exists, no remote/dynamic code.
import json, os, re, shutil, sys, zipfile

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
EXT = os.path.join(ROOT, "extension")
DIST = os.path.join(ROOT, "dist")
BUILD = os.path.join(ROOT, "build")


def check(src):
    manifest = json.load(open(os.path.join(src, "manifest.json"), encoding="utf-8"))
    problems = []
    locales = {}
    for lang in os.listdir(os.path.join(src, "_locales")):
        locales[lang] = json.load(open(os.path.join(src, "_locales", lang, "messages.json"), encoding="utf-8"))
    base = set(locales["en"])
    for lang, msgs in locales.items():
        if set(msgs) != base:
            problems.append(f"locale {lang} keys differ: {set(msgs) ^ base}")
    used = set()
    for folder, _, files in os.walk(src):
        for f in files:
            p = os.path.join(folder, f)
            if f.endswith(".js") and os.sep + "lib" not in folder:
                code = open(p, encoding="utf-8").read()
                used |= set(re.findall(r'\bt\("([A-Za-z0-9_]+)"', code))
                if re.search(r"\beval\(|new Function\(", code):
                    problems.append("dynamic code in " + p)
            if f.endswith(".html"):
                html = open(p, encoding="utf-8").read()
                used |= set(re.findall(r'data-i18n="([A-Za-z0-9_]+)"', html))
                if re.search(r"<script[^>]+src=[\"']https?:", html):
                    problems.append("remote script in " + p)
    used |= set(re.findall(r"__MSG_(\w+)__", json.dumps(manifest)))
    missing = used - base
    if missing:
        problems.append("missing i18n keys: " + ", ".join(sorted(missing)))
    if problems:
        sys.exit("PROBLEMS in " + src + ":\n - " + "\n - ".join(problems))
    return manifest["version"], len(used), len(locales)


def zip_dir(src, name):
    version, n_keys, n_locales = check(src)
    os.makedirs(DIST, exist_ok=True)
    out = os.path.join(DIST, f"{name}-{version}.zip")
    with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as z:
        for folder, _, files in os.walk(src):
            for f in files:
                full = os.path.join(folder, f)
                z.write(full, os.path.relpath(full, src).replace("\\", "/"))
    print(f"OK  {name} v{version}: {n_keys} i18n keys, {n_locales} locales")
    print(f"ZIP {out}  ({os.path.getsize(out)//1024} KB)")


def build_chatgpt():
    plat = os.path.join(ROOT, "platforms", "chatgpt")
    dst = os.path.join(BUILD, "chatgpt")
    if os.path.isdir(dst):
        shutil.rmtree(dst)
    shutil.copytree(EXT, dst)
    shutil.rmtree(os.path.join(dst, "_locales"))
    shutil.copytree(os.path.join(plat, "_locales"), os.path.join(dst, "_locales"))
    for rel in ("manifest.json", "background/config.js", "content/selectors.js",
                "icons/icon16.png", "icons/icon32.png", "icons/icon48.png", "icons/icon128.png"):
        shutil.copyfile(os.path.join(plat, rel), os.path.join(dst, rel))
    with open(os.path.join(dst, "content", "content.css"), "a", encoding="utf-8") as css:
        css.write(open(os.path.join(plat, "content", "theme.css"), encoding="utf-8").read())
    return dst


target = sys.argv[1] if len(sys.argv) > 1 else "all"
if target in ("claude", "all"):
    zip_dir(EXT, "folders-for-claude")
if target in ("chatgpt", "all"):
    zip_dir(build_chatgpt(), "folders-for-chatgpt")
