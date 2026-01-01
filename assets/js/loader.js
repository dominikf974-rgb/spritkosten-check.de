(function () {
  const HEADER_URL = "/assets/partials/header.html";
  const FOOTER_URL = "/assets/partials/footer.html";

  function fetchWithTimeout(url, ms = 7000) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), ms);
    return fetch(url, { cache: "no-store", signal: ctrl.signal })
      .finally(() => clearTimeout(t));
  }

  async function loadInto(id, url) {
    const el = document.getElementById(id);
    if (!el) return false;

    // Platzhalter, damit du siehst: loader läuft
    if (id === "site-header") el.innerHTML = `<div style="padding:10px 14px;background:#fff;border-bottom:1px solid #eee">Header lädt…</div>`;
    if (id === "site-footer") el.innerHTML = `<div style="padding:10px 14px;background:#fff;border-top:1px solid #eee">Footer lädt…</div>`;

    try {
      const res = await fetchWithTimeout(url, 7000);
      if (!res.ok) return false;
      el.innerHTML = await res.text();
      return true;
    } catch (e) {
      return false;
    }
  }

  function killStickyHard() {
    const wrap = document.getElementById("site-header");
    const hdr = wrap?.querySelector("header.site-header");
    if (!wrap || !hdr) return;

    [wrap, hdr].forEach(el => {
      el.style.setProperty("position", "static", "important");
      el.style.setProperty("top", "auto", "important");
      el.style.setProperty("transform", "none", "important");
      el.style.setProperty("z-index", "auto", "important");
    });
  }

  async function init() {
    const [h, f] = await Promise.all([
      loadInto("site-header", HEADER_URL),
      loadInto("site-footer", FOOTER_URL),
    ]);

    // Wenn Header/Footers nicht geladen: klare Meldung anzeigen
    if (!h) {
      const wrap = document.getElementById("site-header");
      if (wrap) wrap.innerHTML = `<div style="padding:12px 14px;background:#fff;border-bottom:1px solid #eee">
        <b>Header konnte nicht geladen werden.</b><br>Pfad: <code>${HEADER_URL}</code>
      </div>`;
    }
    if (!f) {
      const wrap = document.getElementById("site-footer");
      if (wrap) wrap.innerHTML = `<div style="padding:12px 14px;background:#fff;border-top:1px solid #eee">
        <b>Footer konnte nicht geladen werden.</b><br>Pfad: <code>${FOOTER_URL}</code>
      </div>`;
    }

    // Sticky kill nach dem Laden
    killStickyHard();
    requestAnimationFrame(killStickyHard);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
