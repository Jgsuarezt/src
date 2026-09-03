/* Diccionario de idiomas y utilidades de traducción.
   Se carga antes de app.js: expone window.I18N_NATIVE, window.t() y window.applyLanguage(). */
(() => {
  "use strict";

  const NATIVE_NAMES = {
    en: "English",
    es: "Español",
    fr: "Français",
    it: "Italiano",
    pt: "Português",
    de: "Deutsch",
    zh: "中文",
  };

  const DICT = {
    en: {
      appName: "Posterizer",
      pageTitle: "Posterizer — turn your photo into a giant poster",
      tagline: "Turn any image into a giant poster, split across A4, Letter, Legal or A3 sheets ready to print and glue together — with a dot-screen effect, crop marks and PDF export, all in your browser.",
      step1Title: "Image",
      dropzoneText: "Drag an image here or click to choose one",
      statusUnsupportedFile: "Only JPG or PNG images are supported.",
      step2Title: "Paper",
      fieldPaperSize: "Size",
      paperA4: "A4",
      paperLetter: "Letter",
      paperLegal: "Legal",
      paperA3: "A3",
      fieldOrientation: "Orientation",
      orientationPortrait: "Portrait",
      orientationLandscape: "Landscape",
      fieldMargin: "Print margin",
      fieldOverlap: "Overlap for gluing",
      step3Title: "Sheet count",
      fieldSheetsWide: "Sheets in the first row",
      sheetsGridCaption: (c, r) => `${c} × ${r} sheets`,
      step4Title: "Dot screen effect",
      fieldStyle: "Style",
      effectNone: "ORIGINAL",
      effectNoneHint: "Prints the image as-is, without any dot effect.",
      effectBw: "Black & white",
      effectBwHint: "Turns the image into black dots on a white background, like a black-and-white print.",
      fieldDotSize: "Dot size",
      dotQualityHigh: "Higher quality",
      dotQualityLow: "Lower quality",
      step5Title: "Quality",
      fieldResolution: "Print resolution",
      dpiDraft: "Draft (100 dpi)",
      dpiNormal: "Normal (150 dpi)",
      dpiHigh: "High quality (300 dpi) 🔒 PRO",
      dpiLockHint: "Requires unlocking.",
      step6Title: "Other",
      fieldCropMarks: "Crop marks",
      cropMarksHint: "They help cut the margins.",
      cropMarksTooltip: "What are crop marks?\n\nCrop marks are lines in the corners of the pages that show where to cut away the margins.\n\nIf you don't add a margin, crop marks can't be shown — there's no room for them.\n\nIf you use overlap, the marks sit on the non-overlapped part: cutting there only removes a duplicated strip that's already repeated on the next page.",
      unlockTitle: "Unlock PRO quality",
      unlockDesc: "Remove the watermark and unlock 300 dpi printing forever, with a single $3.99 payment.",
      buyLicenseBtn: "Unlock — $3.99",
      licenseKeyPlaceholder: "Paste your license key",
      activateLicenseBtn: "Activate",
      licenseStatusLocked: "Not unlocked: the poster includes a watermark and the maximum quality is 150 dpi.",
      licenseStatusUnlocked: "✓ Unlocked — no watermark, 300 dpi available.",
      licenseStatusChecking: "Checking key…",
      licenseStatusInvalid: "That key isn't valid. Check that you copied it in full.",
      licenseStatusError: "Couldn't verify the key (no connection). It will be retried later.",
      generateBtn: "Generate poster",
      scaleCompareTitle: "Size comparison",
      scaleComparePerson: "1.80 m person",
      printBtn: "Print",
      pdfBtn: "Download PDF",
      pdfBtnGenerating: "Generating…",
      footer: "All processing happens in your browser: your image is never uploaded to any server.",
      statusImageLoaded: (w, h) => `Image loaded: ${w} × ${h} px`,
      statusGenerating: "Generating…",
      statusMarginTooBig: "The margin is too large for this paper size.",
      confirmManyPages: (n, c, r) => `This poster will need ${n} sheets (${c} × ${r}). Continue anyway?`,
      statusCancelled: "Generation cancelled.",
      statusResizedDpi: (dpi) => `Poster too large: resolution automatically adjusted to ${dpi} dpi.`,
      statusReady: (c, r, dpi) => `Ready · ${c} × ${r} sheets · ${dpi} dpi`,
      statusError: (msg) => `Something went wrong generating the poster: ${msg}`,
      scaleComparePoster: (w, h) => `${w} × ${h} cm`,
      pageCount: (n) => `${n} page${n === 1 ? "" : "s"} ready to print`,
      pdfError: (msg) => `Could not generate the PDF: ${msg}`,
    },
    es: {
      appName: "Posterizador",
      pageTitle: "Posterizador — convierte tu foto en un póster gigante",
      tagline: "Convierte cualquier imagen en un póster gigante, recortado en hojas A4, Carta, Legal o A3 listas para imprimir y pegar — con trama de puntos, marcas de corte y exportación a PDF, todo en tu navegador.",
      step1Title: "Imagen",
      dropzoneText: "Arrastra una imagen aquí o haz clic para elegirla",
      statusUnsupportedFile: "Solo se admiten imágenes JPG o PNG.",
      step2Title: "Papel",
      fieldPaperSize: "Tamaño",
      paperA4: "A4",
      paperLetter: "Carta",
      paperLegal: "Legal",
      paperA3: "A3",
      fieldOrientation: "Orientación",
      orientationPortrait: "Vertical",
      orientationLandscape: "Horizontal",
      fieldMargin: "Margen de impresión",
      fieldOverlap: "Solape para pegar",
      step3Title: "Número de hojas",
      fieldSheetsWide: "Hojas en la primera fila",
      sheetsGridCaption: (c, r) => `${c} × ${r} hojas`,
      step4Title: "Efecto de trama",
      fieldStyle: "Estilo",
      effectNone: "ORIGINAL",
      effectNoneHint: "Imprime la imagen tal cual, sin ningún efecto de puntos.",
      effectBw: "Blanco y negro",
      effectBwHint: "Convierte la imagen en puntos negros sobre fondo blanco, como una impresión en blanco y negro.",
      fieldDotSize: "Tamaño de punto",
      dotQualityHigh: "Mayor calidad",
      dotQualityLow: "Menor calidad",
      step5Title: "Calidad",
      fieldResolution: "Resolución de impresión",
      dpiDraft: "Borrador (100 dpi)",
      dpiNormal: "Normal (150 dpi)",
      dpiHigh: "Alta calidad (300 dpi) 🔒 PRO",
      dpiLockHint: "Requiere desbloqueo.",
      step6Title: "Otro",
      fieldCropMarks: "Marcas de corte",
      cropMarksHint: "Ayudan a recortar los márgenes.",
      cropMarksTooltip: "¿Qué son las marcas de corte?\n\nSon líneas en las esquinas de las hojas que muestran dónde recortar los márgenes.\n\nSi no añades margen, las marcas de corte no se pueden mostrar (no hay espacio para ellas).\n\nSi usas solape, las marcas quedan en la parte no solapada: cortar ahí solo retira una franja duplicada, que ya se repite en la siguiente hoja.",
      unlockTitle: "Desbloquear calidad PRO",
      unlockDesc: "Elimina la marca de agua y desbloquea la impresión a 300 dpi para siempre, con un solo pago de $3.99.",
      buyLicenseBtn: "Desbloquear — $3.99",
      licenseKeyPlaceholder: "Pega tu clave de licencia",
      activateLicenseBtn: "Activar",
      licenseStatusLocked: "Sin desbloquear: el póster incluye una marca de agua y la calidad máxima es 150 dpi.",
      licenseStatusUnlocked: "✓ Desbloqueado — sin marca de agua, 300 dpi disponible.",
      licenseStatusChecking: "Verificando clave…",
      licenseStatusInvalid: "Esa clave no es válida. Revisa que la copiaste completa.",
      licenseStatusError: "No se pudo verificar la clave (sin conexión). Se reintentará más tarde.",
      generateBtn: "Generar póster",
      scaleCompareTitle: "Comparación de tamaño",
      scaleComparePerson: "Persona de 1,80 m",
      printBtn: "Imprimir",
      pdfBtn: "Descargar PDF",
      pdfBtnGenerating: "Generando…",
      footer: "Todo el procesamiento ocurre en tu navegador: la imagen nunca se sube a ningún servidor.",
      statusImageLoaded: (w, h) => `Imagen cargada: ${w} × ${h} px`,
      statusGenerating: "Generando…",
      statusMarginTooBig: "El margen es demasiado grande para el tamaño de página elegido.",
      confirmManyPages: (n, c, r) => `Este póster necesitará ${n} hojas (${c} × ${r}). ¿Continuar de todas formas?`,
      statusCancelled: "Generación cancelada.",
      statusResizedDpi: (dpi) => `Póster muy grande: resolución ajustada automáticamente a ${dpi} dpi.`,
      statusReady: (c, r, dpi) => `Listo · ${c} × ${r} hojas · ${dpi} dpi`,
      statusError: (msg) => `Ocurrió un error generando el póster: ${msg}`,
      scaleComparePoster: (w, h) => `${w} × ${h} cm`,
      pageCount: (n) => `${n} página${n === 1 ? "" : "s"} lista${n === 1 ? "" : "s"} para imprimir`,
      pdfError: (msg) => `No se pudo generar el PDF: ${msg}`,
    },
    fr: {
      appName: "Posterisateur",
      pageTitle: "Posterisateur — transformez votre photo en affiche géante",
      tagline: "Transformez n'importe quelle image en une affiche géante, découpée en feuilles A4, Lettre, Legal ou A3 prêtes à imprimer et à assembler — avec un effet de trame, des repères de coupe et un export PDF, le tout dans votre navigateur.",
      step1Title: "Image",
      dropzoneText: "Glissez une image ici ou cliquez pour la choisir",
      statusUnsupportedFile: "Seules les images JPG ou PNG sont prises en charge.",
      step2Title: "Papier",
      fieldPaperSize: "Format",
      paperA4: "A4",
      paperLetter: "Lettre US",
      paperLegal: "Legal US",
      paperA3: "A3",
      fieldOrientation: "Orientation",
      orientationPortrait: "Portrait",
      orientationLandscape: "Paysage",
      fieldMargin: "Marge d'impression",
      fieldOverlap: "Recouvrement pour le collage",
      step3Title: "Nombre de feuilles",
      fieldSheetsWide: "Feuilles sur la première rangée",
      sheetsGridCaption: (c, r) => `${c} × ${r} feuilles`,
      step4Title: "Effet de trame",
      fieldStyle: "Style",
      effectNone: "ORIGINAL",
      effectNoneHint: "Imprime l'image telle quelle, sans aucun effet de points.",
      effectBw: "Noir et blanc",
      effectBwHint: "Transforme l'image en points noirs sur fond blanc, comme une impression en noir et blanc.",
      fieldDotSize: "Taille du point",
      dotQualityHigh: "Meilleure qualité",
      dotQualityLow: "Qualité moindre",
      step5Title: "Qualité",
      fieldResolution: "Résolution d'impression",
      dpiDraft: "Brouillon (100 dpi)",
      dpiNormal: "Normale (150 dpi)",
      dpiHigh: "Haute qualité (300 dpi) 🔒 PRO",
      dpiLockHint: "Nécessite un déverrouillage.",
      step6Title: "Autre",
      fieldCropMarks: "Repères de coupe",
      cropMarksHint: "Ils aident à découper les marges.",
      cropMarksTooltip: "Que sont les repères de coupe ?\n\nCe sont des lignes dans les coins des feuilles qui indiquent où couper les marges.\n\nSi vous n'ajoutez pas de marge, les repères de coupe ne peuvent pas être affichés (il n'y a pas de place pour eux).\n\nSi vous utilisez un recouvrement, les repères se trouvent sur la partie non recouverte : couper à cet endroit ne retire qu'une bande dupliquée, déjà répétée sur la feuille suivante.",
      unlockTitle: "Débloquer la qualité PRO",
      unlockDesc: "Supprimez le filigrane et débloquez l'impression à 300 dpi pour toujours, avec un seul paiement de 3,99 $.",
      buyLicenseBtn: "Débloquer — 3,99 $",
      licenseKeyPlaceholder: "Collez votre clé de licence",
      activateLicenseBtn: "Activer",
      licenseStatusLocked: "Non débloqué : l'affiche comporte un filigrane et la qualité maximale est de 150 dpi.",
      licenseStatusUnlocked: "✓ Débloqué — sans filigrane, 300 dpi disponible.",
      licenseStatusChecking: "Vérification de la clé…",
      licenseStatusInvalid: "Cette clé n'est pas valide. Vérifiez que vous l'avez copiée en entier.",
      licenseStatusError: "Impossible de vérifier la clé (pas de connexion). Nouvelle tentative plus tard.",
      generateBtn: "Générer l'affiche",
      scaleCompareTitle: "Comparaison de taille",
      scaleComparePerson: "Personne de 1,80 m",
      printBtn: "Imprimer",
      pdfBtn: "Télécharger le PDF",
      pdfBtnGenerating: "Génération…",
      footer: "Tout le traitement se fait dans votre navigateur : votre image n'est jamais envoyée à un serveur.",
      statusImageLoaded: (w, h) => `Image chargée : ${w} × ${h} px`,
      statusGenerating: "Génération…",
      statusMarginTooBig: "La marge est trop grande pour ce format de papier.",
      confirmManyPages: (n, c, r) => `Cette affiche nécessitera ${n} feuilles (${c} × ${r}). Continuer quand même ?`,
      statusCancelled: "Génération annulée.",
      statusResizedDpi: (dpi) => `Affiche trop grande : résolution ajustée automatiquement à ${dpi} dpi.`,
      statusReady: (c, r, dpi) => `Prêt · ${c} × ${r} feuilles · ${dpi} dpi`,
      statusError: (msg) => `Une erreur est survenue lors de la génération : ${msg}`,
      scaleComparePoster: (w, h) => `${w} × ${h} cm`,
      pageCount: (n) => `${n} page${n === 1 ? "" : "s"} prête${n === 1 ? "" : "s"} à imprimer`,
      pdfError: (msg) => `Impossible de générer le PDF : ${msg}`,
    },
    it: {
      appName: "Posterizzatore",
      pageTitle: "Posterizzatore — trasforma la tua foto in un poster gigante",
      tagline: "Trasforma qualsiasi immagine in un poster gigante, suddiviso in fogli A4, Letter, Legal o A3 pronti da stampare e incollare insieme — con effetto retinato, crocini di taglio ed esportazione in PDF, tutto nel tuo browser.",
      step1Title: "Immagine",
      dropzoneText: "Trascina un'immagine qui o clicca per sceglierla",
      statusUnsupportedFile: "Sono supportate solo immagini JPG o PNG.",
      step2Title: "Carta",
      fieldPaperSize: "Formato",
      paperA4: "A4",
      paperLetter: "Letter",
      paperLegal: "Legal",
      paperA3: "A3",
      fieldOrientation: "Orientamento",
      orientationPortrait: "Verticale",
      orientationLandscape: "Orizzontale",
      fieldMargin: "Margine di stampa",
      fieldOverlap: "Sovrapposizione per incollare",
      step3Title: "Numero di fogli",
      fieldSheetsWide: "Fogli nella prima riga",
      sheetsGridCaption: (c, r) => `${c} × ${r} fogli`,
      step4Title: "Effetto retinato",
      fieldStyle: "Stile",
      effectNone: "ORIGINALE",
      effectNoneHint: "Stampa l'immagine così com'è, senza alcun effetto a punti.",
      effectBw: "Bianco e nero",
      effectBwHint: "Trasforma l'immagine in punti neri su sfondo bianco, come una stampa in bianco e nero.",
      fieldDotSize: "Dimensione punto",
      dotQualityHigh: "Qualità maggiore",
      dotQualityLow: "Qualità minore",
      step5Title: "Qualità",
      fieldResolution: "Risoluzione di stampa",
      dpiDraft: "Bozza (100 dpi)",
      dpiNormal: "Normale (150 dpi)",
      dpiHigh: "Alta qualità (300 dpi) 🔒 PRO",
      dpiLockHint: "Richiede lo sblocco.",
      step6Title: "Altro",
      fieldCropMarks: "Crocini di taglio",
      cropMarksHint: "Aiutano a tagliare i margini.",
      cropMarksTooltip: "Cosa sono i crocini di taglio?\n\nSono linee negli angoli dei fogli che indicano dove tagliare i margini.\n\nSe non aggiungi un margine, i crocini di taglio non possono essere mostrati (non c'è spazio per loro).\n\nSe usi la sovrapposizione, i crocini si trovano nella parte non sovrapposta: tagliare lì rimuove solo una striscia duplicata, già ripetuta nel foglio successivo.",
      unlockTitle: "Sblocca la qualità PRO",
      unlockDesc: "Rimuovi la filigrana e sblocca la stampa a 300 dpi per sempre, con un unico pagamento di 3,99 $.",
      buyLicenseBtn: "Sblocca — 3,99 $",
      licenseKeyPlaceholder: "Incolla la tua chiave di licenza",
      activateLicenseBtn: "Attiva",
      licenseStatusLocked: "Non sbloccato: il poster include una filigrana e la qualità massima è 150 dpi.",
      licenseStatusUnlocked: "✓ Sbloccato — senza filigrana, 300 dpi disponibili.",
      licenseStatusChecking: "Verifica della chiave…",
      licenseStatusInvalid: "Questa chiave non è valida. Controlla di averla copiata per intero.",
      licenseStatusError: "Impossibile verificare la chiave (nessuna connessione). Si riproverà più tardi.",
      generateBtn: "Genera poster",
      scaleCompareTitle: "Confronto di dimensioni",
      scaleComparePerson: "Persona di 1,80 m",
      printBtn: "Stampa",
      pdfBtn: "Scarica PDF",
      pdfBtnGenerating: "Generazione…",
      footer: "Tutta l'elaborazione avviene nel tuo browser: l'immagine non viene mai caricata su alcun server.",
      statusImageLoaded: (w, h) => `Immagine caricata: ${w} × ${h} px`,
      statusGenerating: "Generazione…",
      statusMarginTooBig: "Il margine è troppo grande per questo formato di carta.",
      confirmManyPages: (n, c, r) => `Questo poster richiederà ${n} fogli (${c} × ${r}). Continuare comunque?`,
      statusCancelled: "Generazione annullata.",
      statusResizedDpi: (dpi) => `Poster troppo grande: risoluzione regolata automaticamente a ${dpi} dpi.`,
      statusReady: (c, r, dpi) => `Pronto · ${c} × ${r} fogli · ${dpi} dpi`,
      statusError: (msg) => `Si è verificato un errore durante la generazione: ${msg}`,
      scaleComparePoster: (w, h) => `${w} × ${h} cm`,
      pageCount: (n) => `${n} pagin${n === 1 ? "a" : "e"} pront${n === 1 ? "a" : "e"} per la stampa`,
      pdfError: (msg) => `Impossibile generare il PDF: ${msg}`,
    },
    pt: {
      appName: "Posterizador",
      pageTitle: "Posterizador — transforme a sua foto num pôster gigante",
      tagline: "Transforme qualquer imagem num pôster gigante, dividido em folhas A4, Carta, Ofício ou A3 prontas para imprimir e colar — com efeito de retícula, marcas de corte e exportação em PDF, tudo no seu navegador.",
      step1Title: "Imagem",
      dropzoneText: "Arraste uma imagem aqui ou clique para escolher",
      statusUnsupportedFile: "Apenas imagens JPG ou PNG são aceitas.",
      step2Title: "Papel",
      fieldPaperSize: "Tamanho",
      paperA4: "A4",
      paperLetter: "Carta",
      paperLegal: "Ofício",
      paperA3: "A3",
      fieldOrientation: "Orientação",
      orientationPortrait: "Retrato",
      orientationLandscape: "Paisagem",
      fieldMargin: "Margem de impressão",
      fieldOverlap: "Sobreposição para colar",
      step3Title: "Número de folhas",
      fieldSheetsWide: "Folhas na primeira linha",
      sheetsGridCaption: (c, r) => `${c} × ${r} folhas`,
      step4Title: "Efeito de retícula",
      fieldStyle: "Estilo",
      effectNone: "ORIGINAL",
      effectNoneHint: "Imprime a imagem como está, sem nenhum efeito de pontos.",
      effectBw: "Preto e branco",
      effectBwHint: "Transforma a imagem em pontos pretos sobre fundo branco, como uma impressão em preto e branco.",
      fieldDotSize: "Tamanho do ponto",
      dotQualityHigh: "Maior qualidade",
      dotQualityLow: "Menor qualidade",
      step5Title: "Qualidade",
      fieldResolution: "Resolução de impressão",
      dpiDraft: "Rascunho (100 dpi)",
      dpiNormal: "Normal (150 dpi)",
      dpiHigh: "Alta qualidade (300 dpi) 🔒 PRO",
      dpiLockHint: "Requer desbloqueio.",
      step6Title: "Outro",
      fieldCropMarks: "Marcas de corte",
      cropMarksHint: "Ajudam a cortar as margens.",
      cropMarksTooltip: "O que são marcas de corte?\n\nSão linhas nos cantos das folhas que mostram onde cortar as margens.\n\nSe não adicionar margem, as marcas de corte não podem ser mostradas (não há espaço para elas).\n\nSe usar sobreposição, as marcas ficam na parte não sobreposta: cortar ali remove apenas uma faixa duplicada, já repetida na folha seguinte.",
      unlockTitle: "Desbloquear qualidade PRO",
      unlockDesc: "Remova a marca d'água e desbloqueie a impressão em 300 dpi para sempre, com um único pagamento de US$ 3,99.",
      buyLicenseBtn: "Desbloquear — US$ 3,99",
      licenseKeyPlaceholder: "Cole sua chave de licença",
      activateLicenseBtn: "Ativar",
      licenseStatusLocked: "Não desbloqueado: o pôster inclui uma marca d'água e a qualidade máxima é 150 dpi.",
      licenseStatusUnlocked: "✓ Desbloqueado — sem marca d'água, 300 dpi disponível.",
      licenseStatusChecking: "Verificando a chave…",
      licenseStatusInvalid: "Essa chave não é válida. Confira se você a copiou por completo.",
      licenseStatusError: "Não foi possível verificar a chave (sem conexão). Será feita nova tentativa depois.",
      generateBtn: "Gerar pôster",
      scaleCompareTitle: "Comparação de tamanho",
      scaleComparePerson: "Pessoa de 1,80 m",
      printBtn: "Imprimir",
      pdfBtn: "Baixar PDF",
      pdfBtnGenerating: "Gerando…",
      footer: "Todo o processamento acontece no seu navegador: a imagem nunca é enviada a um servidor.",
      statusImageLoaded: (w, h) => `Imagem carregada: ${w} × ${h} px`,
      statusGenerating: "Gerando…",
      statusMarginTooBig: "A margem é grande demais para este tamanho de papel.",
      confirmManyPages: (n, c, r) => `Este pôster vai precisar de ${n} folhas (${c} × ${r}). Continuar mesmo assim?`,
      statusCancelled: "Geração cancelada.",
      statusResizedDpi: (dpi) => `Pôster muito grande: resolução ajustada automaticamente para ${dpi} dpi.`,
      statusReady: (c, r, dpi) => `Pronto · ${c} × ${r} folhas · ${dpi} dpi`,
      statusError: (msg) => `Ocorreu um erro ao gerar o pôster: ${msg}`,
      scaleComparePoster: (w, h) => `${w} × ${h} cm`,
      pageCount: (n) => `${n} página${n === 1 ? "" : "s"} pronta${n === 1 ? "" : "s"} para impressão`,
      pdfError: (msg) => `Não foi possível gerar o PDF: ${msg}`,
    },
    de: {
      appName: "Posterizer",
      pageTitle: "Posterizer — mach aus deinem Foto ein riesiges Poster",
      tagline: "Verwandle jedes Bild in ein riesiges Poster, aufgeteilt auf A4-, Letter-, Legal- oder A3-Blätter zum Ausdrucken und Zusammenkleben — mit Rasterpunkt-Effekt, Schnittmarken und PDF-Export, alles direkt im Browser.",
      step1Title: "Bild",
      dropzoneText: "Bild hierher ziehen oder klicken zum Auswählen",
      statusUnsupportedFile: "Nur JPG- oder PNG-Bilder werden unterstützt.",
      step2Title: "Papier",
      fieldPaperSize: "Format",
      paperA4: "A4",
      paperLetter: "Letter",
      paperLegal: "Legal",
      paperA3: "A3",
      fieldOrientation: "Ausrichtung",
      orientationPortrait: "Hochformat",
      orientationLandscape: "Querformat",
      fieldMargin: "Druckrand",
      fieldOverlap: "Überlappung zum Kleben",
      step3Title: "Anzahl der Blätter",
      fieldSheetsWide: "Blätter in der ersten Reihe",
      sheetsGridCaption: (c, r) => `${c} × ${r} Blätter`,
      step4Title: "Rastereffekt",
      fieldStyle: "Stil",
      effectNone: "ORIGINAL",
      effectNoneHint: "Druckt das Bild unverändert, ohne Punkteffekt.",
      effectBw: "Schwarz-weiß",
      effectBwHint: "Verwandelt das Bild in schwarze Punkte auf weißem Grund, wie ein Schwarz-Weiß-Druck.",
      fieldDotSize: "Punktgröße",
      dotQualityHigh: "Höhere Qualität",
      dotQualityLow: "Geringere Qualität",
      step5Title: "Qualität",
      fieldResolution: "Druckauflösung",
      dpiDraft: "Entwurf (100 dpi)",
      dpiNormal: "Normal (150 dpi)",
      dpiHigh: "Hohe Qualität (300 dpi) 🔒 PRO",
      dpiLockHint: "Erfordert Freischaltung.",
      step6Title: "Sonstiges",
      fieldCropMarks: "Schnittmarken",
      cropMarksHint: "Sie helfen beim Zuschneiden der Ränder.",
      cropMarksTooltip: "Was sind Schnittmarken?\n\nSchnittmarken sind Linien in den Ecken der Blätter, die zeigen, wo die Ränder abgeschnitten werden.\n\nWenn du keinen Rand hinzufügst, können keine Schnittmarken angezeigt werden (es ist kein Platz dafür).\n\nWenn du eine Überlappung verwendest, liegen die Marken im nicht überlappten Bereich: Dort zu schneiden entfernt nur einen doppelten Streifen, der bereits auf dem nächsten Blatt wiederholt wird.",
      unlockTitle: "PRO-Qualität freischalten",
      unlockDesc: "Entferne das Wasserzeichen und schalte den Druck mit 300 dpi für immer frei — mit einer einmaligen Zahlung von 3,99 $.",
      buyLicenseBtn: "Freischalten — 3,99 $",
      licenseKeyPlaceholder: "Lizenzschlüssel einfügen",
      activateLicenseBtn: "Aktivieren",
      licenseStatusLocked: "Nicht freigeschaltet: Das Poster enthält ein Wasserzeichen und die maximale Qualität ist 150 dpi.",
      licenseStatusUnlocked: "✓ Freigeschaltet — ohne Wasserzeichen, 300 dpi verfügbar.",
      licenseStatusChecking: "Schlüssel wird geprüft…",
      licenseStatusInvalid: "Dieser Schlüssel ist ungültig. Prüfe, ob du ihn vollständig kopiert hast.",
      licenseStatusError: "Schlüssel konnte nicht geprüft werden (keine Verbindung). Es wird später erneut versucht.",
      generateBtn: "Poster erstellen",
      scaleCompareTitle: "Größenvergleich",
      scaleComparePerson: "Person, 1,80 m",
      printBtn: "Drucken",
      pdfBtn: "PDF herunterladen",
      pdfBtnGenerating: "Wird erstellt…",
      footer: "Die gesamte Verarbeitung erfolgt in deinem Browser: dein Bild wird niemals an einen Server gesendet.",
      statusImageLoaded: (w, h) => `Bild geladen: ${w} × ${h} px`,
      statusGenerating: "Wird erstellt…",
      statusMarginTooBig: "Der Rand ist für dieses Papierformat zu groß.",
      confirmManyPages: (n, c, r) => `Dieses Poster benötigt ${n} Blätter (${c} × ${r}). Trotzdem fortfahren?`,
      statusCancelled: "Erstellung abgebrochen.",
      statusResizedDpi: (dpi) => `Poster zu groß: Auflösung wurde automatisch auf ${dpi} dpi angepasst.`,
      statusReady: (c, r, dpi) => `Fertig · ${c} × ${r} Blätter · ${dpi} dpi`,
      statusError: (msg) => `Beim Erstellen des Posters ist ein Fehler aufgetreten: ${msg}`,
      scaleComparePoster: (w, h) => `${w} × ${h} cm`,
      pageCount: (n) => `${n} Seite${n === 1 ? "" : "n"} druckbereit`,
      pdfError: (msg) => `PDF konnte nicht erstellt werden: ${msg}`,
    },
    zh: {
      appName: "海报生成器",
      pageTitle: "海报生成器 — 把你的照片变成巨幅海报",
      tagline: "将任意图片转换成一张巨幅海报，自动分割成多张 A4、Letter、Legal 或 A3 纸张，可直接打印后拼接——支持网点效果、裁切标记和 PDF 导出，全部在浏览器中完成。",
      step1Title: "图片",
      dropzoneText: "将图片拖到此处，或点击选择",
      statusUnsupportedFile: "仅支持 JPG 或 PNG 格式的图片。",
      step2Title: "纸张",
      fieldPaperSize: "尺寸",
      paperA4: "A4",
      paperLetter: "美式信纸",
      paperLegal: "法律用纸",
      paperA3: "A3",
      fieldOrientation: "方向",
      orientationPortrait: "竖版",
      orientationLandscape: "横版",
      fieldMargin: "打印页边距",
      fieldOverlap: "拼接重叠边",
      step3Title: "纸张数量",
      fieldSheetsWide: "第一行的纸张数",
      sheetsGridCaption: (c, r) => `${c} × ${r} 张`,
      step4Title: "网点效果",
      fieldStyle: "样式",
      effectNone: "原图",
      effectNoneHint: "按原样打印图片，不使用任何网点效果。",
      effectBw: "黑白",
      effectBwHint: "把图片变成白底黑点，就像黑白印刷效果。",
      fieldDotSize: "网点大小",
      dotQualityHigh: "质量更高",
      dotQualityLow: "质量更低",
      step5Title: "质量",
      fieldResolution: "打印分辨率",
      dpiDraft: "草稿（100 dpi）",
      dpiNormal: "标准（150 dpi）",
      dpiHigh: "高质量（300 dpi）🔒 PRO",
      dpiLockHint: "需要解锁。",
      step6Title: "其他",
      fieldCropMarks: "裁切标记",
      cropMarksHint: "帮助裁剪页边距。",
      cropMarksTooltip: "什么是裁切标记？\n\n裁切标记是纸张四角的线条，用来标示应在何处裁掉页边距。\n\n如果不设置页边距，裁切标记将无法显示（没有空间容纳它们）。\n\n如果使用重叠拼接，标记会位于未重叠的部分：沿标记裁剪只会去掉一段重复的部分，该部分已经在下一张纸上重复出现。",
      unlockTitle: "解锁 PRO 品质",
      unlockDesc: "去除水印并永久解锁 300 dpi 打印，只需一次性支付 3.99 美元。",
      buyLicenseBtn: "解锁 — 3.99 美元",
      licenseKeyPlaceholder: "粘贴你的许可证密钥",
      activateLicenseBtn: "激活",
      licenseStatusLocked: "尚未解锁：海报会带有水印，最高质量为 150 dpi。",
      licenseStatusUnlocked: "✓ 已解锁 — 无水印，可使用 300 dpi。",
      licenseStatusChecking: "正在验证密钥…",
      licenseStatusInvalid: "该密钥无效，请检查是否完整复制。",
      licenseStatusError: "无法验证密钥（无网络连接），稍后会重试。",
      generateBtn: "生成海报",
      scaleCompareTitle: "尺寸对比",
      scaleComparePerson: "1.8 米高的人",
      printBtn: "打印",
      pdfBtn: "下载 PDF",
      pdfBtnGenerating: "正在生成…",
      footer: "全部处理均在你的浏览器中完成：图片不会上传到任何服务器。",
      statusImageLoaded: (w, h) => `图片已加载：${w} × ${h} 像素`,
      statusGenerating: "正在生成…",
      statusMarginTooBig: "该纸张尺寸下页边距过大。",
      confirmManyPages: (n, c, r) => `这张海报需要 ${n} 张纸（${c} × ${r}）。仍要继续吗？`,
      statusCancelled: "已取消生成。",
      statusResizedDpi: (dpi) => `海报过大：分辨率已自动调整为 ${dpi} dpi。`,
      statusReady: (c, r, dpi) => `已完成 · ${c} × ${r} 张 · ${dpi} dpi`,
      statusError: (msg) => `生成海报时出错：${msg}`,
      scaleComparePoster: (w, h) => `${w} × ${h} cm`,
      pageCount: (n) => `共 ${n} 页，可以打印`,
      pdfError: (msg) => `PDF 生成失败：${msg}`,
    },
  };

  const SUPPORTED = Object.keys(DICT);
  let currentLang = "en";

  function t(key, ...args) {
    const entry = (DICT[currentLang] && DICT[currentLang][key]) ?? DICT.en[key];
    return typeof entry === "function" ? entry(...args) : entry;
  }

  function detectInitialLang() {
    try {
      const saved = localStorage.getItem("posterizer_lang");
      if (saved && SUPPORTED.includes(saved)) return saved;
    } catch (e) { /* localStorage no disponible */ }
    return null;
  }

  function paintStaticText() {
    document.querySelectorAll("[id^='txt-']").forEach((el) => {
      const key = el.id.slice(4);
      if (DICT.en[key] !== undefined) el.textContent = t(key);
    });
    document.querySelectorAll("[id^='opt-']").forEach((el) => {
      const key = el.id.slice(4);
      if (DICT.en[key] !== undefined) el.textContent = t(key);
    });
    document.querySelectorAll("[id^='hint-']").forEach((el) => {
      const key = el.id.slice(5);
      if (DICT.en[key] !== undefined) el.title = t(key);
    });

    const optEffectNone = document.getElementById("opt-effectNone");
    if (optEffectNone) optEffectNone.title = t("effectNoneHint");
    const optEffectBw = document.getElementById("opt-effectBw");
    if (optEffectBw) optEffectBw.title = t("effectBwHint");

    document.getElementById("pageTitle").textContent = t("pageTitle");
    document.title = t("pageTitle");
    document.getElementById("dropzoneText").textContent = t("dropzoneText");
    document.getElementById("generateBtn").textContent = t("generateBtn");

    const paperOptA4 = document.querySelector('#pageSize option[value="A4"]');
    if (paperOptA4) paperOptA4.textContent = `${t("paperA4")} (210 × 297 mm)`;
    const paperOptLetter = document.getElementById("opt-paperLetter");
    if (paperOptLetter) paperOptLetter.textContent = `${t("paperLetter")} (215.9 × 279.4 mm)`;
    const paperOptLegal = document.getElementById("opt-paperLegal");
    if (paperOptLegal) paperOptLegal.textContent = `${t("paperLegal")} (215.9 × 355.6 mm)`;
    const paperOptA3 = document.querySelector('#pageSize option[value="A3"]');
    if (paperOptA3) paperOptA3.textContent = `${t("paperA3")} (297 × 420 mm)`;
  }

  function applyLanguage(lang, { silent } = {}) {
    if (!SUPPORTED.includes(lang)) lang = "en";
    currentLang = lang;
    document.documentElement.lang = lang;
    try { localStorage.setItem("posterizer_lang", lang); } catch (e) { /* ignore */ }
    paintStaticText();
    const switcher = document.getElementById("langSwitch");
    if (switcher) switcher.value = lang;
    if (!silent) document.dispatchEvent(new CustomEvent("languagechange", { detail: { lang } }));
  }

  function buildLangPickers() {
    const grid = document.getElementById("langGrid");
    const switcher = document.getElementById("langSwitch");
    SUPPORTED.forEach((code) => {
      if (grid) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "lang-option";
        btn.textContent = NATIVE_NAMES[code];
        btn.addEventListener("click", () => {
          document.getElementById("langOverlay").classList.remove("visible");
          applyLanguage(code);
        });
        grid.appendChild(btn);
      }
      if (switcher) {
        const opt = document.createElement("option");
        opt.value = code;
        opt.textContent = NATIVE_NAMES[code];
        switcher.appendChild(opt);
      }
    });
    if (switcher) {
      switcher.addEventListener("change", () => applyLanguage(switcher.value));
    }
  }

  function initLanguage() {
    buildLangPickers();
    const saved = detectInitialLang();
    if (saved) {
      applyLanguage(saved, { silent: true });
    } else {
      const browserLang = (navigator.language || "en").slice(0, 2).toLowerCase();
      applyLanguage(SUPPORTED.includes(browserLang) ? browserLang : "en", { silent: true });
      document.getElementById("langOverlay").classList.add("visible");
    }
  }

  document.addEventListener("DOMContentLoaded", initLanguage);

  window.t = t;
  window.applyLanguage = applyLanguage;
  window.I18N_SUPPORTED = SUPPORTED;
})();
