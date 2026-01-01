(function () {
  const BASE = "/"; // bei spritkosten-check.de Root passt "/"
  const HEADER_URL = BASE + "assets/partials/header.html";
  const FOOTER_URL = BASE + "assets/partials/footer.html";

  function fetchWithTimeout(url, ms = 8000) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), ms);
    return fetch(url, { cache: "force-cache", signal: ctrl.signal })
      .finally(() => clearTimeout(t));
  }

  async function loadInto(id, url) {
    const el = document.getElementById(id);
    if (!el) return;

    try {
      const res = await fetchWithTimeout(url, 8000);
      if (!res.ok) return;
      el.innerHTML = await res.text();
    } catch (_) {
      // Timeout/Netzfehler -> einfach überspringen, kein Endlos-Laden
    }
  }

  async function init() {
    // parallel laden, nicht nacheinander blockieren
    await Promise.allSettled([
      loadInto("site-header", HEADER_URL),
      loadInto("site-footer", FOOTER_URL),
    ]);

    // Active Tab
    const page = document.body.getAttribute("data-page") || "home";
    document.querySelectorAll('.tablink[data-page]').forEach(a => {
      if (a.getAttribute("data-page") === page) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
