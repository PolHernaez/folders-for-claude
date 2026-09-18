# FASE 2 — PRD: Folders for Claude

**Problema:** Els usuaris intensius de Claude acumulen centenars de xats en una llista cronològica i no troben res.

**Usuari objectiu:** Qui fa servir claude.ai cada dia a l'ordinador per a feina o estudis (desenvolupadors, redactors, consultors, estudiants) i té més de 50 xats.

**Promesa de valor (per a la fitxa):** "Organitza els teus xats de Claude en carpetes, directament a la barra lateral."

## Funcions del MVP (3)

1. **Carpetes a la barra lateral de Claude.** Crear, reanomenar, acolorir, plegar, reordenar (arrossegant) i esborrar.
2. **Afegir xats en un clic.** Botó "carpeta+" per al xat obert (tria carpeta o en crea una) + "Afegeix xats…" per afegir-ne molts de cop. Un xat pot estar a diverses carpetes. Arrossegar xats entre carpetes.
3. **Cerca** dins de noms de carpeta i títols de xat.

## Gratis vs Pro

| | Gratis | Pro |
|---|---|---|
| Carpetes | **3** | Il·limitades |
| Xats per carpeta | Il·limitats | Il·limitats |
| Cerca, colors, arrossegar | ✅ | ✅ |
| Còpia de seguretat (JSON) | ✅ | ✅ |
| Sincronització entre ordinadors | ❌ | ✅ (via Chrome sync) |

Per què 3 carpetes: n'hi ha prou per enganxar-se (ex. Feina / Estudis / Personal), però qui organitza de debò en vol més aviat. Easy Folders en dona 5; nosaltres 3 perquè el nostre Pro és més barat.

> La còpia de seguretat és gratis a propòsit: les dades són de l'usuari. Tancar-les darrere del pagament genera ressenyes dolentes.

## Preu proposat

| Pla | Preu | Comentari |
|---|---|---|
| Mensual | **3,99 $** | |
| Anual | **24 $** (2 $/mes) | El que recomanarem |
| De per vida | **39 $** | Bo per a usuaris que odien subscripcions |

Comparació: Easy Folders / Sortbase: £8,99/mes o £149,99 per sempre (*font de tercers, no verificada*). Nosaltres anem a menys de la meitat perquè som nous, sense ressenyes, i fem una sola cosa.

**Període de prova:** no a la v1. El pla gratuït ja fa de prova il·limitada. Afegir un "trial" de 7 dies complica el codi i no aporta gaire quan el gratuït ja funciona. Ho revisarem si la conversió és < 1%.

## Permisos

| Permís | Per què |
|---|---|
| `storage` | Guardar carpetes al navegador (i sincronitzar-les si és Pro). |
| Accés a `https://claude.ai/*` (content script) | Mostrar les carpetes a la barra lateral de Claude. |
| Accés a `https://extensionpay.com/*` (content script) | El requereix ExtensionPay per saber quan s'ha completat un pagament. |

No demanem `tabs`, `history`, `cookies`, `webRequest` ni accés a "totes les webs".

## Què NO farem a la v1

- Subcarpetes.
- Suport per a ChatGPT, Gemini, etc.
- Exportar converses (contingut dels missatges).
- Etiquetes, notes, prompts guardats.
- Servidor propi o comptes d'usuari.
- Llegir el contingut dels xats (només títol i ID).

## Noms proposats (amb la paraula clau)

1. **Folders for Claude – Organize & Search Chats** (44 caràcters) ← **el que he fet servir**
2. Claude Chat Folders – Organize Your Conversations (49)
3. Chat Folders for Claude: Sort, Color & Find Chats (50)

Recomano el 1: comença per "Folders" + "Claude", les dues paraules que la gent busca, i deixa clar que no som Anthropic ("for Claude"). El 2 comença per "Claude" i podria semblar oficial → més risc de rebuig per suplantació.

⚠️ Ja hi ha una extensió amb 1 usuari que es diu "Folders for Claude" (Daan25). No és il·legal repetir un nom descriptiu, però si vols evitar confusions, fes servir l'opció 3.
