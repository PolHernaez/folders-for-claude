# Renders an HTML file to PNG with headless Chrome.
# Usage: python tools/shot.py <input.html> <output.png> <width> <height> [transparent]
import os, subprocess, sys, tempfile

CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

def shot(src, out, w, h, transparent=False):
    src = os.path.abspath(src)
    out = os.path.abspath(out)
    args = [
        CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars",
        "--user-data-dir=" + tempfile.mkdtemp(),
        f"--window-size={w},{h}", "--screenshot=" + out,
        "--virtual-time-budget=2000",
    ]
    if transparent:
        args.append("--default-background-color=00000000")
    args.append("file:///" + src.replace("\\", "/"))
    subprocess.run(args, capture_output=True, timeout=60)
    if not os.path.exists(out):
        sys.exit("render failed: " + out)
    return out

if __name__ == "__main__":
    a = sys.argv
    shot(a[1], a[2], int(a[3]), int(a[4]), len(a) > 5)
    print("ok", a[2])
