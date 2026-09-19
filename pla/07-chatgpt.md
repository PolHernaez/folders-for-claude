# Versió ChatGPT — "Chat Folders"

Mateix codi que Folders for Claude. Només canvien els fitxers de `platforms/chatgpt/`:

| Fitxer | Què fa |
|---|---|
| `manifest.json` | Igual que el de Claude però funciona a `https://chatgpt.com/*` |
| `background/config.js` | ID d'ExtensionPay (`mapph-chatgpt-folders`), pàgina d'inici i nom del fitxer de còpia |
| `content/selectors.js` | Troba la llista de xats de ChatGPT pels enllaços `/c/<id>` (no depèn de classes CSS, que ChatGPT canvia sovint) |
| `content/theme.css` | Colors grisos/verds per encaixar amb ChatGPT |
| `_locales/` | Textos generats amb `python tools/build_locales.py chatgpt` |
| `icons/` | Icona verda |

`python tools/build_zip.py chatgpt` ho ajunta a `build/chatgpt/` i crea `dist/folders-for-chatgpt-1.0.0.zip`.

## Nom: per què no "Folders for ChatGPT"

Segons les normes de marca d'OpenAI, no es pot fer servir "ChatGPT" (ni "GPT") al **nom** d'un producte, tampoc com a "for ChatGPT". Si OpenAI es queixa, Google pot retirar l'extensió. Per això:
- **Nom:** *Chat Folders – Organize & Search AI Chats*
- **"ChatGPT"** només surt a la descripció, com a ús descriptiu: "Works with ChatGPT".

Perdem una mica de posicionament (el títol pesa molt), però és molt més segur.

## ⚠️ Límit de la Chrome Web Store

El teu compte de desenvolupador té un límit de **2 extensions publicades**. Amb aquesta, l'ompliràs. Per publicar-ne una tercera (per exemple, Gemini) caldrà que Google t'ampliï el límit.

## Passos (tu)

1. **Provar-la:** a `chrome://extensions` → *Carrega l'extensió descomprimida* → tria la carpeta `ExtensioProva\build\chatgpt`. Obre https://chatgpt.com **amb la sessió iniciada** i comprova:
   - [ ] Surt "Carpetes" damunt de la llista de xats de la barra lateral
   - [ ] Crear carpeta, afegir el xat obert, obrir-lo des de la carpeta
   - [ ] Xats de projectes (`/g/.../c/...`) també es poden afegir
   - [ ] Plegar la barra lateral → surt el botó flotant
   - [ ] Mode clar i fosc

   Com que no he pogut veure ChatGPT amb la sessió iniciada, **aquesta prova és important**. Si no surt la secció, obre la consola (F12), filtra per `[Folders]` i envia'm una captura.
2. **ExtensionPay:** *+ New extension* → Name `Chat Folders`, ID **`mapph-chatgpt-folders`**, mateixos plans (`monthly` 3,99 · `yearly` 24 · `lifetime` 39). Stripe ja està connectat.
3. **Pagament de prova** amb la targeta 4242, com vas fer amb Claude.
4. **Publicar:** *+ Nuevo elemento* → `dist\folders-for-chatgpt-1.0.0.zip`.
   - Textos: [store/chatgpt/listing.md](../store/chatgpt/listing.md)
   - Imatges: `store\chatgpt\screenshots\`
   - Privacitat: [store/chatgpt/privacy-form.md](../store/chatgpt/privacy-form.md)
   - Web: `https://polhernaez.github.io/folders-for-claude/chatgpt/`
   - Pagaments: **Contiene compras en la aplicación**

## Nota per a Claude

La de Claude ara també llegeix `background/config.js`. El zip `dist/folders-for-claude-1.0.0.zip` s'ha regenerat amb aquest canvi (funciona igual). La de Claude ja és a la **1.0.1** (`dist/folders-for-claude-1.0.1.zip`): puja-la com a actualització quan Google aprovi la 1.0.0.
