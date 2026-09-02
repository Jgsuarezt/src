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
      effectNone: "None (plain image)",
      effectBw: "Black & white dots",
      effectColor: "Color dots",
      fieldDotSize: "Dot size",
      step5Title: "Quality",
      fieldResolution: "Print resolution",
      dpiDraft: "Draft (100 dpi)",
      dpiNormal: "Normal (150 dpi)",
      dpiHigh: "High quality (300 dpi)",
      generateBtn: "Generate poster",
      stageEmptyHtml: (btn) => `Upload an image and press <strong>${btn}</strong> to see the page-by-page preview here.`,
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
      overviewCaption: (w, h, c, r, dpi) => `Actual size: ${w} × ${h} cm  ·  ${c} × ${r} sheets (${c * r} total)  ·  ${dpi} dpi`,
      pageCount: (n) => `${n} page${n === 1 ? "" : "s"} ready to print`,
      pdfError: (msg) => `Could not generate the PDF: ${msg}`,
      rowAbbr: "R",
      colAbbr: "C",
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
      effectNone: "Ninguno (imagen normal)",
      effectBw: "Puntos blanco y negro",
      effectColor: "Puntos a color",
      fieldDotSize: "Tamaño de punto",
      step5Title: "Calidad",
      fieldResolution: "Resolución de impresión",
      dpiDraft: "Borrador (100 dpi)",
      dpiNormal: "Normal (150 dpi)",
      dpiHigh: "Alta calidad (300 dpi)",
      generateBtn: "Generar póster",
      stageEmptyHtml: (btn) => `Sube una imagen y pulsa <strong>${btn}</strong> para ver aquí la vista previa página por página.`,
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
      overviewCaption: (w, h, c, r, dpi) => `Tamaño real: ${w} × ${h} cm  ·  ${c} × ${r} hojas (${c * r} en total)  ·  ${dpi} dpi`,
      pageCount: (n) => `${n} página${n === 1 ? "" : "s"} lista${n === 1 ? "" : "s"} para imprimir`,
      pdfError: (msg) => `No se pudo generar el PDF: ${msg}`,
      rowAbbr: "F",
      colAbbr: "C",
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
      effectNone: "Aucun (image normale)",
      effectBw: "Points noir et blanc",
      effectColor: "Points en couleur",
      fieldDotSize: "Taille du point",
      step5Title: "Qualité",
      fieldResolution: "Résolution d'impression",
      dpiDraft: "Brouillon (100 dpi)",
      dpiNormal: "Normale (150 dpi)",
      dpiHigh: "Haute qualité (300 dpi)",
      generateBtn: "Générer l'affiche",
      stageEmptyHtml: (btn) => `Importez une image et cliquez sur <strong>${btn}</strong> pour voir ici l'aperçu page par page.`,
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
      overviewCaption: (w, h, c, r, dpi) => `Taille réelle : ${w} × ${h} cm  ·  ${c} × ${r} feuilles (${c * r} au total)  ·  ${dpi} dpi`,
      pageCount: (n) => `${n} page${n === 1 ? "" : "s"} prête${n === 1 ? "" : "s"} à imprimer`,
      pdfError: (msg) => `Impossible de générer le PDF : ${msg}`,
      rowAbbr: "L",
      colAbbr: "C",
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
      effectNone: "Nessuno (immagine normale)",
      effectBw: "Punti bianco e nero",
      effectColor: "Punti a colori",
      fieldDotSize: "Dimensione punto",
      step5Title: "Qualità",
      fieldResolution: "Risoluzione di stampa",
      dpiDraft: "Bozza (100 dpi)",
      dpiNormal: "Normale (150 dpi)",
      dpiHigh: "Alta qualità (300 dpi)",
      generateBtn: "Genera poster",
      stageEmptyHtml: (btn) => `Carica un'immagine e premi <strong>${btn}</strong> per vedere qui l'anteprima pagina per pagina.`,
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
      overviewCaption: (w, h, c, r, dpi) => `Dimensione reale: ${w} × ${h} cm  ·  ${c} × ${r} fogli (${c * r} totali)  ·  ${dpi} dpi`,
      pageCount: (n) => `${n} pagin${n === 1 ? "a" : "e"} pront${n === 1 ? "a" : "e"} per la stampa`,
      pdfError: (msg) => `Impossibile generare il PDF: ${msg}`,
      rowAbbr: "R",
      colAbbr: "C",
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
      effectNone: "Nenhum (imagem normal)",
      effectBw: "Pontos preto e branco",
      effectColor: "Pontos coloridos",
      fieldDotSize: "Tamanho do ponto",
      step5Title: "Qualidade",
      fieldResolution: "Resolução de impressão",
      dpiDraft: "Rascunho (100 dpi)",
      dpiNormal: "Normal (150 dpi)",
      dpiHigh: "Alta qualidade (300 dpi)",
      generateBtn: "Gerar pôster",
      stageEmptyHtml: (btn) => `Envie uma imagem e clique em <strong>${btn}</strong> para ver aqui a pré-visualização página a página.`,
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
      overviewCaption: (w, h, c, r, dpi) => `Tamanho real: ${w} × ${h} cm  ·  ${c} × ${r} folhas (${c * r} no total)  ·  ${dpi} dpi`,
      pageCount: (n) => `${n} página${n === 1 ? "" : "s"} pronta${n === 1 ? "" : "s"} para impressão`,
      pdfError: (msg) => `Não foi possível gerar o PDF: ${msg}`,
      rowAbbr: "L",
      colAbbr: "C",
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
      effectNone: "Kein Effekt (normales Bild)",
      effectBw: "Schwarz-weiße Punkte",
      effectColor: "Farbige Punkte",
      fieldDotSize: "Punktgröße",
      step5Title: "Qualität",
      fieldResolution: "Druckauflösung",
      dpiDraft: "Entwurf (100 dpi)",
      dpiNormal: "Normal (150 dpi)",
      dpiHigh: "Hohe Qualität (300 dpi)",
      generateBtn: "Poster erstellen",
      stageEmptyHtml: (btn) => `Lade ein Bild hoch und klicke auf <strong>${btn}</strong>, um hier die Seiten-Vorschau zu sehen.`,
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
      overviewCaption: (w, h, c, r, dpi) => `Tatsächliche Größe: ${w} × ${h} cm  ·  ${c} × ${r} Blätter (${c * r} insgesamt)  ·  ${dpi} dpi`,
      pageCount: (n) => `${n} Seite${n === 1 ? "" : "n"} druckbereit`,
      pdfError: (msg) => `PDF konnte nicht erstellt werden: ${msg}`,
      rowAbbr: "Z",
      colAbbr: "S",
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
      effectNone: "无（原始图片）",
      effectBw: "黑白网点",
      effectColor: "彩色网点",
      fieldDotSize: "网点大小",
      step5Title: "质量",
      fieldResolution: "打印分辨率",
      dpiDraft: "草稿（100 dpi）",
      dpiNormal: "标准（150 dpi）",
      dpiHigh: "高质量（300 dpi）",
      generateBtn: "生成海报",
      stageEmptyHtml: (btn) => `上传一张图片，然后点击<strong>${btn}</strong>，即可在这里查看逐页预览。`,
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
      overviewCaption: (w, h, c, r, dpi) => `实际尺寸：${w} × ${h} cm  ·  ${c} × ${r} 张（共 ${c * r} 张）  ·  ${dpi} dpi`,
      pageCount: (n) => `共 ${n} 页，可以打印`,
      pdfError: (msg) => `PDF 生成失败：${msg}`,
      rowAbbr: "行",
      colAbbr: "列",
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

    document.getElementById("pageTitle").textContent = t("pageTitle");
    document.title = t("pageTitle");
    document.getElementById("dropzoneText").textContent = t("dropzoneText");
    document.getElementById("generateBtn").textContent = t("generateBtn");
    document.getElementById("printBtn").textContent = "🖨️ " + t("printBtn");
    document.getElementById("pdfBtn").textContent = "⬇️ " + t("pdfBtn");
    document.getElementById("txt-stageEmpty").innerHTML = t("stageEmptyHtml", t("generateBtn"));

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
