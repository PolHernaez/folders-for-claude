# Creates dist/folders-for-claude-<version>.zip ready to upload to the Chrome Web Store.
# Also runs a few sanity checks (valid JSON, every i18n key exists, no remote code).
import json, os, re, sys, zipfile

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
EXT = os.path.join(ROOT, "extension")
DIST = os.path.join(ROOT, "dist")

manifest = json.load(open(os.path.join(EXT, "manifest.json"), encoding="utf-8"))
version = manifest["version"]
problems = []

# 1. Locales: same keys everywhere, and every key used in code exists.
locales = {}
for lang in os.listdir(os.path.join(EXT, "_locales")):
    locales[lang] = json.load(open(os.path.join(EXT, "_locales", lang, "messages.json"), encoding="utf-8"))
base = set(locales["en"])
for lang, msgs in locales.items():
    if set(msgs) != base:
        problems.append(f"locale {lang} keys differ: {set(msgs) ^ base}")

used = set()
for folder, _, files in os.walk(EXT):
    for f in files:
        p = os.path.join(folder, f)
        if f.endswith(".js") and "lib" not in folder:
            src = open(p, encoding="utf-8").read()
            used |= set(re.findall(r'\bt\("([A-Za-z0-9_]+)"', src))
            # 2. No remote code
            if re.search(r"<script[^>]+src=[\"']https?:", src) or re.search(r"\beval\(|new Function\(", src):
                problems.append("possible remote/dynamic code in " + p)
        if f.endswith(".html"):
            src = open(p, encoding="utf-8").read()
            used |= set(re.findall(r'data-i18n="([A-Za-z0-9_]+)"', src))
            if re.search(r"<script[^>]+src=[\"']https?:", src):
                problems.append("remote script in " + p)
used |= set(re.findall(r"__MSG_(\w+)__", json.dumps(manifest)))
missing = used - base
if missing:
    problems.append("missing i18n keys: " + ", ".join(sorted(missing)))

if problems:
    print("PROBLEMS:\n - " + "\n - ".join(problems))
    sys.exit(1)

os.makedirs(DIST, exist_ok=True)
out = os.path.join(DIST, f"folders-for-claude-{version}.zip")
with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as z:
    for folder, _, files in os.walk(EXT):
        for f in files:
            full = os.path.join(folder, f)
            z.write(full, os.path.relpath(full, EXT).replace("\\", "/"))
print(f"OK  {len(used)} i18n keys used, {len(locales)} locales")
print(f"ZIP {out}  ({os.path.getsize(out)//1024} KB)")
