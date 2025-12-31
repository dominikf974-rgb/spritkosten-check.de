(async function(){
  async function loadInto(id, url){
    const el = document.getElementById(id);
    if(!el) return;
    const res = await fetch(url, { cache: "no-store" });
    el.innerHTML = await res.text();
  }

  await loadInto("site-header", "/assets/partials/header.html");
  await loadInto("site-footer", "/assets/partials/footer.html");

  const page = document.body.getAttribute("data-page") || "home";
  document.querySelectorAll('.tablink[data-page]').forEach(a => {
    if(a.getAttribute("data-page") === page) a.setAttribute("aria-current","page");
    else a.removeAttribute("aria-current");
  });
})();
