# Generates extension/_locales/*/messages.json from the table below.
# Edit the texts here and run:  python tools/build_locales.py [claude|chatgpt]
import json, os, sys

ROOT = os.path.join(os.path.dirname(__file__), "..", "extension", "_locales")

LANGS = ["en", "es", "ca", "fr", "de", "pt_BR", "it"]

M = {
"extName": [
 "Folders for Claude – Organize & Search Chats",
 "Carpetas para Claude – Organiza y busca chats",
 "Carpetes per a Claude – Organitza i cerca xats",
 "Dossiers pour Claude – Organisez vos chats",
 "Ordner für Claude – Chats organisieren & suchen",
 "Pastas para Claude – Organize e busque chats",
 "Cartelle per Claude – Organizza e cerca chat"],
"extShortName": ["Folders for Claude","Carpetas para Claude","Carpetes per a Claude","Dossiers pour Claude","Ordner für Claude","Pastas para Claude","Cartelle per Claude"],
"extDescription": [
 "Organize your Claude chats into folders right in the sidebar. Search, color-code and find any conversation in seconds.",
 "Organiza tus chats de Claude en carpetas dentro de la barra lateral. Busca, colorea y encuentra cualquier conversación.",
 "Organitza els teus xats de Claude en carpetes a la barra lateral. Cerca, acoloreix i troba qualsevol conversa en segons.",
 "Rangez vos chats Claude dans des dossiers, directement dans la barre latérale. Recherchez et retrouvez tout en secondes.",
 "Sortiere deine Claude-Chats in Ordner direkt in der Seitenleiste. Suchen, farbig markieren, alles in Sekunden finden.",
 "Organize seus chats do Claude em pastas na barra lateral. Pesquise, use cores e encontre qualquer conversa em segundos.",
 "Organizza le chat di Claude in cartelle nella barra laterale. Cerca, colora e trova ogni conversazione in pochi secondi."],
"folders": ["Folders","Carpetas","Carpetes","Dossiers","Ordner","Pastas","Cartelle"],
"addCurrentChat": ["Add this chat to a folder","Añadir este chat a una carpeta","Afegeix aquest xat a una carpeta","Ajouter ce chat à un dossier","Diesen Chat zu einem Ordner hinzufügen","Adicionar este chat a uma pasta","Aggiungi questa chat a una cartella"],
"search": ["Search","Buscar","Cerca","Rechercher","Suchen","Pesquisar","Cerca"],
"newFolder": ["New folder","Nueva carpeta","Carpeta nova","Nouveau dossier","Neuer Ordner","Nova pasta","Nuova cartella"],
"newFolderWithChat": ["New folder with this chat…","Nueva carpeta con este chat…","Carpeta nova amb aquest xat…","Nouveau dossier avec ce chat…","Neuer Ordner mit diesem Chat…","Nova pasta com este chat…","Nuova cartella con questa chat…"],
"searchInFolders": ["Search in folders…","Buscar en carpetas…","Cerca a les carpetes…","Rechercher dans les dossiers…","In Ordnern suchen…","Pesquisar nas pastas…","Cerca nelle cartelle…"],
"folderOptions": ["Folder options","Opciones de carpeta","Opcions de la carpeta","Options du dossier","Ordneroptionen","Opções da pasta","Opzioni cartella"],
"removeFromFolder": ["Remove from folder","Quitar de la carpeta","Treu de la carpeta","Retirer du dossier","Aus Ordner entfernen","Remover da pasta","Rimuovi dalla cartella"],
"untitled": ["Untitled chat","Chat sin título","Xat sense títol","Chat sans titre","Unbenannter Chat","Chat sem título","Chat senza titolo"],
"emptyFolder": ["Empty. Open a chat and use the folder+ button.","Vacía. Abre un chat y usa el botón carpeta+.","Buida. Obre un xat i fes servir el botó carpeta+.","Vide. Ouvrez un chat et utilisez le bouton dossier+.","Leer. Öffne einen Chat und nutze den Ordner+-Button.","Vazia. Abra um chat e use o botão pasta+.","Vuota. Apri una chat e usa il pulsante cartella+."],
"createFirstFolder": ["+ Create your first folder","+ Crea tu primera carpeta","+ Crea la teva primera carpeta","+ Créez votre premier dossier","+ Erstelle deinen ersten Ordner","+ Crie sua primeira pasta","+ Crea la tua prima cartella"],
"noResults": ["No matches","Sin resultados","Cap resultat","Aucun résultat","Keine Treffer","Nenhum resultado","Nessun risultato"],
"freeLimitReached": ["Free plan: $1 folders. Upgrade for unlimited →","Plan gratis: $1 carpetas. Pásate a Pro para ilimitadas →","Pla gratuït: $1 carpetes. Passa't a Pro per tenir-ne il·limitades →","Offre gratuite : $1 dossiers. Passez à Pro pour l'illimité →","Kostenlos: $1 Ordner. Upgrade für unbegrenzt →","Plano grátis: $1 pastas. Faça upgrade para ilimitadas →","Piano gratuito: $1 cartelle. Passa a Pro per illimitate →"],
"rateAsk": ["Folders helping you? A quick rating helps a solo developer a lot.","¿Te ayudan las carpetas? Una valoración rápida ayuda mucho a un desarrollador independiente.","T'ajuden les carpetes? Una valoració ràpida ajuda molt a un desenvolupador independent.","Les dossiers vous aident ? Une note rapide aide beaucoup un développeur indépendant.","Helfen dir die Ordner? Eine kurze Bewertung hilft einem Solo-Entwickler sehr.","As pastas estão ajudando? Uma avaliação rápida ajuda muito um desenvolvedor independente.","Le cartelle ti aiutano? Una valutazione veloce aiuta molto uno sviluppatore indipendente."],
"rateYes": ["Rate it","Valorar","Valora-la","Noter","Bewerten","Avaliar","Valuta"],
"dismiss": ["Not now","Ahora no","Ara no","Plus tard","Nicht jetzt","Agora não","Non ora"],
"syncFull": ["Sync storage is full. Your folders are still saved on this device.","El almacenamiento de sincronización está lleno. Tus carpetas siguen guardadas en este dispositivo.","L'emmagatzematge de sincronització és ple. Les carpetes continuen desades en aquest dispositiu.","Le stockage de synchronisation est plein. Vos dossiers restent enregistrés sur cet appareil.","Der Sync-Speicher ist voll. Deine Ordner sind auf diesem Gerät weiterhin gespeichert.","O armazenamento de sincronização está cheio. Suas pastas continuam salvas neste dispositivo.","Lo spazio di sincronizzazione è pieno. Le cartelle restano salvate su questo dispositivo."],
"upgradeTitle": ["Upgrade to Pro","Pásate a Pro","Passa't a Pro","Passer à Pro","Auf Pro upgraden","Faça upgrade para Pro","Passa a Pro"],
"upgradeText": ["The free plan includes $1 folders with unlimited chats. Pro removes the limit:","El plan gratis incluye $1 carpetas con chats ilimitados. Pro quita el límite:","El pla gratuït inclou $1 carpetes amb xats il·limitats. Pro treu el límit:","L'offre gratuite inclut $1 dossiers avec chats illimités. Pro supprime la limite :","Der Gratis-Plan enthält $1 Ordner mit unbegrenzten Chats. Pro hebt das Limit auf:","O plano grátis inclui $1 pastas com chats ilimitados. O Pro remove o limite:","Il piano gratuito include $1 cartelle con chat illimitate. Pro rimuove il limite:"],
"proFeature1": ["Unlimited folders","Carpetas ilimitadas","Carpetes il·limitades","Dossiers illimités","Unbegrenzte Ordner","Pastas ilimitadas","Cartelle illimitate"],
"proFeature2": ["Sync folders across your computers (Chrome sync)","Sincroniza las carpetas entre tus ordenadores (sincronización de Chrome)","Sincronitza les carpetes entre els teus ordinadors (sincronització de Chrome)","Synchronisez vos dossiers entre vos ordinateurs (synchro Chrome)","Ordner zwischen deinen Computern synchronisieren (Chrome-Sync)","Sincronize as pastas entre seus computadores (sincronização do Chrome)","Sincronizza le cartelle tra i tuoi computer (sincronizzazione di Chrome)"],
"proFeature3": ["Support an independent developer and future features","Apoya a un desarrollador independiente y las próximas funciones","Dona suport a un desenvolupador independent i a les properes funcions","Soutenez un développeur indépendant et les prochaines fonctions","Unterstütze einen unabhängigen Entwickler und neue Funktionen","Apoie um desenvolvedor independente e os próximos recursos","Sostieni uno sviluppatore indipendente e le prossime funzioni"],
"upgradeCancel": ["Secure payment with Stripe. Cancel anytime in one click.","Pago seguro con Stripe. Cancela cuando quieras con un clic.","Pagament segur amb Stripe. Cancel·la quan vulguis amb un clic.","Paiement sécurisé par Stripe. Résiliable à tout moment en un clic.","Sichere Zahlung über Stripe. Jederzeit mit einem Klick kündbar.","Pagamento seguro com Stripe. Cancele quando quiser com um clique.","Pagamento sicuro con Stripe. Annulla quando vuoi con un clic."],
"restorePurchase": ["Already paid? Log in","¿Ya pagaste? Inicia sesión","Ja has pagat? Inicia sessió","Déjà payé ? Connectez-vous","Schon bezahlt? Anmelden","Já pagou? Entre","Hai già pagato? Accedi"],
"upgradeButton": ["See Pro plans","Ver planes Pro","Mira els plans Pro","Voir les offres Pro","Pro-Pläne ansehen","Ver planos Pro","Vedi i piani Pro"],
"manageSubscription": ["Manage subscription","Gestionar suscripción","Gestiona la subscripció","Gérer l'abonnement","Abo verwalten","Gerenciar assinatura","Gestisci abbonamento"],
"close": ["Close","Cerrar","Tanca","Fermer","Schließen","Fechar","Chiudi"],
"cancel": ["Cancel","Cancelar","Cancel·la","Annuler","Abbrechen","Cancelar","Annulla"],
"save": ["Save","Guardar","Desa","Enregistrer","Speichern","Salvar","Salva"],
"delete": ["Delete","Eliminar","Elimina","Supprimer","Löschen","Excluir","Elimina"],
"deleteFolder": ["Delete folder","Eliminar carpeta","Elimina la carpeta","Supprimer le dossier","Ordner löschen","Excluir pasta","Elimina cartella"],
"deleteConfirm": ["Delete \"$1\"? Your chats stay in Claude; only the folder is removed.","¿Eliminar \"$1\"? Tus chats siguen en Claude; solo se borra la carpeta.","Vols eliminar \"$1\"? Els xats continuen a Claude; només s'esborra la carpeta.","Supprimer « $1 » ? Vos chats restent dans Claude ; seul le dossier est supprimé.","\"$1\" löschen? Deine Chats bleiben in Claude, nur der Ordner wird entfernt.","Excluir \"$1\"? Seus chats continuam no Claude; só a pasta é removida.","Eliminare \"$1\"? Le chat restano in Claude; viene rimossa solo la cartella."],
"searchChats": ["Search chats…","Buscar chats…","Cerca xats…","Rechercher des chats…","Chats suchen…","Pesquisar chats…","Cerca chat…"],
"noChatsVisible": ["No chats found on this page.","No hay chats en esta página.","No hi ha xats en aquesta pàgina.","Aucun chat trouvé sur cette page.","Keine Chats auf dieser Seite gefunden.","Nenhum chat nesta página.","Nessuna chat in questa pagina."],
"moreChatsHint": ["Only chats loaded on the page are listed.","Solo aparecen los chats cargados en la página.","Només surten els xats carregats a la pàgina.","Seuls les chats chargés sur la page sont listés.","Nur auf der Seite geladene Chats werden angezeigt.","Só aparecem os chats carregados na página.","Sono elencate solo le chat caricate nella pagina."],
"openChatsPage": ["Open the Chats page to see more","Abre la página de Chats para ver más","Obre la pàgina de Xats per veure'n més","Ouvrez la page Chats pour en voir plus","Öffne die Chats-Seite für mehr","Abra a página de Chats para ver mais","Apri la pagina Chat per vederne altre"],
"addChatsTo": ["Add chats to \"$1\"","Añadir chats a \"$1\"","Afegeix xats a \"$1\"","Ajouter des chats à « $1 »","Chats zu \"$1\" hinzufügen","Adicionar chats a \"$1\"","Aggiungi chat a \"$1\""],
"addChats": ["Add chats…","Añadir chats…","Afegeix xats…","Ajouter des chats…","Chats hinzufügen…","Adicionar chats…","Aggiungi chat…"],
"rename": ["Rename","Cambiar nombre","Canvia el nom","Renommer","Umbenennen","Renomear","Rinomina"],
"openClaude": ["Open Claude","Abrir Claude","Obre Claude","Ouvrir Claude","Claude öffnen","Abrir o Claude","Apri Claude"],
"settings": ["Settings & backup","Ajustes y copia de seguridad","Configuració i còpia de seguretat","Paramètres et sauvegarde","Einstellungen & Backup","Configurações e backup","Impostazioni e backup"],
"popupStats": ["$1 folders · $2 chats organized","$1 carpetas · $2 chats organizados","$1 carpetes · $2 xats organitzats","$1 dossiers · $2 chats organisés","$1 Ordner · $2 Chats organisiert","$1 pastas · $2 chats organizados","$1 cartelle · $2 chat organizzate"],
"free": ["Free","Gratis","Gratuït","Gratuit","Gratis","Grátis","Gratis"],
"popupFreeLimit": ["Free plan: up to $1 folders, unlimited chats.","Plan gratis: hasta $1 carpetas, chats ilimitados.","Pla gratuït: fins a $1 carpetes, xats il·limitats.","Offre gratuite : jusqu'à $1 dossiers, chats illimités.","Gratis: bis zu $1 Ordner, unbegrenzte Chats.","Plano grátis: até $1 pastas, chats ilimitados.","Piano gratuito: fino a $1 cartelle, chat illimitate."],
"syncTitle": ["Sync across devices (Pro)","Sincronizar entre dispositivos (Pro)","Sincronitza entre dispositius (Pro)","Synchroniser entre appareils (Pro)","Geräteübergreifend synchronisieren (Pro)","Sincronizar entre dispositivos (Pro)","Sincronizza tra dispositivi (Pro)"],
"syncText": ["Uses Chrome's own sync (your Google account). Nothing is sent to our servers.","Usa la sincronización de Chrome (tu cuenta de Google). No se envía nada a nuestros servidores.","Fa servir la sincronització de Chrome (el teu compte de Google). No s'envia res als nostres servidors.","Utilise la synchronisation de Chrome (votre compte Google). Rien n'est envoyé à nos serveurs.","Nutzt Chromes eigene Synchronisierung (dein Google-Konto). Nichts wird an unsere Server gesendet.","Usa a sincronização do Chrome (sua conta Google). Nada é enviado aos nossos servidores.","Usa la sincronizzazione di Chrome (il tuo account Google). Nulla viene inviato ai nostri server."],
"syncToggle": ["Sync my folders","Sincronizar mis carpetas","Sincronitza les meves carpetes","Synchroniser mes dossiers","Meine Ordner synchronisieren","Sincronizar minhas pastas","Sincronizza le mie cartelle"],
"syncOn": ["Sync is on.","Sincronización activada.","Sincronització activada.","Synchronisation activée.","Synchronisierung aktiv.","Sincronização ativada.","Sincronizzazione attiva."],
"syncOff": ["Sync is off. Folders stay on this device.","Sincronización desactivada. Las carpetas se quedan en este dispositivo.","Sincronització desactivada. Les carpetes es queden en aquest dispositiu.","Synchronisation désactivée. Les dossiers restent sur cet appareil.","Synchronisierung aus. Ordner bleiben auf diesem Gerät.","Sincronização desativada. As pastas ficam neste dispositivo.","Sincronizzazione disattivata. Le cartelle restano su questo dispositivo."],
"backupTitle": ["Backup","Copia de seguridad","Còpia de seguretat","Sauvegarde","Backup","Backup","Backup"],
"backupText": ["Download your folders as a JSON file or restore them from one.","Descarga tus carpetas en un archivo JSON o restáuralas desde uno.","Descarrega les carpetes en un fitxer JSON o restaura-les des d'un.","Téléchargez vos dossiers en JSON ou restaurez-les depuis un fichier.","Lade deine Ordner als JSON-Datei herunter oder stelle sie daraus wieder her.","Baixe suas pastas em um arquivo JSON ou restaure a partir de um.","Scarica le cartelle in un file JSON o ripristinale da uno."],
"exportJson": ["Export","Exportar","Exporta","Exporter","Exportieren","Exportar","Esporta"],
"importJson": ["Import","Importar","Importa","Importer","Importieren","Importar","Importa"],
"importDone": ["Imported $1 folders.","Importadas $1 carpetas.","S'han importat $1 carpetes.","$1 dossiers importés.","$1 Ordner importiert.","$1 pastas importadas.","$1 cartelle importate."],
"importTooMany": ["Free plan: only the first $1 folders were imported.","Plan gratis: solo se importaron las primeras $1 carpetas.","Pla gratuït: només s'han importat les primeres $1 carpetes.","Offre gratuite : seuls les $1 premiers dossiers ont été importés.","Gratis-Plan: nur die ersten $1 Ordner wurden importiert.","Plano grátis: só as primeiras $1 pastas foram importadas.","Piano gratuito: importate solo le prime $1 cartelle."],
"importError": ["That file is not a valid backup.","Ese archivo no es una copia válida.","Aquest fitxer no és una còpia vàlida.","Ce fichier n'est pas une sauvegarde valide.","Diese Datei ist kein gültiges Backup.","Esse arquivo não é um backup válido.","Questo file non è un backup valido."],
"privacyTitle": ["Privacy","Privacidad","Privadesa","Confidentialité","Datenschutz","Privacidade","Privacy"],
"privacyText": ["Folder names, chat IDs and chat titles are stored only in your browser. We never read your messages.","Los nombres de carpetas, IDs y títulos de chats se guardan solo en tu navegador. Nunca leemos tus mensajes.","Els noms de carpetes, IDs i títols dels xats només es guarden al teu navegador. Mai llegim els teus missatges.","Noms de dossiers, identifiants et titres de chats sont stockés uniquement dans votre navigateur. Nous ne lisons jamais vos messages.","Ordnernamen, Chat-IDs und Chat-Titel werden nur in deinem Browser gespeichert. Wir lesen nie deine Nachrichten.","Nomes de pastas, IDs e títulos de chats ficam só no seu navegador. Nunca lemos suas mensagens.","Nomi delle cartelle, ID e titoli delle chat restano solo nel tuo browser. Non leggiamo mai i tuoi messaggi."]
}

# ChatGPT build: same texts with the platform name swapped, plus a few overrides.
# OpenAI doesn't allow "ChatGPT" in product names, so the name is generic and
# ChatGPT only appears descriptively ("Works with ChatGPT").
CHATGPT_OVERRIDES = {
"extName": [
 "Chat Folders – Organize & Search AI Chats",
 "Carpetas de chats – Organiza y busca chats de IA",
 "Carpetes de xats – Organitza i cerca xats d'IA",
 "Dossiers de chats – Organisez vos chats IA",
 "Chat-Ordner – KI-Chats organisieren & suchen",
 "Pastas de chats – Organize e busque chats de IA",
 "Cartelle chat – Organizza e cerca chat IA"],
"extShortName": ["Chat Folders","Carpetas de chats","Carpetes de xats","Dossiers de chats","Chat-Ordner","Pastas de chats","Cartelle chat"],
"extDescription": [
 "Works with ChatGPT. Organize your chats into folders right in the sidebar. Search, color-code and find any conversation.",
 "Funciona con ChatGPT. Organiza tus chats en carpetas en la barra lateral. Busca, colorea y encuentra cualquier conversación.",
 "Funciona amb ChatGPT. Organitza els xats en carpetes a la barra lateral. Cerca, acoloreix i troba qualsevol conversa.",
 "Fonctionne avec ChatGPT. Rangez vos chats dans des dossiers dans la barre latérale et retrouvez tout en secondes.",
 "Funktioniert mit ChatGPT. Sortiere Chats in Ordner direkt in der Seitenleiste. Suchen, einfärben, schnell finden.",
 "Funciona com o ChatGPT. Organize seus chats em pastas na barra lateral. Pesquise, use cores e encontre qualquer conversa.",
 "Funziona con ChatGPT. Organizza le chat in cartelle nella barra laterale. Cerca, colora e trova ogni conversazione."],
"moreChatsHint": [
 "Only chats loaded in the sidebar are listed. Scroll down the sidebar to load older ones.",
 "Solo aparecen los chats cargados en la barra lateral. Baja por la barra lateral para cargar los más antiguos.",
 "Només surten els xats carregats a la barra lateral. Baixa per la barra lateral per carregar-ne de més antics.",
 "Seuls les chats chargés dans la barre latérale sont listés. Faites défiler la barre latérale pour charger les plus anciens.",
 "Nur in der Seitenleiste geladene Chats werden angezeigt. Scrolle in der Seitenleiste nach unten, um ältere zu laden.",
 "Só aparecem os chats carregados na barra lateral. Role a barra lateral para carregar os mais antigos.",
 "Sono elencate solo le chat caricate nella barra laterale. Scorri la barra laterale per caricare quelle più vecchie."],
}

PLATFORMS = {
    "claude": (ROOT, lambda s: s, {}),
    "chatgpt": (os.path.join(os.path.dirname(__file__), "..", "platforms", "chatgpt", "_locales"),
                lambda s: s.replace("Claude", "ChatGPT"), CHATGPT_OVERRIDES),
}
platform = sys.argv[1] if len(sys.argv) > 1 else "claude"
ROOT, swap, overrides = PLATFORMS[platform]
M = {k: [swap(v) for v in vals] for k, vals in M.items()}
M.update(overrides)

for i, lang in enumerate(LANGS):
    out = {}
    for key, vals in M.items():
        assert len(vals) == len(LANGS), key
        out[key] = {"message": vals[i]}
    d = os.path.join(ROOT, lang)
    os.makedirs(d, exist_ok=True)
    with open(os.path.join(d, "messages.json"), "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=2)

# Store limits: name <= 75 chars (CWS), short_name <= 12 recommended, description <= 132.
for i, lang in enumerate(LANGS):
    n, d = M["extName"][i], M["extDescription"][i]
    print(f"{lang:6} name={len(n):3} desc={len(d):3}", "!!" if len(n) > 75 or len(d) > 132 else "")
