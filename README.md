# Folders for Claude

Extensió de Chrome (Manifest V3, JavaScript sense framework, sense build) que afegeix **carpetes** a la barra lateral de claude.ai. Freemium: 3 carpetes gratis, Pro il·limitat + sincronització.

## Estat (19/09/2026)

| Fase | Estat | Document |
|---|---|---|
| 1. Recerca | ✅ Feta (nínxol triat provisionalment: Claude) | [pla/01-recerca.md](pla/01-recerca.md) |
| 2. PRD, preu, nom | ✅ Proposta | [pla/02-prd.md](pla/02-prd.md) |
| 3. Construcció | ✅ Codi fet, provat en maqueta i a claude.ai real | [pla/03-proves.md](pla/03-proves.md) |
| 4. Monetització | ✅ ExtensionPay (`mapph-claude-folders`) + Stripe en mode real · pagament i cancel·lació de prova OK | [pla/04-monetitzacio.md](pla/04-monetitzacio.md) |
| 5. Fitxa botiga | ✅ Textos 7 idiomes, captures, tile, privacitat | [store/](store/) |
| 6. Publicació | ✅ **Publicada** el 21/09/2026 · [fitxa a la botiga](https://chromewebstore.google.com/detail/cjagakgmeodecbdhagkidecmngdelahp) | [pla/06-publicacio.md](pla/06-publicacio.md) |
| 7. Operació | ✅ Rutina escrita | [OPERACIO.md](OPERACIO.md) |
| Versió ChatGPT ("Chat Folders") | ✅ Codi, textos, imatges, web · ⏳ provar amb sessió iniciada, ExtensionPay, publicar | [pla/07-chatgpt.md](pla/07-chatgpt.md) |

## Estructura

```
extension/                    ← codi comú + versió Claude (el que es puja a la botiga)
platforms/chatgpt/            ← fitxers que canvien a la versió ChatGPT
  manifest.json               permisos i fitxers de l'extensió
  background/service-worker.js  pagaments (ExtensionPay), estat Pro, obre claude.ai en instal·lar
  content/storage.js          guarda/llegeix carpetes (local + sync en trossos)
  content/selectors.js        TOT el que depèn de l'HTML de claude.ai (l'únic fitxer a tocar si Claude canvia)
  content/content.js          la interfície: secció Carpetes, menús, finestres, arrossegar, cerca
  content/content.css         estils (dins Shadow DOM, no afecten Claude)
  popup/                      finestreta de la icona: estat, comptador, botons
  options/                    configuració: sincronització Pro, exportar/importar JSON
  lib/ExtPay.js               llibreria oficial d'ExtensionPay v3.1.1 (no tocar)
  _locales/                   textos en en, es, ca, fr, de, pt_BR, it
  icons/                      16, 32, 48, 128 px
store/                        textos de la fitxa, formulari de privacitat, captures
docs/                         web + política de privacitat (per a GitHub Pages)
pla/                          documents de cada fase
tools/                        scripts: idiomes, captures, zip, banc de proves
dist/                         zip final
```

## Ordres útils

```bash
python tools/build_locales.py [claude|chatgpt]   # regenera _locales després d'editar textos
python tools/build_zip.py [claude|chatgpt]   # comprova i crea els zips a dist/ (ChatGPT també a build/chatgpt/)
python -m http.server 8765 --bind 127.0.0.1   # servidor del banc de proves
python tools/make_store_images.py [claude|chatgpt]   # regenera captures (amb el servidor engegat)
```

Banc de proves: amb el servidor engegat, obre `http://127.0.0.1:8765/tools/harness/claude-mock.html?seed=1&lang=ca` (paràmetres: `pro=1`, `reset=1`, `light=1`, `chat=3`, `demo=menu|search|folder|upgrade|add`).

## El que queda per fer (tu)

1. Captures reals a claude.ai (les d'ara són d'una maqueta) i traduccions de la fitxa als altres idiomes.
2. Seguiment setmanal → [OPERACIO.md](OPERACIO.md)
3. Pujar la 1.0.1 com a actualització.
