(async function(){
  async function loadInto(id, url){
    const el = document.getElementById(id);
    if(!el) return;
    const res = await fetch(url, { cache: "no-store" });
    el.innerHTML = await res.text();
  }

  await loadInto("site-header", "/assets/partials/header.html");
  await loadInto("site-footer", "/assets/partials/footer.html");

  // ✅ Sticky-Killer (läuft nach dem Nachladen!)
  const killSticky = () => {
    const wrap = document.getElementById("site-header");
    const hdr  = document.querySelector("#site-header header.site-header");
    const inner = document.querySelector("#site-header .header-inner");
    const nav = document.querySelector("#site-header nav.tabs");

    [wrap, hdr, inner, nav].forEach(el => {
      if(!el) return;
      el.style.position = "static";
      el.style.top = "auto";
      el.style.bottom = "auto";
      el.style.zIndex = "auto";
      el.style.transform = "none";
    });

    // falls jemand Klassen setzt
    if(hdr){
      hdr.classList.remove("sticky","is-sticky","fixed","fixed-top","sticky-top");
    }
  };

  killSticky();
  // Falls ein Script später wieder sticky setzt: nochmal killen
  setTimeout(killSticky, 50);
  setTimeout(killSticky, 300);
  setInterval(killSticky, 2000);

  const page = document.body.getAttribute("data-page") || "home";
  document.querySelectorAll('.tablink[data-page]').forEach(a => {
    if(a.getAttribute("data-page") === page) a.setAttribute("aria-current","page");
    else a.removeAttribute("aria-current");
  });
})();
