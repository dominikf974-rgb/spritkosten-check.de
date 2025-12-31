(async function(){

  function rootPath(){
    const p = location.pathname.split('/');
    if (p[p.length-1] === '' || p[p.length-1].includes('.')) p.pop();
    return '../'.repeat(p.length-1);
  }

  const ROOT = rootPath();

  async function loadInto(id, file){
    const el = document.getElementById(id);
    if(!el) return;
    const res = await fetch(ROOT + 'assets/partials/' + file, { cache: "no-store" });
    el.innerHTML = await res.text();
  }

  await loadInto("site-header", "header.html");
  await loadInto("site-footer", "footer.html");

  const page = document.body.getAttribute("data-page") || "home";
  document.querySelectorAll('.tablink[data-page]').forEach(a => {
    if(a.getAttribute("data-page") === page) a.setAttribute("aria-current","page");
    else a.removeAttribute("aria-current");
  });

})();
