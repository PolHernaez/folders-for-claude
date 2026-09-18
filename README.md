# Folders for Claude

Extensió de Chrome (Manifest V3, JavaScript sense framework, sense build) que afegeix **carpetes** a la barra lateral de claude.ai. Freemium: 3 carpetes gratis, Pro il·limitat + sincronització.

## Estat (19/09/2026)

| Fase | Estat | Document |
|---|---|---|
| 1. Recerca | ✅ Feta (nínxol triat provisionalment: Claude) | [pla/01-recerca.md](pla/01-recerca.md) |
| 2. PRD, preu, nom | ✅ Proposta | [pla/02-prd.md](pla/02-prd.md) |
| 3. Construcció | ✅ Codi fet, provat en maqueta i a claude.ai real | [pla/03-proves.md](pla/03-proves.md) |
| 4. Monetització | ✅ ExtensionPay (`mapph-claude-folders`) + Stripe connectats · pagament i cancel·lació de prova OK · ⏳ activar Stripe en mode real | [pla/04-monetitzacio.md](pla/04-monetitzacio.md) |
| 5. Fitxa botiga | ✅ Textos 7 idiomes, captures, tile, privacitat | [store/](store/) |
| 6. Publicació | ✅ Zip + guia · ⏳ falta registre (5 $) | [pla/06-publicacio.md](pla/06-publicacio.md) |
| 7. Operació | ✅ Rutina escrita | [OPERACIO.md](OPERACIO.md) |

## Estructura

```
extension/                    ← el que es puja a la botiga
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
python tools/build_locales.py        # regenera _locales després d'editar textos
python tools/build_zip.py            # comprova i crea dist/folders-for-claude-<versió>.zip
python -m http.server 8765 --bind 127.0.0.1   # servidor del banc de proves
python tools/make_store_images.py    # regenera captures (amb el servidor engegat)
```

Banc de proves: amb el servidor engegat, obre `http://127.0.0.1:8765/tools/harness/claude-mock.html?seed=1&lang=ca` (paràmetres: `pro=1`, `reset=1`, `light=1`, `chat=3`, `demo=menu|search|folder|upgrade|add`).

## El que queda per fer (tu)

1. Activar el compte de Stripe en mode real (DNI, IBAN)
2. GitHub Pages (correu de suport ja posat: hola.mapph@gmail.com) → [pla/06-publicacio.md](pla/06-publicacio.md)
3. Pagar els 5 $ de desenvolupador, pujar el zip i enviar a revisió.
