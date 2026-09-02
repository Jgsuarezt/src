(() => {
  "use strict";

  // ---------- constantes ----------
  const PAGE_SIZES_MM = {
    A4: [210, 297],
    LETTER: [215.9, 279.4],
    LEGAL: [215.9, 355.6],
    A3: [297, 420],
  };
  const MAX_POSTER_DIM_PX = 7000; // límite por lado para no reventar el navegador
  const MAX_PAGES_WITHOUT_CONFIRM = 60;

  // ---------- elementos ----------
  const $ = (id) => document.getElementById(id);
  const fileInput = $("fileInput");
  const dropzone = $("dropzone");
  const dropzoneText = $("dropzoneText");
  const thumb = $("thumb");
  const posterW = $("posterW");
  const posterH = $("posterH");
  const lockAspect = $("lockAspect");
  const pageSizeSel = $("pageSize");
  const orientationSel = $("orientation");
  const marginInput = $("margin");
  const overlapInput = $("overlap");
  const effectSel = $("effect");
  const dotSize = $("dotSize");
  const dotSizeValue = $("dotSizeValue");
  const dotSizeLabel = $("dotSizeLabel");
  const dpiSel = $("dpi");
  const generateBtn = $("generateBtn");
  const statusText = $("statusText");
  const stageEmpty = $("stageEmpty");
  const stagePreview = $("stagePreview");
  const overviewCanvas = $("overviewCanvas");
  const overviewCaption = $("overviewCaption");
  const stageToolbar = $("stageToolbar");
  const pageCountText = $("pageCountText");
  const pagesContainer = $("pagesContainer");
  const printBtn = $("printBtn");
  const pdfBtn = $("pdfBtn");

  let img = null; // HTMLImageElement cargada
  let imgAspect = 1; // ancho / alto
  let generatedPages = []; // {canvas, wMm, hMm}
  let printStyleTag = null;

  // ---------- utilidades ----------
  const mm2px = (mm, dpi) => Math.round((mm / 25.4) * dpi);

  function setStatus(msg) {
    statusText.textContent = msg || "";
  }

  function currentPageSizeMm() {
    let [w, h] = PAGE_SIZES_MM[pageSizeSel.value];
    if (orientationSel.value === "landscape") [w, h] = [h, w];
    return [w, h];
  }

  // ---------- carga de imagen / PDF ----------
  function applyLoadedImage(image) {
    img = image;
    imgAspect = image.naturalWidth / image.naturalHeight;
    thumb.src = image.src;
    thumb.hidden = false;
    dropzoneText.hidden = true;
    generateBtn.disabled = false;
    if (lockAspect.checked) syncHeightFromWidth();
  }

  const isPdfFile = (file) => file.type === "application/pdf" || /\.pdf$/i.test(file.name);

  // Renderiza la primera página del PDF a un canvas y lo devuelve como
  // HTMLImageElement, para que el resto del código lo trate como una imagen más.
  async function pdfFirstPageToImage(file) {
    if (!window.pdfjsLib) {
      throw new Error(t("pdfLibMissing"));
    }
    const buffer = await file.arrayBuffer();
    const pdf = await window.pdfjsLib.getDocument({ data: buffer }).promise;
    const page = await pdf.getPage(1);
    const baseViewport = page.getViewport({ scale: 1 });
    const targetLongSide = 2200;
    const scale = targetLongSide / Math.max(baseViewport.width, baseViewport.height);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(viewport.width);
    canvas.height = Math.round(viewport.height);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    await page.render({ canvasContext: ctx, viewport }).promise;

    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = canvas.toDataURL("image/png");
    });
  }

  function loadFile(file) {
    if (!file) return;

    if (isPdfFile(file)) {
      setStatus(t("statusLoadingPdf"));
      pdfFirstPageToImage(file)
        .then((image) => {
          applyLoadedImage(image);
          setStatus(t("statusPdfLoaded", image.naturalWidth, image.naturalHeight));
        })
        .catch((err) => {
          console.error(err);
          setStatus(t("statusPdfError", err.message));
        });
      return;
    }

    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const image = new Image();
      image.onload = () => {
        applyLoadedImage(image);
        setStatus(t("statusImageLoaded", image.naturalWidth, image.naturalHeight));
      };
      image.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  fileInput.addEventListener("change", () => loadFile(fileInput.files[0]));
  dropzone.addEventListener("click", (e) => {
    if (e.target !== fileInput) fileInput.click();
  });
  ["dragover", "dragenter"].forEach((ev) =>
    dropzone.addEventListener(ev, (e) => {
      e.preventDefault();
      dropzone.classList.add("dragover");
    })
  );
  ["dragleave", "drop"].forEach((ev) =>
    dropzone.addEventListener(ev, (e) => {
      e.preventDefault();
      dropzone.classList.remove("dragover");
    })
  );
  dropzone.addEventListener("drop", (e) => {
    const file = e.dataTransfer.files[0];
    if (file) loadFile(file);
  });

  // ---------- aspecto ligado ----------
  function syncHeightFromWidth() {
    if (!img) return;
    posterH.value = (parseFloat(posterW.value || 0) / imgAspect).toFixed(1);
  }
  function syncWidthFromHeight() {
    if (!img) return;
    posterW.value = (parseFloat(posterH.value || 0) * imgAspect).toFixed(1);
  }
  posterW.addEventListener("input", () => {
    if (lockAspect.checked) syncHeightFromWidth();
  });
  posterH.addEventListener("input", () => {
    if (lockAspect.checked) syncWidthFromHeight();
  });
  lockAspect.addEventListener("change", () => {
    if (lockAspect.checked) syncHeightFromWidth();
  });

  // ---------- efecto trama ----------
  dotSize.addEventListener("input", () => {
    dotSizeValue.textContent = `${dotSize.value} px`;
  });
  effectSel.addEventListener("change", () => {
    dotSizeLabel.style.display = effectSel.value === "none" ? "none" : "flex";
  });

  // Reduce la imagen fuente a una rejilla cols x rows (una muestra de color
  // promedio por celda) y dibuja un punto en cada celda cuyo tamaño depende
  // del brillo de esa celda. Efecto clásico de trama / halftone.
  function applyHalftone(posterCanvas, cellPx, mode) {
    const w = posterCanvas.width;
    const h = posterCanvas.height;
    const cols = Math.max(1, Math.ceil(w / cellPx));
    const rows = Math.max(1, Math.ceil(h / cellPx));

    const small = document.createElement("canvas");
    small.width = cols;
    small.height = rows;
    const sctx = small.getContext("2d");
    sctx.imageSmoothingEnabled = true;
    sctx.imageSmoothingQuality = "high";
    sctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, cols, rows);
    const data = sctx.getImageData(0, 0, cols, rows).data;

    const ctx = posterCanvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);

    const maxRadius = (cellPx / 2) * 1.15;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const idx = (r * cols + c) * 4;
        const R = data[idx], G = data[idx + 1], B = data[idx + 2];
        const lum = 0.299 * R + 0.587 * G + 0.114 * B;
        const darkness = 1 - lum / 255;
        const radius = maxRadius * darkness;
        if (radius < 0.35) continue;
        const cx = c * cellPx + cellPx / 2;
        const cy = r * cellPx + cellPx / 2;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fillStyle = mode === "color" ? `rgb(${R},${G},${B})` : "#000000";
        ctx.fill();
      }
    }
  }

  // ---------- generación del póster ----------
  function buildPosterCanvas(posterWpx, posterHpx, effect, cellPx) {
    const canvas = document.createElement("canvas");
    canvas.width = posterWpx;
    canvas.height = posterHpx;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, posterWpx, posterHpx);
    ctx.drawImage(img, 0, 0, posterWpx, posterHpx);

    if (effect !== "none") {
      applyHalftone(canvas, cellPx, effect);
    }
    return canvas;
  }

  function drawCropMarks(ctx, x0, y0, x1, y1) {
    const len = 10;
    ctx.strokeStyle = "#999999";
    ctx.lineWidth = 1;
    const corners = [
      [x0, y0, 1, 1],
      [x1, y0, -1, 1],
      [x0, y1, 1, -1],
      [x1, y1, -1, -1],
    ];
    corners.forEach(([x, y, dx, dy]) => {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + len * dx, y);
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + len * dy);
      ctx.stroke();
    });
  }

  function injectPrintPageSize(wMm, hMm) {
    if (printStyleTag) printStyleTag.remove();
    printStyleTag = document.createElement("style");
    printStyleTag.textContent = `@page { size: ${wMm}mm ${hMm}mm; margin: 0; }`;
    document.head.appendChild(printStyleTag);
  }

  function generate() {
    if (!img) return;
    setStatus(t("statusGenerating"));
    generateBtn.disabled = true;

    // usamos un pequeño timeout para que el navegador pinte el estado "Generando…"
    setTimeout(() => {
      try {
        doGenerate();
      } catch (err) {
        console.error(err);
        setStatus(t("statusError", err.message));
      } finally {
        generateBtn.disabled = false;
      }
    }, 30);
  }

  function doGenerate() {
    const posterWmm = parseFloat(posterW.value) * 10;
    const posterHmm = parseFloat(posterH.value) * 10;
    const margin = Math.max(0, parseFloat(marginInput.value) || 0);
    let overlap = Math.max(0, parseFloat(overlapInput.value) || 0);
    const effect = effectSel.value;
    const cellPxBase = parseInt(dotSize.value, 10);
    let dpi = parseInt(dpiSel.value, 10);

    let [pageWmm, pageHmm] = currentPageSizeMm();
    const printableW = pageWmm - 2 * margin;
    const printableH = pageHmm - 2 * margin;
    if (printableW <= 5 || printableH <= 5) {
      setStatus(t("statusMarginTooBig"));
      return;
    }
    overlap = Math.min(overlap, Math.min(printableW, printableH) - 1);

    const stepW = printableW - overlap;
    const stepH = printableH - overlap;

    const cols = Math.max(1, Math.ceil((posterWmm - overlap) / stepW));
    const rows = Math.max(1, Math.ceil((posterHmm - overlap) / stepH));
    const totalPages = cols * rows;

    if (totalPages > MAX_PAGES_WITHOUT_CONFIRM) {
      const ok = confirm(t("confirmManyPages", totalPages, cols, rows));
      if (!ok) {
        setStatus(t("statusCancelled"));
        return;
      }
    }

    const actualPosterWmm = cols * stepW + overlap;
    const actualPosterHmm = rows * stepH + overlap;

    let posterWpx = mm2px(actualPosterWmm, dpi);
    let posterHpx = mm2px(actualPosterHmm, dpi);
    const maxDim = Math.max(posterWpx, posterHpx);
    if (maxDim > MAX_POSTER_DIM_PX) {
      const scale = MAX_POSTER_DIM_PX / maxDim;
      dpi = Math.max(50, Math.round(dpi * scale));
      posterWpx = mm2px(actualPosterWmm, dpi);
      posterHpx = mm2px(actualPosterHmm, dpi);
      setStatus(t("statusResizedDpi", dpi));
    }

    const posterCanvas = buildPosterCanvas(posterWpx, posterHpx, effect, cellPxBase);

    // ----- vista general -----
    stageEmpty.hidden = true;
    stagePreview.hidden = false;
    const maxPreview = 800;
    const previewScale = Math.min(1, maxPreview / posterWpx);
    overviewCanvas.width = posterWpx * previewScale;
    overviewCanvas.height = posterHpx * previewScale;
    const octx = overviewCanvas.getContext("2d");
    octx.drawImage(posterCanvas, 0, 0, overviewCanvas.width, overviewCanvas.height);
    octx.strokeStyle = "rgba(255,90,60,0.8)";
    octx.lineWidth = 1;
    for (let c = 1; c < cols; c++) {
      const x = mm2px(c * stepW + overlap / 2, dpi) * previewScale;
      octx.beginPath();
      octx.moveTo(x, 0);
      octx.lineTo(x, overviewCanvas.height);
      octx.stroke();
    }
    for (let r = 1; r < rows; r++) {
      const y = mm2px(r * stepH + overlap / 2, dpi) * previewScale;
      octx.beginPath();
      octx.moveTo(0, y);
      octx.lineTo(overviewCanvas.width, y);
      octx.stroke();
    }
    overviewCaption.textContent = t(
      "overviewCaption",
      (actualPosterWmm / 10).toFixed(1),
      (actualPosterHmm / 10).toFixed(1),
      cols, rows, dpi
    );

    // ----- páginas individuales -----
    pagesContainer.innerHTML = "";
    generatedPages = [];
    const pageWpx = mm2px(pageWmm, dpi);
    const pageHpx = mm2px(pageHmm, dpi);
    const marginPx = mm2px(margin, dpi);
    const contentWpx = mm2px(printableW, dpi);
    const contentHpx = mm2px(printableH, dpi);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const srcXmm = c * stepW;
        const srcYmm = r * stepH;
        const srcXpx = mm2px(srcXmm, dpi);
        const srcYpx = mm2px(srcYmm, dpi);

        const pageCanvas = document.createElement("canvas");
        pageCanvas.width = pageWpx;
        pageCanvas.height = pageHpx;
        const pctx = pageCanvas.getContext("2d");
        pctx.fillStyle = "#ffffff";
        pctx.fillRect(0, 0, pageWpx, pageHpx);
        pctx.drawImage(
          posterCanvas,
          srcXpx, srcYpx, contentWpx, contentHpx,
          marginPx, marginPx, contentWpx, contentHpx
        );
        const rowAbbr = t("rowAbbr");
        const colAbbr = t("colAbbr");
        if (margin > 2) {
          drawCropMarks(pctx, marginPx, marginPx, marginPx + contentWpx, marginPx + contentHpx);
          pctx.fillStyle = "#999999";
          pctx.font = `${Math.max(10, marginPx * 0.6)}px monospace`;
          pctx.fillText(`${rowAbbr}${r + 1}-${colAbbr}${c + 1}`, 4, pageHpx - 4);
        }

        const card = document.createElement("div");
        card.className = "page-card";
        card.appendChild(pageCanvas);
        const label = document.createElement("span");
        label.className = "page-label";
        label.textContent = `${rowAbbr}${r + 1} / ${colAbbr}${c + 1}`;
        card.appendChild(label);
        pagesContainer.appendChild(card);

        generatedPages.push({ canvas: pageCanvas, wMm: pageWmm, hMm: pageHmm });
      }
    }

    injectPrintPageSize(pageWmm, pageHmm);
    stageToolbar.hidden = false;
    pageCountText.textContent = t("pageCount", totalPages);
    setStatus(t("statusReady", cols, rows, dpi));
  }

  generateBtn.addEventListener("click", generate);

  // ---------- imprimir ----------
  printBtn.addEventListener("click", () => window.print());

  // ---------- exportar PDF ----------
  pdfBtn.addEventListener("click", async () => {
    if (!generatedPages.length) return;
    pdfBtn.disabled = true;
    pdfBtn.textContent = t("pdfBtnGenerating");
    try {
      const { jsPDF } = window.jspdf;
      const first = generatedPages[0];
      const orientation = first.wMm >= first.hMm ? "landscape" : "portrait";
      const doc = new jsPDF({ unit: "mm", format: [first.wMm, first.hMm], orientation });

      generatedPages.forEach((page, i) => {
        if (i > 0) {
          const o = page.wMm >= page.hMm ? "landscape" : "portrait";
          doc.addPage([page.wMm, page.hMm], o);
        }
        const dataUrl = page.canvas.toDataURL("image/jpeg", 0.92);
        doc.addImage(dataUrl, "JPEG", 0, 0, page.wMm, page.hMm);
      });

      doc.save("poster.pdf");
    } catch (err) {
      console.error(err);
      alert(t("pdfError", err.message));
    } finally {
      pdfBtn.disabled = false;
      pdfBtn.textContent = "⬇️ " + t("pdfBtn");
    }
  });

  // ---------- cambio de idioma ----------
  document.addEventListener("languagechange", () => {
    if (img) generate();
  });
})();
