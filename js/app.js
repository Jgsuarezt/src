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

  // ---------- carga de imagen ----------
  function loadFile(file) {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const image = new Image();
      image.onload = () => {
        img = image;
        imgAspect = image.naturalWidth / image.naturalHeight;
        thumb.src = e.target.result;
        thumb.hidden = false;
        dropzoneText.hidden = true;
        generateBtn.disabled = false;
        setStatus(`Imagen cargada: ${image.naturalWidth} × ${image.naturalHeight} px`);
        if (lockAspect.checked) syncHeightFromWidth();
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
    setStatus("Generando…");
    generateBtn.disabled = true;

    // usamos un pequeño timeout para que el navegador pinte el estado "Generando…"
    setTimeout(() => {
      try {
        doGenerate();
      } catch (err) {
        console.error(err);
        setStatus("Ocurrió un error generando el póster: " + err.message);
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
      setStatus("El margen es demasiado grande para el tamaño de página elegido.");
      return;
    }
    overlap = Math.min(overlap, Math.min(printableW, printableH) - 1);

    const stepW = printableW - overlap;
    const stepH = printableH - overlap;

    const cols = Math.max(1, Math.ceil((posterWmm - overlap) / stepW));
    const rows = Math.max(1, Math.ceil((posterHmm - overlap) / stepH));
    const totalPages = cols * rows;

    if (totalPages > MAX_PAGES_WITHOUT_CONFIRM) {
      const ok = confirm(
        `Este póster necesitará ${totalPages} hojas (${cols} × ${rows}). ¿Continuar de todas formas?`
      );
      if (!ok) {
        setStatus("Generación cancelada.");
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
      setStatus(`Póster muy grande: resolución ajustada automáticamente a ${dpi} dpi.`);
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
    overviewCaption.textContent =
      `Tamaño real: ${(actualPosterWmm / 10).toFixed(1)} × ${(actualPosterHmm / 10).toFixed(1)} cm` +
      `  ·  ${cols} × ${rows} hojas (${totalPages} en total)  ·  ${dpi} dpi`;

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
        if (margin > 2) {
          drawCropMarks(pctx, marginPx, marginPx, marginPx + contentWpx, marginPx + contentHpx);
          pctx.fillStyle = "#999999";
          pctx.font = `${Math.max(10, marginPx * 0.6)}px monospace`;
          pctx.fillText(`F${r + 1}-C${c + 1}`, 4, pageHpx - 4);
        }

        const card = document.createElement("div");
        card.className = "page-card";
        card.appendChild(pageCanvas);
        const label = document.createElement("span");
        label.className = "page-label";
        label.textContent = `Fila ${r + 1} / Col ${c + 1}`;
        card.appendChild(label);
        pagesContainer.appendChild(card);

        generatedPages.push({ canvas: pageCanvas, wMm: pageWmm, hMm: pageHmm });
      }
    }

    injectPrintPageSize(pageWmm, pageHmm);
    stageToolbar.hidden = false;
    pageCountText.textContent = `${totalPages} página${totalPages > 1 ? "s" : ""} lista${totalPages > 1 ? "s" : ""} para imprimir`;
    setStatus(`Listo · ${cols} × ${rows} hojas · ${dpi} dpi`);
  }

  generateBtn.addEventListener("click", generate);

  // ---------- imprimir ----------
  printBtn.addEventListener("click", () => window.print());

  // ---------- exportar PDF ----------
  pdfBtn.addEventListener("click", async () => {
    if (!generatedPages.length) return;
    pdfBtn.disabled = true;
    pdfBtn.textContent = "Generando PDF…";
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
      alert("No se pudo generar el PDF: " + err.message);
    } finally {
      pdfBtn.disabled = false;
      pdfBtn.textContent = "⬇️ Descargar PDF";
    }
  });
})();
