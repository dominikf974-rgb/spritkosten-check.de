(async function () {
  async function loadInto(id, url) {
    const el = document.getElementById(id);
    if (!el) return;

    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return;

    el.innerHTML = await res.text();
  }

  await loadInto("site-header", "assets/partials/header.html");
  await loadInto("site-footer", "assets/partials/footer.html");

  // Header: niemals sticky/fixed (einmalig + leicht)
  const headerWrap = document.getElementById("site-header");

  function killSticky() {
    if (!headerWrap) return;
    const hdr = headerWrap.querySelector("header.site-header");
    [headerWrap, hdr].filter(Boolean).forEach(el => {
      el.style.position = "static";
      el.style.top = "auto";
      el.style.bottom = "auto";
      el.style.left = "auto";
      el.style.right = "auto";
      el.style.zIndex = "auto";
      el.style.transform = "none";
    });
    if (hdr) hdr.classList.remove("sticky","is-sticky","fixed","fixed-top","sticky-top");
  }

  killSticky();
  requestAnimationFrame(killSticky);

  // Nur Header beobachten (kein Intervall, kein Ruckeln)
  if (headerWrap) {
    const mo = new MutationObserver(() => killSticky());
    mo.observe(headerWrap, { attributes: true, subtree: true, attributeFilter: ["class", "style"] });
  }

  // Active tab markieren
  const page = document.body.getAttribute("data-page") || "home";
  document.querySelectorAll('.tablink[data-page]').forEach(a => {
    if (a.getAttribute("data-page") === page) a.setAttribute("aria-current","page");
    else a.removeAttribute("aria-current");
  });
})();
