# Pestanya "Privacy" del panell de desenvolupador

Copia i enganxa cada bloc al camp corresponent (en anglès).

## Single purpose description

```
Chat Folders has a single purpose: letting users organize their chatgpt.com conversations into folders shown inside ChatGPT's sidebar, so they can file, search and reopen chats quickly.
```

## Permission justification

**storage**
```
Used to save the user's folders (folder names, colors, order) and, for each chat the user files, the chat's ID and title. With the optional Pro sync setting, the same data is written to chrome.storage.sync so the user's folders appear on their other computers. No other data is stored.
```

**Host permission / content script: https://chatgpt.com/***
```
The content script inserts the Folders section into ChatGPT's sidebar and reads the ID (from the link URL) and visible title of chats so they can be added to folders and kept up to date when renamed. It never reads message content.
```

**Host permission / content script: https://extensionpay.com/***
```
Required by ExtPay.js (ExtensionPay's open-source payment library) to detect when the user completes or restores a purchase on extensionpay.com, so Pro features unlock immediately.
```

**Remote code**
Tria: **No, I am not using remote code.**
```
All JavaScript is bundled in the package. The extension only makes JSON requests to extensionpay.com to check the user's plan status.
```

## Data usage (què recollim)

Chrome defineix "recollir" com enviar dades fora del dispositiu. La nostra recomanació, per ser prudents i honestos:

| Categoria | Marcar? | Per què |
|---|---|---|
| Personally identifiable information | ❌ | L'email el recull ExtensionPay a la seva web, no l'extensió. |
| Health information | ❌ | |
| Financial and payment information | ❌ | El pagament es fa a la web d'ExtensionPay/Stripe. |
| Authentication information | ❌ | |
| Personal communications | ❌ | No llegim missatges. |
| Location | ❌ | |
| Web history | ❌ | |
| User activity | ❌ | |
| **Website content** | ✅ | Els títols dels xats es guarden i, si l'usuari activa la sincronització Pro, viatgen per Chrome sync. Millor declarar-ho que arriscar un rebuig. |

Després marca les **tres certificacions**:
- ✅ I do not sell or transfer user data to third parties, outside of the approved use cases.
- ✅ I do not use or transfer user data for purposes that are unrelated to my item's single purpose.
- ✅ I do not use or transfer user data to determine creditworthiness or for lending purposes.

**Privacy policy URL:** `https://polhernaez.github.io/folders-for-claude/chatgpt/privacy-policy.html`
