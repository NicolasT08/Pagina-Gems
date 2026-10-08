/* =========================================================
   GEMS — página de descarga del APK
   Todo lo que cambia entre versiones vive en CONFIG.
   ========================================================= */

const CONFIG = {
  appName: "GEMS",
  version: "1.0.0",            // TODO: versión real
  releaseDate: "2026-10-03",   // TODO
  apkSizeMB: 79.1,             // tamaño de app-release.apk
  minAndroid: "8.0",           // TODO: según minSdkVersion
  sha256: "99ef0838b4f5a1b4eb7a0ee1159d039b6a7a8703d6248a303da051700a3530ef", // hash de app-release.apk (ver README)
  apkUrl: "app-release.apk",   // APK servido junto a esta página
  releasesUrl: "https://github.com/NicolasT08/Pagina-Gems/releases",
  contactEmail: "",            // TODO
  // URL pública de esta página. Solo se usa para el QR cuando la página
  // se abre localmente (file://); en GitHub Pages se usa la URL real.
  pageUrl: "https://<USUARIO>.github.io/<REPO>/", // TODO
};

(function () {
  "use strict";

  const root = document.documentElement;
  root.classList.add("js");

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1. Datos desde CONFIG ---------- */

  function formatNumber(n) {
    return Number(n).toLocaleString("es-CO", { maximumFractionDigits: 1 });
  }

  function formatDate(iso) {
    if (!iso) return "";
    const d = new Date(iso + "T12:00:00");
    if (isNaN(d)) return iso;
    return d.toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" });
  }

  const sha = (CONFIG.sha256 || "").trim().toLowerCase();

  const values = {
    appName: CONFIG.appName,
    version: CONFIG.version ? "v" + CONFIG.version : "",
    size: CONFIG.apkSizeMB > 0 ? formatNumber(CONFIG.apkSizeMB) + " MB" : "",
    minAndroid: CONFIG.minAndroid ? "Android " + CONFIG.minAndroid + "+" : "",
    minAndroidPlain: CONFIG.minAndroid || "",
    releaseDate: formatDate(CONFIG.releaseDate),
    sha256: sha,
    contactEmail: CONFIG.contactEmail || "",
  };

  document.querySelectorAll("[data-config]").forEach((el) => {
    const v = values[el.dataset.config];
    if (v) el.textContent = v;
  });

  document.querySelectorAll("[data-requires]").forEach((el) => {
    if (!values[el.dataset.requires]) el.hidden = true;
  });

  document.querySelectorAll("[data-apk]").forEach((a) => { a.href = CONFIG.apkUrl; });
  document.querySelectorAll("[data-releases]").forEach((a) => { a.href = CONFIG.releasesUrl; });
  document.querySelectorAll("[data-contact]").forEach((a) => { a.href = "mailto:" + values.contactEmail; });

  // Línea técnica bajo el botón: "v1.0.0 · 24 MB · Android 8.0+"
  const meta = [values.version, values.size, values.minAndroid].filter(Boolean).join(" · ");
  document.querySelectorAll("[data-download-meta]").forEach((el) => {
    el.textContent = meta;
    el.hidden = !meta;
  });

  // Numeración de fichas (01, 02…) solo sobre las secciones visibles
  let n = 0;
  document.querySelectorAll("[data-section-num]").forEach((el) => {
    if (el.closest("[hidden]")) return;
    n += 1;
    el.textContent = String(n).padStart(2, "0");
  });

  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- 2. Detección de dispositivo ---------- */

  const ua = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isAndroid = /Android/i.test(ua);
  const isMobile = isIOS || isAndroid || /Mobi|Tablet/i.test(ua);

  root.dataset.device = isIOS ? "ios" : isAndroid ? "android" : isMobile ? "mobile" : "desktop";

  if (isIOS) {
    const notice = document.getElementById("ios-notice");
    if (notice) notice.hidden = false;
  }

  if (!isMobile) loadQR();

  function currentPageUrl() {
    if (/^https?:$/.test(location.protocol)) return location.origin + location.pathname;
    return CONFIG.pageUrl;
  }

  function loadQR() {
    const box = document.getElementById("qr");
    if (!box) return;
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js";
    script.integrity = "sha384-mZT2gIty7ZDdOGkxfP6joZcYdMW1Jvj9dRlfpTmaJAKKXTqzygtB22k7FLe+KZC1";
    script.crossOrigin = "anonymous";
    script.referrerPolicy = "no-referrer";
    script.async = true;
    script.onload = () => {
      if (typeof window.qrcode !== "function") return;
      const qr = window.qrcode(0, "M");
      qr.addData(currentPageUrl());
      qr.make();
      const holder = box.querySelector(".qr__code");
      holder.innerHTML = qr.createSvgTag({ cellSize: 4, margin: 0, scalable: true });
      const svg = holder.querySelector("svg");
      svg.setAttribute("role", "img");
      svg.setAttribute("aria-label", "Código QR con el enlace a esta página");
      box.hidden = false;
    };
    // Sin conexión simplemente no se muestra el QR.
    document.head.appendChild(script);
  }

  /* ---------- 3. Copiar hash ---------- */

  const copyBtn = document.getElementById("copy-hash");
  const copyStatus = document.getElementById("copy-status");
  let copyTimer;

  function fallbackCopy(text) {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    let ok = false;
    try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
    area.remove();
    return ok;
  }

  if (copyBtn && sha) {
    copyBtn.addEventListener("click", async () => {
      let ok = false;
      try {
        await navigator.clipboard.writeText(sha);
        ok = true;
      } catch (e) {
        ok = fallbackCopy(sha);
      }
      copyBtn.classList.toggle("is-copied", ok);
      copyBtn.querySelector(".copy__label").textContent = ok ? "¡Copiado!" : "Copiar";
      copyStatus.textContent = ok
        ? "Hash copiado al portapapeles."
        : "No se pudo copiar. Selecciona el texto y cópialo a mano.";
      clearTimeout(copyTimer);
      copyTimer = setTimeout(() => {
        copyBtn.classList.remove("is-copied");
        copyBtn.querySelector(".copy__label").textContent = "Copiar";
      }, 2200);
    });
  }

  /* ---------- 4. Carrusel de capturas ---------- */

  const track = document.querySelector(".shots__track");
  const prev = document.querySelector("[data-shots-prev]");
  const next = document.querySelector("[data-shots-next]");

  if (track && prev && next) {
    const step = () => {
      const item = track.querySelector("li");
      return item ? item.getBoundingClientRect().width + 16 : 240;
    };
    const update = () => {
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
    };
    const behavior = reduceMotion ? "auto" : "smooth";
    prev.addEventListener("click", () => track.scrollBy({ left: -step(), behavior }));
    next.addEventListener("click", () => track.scrollBy({ left: step(), behavior }));
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  /* ---------- 5. Aparición al hacer scroll ---------- */

  const revealItems = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((el) => el.classList.add("is-visible"));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    revealItems.forEach((el) => io.observe(el));
  }
})();
