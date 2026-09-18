# FASE 1 — Recerca del nínxol

**Data de la recerca:** 19/09/2026
**Font de les dades:** [chrome-stats.com](https://chrome-stats.com) (còpia diària de la Chrome Web Store, dades del 18/09/2026). La Chrome Web Store no es pot llegir automàticament (bloqueja les eines d'automatització), així que he fet servir chrome-stats. Els usuaris són els que mostra la botiga ("10.000+" surt com 10.000).

> ⚠️ El que **no** he pogut verificar ho marco com a *no verificat*. Els ingressos d'altres extensions no són públics: no n'he inventat cap.

---

## Nínxols mirats (14)

| # | Nínxol | Competidor principal (usuaris · valoració) | Observació ràpida |
|---|---|---|---|
| 1 | **Carpetes per a Claude** | Toolbox for Claude (1.000 · 4,83), Sortbase ex-Easy Folders (10.000 · 3,x, multi-plataforma) | Cap extensió específica de Claude passa de 1.000 usuaris. La líder té una ressenya d'ago-26 "no fa res". |
| 2 | Exportar xats d'IA (PDF/MD/Word) | ExportGPT (40.000 · 3,25), NousSave (3.000 · 4,64, **gratis**) | Molta demanda, però NousSave és bo i gratuït. |
| 3 | Carpetes per a NotebookLM | Bookshelf (50.000 · 4,30), FolderLM (40.000 · 4,22) | ❌ Google ja ha tret **"Collections"** natives. |
| 4 | Carpetes per a Gemini | Gemini Chat Folders (10.000 · 4,25), Superpower for Gemini (10.000 · 4,46) | Ple: 6+ extensions entre 5.000 i 10.000. |
| 5 | Carpetes per a ChatGPT | ChatGPT Chat Organizer (11.953 · 4,03, marcada *obsolete*), ChatGPT Folders (10.000 · 3,88) | ChatGPT ja té "Projects" natius. Molt saturat. |
| 6 | Comptador d'ús de Claude | Claude Usage Tracker (100.000 · 4,78, **gratis i open source**) | Mercat gran però el líder és gratuït i bo. |
| 7 | Eines per a venedors de Vinted | Dotb (10.000 · 4,57), Vinted Relister (1.000 · 3,29) | Es paga, però automatitzar Vinted viola els seus termes → risc de bans. |
| 8 | Eines per a Wallapop | Wallapop ChatTrack (1.000 · 5,0), "Wallapop,Vinted,Azeler Renovar" (744) | Demanda petita al Chrome (la gent usa l'app mòbil). |
| 9 | Assistència Google Meet | Google Meet Attendance List (400.000 · 4,73) | Líder fort i públic (professors) amb poca disposició a pagar. |
| 10 | Google Calendar | Checker Plus (300.000 · 4,42) | Líder fort. |
| 11 | LinkedIn feed blocker | LinkedIn Feed Blocker (3.000 · 4,67) | Demanda baixa, ningú paga. |
| 12 | YouTube Studio | No Youtube Studio Comment Widget (6.000 · 5,0) | Nínxols molt petits. |
| 13 | Gmail unsubscribe | Trimbox (60.000 · 4,45), InboxPurge (30.000 · 4,66) | Cal API de Gmail + verificació de Google (cara). Fora del nostre abast. |
| 14 | Prompts per a Claude/ChatGPT | MetaPrompt (100.000), Promptly (70.000) | Saturat. |

## Top 5 puntuats (1 = dolent, 5 = bo)

"Risc de plataforma" va a la inversa: 5 = poc risc.

| Nínxol | Demanda | Dolor | Competència feble | Disposició a pagar | Facilitat MV3 | Risc plataforma | **Total** |
|---|---|---|---|---|---|---|---|
| **Carpetes per a Claude** | 3 | 4 | 5 | 4 | 4 | 3 | **23** |
| Exportar xats d'IA | 5 | 3 | 2 | 3 | 3 | 4 | 20 |
| Carpetes per a Gemini | 4 | 3 | 2 | 3 | 4 | 3 | 19 |
| Venedors de Vinted | 3 | 4 | 3 | 5 | 2 | 1 | 18 |
| Carpetes per a NotebookLM | 4 | 2 | 3 | 2 | 4 | 1 | 16 |

## Recomanació: **Carpetes per a Claude**

Per què:

1. **És el model d'Easy Folders**, que ja vam validar, però a la plataforma on la competència és més fluixa. A ChatGPT i Gemini hi ha 5-10 extensions amb 5.000-12.000 usuaris cadascuna. A Claude, **la millor extensió de carpetes específica té 1.000 usuaris** i una ressenya recent diu que no funciona.
2. **Els usuaris de Claude instal·len extensions.** Claude Usage Tracker té 100.000 usuaris; Claude QoL, 20.000. Hi ha públic.
3. **Es paga per això.** Easy Folders (ara es diu Sortbase) cobra per carpetes il·limitades. Les ressenyes de Sortbase es queixen de fiabilitat, del mur de pagament i de com funciona amb Claude → hi ha forat per a una eina específica, simple i fiable.
4. **Tècnicament senzill**: només cal el permís `storage` i accés a claude.ai. Sense servidor.
5. **Dolor no resolt pels competidors**: sincronització entre dispositius (queixa repetida a Bookshelf i FolderLM) → ho resolem gratis amb `chrome.storage.sync`.

**Riscos (sincerament):**

- **Anthropic podria afegir carpetes.** Claude ja té "Projects", però serveixen per donar context compartit, no per endreçar xats. És el risc principal. Mitigació: sortir ràpid i, si passa, pivotar al 2n nínxol (exportació).
- **Hi ha moltes extensions petites de "carpetes per Claude" que no han tirat** (ChatShelf, Folders for Claude, Shelfpane… totes amb menys de 200 usuaris). Pot ser que la demanda sigui menor del que sembla, o que simplement fossin dolentes / mal posicionades. No ho puc saber amb certesa.
- **Canvis a l'HTML de claude.ai.** Mitigació: tots els selectors en un sol fitxer (`selectors.js`) i mode flotant de rescat.
- **Marca "Claude".** Fem servir "for Claude" (ús descriptiu) i un avís de no afiliació. Si la botiga ho qüestiona, cal canviar el nom.

**2n nínxol de reserva:** exportar xats d'IA a PDF/Markdown/Word (més demanda, més competència).

## Fonts principals

- Cerques a chrome-stats: `claude folders`, `claude export`, `claude usage`, `chatgpt folders`, `gemini folders`, `notebooklm`, `vinted`, `wallapop`, `google meet attendance`, `google calendar`, `linkedin feed`, `youtube studio`, `gmail unsubscribe`, `claude prompt`.
- Fitxes de detall: Toolbox for Claude (`hhbcdmmjedmlhkhlkohphknmbinblhjh`), Sortbase (`gdocioajfidpnaejbgmbnkflgmppibfe`), Bookshelf (`ibjbgddbhlcookmdhehgljaneccjidik`), FolderLM (`nknkgcmodkaiffdnlpmlnegmeamnbioe`), NotebookLM Ultra Exporter (`afchokljnhhggkhedfbmkcmdagjmjchj`), ExportGPT (`jamcijfplmgbngnppdhmbbogjebgfimn`).
- NotebookLM Collections natives: [nlmtools.com — Collections guide](https://www.nlmtools.com/blog/notebooklm-collections-guide).
- Preus d'Easy Folders (5 carpetes gratis; £8,99/mes o £149,99 per sempre): [brouseai.com](https://www.brouseai.com/ai/easy-folders) — *font de tercers, no verificat a la web oficial*.
