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
  const thumbCanvas = $("thumbCanvas");
  const thumbGridCaption = $("thumbGridCaption");
  const sheetsWideInput = $("sheetsWide");
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

  // A partir del papel elegido, el margen/solape y cuántas hojas de ancho
  // quiere el usuario, calcula la rejilla completa. El alto en hojas se
  // deriva de la proporción de la imagen, así que no hay que pedirlo aparte.
  function computeGrid() {
    const cols = Math.max(1, parseInt(sheetsWideInput.value, 10) || 1);
    const margin = Math.max(0, parseFloat(marginInput.value) || 0);
    let overlap = Math.max(0, parseFloat(overlapInput.value) || 0);
    const [pageWmm, pageHmm] = currentPageSizeMm();
    const printableW = pageWmm - 2 * margin;
    const printableH = pageHmm - 2 * margin;
    if (printableW <= 5 || printableH <= 5) return null;
    overlap = Math.min(overlap, Math.min(printableW, printableH) - 1);

    const stepW = printableW - overlap;
    const stepH = printableH - overlap;
    const actualPosterWmm = cols * stepW + overlap;
    const rows = img
      ? Math.max(1, Math.ceil((actualPosterWmm / imgAspect - overlap) / stepH))
      : 1;
    const actualPosterHmm = rows * stepH + overlap;

    return { cols, rows, margin, overlap, stepW, stepH, pageWmm, pageHmm, printableW, printableH, actualPosterWmm, actualPosterHmm };
  }

  // ---------- vista previa con rejilla sobre la imagen subida ----------
  function renderThumbGrid() {
    if (!img) return;
    const grid = computeGrid();
    if (!grid) return;
    const { cols, rows, stepW, stepH, overlap, actualPosterWmm, actualPosterHmm } = grid;

    const cw = 300;
    const ch = Math.max(1, Math.round(cw * (actualPosterHmm / actualPosterWmm)));
    thumbCanvas.width = cw;
    thumbCanvas.height = ch;
    thumbCanvas.hidden = false;
    dropzoneText.hidden = true;

    const ctx = thumbCanvas.getContext("2d");
    ctx.drawImage(img, 0, 0, cw, ch);
    ctx.strokeStyle = "rgba(255,90,60,0.9)";
    ctx.lineWidth = 1;
    for (let c = 1; c < cols; c++) {
      const x = ((c * stepW + overlap / 2) / actualPosterWmm) * cw;
      ctx.beginPath();
      ctx.moveTo(x + 0.5, 0);
      ctx.lineTo(x + 0.5, ch);
      ctx.stroke();
    }
    for (let r = 1; r < rows; r++) {
      const y = ((r * stepH + overlap / 2) / actualPosterHmm) * ch;
      ctx.beginPath();
      ctx.moveTo(0, y + 0.5);
      ctx.lineTo(cw, y + 0.5);
      ctx.stroke();
    }
    ctx.strokeStyle = "rgba(255,90,60,0.9)";
    ctx.strokeRect(0.5, 0.5, cw - 1, ch - 1);

    thumbGridCaption.textContent = t("sheetsGridCaption", cols, rows);
  }

  // ---------- carga de imagen ----------
  function loadFile(file) {
    if (!file) return;
    if (file.type !== "image/png" && file.type !== "image/jpeg") {
      setStatus(t("statusUnsupportedFile"));
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const image = new Image();
      image.onload = () => {
        img = image;
        imgAspect = image.naturalWidth / image.naturalHeight;
        generateBtn.disabled = false;
        setStatus(t("statusImageLoaded", image.naturalWidth, image.naturalHeight));
        renderThumbGrid();
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

  // ---------- controles que afectan la rejilla ----------
  [sheetsWideInput, pageSizeSel, orientationSel, marginInput, overlapInput].forEach((el) => {
    el.addEventListener("input", renderThumbGrid);
    el.addEventListener("change", renderThumbGrid);
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
    const grid = computeGrid();
    if (!grid) {
      setStatus(t("statusMarginTooBig"));
      return;
    }
    const { cols, rows, margin, overlap, stepW, stepH, pageWmm, pageHmm, printableW, printableH, actualPosterWmm, actualPosterHmm } = grid;
    const effect = effectSel.value;
    const cellPxBase = parseInt(dotSize.value, 10);
    let dpi = parseInt(dpiSel.value, 10);
    const totalPages = cols * rows;

    if (totalPages > MAX_PAGES_WITHOUT_CONFIRM) {
      const ok = confirm(t("confirmManyPages", totalPages, cols, rows));
      if (!ok) {
        setStatus(t("statusCancelled"));
        return;
      }
    }

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
    const rowAbbr = t("rowAbbr");
    const colAbbr = t("colAbbr");

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
    renderThumbGrid();
    if (img) generate();
  });
})();
