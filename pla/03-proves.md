# FASE 3 — Com provar l'extensió

## Carregar-la al teu Chrome (2 minuts)

1. Obre `chrome://extensions`.
2. Activa **Mode de desenvolupador** (dalt a la dreta).
3. **Carrega l'extensió descomprimida** → tria la carpeta `ExtensioProva\extension`.
4. Obre https://claude.ai. Ha d'aparèixer la secció **Carpetes** damunt de "Fijados"/"Chats y tareas".
5. Si canvies codi: botó 🔄 de l'extensió a `chrome://extensions` + recarrega claude.ai.

Per veure errors: a claude.ai, F12 → Console → filtra per `Folders for Claude`. Per al service worker: `chrome://extensions` → "Service worker" → Inspect.

## Proves automàtiques ja fetes (per mi)

Amb una maqueta de la barra lateral (`tools/harness/claude-mock.html`) que imita l'estructura HTML real de claude.ai (la vaig llegir del teu Chrome el 19/09/2026, només l'estructura, sense contingut):

- ✅ Crear carpeta (botó i Enter), afegir el xat obert, crear 3 i bloquejar la 4a amb la finestra Pro
- ✅ Obrir un xat des de la carpeta (navegació interna), marcar el xat actual
- ✅ Actualitzar títol quan canvia el nom a Claude
- ✅ Afegir xats en bloc amb cerca, canviar color, reanomenar, plegar, esborrar amb confirmació, treure xat
- ✅ Cerca dins carpetes i "Cap resultat"
- ✅ Sincronització: 20 carpetes × 20 xats (400 xats, amb accents i cometes) → 6 trossos, màxim 7.527 bytes per clau (límit de Chrome: 8.192)
- ✅ Barra lateral plegada → botó flotant; desplegada → torna a la barra
- ✅ Textos en català, castellà i anglès

**No provat encara (cal que ho facis tu):** claude.ai real, pagament, `chrome.storage.sync` real entre dos ordinadors.

## Checklist manual

### Casos normals
- [ ] Apareix "Carpetes" a la barra lateral de claude.ai
- [ ] `+` → crear "Feina" → apareix
- [ ] Obrir un xat → botó carpeta+ (a la capçalera de Carpetes) → marcar "Feina" → el xat surt dins la carpeta
- [ ] Clicar el xat dins la carpeta → s'obre sense recarregar la pàgina
- [ ] Ctrl+clic → s'obre en una pestanya nova
- [ ] `⋯` de la carpeta → Afegeix xats… → marcar-ne 3 → Desa
- [ ] `⋯` → canviar color, reanomenar
- [ ] Arrossegar un xat d'una carpeta a una altra
- [ ] Arrossegar una carpeta sobre una altra (reordenar)
- [ ] Lupa → escriure part d'un títol → filtra
- [ ] Canviar el nom d'un xat a Claude → la carpeta s'actualitza en uns segons
- [ ] Popup de l'extensió: mostra "N carpetes · M xats"
- [ ] Configuració → Exporta → s'ha descarregat un JSON → Importa'l → torna a estar igual

### Casos límit
- [ ] Crear la 4a carpeta sent gratuït → finestra Pro (i no es crea)
- [ ] Nom de carpeta molt llarg (60+ caràcters) → es talla amb "…"
- [ ] Esborrar un xat a Claude que és dins una carpeta → segueix a la carpeta; clicar-lo porta a un xat inexistent → treure'l amb ✕ (limitació coneguda v1)
- [ ] Plegar la barra lateral de Claude → apareix el botó rodó flotant a baix a l'esquerra
- [ ] Finestra estreta (mòbil) → botó flotant
- [ ] Mode clar i fosc de Claude (Configuració de Claude → Aparença) → recarregar → colors correctes
- [ ] Dues pestanyes de claude.ai obertes → crear carpeta a una → apareix a l'altra
- [ ] Escriure el nom d'una carpeta: cap tecla s'escriu al quadre de xat de Claude
- [ ] Escape tanca menús i finestres

### Sense connexió
- [ ] Desconnecta el Wi-Fi → recarrega claude.ai (si carrega de memòria cau) → les carpetes surten igual (són locals)
- [ ] Popup sense connexió → mostra l'últim estat Pro/Gratuït conegut

### Compte nou de Claude
- [ ] Compte sense cap xat → surt "+ Crea la teva primera carpeta"
- [ ] El botó carpeta+ només apareix quan hi ha un xat obert

### Rendiment
- [ ] Amb 200+ xats a la barra lateral, escriure a Claude no va més lent (el codi espera 400 ms entre revisions)
- [ ] Mentre Claude respon (streaming), no hi ha parpelleig a les carpetes

**PUNT DE CONTROL 3:** prova-la a claude.ai i passa'm els errors (captura + què has fet).
