<!doctype html>
<html lang="pt-br">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>ShopFi</title>
  <meta name="description" content="ShopFi — vitrine de ofertas com links de afiliado." />
  <meta name="referrer" content="no-referrer-when-downgrade">

  <style>
    :root{--bg:#0b0f17;--card:#121a29;--txt:#e8eefc;--muted:#a8b3cf;--line:#23314d;--btn:#3b82f6;}
    *{box-sizing:border-box;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial;}
    body{margin:0;background:linear-gradient(180deg,#070a10, #0b0f17 40%, #070a10);color:var(--txt);}
    header{position:sticky;top:0;background:rgba(11,15,23,.85);backdrop-filter:blur(8px);border-bottom:1px solid var(--line);z-index:10}
    .wrap{max-width:1100px;margin:0 auto;padding:16px}
    .top{display:flex;gap:12px;align-items:center;justify-content:space-between;flex-wrap:wrap}
    .brand{display:flex;gap:10px;align-items:center}
    .logo{width:38px;height:38px;border-radius:12px;background:linear-gradient(135deg,#60a5fa,#a78bfa);display:grid;place-items:center;font-weight:900;color:#0b0f17}
    h1{font-size:18px;margin:0}
    .muted{color:var(--muted);font-size:13px;margin:2px 0 0}
    .controls{display:flex;gap:10px;flex-wrap:wrap}
    input,select{background:#0e1626;border:1px solid var(--line);color:var(--txt);padding:10px 12px;border-radius:12px;outline:none}
    main{padding:18px 0 40px}
    .grid{display:grid;grid-template-columns:repeat(12,1fr);gap:14px}
    .card{grid-column:span 12;background:rgba(18,26,41,.95);border:1px solid var(--line);border-radius:18px;overflow:hidden;display:flex;gap:14px;padding:14px}
    @media(min-width:700px){.card{grid-column:span 6}}
    @media(min-width:1000px){.card{grid-column:span 4}}
    .img{
      width:92px;height:92px;border-radius:16px;background:#0e1626;border:1px solid var(--line);
      display:grid;place-items:center;color:var(--muted);flex:0 0 auto;overflow:hidden
    }
    .img img{width:100%;height:100%;object-fit:cover}
    .info{display:flex;flex-direction:column;gap:6px;min-width:0;width:100%}
    .title{font-weight:800;font-size:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .meta{font-size:12px;color:var(--muted);display:flex;gap:8px;flex-wrap:wrap}
    .price{font-weight:900}
    .btn{
      margin-top:auto;display:inline-flex;align-items:center;justify-content:center;gap:8px;
      background:var(--btn);color:white;border:none;border-radius:14px;padding:10px 12px;
      font-weight:800;cursor:pointer;text-decoration:none
    }
    .btn:active{transform:scale(.99)}
    footer{border-top:1px solid var(--line);color:var(--muted);font-size:12px}
    .tag{border:1px solid var(--line);padding:2px 8px;border-radius:999px}
    .note{background:#0e1626;border:1px dashed var(--line);border-radius:16px;padding:12px;color:var(--muted);font-size:13px}
    a{color:#93c5fd}
    .row{display:flex;gap:10px;align-items:center;flex-wrap:wrap}
    .pill{padding:6px 10px;border-radius:999px;border:1px solid var(--line);background:#0e1626;color:var(--muted);font-size:12px}
  </style>
</head>
<body>
  <header>
    <div class="wrap top">
      <div class="brand">
        <div class="logo">SF</div>
        <div>
          <h1>ShopFi</h1>
          <div class="muted">Clique em “Comprar” e você vai para a loja oficial.</div>
        </div>
      </div>
      <div class="controls">
        <input id="q" placeholder="Buscar produto..." />
        <select id="cat">
          <option value="all">Todas categorias</option>
        </select>
      </div>
    </div>
  </header>

  <main class="wrap">
    <div class="note">
      <b>ShopFi</b> é uma vitrine. Os produtos abrem na loja oficial usando link de afiliado.
      <div style="height:8px"></div>
      <span class="pill" id="status">Carregando produtos...</span>
    </div>

    <div style="height:14px"></div>
    <section class="grid" id="grid"></section>
  </main>

  <footer>
    <div class="wrap">
      <p>
        <b>Aviso:</b> Este site contém links de afiliado. Podemos receber comissão por compras qualificadas, sem custo extra para você.
      </p>
      <p class="row">
        <span>© <span id="year"></span> ShopFi</span>
        <span>•</span>
        <a href="#" id="adminLink" style="opacity:.55">Acesso</a>
      </p>
    </div>
  </footer>

  <script type="module">
    import { carregarProdutos } from "./app.js";

    const grid = document.getElementById("grid");
    const q = document.getElementById("q");
    const cat = document.getElementById("cat");
    const status = document.getElementById("status");

    document.getElementById("year").textContent = new Date().getFullYear();

    // Link admin "escondido"
    // dica: você pode tirar esse link e acessar direto /admin.html
    document.getElementById("adminLink").addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "./admin.html";
    });

    const esc = (s) => String(s ?? "")
      .replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;")
      .replaceAll('"',"&quot;").replaceAll("'","&#039;");

    function uniqueCats(items){
      return [...new Set(items.map(p => p.categoria).filter(Boolean))].sort((a,b)=>a.localeCompare(b));
    }

    function render(produtos){
      const term = q.value.trim().toLowerCase();
      const c = cat.value;

      const filtered = produtos.filter(p=>{
        const okCat = (c === "all") || (p.categoria === c);
        const okTerm = !term || (
          (p.titulo || "").toLowerCase().includes(term) ||
          (p.loja || "").toLowerCase().includes(term)
        );
        return okCat && okTerm;
      });

      grid.innerHTML = filtered.map(p => `
        <article class="card">
          <div class="img">
            ${p.imagem ? `<img src="${esc(p.imagem)}" alt="${esc(p.titulo)}">` : "Sem imagem"}
          </div>
          <div class="info">
            <div class="title" title="${esc(p.titulo)}">${esc(p.titulo || "Produto")}</div>
            <div class="meta">
              ${p.categoria ? `<span class="tag">${esc(p.categoria)}</span>` : ""}
              ${p.loja ? `<span class="tag">${esc(p.loja)}</span>` : ""}
              ${p.preco ? `<span class="price">${esc(p.preco)}</span>` : ""}
            </div>
            <a class="btn" href="${esc(p.linkAfiliado)}" target="_blank" rel="noopener noreferrer nofollow">
              Comprar ↗
            </a>
          </div>
        </article>
      `).join("") || `<div class="note">Nenhum produto encontrado.</div>`;
    }

    function setupCats(produtos){
      const cats = uniqueCats(produtos);
      cat.innerHTML = `<option value="all">Todas categorias</option>` +
        cats.map(c=>`<option value="${esc(c)}">${esc(c)}</option>`).join("");
    }

    async function boot(){
      try{
        const produtos = await carregarProdutos();
        setupCats(produtos);
        render(produtos);

        q.addEventListener("input", () => render(produtos));
        cat.addEventListener("change", () => render(produtos));

        status.textContent = `Produtos carregados: ${produtos.length}`;
      }catch(err){
        console.error(err);
        status.textContent = "Erro ao carregar produtos. Verifique o Firebase Config.";
        grid.innerHTML = `<div class="note">Não foi possível carregar. Confere o arquivo <b>firebase-config.js</b>.</div>`;
      }
    }

    boot();
  </script>
</body>
</html>
