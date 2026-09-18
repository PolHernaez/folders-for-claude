# OPERACIÓ SETMANAL — Folders for Claude

Objectiu: **2-4 hores a la setmana.** Tria un dia fix (p. ex. diumenge a la tarda).

## 1. Revisió de números (20 min)

**Panell de la Chrome Web Store** → el teu item → *Analytics*:

| Mètrica | On | Apunta-la cada setmana |
|---|---|---|
| Instal·lacions noves | Installs | |
| Usuaris actius setmanals | Users → Weekly users | |
| Desinstal·lacions | Uninstalls | |
| Valoració mitjana i nº ressenyes | Ratings | |
| Impressions a la botiga → instal·lacions | Store listing → Conversion | |

**ExtensionPay** (dashboard) / **Stripe**:

| Mètrica | Apunta-la |
|---|---|
| Nous pagaments (mensual / anual / per sempre) | |
| Cancel·lacions | |
| MRR (ingressos recurrents mensuals) | |
| Conversió = pagadors nous / instal·lacions noves | |

Fes-ho en un full de càlcul amb una fila per setmana. Senyals d'alarma: desinstal·lacions > 50 % de les instal·lacions, o valoració < 4.

## 2. Sistema setmanal amb mi (30-60 min)

Cada setmana enganxa'm aquest bloc omplert:

```
SETMANA DEL __/__
Números: installs __, WAU __, uninstalls __, valoració __ (__ ressenyes), pagaments __, cancel·lacions __, MRR __ $
Ressenyes noves (copia-les senceres):
- ...
Correus de suport nous (sense dades personals):
- ...
Canvis que ha fet Claude.ai que hagis notat:
- ...
```

Jo et retornaré:
1. Respostes a cada ressenya i correu, llestes per enganxar.
2. Bugs a arreglar (amb el codi arreglat).
3. Millores ordenades per impacte (instal·lacions/conversió vs esforç).

## 3. Plantilles de suport

**EN — Not showing up**
```
Hi! Thanks for trying Folders for Claude. Could you try this: 1) reload claude.ai, 2) make sure the sidebar is expanded (if it's collapsed you'll see a round folder button at the bottom-left instead). If it still doesn't appear, reply with your Chrome version (chrome://version) and a screenshot and I'll fix it quickly.
```

**ES — No aparece**
```
¡Hola! Gracias por probar Carpetas para Claude. Prueba esto: 1) recarga claude.ai, 2) comprueba que la barra lateral esté abierta (si está plegada verás un botón redondo de carpeta abajo a la izquierda). Si sigue sin salir, respóndeme con tu versión de Chrome (chrome://version) y una captura y lo arreglo enseguida.
```

**EN — Paid but still Free**
```
Sorry about that! Open the extension popup and click "Already paid? Log in", then use the same email you paid with. Pro unlocks within a few seconds. If not, reply with that email and I'll check it manually.
```

**ES — He pagado y sigue en Gratis**
```
¡Perdona! Abre el popup de la extensión y pulsa "¿Ya pagaste? Inicia sesión" con el mismo email del pago. Pro se activa en unos segundos. Si no, respóndeme con ese email y lo reviso a mano.
```

**EN — Cancel / refund**
```
No problem. Click the extension icon → "Manage subscription" to cancel in one click. If you were charged recently and didn't use Pro, reply and I'll refund you in full.
```

**ES — Cancelar / reembolso**
```
Sin problema. Pulsa el icono de la extensión → "Gestionar suscripción" y cancelas en un clic. Si te cobramos hace poco y no lo has usado, respóndeme y te devuelvo el dinero.
```

**EN — Lost my folders**
```
Folders are stored in your browser. They can disappear if the extension was removed or Chrome data was cleared. If you exported a backup, go to Settings → Import. Tip for the future: export a backup now and then, or turn on Sync (Pro).
```

**ES — He perdido mis carpetas**
```
Las carpetas se guardan en tu navegador y pueden desaparecer si se eliminó la extensión o se borraron los datos de Chrome. Si exportaste una copia, ve a Ajustes → Importar. Consejo: exporta una copia de vez en cuando o activa la sincronización (Pro).
```

**EN — Feature request**
```
Great idea, thanks! I've added it to the list. I ship an update every 2-4 weeks and prioritize what most people ask for.
```

**ES — Petición de función**
```
¡Buena idea, gracias! La he apuntado. Publico una actualización cada 2-4 semanas y priorizo lo que más gente pide.
```

Respon **sempre** a les ressenyes d'1-3 estrelles en menys de 48 h, amable i amb solució. Les respostes són públiques i també venen.

## 4. Cadència d'actualitzacions

- **Una actualització cada 2-4 setmanes**, encara que sigui petita. La frescor compta al rànquing i dona confiança ("Updated: fa 5 dies").
- **Arreglar urgent** (el mateix dia si pots) quan claude.ai canviï i l'extensió deixi d'aparèixer: normalment només cal tocar `extension/content/selectors.js`.
- Procés: canviar codi → `version` +1 al manifest → `python tools/build_zip.py` → panell → *Package → Upload new package* → *Submit for review*.
- Idees de v1.1-v1.3 (ordenades): subcarpetes (Pro), botó "afegir a carpeta" a cada fila de la barra de Claude, exportar carpeta a Markdown, més idiomes (ja, ko, zh, pl, nl, tr).

## 5. Demanar valoracions (dins les normes)

Ja està programat: després que l'usuari hagi afegit **10 xats a carpetes** (és a dir, que ja n'ha tret profit), surt **una sola vegada** un avís discret a sota de les carpetes amb "Valora-la" / "Ara no". No torna a sortir mai. Mai abans d'un ús amb èxit, mai amb finestres emergents, mai oferint res a canvi (prohibit per Google).

## 6. Criteris de decisió

- **Als 3 mesos, > 2.000 instal·lacions i < 50 $/mes** → proposar canvis al mur de pagament o preu (p. ex. límit de 2 carpetes, o afegir subcarpetes només a Pro). Si en 1 mes més no millora → aturar i passar al 2n nínxol (exportació de xats d'IA, veure `pla/01-recerca.md`).
- **> 500 $/mes** → reinvertir: eina d'ASO (p. ex. un mes de chrome-stats Pro), funcions Pro noves, segona extensió al mateix nínxol (exportador per a Claude).
- **> 1.000 $/mes estables** → ⚠️ **parla amb una gestoria** per donar-te d'alta d'autònom (tarifa plana per a nous autònoms). De fet, fes-hi una consulta quan comencis a cobrar qualsevol import regular: els ingressos s'han de declarar igualment a la renda.
