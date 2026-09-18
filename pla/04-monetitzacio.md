# FASE 4 — Monetització

## Sistema triat: ExtensionPay (sobre Stripe)

Comprovat el 19/09/2026 a [extensionpay.com](https://extensionpay.com) i [stripe.com/es/pricing](https://stripe.com/es/pricing):

| Qui | Què cobra |
|---|---|
| ExtensionPay | **5 %** de cada cobrament. Sense quota mensual ni cost inicial. |
| Stripe (Espanya) | Targetes EEE estàndard **1,5 % + 0,25 €** · premium EEE 2,8 % + 0,25 € · Regne Unit 2,5 % + 0,25 € · internacionals 3,15 % + 0,25 € (+2 % si hi ha canvi de moneda) |

Exemple amb un pla anual de 24 $ pagat amb targeta dels EUA: 5 % (1,20) + 3,15 % (0,76) + 2 % canvi (0,48) + 0,25 € ≈ **2,70 $ de comissions → et queden ~21,30 $**.

ExtensionPay suporta: mensual, anual i pagament únic (per sempre), i també períodes de prova. Els diners van directament al teu compte de Stripe.

**Per què ExtensionPay:** zero servidor, llibreria oberta ([github.com/Glench/ExtPay](https://github.com/Glench/ExtPay), v3.1.1, ja inclosa a `extension/lib/ExtPay.js`), i gestiona les cancel·lacions per tu (pàgina de "gestionar subscripció").

## Com està integrat (ja fet)

- `background/service-worker.js` → crea `ExtPay("mapph-claude-folders")`, consulta si l'usuari ha pagat cada 6 h i ho guarda a `cf_pro`. Si no hi ha internet, fa servir l'últim valor conegut.
- Quan un usuari gratuït intenta crear la 4a carpeta → finestra "Passa't a Pro" amb el que inclou, "Pagament segur amb Stripe. Cancel·la quan vulguis amb un clic.", botó per veure plans i enllaç "Ja has pagat? Inicia sessió".
- Popup: estat Gratuït/Pro, botó de plans o "Gestiona la subscripció".
- Si la subscripció s'acaba, la sincronització es desactiva sola però **les carpetes no s'esborren mai** (només no se'n poden crear de noves fins tornar a 3).

## Què has de fer tu (pas a pas)

> ⚠️ No ho puc fer jo: són comptes a nom teu i hi ha dades bancàries.
> ⚠️ Si ets menor d'edat, Stripe no et deixarà obrir compte. Caldria que un adult responsable ho fes.
> ⚠️ Cobrar diners a Espanya té implicacions fiscals (IRPF, i a partir de cert volum, alta d'autònom). Mira el punt de "gestoria" a `OPERACIO.md`.

### 1. Compte de Stripe
1. Ves a https://dashboard.stripe.com/register
2. País: **Espanya**. Correu: un correu nou dedicat al projecte (recomanat, per mantenir-ho *faceless*).
3. Activa el compte ("Activate payments"):
   - Tipus d'empresa: **Individual / Persona física** (si no tens empresa).
   - Sector: *Software* → *Software as a service*.
   - Web del negoci: la URL de GitHub Pages (`https://<usuari>.github.io/<repo>/`).
   - Descripció del producte: `Browser extension subscription that adds folders to organize AI chat conversations.`
   - Nom que surt a l'extracte bancari (statement descriptor): `FOLDERSCLAUDE` (màx. 22 caràcters).
   - Compte bancari (IBAN) on vols cobrar.
4. Stripe et pot demanar el DNI per verificar-te. És normal.

### 2. Compte d'ExtensionPay
1. Ves a https://extensionpay.com/signup i crea el compte (amb el mateix correu del projecte).
2. **Register new extension** → ID de l'extensió: **`mapph-claude-folders`** (ha de ser exactament aquest, és el que hi ha al codi a `background/service-worker.js`).
3. Connecta el compte de Stripe (botó "Connect with Stripe").
4. Crea els plans:
   | Nickname | Preu | Interval |
   |---|---|---|
   | `monthly` | 3,99 USD | Mensual |
   | `yearly` | 24 USD | Anual |
   | `lifetime` | 39 USD | Pagament únic |
5. (Opcional) Afegeix el logo `extension/icons/icon128.png`.

### 3. Prova de pagament
1. Carrega l'extensió descomprimida (vegeu `pla/03-proves.md`). Una extensió descomprimida es registra a ExtensionPay en **mode de prova**.
2. Crea 3 carpetes a claude.ai → intenta crear-ne una 4a → "Mira els plans Pro".
3. En mode de prova, ExtensionPay et demanarà **la contrasenya del teu compte d'ExtensionPay** abans d'anar a Stripe (és una protecció seva). Després paga amb la targeta de prova de Stripe: `4242 4242 4242 4242`, qualsevol data futura, qualsevol CVC.
4. Tanca la pestanya de pagament → al cap d'uns segons, el popup ha de dir **Pro** i ja pots crear més carpetes.
5. Prova "Gestiona la subscripció" → cancel·la → torna a obrir el popup (o espera) i ha de tornar a **Gratuït**.

**PUNT DE CONTROL 4:** confirma'm que els comptes estan creats i que el pagament de prova funciona.
