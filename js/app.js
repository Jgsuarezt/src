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
  const cropMarksToggle = $("cropMarksToggle");
  const generateBtn = $("generateBtn");
  const statusText = $("statusText");
  const scaleCompareCanvas = $("scaleCompareCanvas");
  const stageToolbar = $("stageToolbar");
  const pageCountText = $("pageCountText");
  const pagesContainer = $("pagesContainer");
  const printBtn = $("printBtn");
  const pdfBtn = $("pdfBtn");
  const pdfBtnLabel = $("txt-pdfBtn");

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
  // quiere el usuario, calcula la rejilla completa. El ancho del póster queda
  // fijado por el número de hojas, y el alto se deriva de la proporción de la
  // imagen SIN deformarla — por eso "rows" (hojas necesarias para cubrir ese
  // alto) puede dejar la última fila solo parcialmente ocupada por la imagen.
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
    const posterWmm = cols * stepW + overlap; // ancho exacto: cols es un dato directo
    const imageHmm = posterWmm / imgAspect; // alto real de la imagen, sin estirarla
    const rows = Math.max(1, Math.ceil((imageHmm - overlap) / stepH));
    const gridHmm = rows * stepH + overlap; // alto total de hojas impresas (>= imageHmm)

    return { cols, rows, margin, overlap, stepW, stepH, pageWmm, pageHmm, printableW, printableH, posterWmm, imageHmm, gridHmm };
  }

  // ---------- vista previa con rejilla sobre la imagen subida ----------
  function renderThumbGrid() {
    if (!img) return;
    const grid = computeGrid();
    if (!grid) return;
    const { cols, rows, stepW, stepH, overlap, posterWmm, imageHmm, gridHmm } = grid;

    const cw = 300;
    const ch = Math.max(1, Math.round(cw * (gridHmm / posterWmm)));
    const imageChPx = Math.max(1, Math.round(cw * (imageHmm / posterWmm)));
    thumbCanvas.width = cw;
    thumbCanvas.height = ch;
    thumbCanvas.hidden = false;
    dropzoneText.hidden = true;

    const ctx = thumbCanvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, cw, ch);
    ctx.drawImage(img, 0, 0, cw, imageChPx);
    ctx.strokeStyle = "rgba(255,90,60,0.9)";
    ctx.lineWidth = 1;
    for (let c = 1; c < cols; c++) {
      const x = ((c * stepW + overlap / 2) / posterWmm) * cw;
      ctx.beginPath();
      ctx.moveTo(x + 0.5, 0);
      ctx.lineTo(x + 0.5, ch);
      ctx.stroke();
    }
    for (let r = 1; r < rows; r++) {
      const y = ((r * stepH + overlap / 2) / gridHmm) * ch;
      ctx.beginPath();
      ctx.moveTo(0, y + 0.5);
      ctx.lineTo(cw, y + 0.5);
      ctx.stroke();
    }
    ctx.strokeStyle = "rgba(255,90,60,0.9)";
    ctx.strokeRect(0.5, 0.5, cw - 1, ch - 1);

    thumbGridCaption.textContent = t("sheetsGridCaption", cols, rows);
  }

  // Dibuja una silueta humana de 1.80 m junto a un rectángulo a la misma
  // escala representando el póster, para que el tamaño real se entienda de
  // un vistazo sin tener que generar ni renderizar el póster completo.
  function drawPersonSilhouette(ctx, x, baseline, w, h, color) {
    ctx.save();
    ctx.translate(x, baseline - h);
    ctx.fillStyle = color;

    const headR = h * 0.075;
    const headCx = w * 0.5;
    ctx.beginPath();
    ctx.arc(headCx, headR, headR, 0, Math.PI * 2);
    ctx.fill();

    const shoulderY = headR * 2.1;
    const shoulderHalf = w * 0.34;
    const hipY = h * 0.5;
    const hipHalf = w * 0.19;
    ctx.beginPath();
    ctx.moveTo(headCx - shoulderHalf, shoulderY);
    ctx.lineTo(headCx + shoulderHalf, shoulderY);
    ctx.lineTo(headCx + hipHalf, hipY);
    ctx.lineTo(headCx - hipHalf, hipY);
    ctx.closePath();
    ctx.fill();

    const legGap = w * 0.05;
    const legW = w * 0.15;
    const legBottom = h * 0.98;
    ctx.fillRect(headCx - legGap / 2 - legW, hipY, legW, legBottom - hipY);
    ctx.fillRect(headCx + legGap / 2, hipY, legW, legBottom - hipY);

    ctx.restore();
  }

  function renderScaleCompare() {
    const grid = computeGrid();
    if (!grid) return;
    const { posterWmm, imageHmm } = grid;
    const posterWcm = posterWmm / 10;
    const posterHcm = imageHmm / 10;
    const personHeightCm = 180;

    const cssW = 460;
    const cssH = 260;
    const dpr = window.devicePixelRatio || 1;
    scaleCompareCanvas.width = cssW * dpr;
    scaleCompareCanvas.height = cssH * dpr;
    scaleCompareCanvas.style.width = cssW + "px";
    scaleCompareCanvas.style.height = cssH + "px";
    const ctx = scaleCompareCanvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssW, cssH);

    const baseline = cssH - 38;
    const drawableH = baseline - 10;
    const sideMargin = 8;
    const gap = 30;
    const personAspect = 0.32; // ancho/alto aproximado de la silueta

    // La escala primero se limita por el alto disponible; si aun así el
    // ancho combinado (persona + póster) no cabe, se reduce más — así la
    // persona se achica junto con el póster para que todo sea visible,
    // aunque la etiqueta siga diciendo "1.80 m".
    let pxPerCm = drawableH / Math.max(personHeightCm, posterHcm, 1);
    const availW = cssW - sideMargin * 2;
    const combinedWcm = personHeightCm * personAspect + posterWcm;
    if (combinedWcm * pxPerCm + gap > availW) {
      pxPerCm = Math.min(pxPerCm, (availW - gap) / combinedWcm);
    }

    const personHpx = personHeightCm * pxPerCm;
    const personWpx = personHpx * personAspect;
    const posterHpx = posterHcm * pxPerCm;
    const posterWpx = Math.max(2, posterWcm * pxPerCm);

    const totalW = personWpx + gap + posterWpx;
    const startX = Math.max(sideMargin, (cssW - totalW) / 2);
    const personX = startX;
    const posterX = personX + personWpx + gap;

    const styles = getComputedStyle(document.documentElement);
    const accent = styles.getPropertyValue("--accent").trim() || "#ff5a3c";
    const dim = styles.getPropertyValue("--text-dim").trim() || "#9aa1ac";
    const textColor = styles.getPropertyValue("--text").trim() || "#e8eaed";

    drawPersonSilhouette(ctx, personX, baseline, personWpx, personHpx, dim);

    ctx.fillStyle = "rgba(255,90,60,0.14)";
    ctx.strokeStyle = accent;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.rect(posterX, baseline - posterHpx, posterWpx, posterHpx);
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = dim;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(sideMargin, baseline + 0.5);
    ctx.lineTo(cssW - sideMargin, baseline + 0.5);
    ctx.stroke();

    ctx.fillStyle = textColor;
    ctx.font = "500 11px 'IBM Plex Mono', ui-monospace, monospace";
    ctx.textAlign = "center";
    ctx.fillText(t("scaleComparePerson"), personX + personWpx / 2, baseline + 18);
    ctx.fillText(
      t("scaleComparePoster", posterWcm.toFixed(0), posterHcm.toFixed(0)),
      posterX + posterWpx / 2,
      baseline + 18
    );
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
        renderScaleCompare();
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
    el.addEventListener("input", () => { renderThumbGrid(); renderScaleCompare(); });
    el.addEventListener("change", () => { renderThumbGrid(); renderScaleCompare(); });
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
  // del brillo de esa celda. Efecto clásico de trama / halftone. Solo cubre
  // hasta imageHpx (el alto real de la imagen sin deformar); el resto del
  // canvas se deja en blanco.
  function applyHalftone(posterCanvas, cellPx, imageHpx) {
    const w = posterCanvas.width;
    const h = imageHpx;
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

    const maxRadius = (cellPx / 2) * 1.15;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const idx = (r * cols + c) * 4;
        const lum = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
        const darkness = 1 - lum / 255;
        const radius = maxRadius * darkness;
        if (radius < 0.35) continue;
        const cx = c * cellPx + cellPx / 2;
        const cy = r * cellPx + cellPx / 2;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fillStyle = "#000000";
        ctx.fill();
      }
    }
  }

  // ---------- generación del póster ----------
  // El canvas se crea al tamaño completo de la rejilla de hojas (posterHpx),
  // pero la imagen solo se dibuja hasta imageHpx (su alto real, sin
  // deformarla); lo que sobra por debajo queda en blanco.
  function buildPosterCanvas(posterWpx, posterHpx, imageHpx, effect, cellPx) {
    const canvas = document.createElement("canvas");
    canvas.width = posterWpx;
    canvas.height = posterHpx;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, posterWpx, posterHpx);

    if (effect !== "none") {
      applyHalftone(canvas, cellPx, imageHpx);
    } else {
      ctx.drawImage(img, 0, 0, posterWpx, imageHpx);
    }
    return canvas;
  }

  // Dibuja marcas de corte en cada esquina del área de contenido, hacia
  // AFUERA (dentro del margen), nunca sobre la imagen impresa.
  function drawCropMarks(ctx, x0, y0, x1, y1) {
    const marginPx = x0; // doGenerate siempre llama con x0 === y0 === marginPx
    const len = Math.max(4, Math.min(marginPx * 0.6, 14));
    ctx.strokeStyle = "#999999";
    ctx.lineWidth = 1;
    const corners = [
      [x0, y0, -1, -1],
      [x1, y0, 1, -1],
      [x0, y1, -1, 1],
      [x1, y1, 1, 1],
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

  // Bloque de marca de agua en la esquina inferior derecha, ocupando el 15%
  // del ancho y el 15% del alto de la hoja. Solo se dibuja en la última hoja
  // (última fila, última columna) y solo mientras no haya una licencia
  // activa (ver js/license.js).
  function drawWatermark(ctx, pageWpx, pageHpx) {
    const boxW = pageWpx * 0.15;
    const boxH = pageHpx * 0.15;
    const x = pageWpx - boxW;
    const y = pageHpx - boxH;
    ctx.save();
    ctx.fillStyle = "rgba(20, 18, 15, 0.82)";
    ctx.fillRect(x, y, boxW, boxH);

    ctx.fillStyle = "#f0ece1";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const maxTextWidth = boxW * 0.86;
    let fontSize = Math.max(8, boxH * 0.28);
    ctx.font = `${fontSize}px sans-serif`;
    while (fontSize > 6 && ctx.measureText("POSTERIZADOR").width > maxTextWidth) {
      fontSize -= 1;
      ctx.font = `${fontSize}px sans-serif`;
    }
    ctx.fillText("POSTERIZADOR", x + boxW / 2, y + boxH / 2);
    ctx.restore();
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
    const { cols, rows, margin, stepW, stepH, pageWmm, pageHmm, printableW, printableH, posterWmm, imageHmm, gridHmm } = grid;
    const effect = effectSel.value;
    const cellPxBase = parseInt(dotSize.value, 10);
    const unlocked = window.PosterizadorLicense ? window.PosterizadorLicense.isUnlocked() : false;
    let dpi = parseInt(dpiSel.value, 10);
    if (!unlocked && dpi > 150) dpi = 150; // 300 dpi requiere licencia, por si el <select> fue forzado
    const totalPages = cols * rows;

    if (totalPages > MAX_PAGES_WITHOUT_CONFIRM) {
      const ok = confirm(t("confirmManyPages", totalPages, cols, rows));
      if (!ok) {
        setStatus(t("statusCancelled"));
        return;
      }
    }

    let posterWpx = mm2px(posterWmm, dpi);
    let posterHpx = mm2px(gridHmm, dpi);
    let imageHpx = mm2px(imageHmm, dpi);
    const maxDim = Math.max(posterWpx, posterHpx);
    if (maxDim > MAX_POSTER_DIM_PX) {
      const scale = MAX_POSTER_DIM_PX / maxDim;
      dpi = Math.max(50, Math.round(dpi * scale));
      posterWpx = mm2px(posterWmm, dpi);
      posterHpx = mm2px(gridHmm, dpi);
      imageHpx = mm2px(imageHmm, dpi);
      setStatus(t("statusResizedDpi", dpi));
    }

    const posterCanvas = buildPosterCanvas(posterWpx, posterHpx, imageHpx, effect, cellPxBase);

    // ----- páginas individuales -----
    pagesContainer.innerHTML = "";
    generatedPages = [];
    const pageWpx = mm2px(pageWmm, dpi);
    const pageHpx = mm2px(pageHmm, dpi);
    const marginPx = mm2px(margin, dpi);
    const contentWpx = mm2px(printableW, dpi);
    const contentHpx = mm2px(printableH, dpi);
    const showCropMarks = cropMarksToggle.checked && margin > 2;

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
        if (showCropMarks) {
          drawCropMarks(pctx, marginPx, marginPx, marginPx + contentWpx, marginPx + contentHpx);
        }
        if (!unlocked && r === rows - 1 && c === cols - 1) {
          drawWatermark(pctx, pageWpx, pageHpx);
        }

        const card = document.createElement("div");
        card.className = "page-card";
        card.appendChild(pageCanvas);
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
    pdfBtnLabel.textContent = t("pdfBtnGenerating");
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
      pdfBtnLabel.textContent = t("pdfBtn");
    }
  });

  // ---------- cambio de idioma ----------
  document.addEventListener("languagechange", () => {
    renderThumbGrid();
    renderScaleCompare();
    if (img) generate();
  });

  // ---------- cambio de estado de licencia (desbloqueo) ----------
  if (window.PosterizadorLicense) {
    window.PosterizadorLicense.onChange(() => {
      if (img) generate();
    });
  }

  document.addEventListener("DOMContentLoaded", renderScaleCompare);
})();
