(async function () {
  async function loadInto(id, url) {
    const el = document.getElementById(id);
    if (!el) return;

    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);

    el.innerHTML = await res.text();
  }

  // --- Load Partials ---
  try {
    await loadInto("site-header", "/assets/partials/header.html");
    await loadInto("site-footer", "/assets/partials/footer.html");
  } catch (e) {
    // Keine F12? Dann wenigstens nicht alles crashen:
    // Seite läuft weiter, nur Header/Footer fehlen.
    return;
  }

  // --- Header: garantiert NICHT sticky/fixed ---
  const headerWrap = document.getElementById("site-header");

  function killSticky() {
    if (!headerWrap) return;

    // Nur die relevanten Elemente, nicht wild alles!
    const nodes = [
      headerWrap,
      headerWrap.querySelector("header.site-header"),
    ].filter(Boolean);

    nodes.forEach((el) => {
      el.style.position = "static";
      el.style.top = "auto";
      el.style.bottom = "auto";
      el.style.left = "auto";
      el.style.right = "auto";
      el.style.zIndex = "auto";
      el.style.transform = "none";
    });

    const hdr = headerWrap.querySelector("header.site-header");
    if (hdr) hdr.classList.remove("sticky", "is-sticky", "fixed", "fixed-top", "sticky-top");
  }

  // 1x direkt + nach dem Render-Frame
  killSticky();
  requestAnimationFrame(killSticky);

  // Wenn wirklich jemand später sticky setzt: nur Header beobachten (leicht & sauber)
  if (headerWrap) {
    const mo = new MutationObserver(() => killSticky());
    mo.observe(headerWrap, { attributes: true, subtree: true, attributeFilter: ["class", "style"] });
  }

  // --- Active Tab ---
  const page = document.body.getAttribute("data-page") || "home";
  document.querySelectorAll('.tablink[data-page]').forEach((a) => {
    if (a.getAttribute("data-page") === page) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
})();
