/* Desbloqueo de pago único vía la License API pública de Lemon Squeezy.
   No requiere backend propio: esa API está pensada para ser llamada
   directamente desde el navegador con la clave que recibe el comprador.

   CONFIGURA ESTO cuando tengas tu producto creado en Lemon Squeezy:
   pega aquí el enlace de compra (Checkout / Payment Link) de tu producto. */
(() => {
  "use strict";

  const CHECKOUT_URL = "https://TU-TIENDA.lemonsqueezy.com/buy/TU-PRODUCTO-ID";
  const STORAGE_KEY = "posterizador_license";
  const VALIDATE_ENDPOINT = "https://api.lemonsqueezy.com/v1/licenses/validate";

  let state = { key: null, valid: false };
  const listeners = [];

  function loadStored() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function saveStored(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) { /* localStorage no disponible */ }
  }

  function notify() {
    listeners.forEach((fn) => fn(state.valid));
  }

  function isUnlocked() {
    return state.valid === true;
  }

  function onChange(fn) {
    listeners.push(fn);
  }

  async function validateKey(key) {
    const res = await fetch(VALIDATE_ENDPOINT, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: new URLSearchParams({ license_key: key }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }

  function setStatusText(key) {
    const el = document.getElementById("licenseStatusText");
    if (el && window.t) el.textContent = window.t(key);
  }

  function applyUIState() {
    const card = document.getElementById("unlockCard");
    const lockedBlock = document.getElementById("unlockLocked");
    const dpiHighOpt = document.getElementById("opt-dpiHigh");
    const dpiSel = document.getElementById("dpi");
    const dpiLockHint = document.getElementById("dpiLockHint");

    if (isUnlocked()) {
      if (card) card.classList.add("unlocked");
      if (lockedBlock) lockedBlock.hidden = true;
      if (dpiHighOpt) dpiHighOpt.disabled = false;
      if (dpiLockHint) dpiLockHint.hidden = true;
      setStatusText("licenseStatusUnlocked");
    } else {
      if (card) card.classList.remove("unlocked");
      if (lockedBlock) lockedBlock.hidden = false;
      if (dpiHighOpt) {
        dpiHighOpt.disabled = true;
        if (dpiSel && dpiSel.value === "300") dpiSel.value = "150";
      }
      if (dpiLockHint) dpiLockHint.hidden = false;
      setStatusText("licenseStatusLocked");
    }
  }

  async function activate(rawKey) {
    const key = (rawKey || "").trim();
    if (!key) return;
    setStatusText("licenseStatusChecking");
    try {
      const data = await validateKey(key);
      if (data && data.valid) {
        state = { key, valid: true };
        saveStored(state);
        applyUIState();
        notify();
      } else {
        setStatusText("licenseStatusInvalid");
      }
    } catch (e) {
      setStatusText("licenseStatusError");
    }
  }

  function wireUI() {
    const buyBtn = document.getElementById("buyLicenseBtn");
    const input = document.getElementById("licenseKeyInput");
    const activateBtn = document.getElementById("activateLicenseBtn");

    if (buyBtn) {
      buyBtn.addEventListener("click", () => {
        if (CHECKOUT_URL.includes("TU-TIENDA")) {
          alert("Configura tu enlace de compra de Lemon Squeezy en js/license.js (CHECKOUT_URL).");
          return;
        }
        window.open(CHECKOUT_URL, "_blank", "noopener");
      });
    }
    if (activateBtn && input) {
      activateBtn.addEventListener("click", () => activate(input.value));
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") activate(input.value);
      });
    }
    document.addEventListener("languagechange", () => {
      if (input && window.t) input.placeholder = window.t("licenseKeyPlaceholder");
      applyUIState();
    });
  }

  async function init() {
    wireUI();
    const input = document.getElementById("licenseKeyInput");
    if (input && window.t) input.placeholder = window.t("licenseKeyPlaceholder");

    const stored = loadStored();
    if (stored && stored.key) {
      // Optimista: confía en el último estado válido conocido para no
      // "perder" el desbloqueo si el usuario abre la página sin conexión.
      state = { key: stored.key, valid: !!stored.valid };
      applyUIState();
      notify();
      try {
        const data = await validateKey(stored.key);
        state = { key: stored.key, valid: !!(data && data.valid) };
        saveStored(state);
      } catch (e) {
        // Sin conexión o la API no respondió: se mantiene el último
        // estado guardado en vez de bloquear al usuario de golpe.
        return;
      }
    }
    applyUIState();
    notify();
  }

  document.addEventListener("DOMContentLoaded", init);

  window.PosterizadorLicense = { isUnlocked, onChange };
})();
