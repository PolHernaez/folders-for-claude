# FASE 6 — Auditoria i publicació

## Auditoria contra les polítiques de la Chrome Web Store

| Norma | Estat | Detall |
|---|---|---|
| Propòsit únic | ✅ | Només organitza xats de claude.ai en carpetes. Popup i configuració serveixen a aquest propòsit. |
| Permisos mínims | ✅ | `storage` + content scripts a `claude.ai` i `extensionpay.com`. Sense `tabs`, `<all_urls>`, `cookies`, `webRequest`. |
| Codi remot | ✅ | Tot va dins el zip. `tools/build_zip.py` comprova que no hi hagi `eval`, `new Function` ni scripts externs. ExtPay.js és una llibreria local; només fa peticions JSON. |
| Afiliació injectada | ✅ | Cap enllaç d'afiliat ni modificació d'enllaços. |
| Metadades sense spam | ✅ | Paraules clau integrades en frases, cap llista de keywords, sense testimonis inventats ni "#1". |
| Divulgació de dades | ✅ | Política de privacitat coherent amb el codi; formulari a `store/privacy-form.md`. |
| No és còpia | ✅ | Codi escrit de zero. Nom i icona propis. |
| Suplantació / marques | ⚠️ | "for Claude" és ús descriptiu i hi ha avís de no afiliació a la descripció. Si Google ho qüestiona, canvia el nom (opció 3 del PRD) i treu "Claude" del principi. |
| Qualitat mínima | ✅ | Funció real i completa, icona, 5 captures, descripció. |
| Pagaments | ✅ | Preus i límits explicats a la descripció. Cancel·lació fàcil. |

## Zip final

```bash
python tools/build_zip.py
```

Genera `dist/folders-for-claude-1.0.0.zip`. Cada vegada que publiquis una actualització, **puja el número de `version`** a `extension/manifest.json` (1.0.1, 1.1.0…).

## Abans de publicar (una sola vegada)

1. **Correu de suport**: ✅ `hola.mapph@gmail.com` (ja posat a `docs/index.html` i `docs/privacy-policy.html`).
2. **GitHub Pages** (gratis):
   1. Crea un repositori públic a GitHub, p. ex. `folders-for-claude`.
   2. Puja-hi la carpeta `docs/` (pots pujar tot el projecte; `dist/` no cal).
   3. Settings → Pages → Source: *Deploy from a branch* → Branch `main`, carpeta `/docs` → Save.
   4. En 1-2 minuts tindràs: `https://<usuari>.github.io/folders-for-claude/privacy-policy.html`.
3. **ExtensionPay**: comptes creats i ID `mapph-claude-folders` registrat (veure `pla/04-monetitzacio.md`).

## Registrar-te com a desenvolupador (5 $, pagament únic)

1. Ves a https://chrome.google.com/webstore/devconsole (amb el compte de Google del projecte).
2. Accepta l'acord de desenvolupador i paga la quota d'inscripció (5 $, un sol cop). **Això ho has de pagar tu.**
3. Account → omple el nom del desenvolupador (surt públicament; posa un nom de marca, p. ex. "Shelf Labs", per ser *faceless*) i verifica el correu de contacte.

## Pujar i omplir el panell

1. **+ New item** → puja `dist/folders-for-claude-1.0.0.zip`.
2. **Store listing**
   - Descripció: enganxa la versió anglesa de `store/listing.md`. Després, amb el selector d'idioma, afegeix-hi es, ca, fr, de, pt_BR, it.
   - Categoria: *Productivity → Workflow & Planning*. Idioma: English.
   - Icona de la botiga: 128×128 → `extension/icons/icon128.png`.
   - Captures: les 5 de `store/screenshots/` (1280×800).
   - Tile promocional petit: `store/screenshots/promo-small-440x280.png`.
   - Marquee (opcional): `store/screenshots/promo-marquee-1400x560.png`.
   - Web oficial: URL de GitHub Pages. URL d'assistència: la mateixa o `mailto:`.
3. **Privacy**: copia-ho tot de `store/privacy-form.md`.
4. **Distribution**: *Contains in-app purchases* / "Contiene compras en la aplicación" (tenim pla Pro de pagament; marcar "0 €" seria fals). Visibilitat: *Public*. Regions: totes.
5. **Submit for review**. Normalment tarda de 1 a 7 dies (les primeres vegades pot tardar més).

## Si la rebutgen

1. Rebràs un correu amb un **codi de violació** (p. ex. "Red Titanium", "Purple Potassium"…) i un text. També surt al panell, a *Status*.
2. Busca el codi a https://developer.chrome.com/docs/webstore/troubleshooting — cada codi explica la norma.
3. Els motius més probables per a nosaltres:
   - **Purple Potassium** (permisos excessius) → revisar justificacions; ja són mínimes.
   - **Yellow Argon / Yellow Zinc** (metadades / descripció) → treure frases que semblin llista de paraules clau.
   - **Suplantació de marca** ("Claude") → canviar el títol a una opció sense "Claude" al principi i reforçar l'avís.
   - **Purple Lithium** (privacitat) → la política ha de coincidir 100 % amb el formulari.
4. Enganxa'm el correu sencer: et dic què canviar, ho canvio, puges la versió (+1) i reenvies.
5. Si creus que és un error, pots apel·lar des del mateix correu (enllaç "appeal").

**PUNT DE CONTROL 6:** avisa'm quan estigui publicada.
