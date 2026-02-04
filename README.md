<!doctype html>
<html lang="pt-br">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Vitrine de Ofertas</title>
  <meta name="description" content="Vitrine de produtos com links de afiliado. Ao clicar você vai para a loja oficial." />
  <style>
    :root{--bg:#0b0f17;--card:#121a29;--txt:#e8eefc;--muted:#a8b3cf;--line:#23314d;--btn:#3b82f6;}
    *{box-sizing:border-box;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial;}
    body{margin:0;background:linear-gradient(180deg,#070a10, #0b0f17 40%, #070a10);color:var(--txt);}
    header{position:sticky;top:0;background:rgba(11,15,23,.85);backdrop-filter:blur(8px);border-bottom:1px solid var(--line);z-index:10}
    .wrap{max-width:1050px;margin:0 auto;padding:16px}
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
    .info{display:flex;flex-direction:column;gap:6px;min-width:0}
    .title{font-weight:800;font-size:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .meta{font-size:12px;color:var(--muted);display:flex;gap:10px;flex-wrap:wrap}
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
  </style>
</head>
<body>
  <header>
    <div class="wrap top">
      <div class="brand">
        <div class="logo">DS</div>
        <div>
          <h1>Vitrine de Ofertas</h1>
          <div class="muted">Ao clicar em “Comprar”, você será redirecionado para a loja oficial.</div>
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
      <b>Como editar:</b> desça no código até <code>const produtos = [...]</code> e troque pelos seus links de afiliado.
      Dica: use imagens (URL) do próprio produto na loja.
    </div>
    <div style="height:14px"></div>
    <section class="grid" id="grid"></section>
  </main>

  <footer>
    <div class="wrap">
      <p>
        <b>Aviso:</b> Este site usa links de afiliado. Podemos receber comissão por compras qualificadas, sem custo extra para você.
      </p>
      <p>
        <a href="#privacidade" onclick="alert('Sugestão: crie uma página/arquivo privacidade.html com sua política.');return false;">Política de Privacidade</a>
        • <a href="#contato" onclick="alert('Sugestão: coloque seu WhatsApp/Instagram no rodapé.');return false;">Contato</a>
      </p>
    </div>
  </footer>

  <script>
    // ========= EDITA AQUI =========
    const produtos = [
      {
        titulo: "Headset Gamer (Exemplo)",
        categoria: "Acessórios",
        preco: "R$ 79,90",
        loja: "Shopee",
        imagem: "https://images.unsplash.com/photo-1518441984945-6e9071b0f7aa?auto=format&fit=crop&w=300&q=60",
        linkAfiliado: "COLE_AQUI_SEU_LINK_DE_AFILIADO"
      },
      {
        titulo: "Mouse Gamer (Exemplo)",
        categoria: "Acessórios",
        preco: "R$ 39,90",
        loja: "Amazon",
        imagem: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=300&q=60",
        linkAfiliado: "COLE_AQUI_SEU_LINK_DE_AFILIADO"
      },
      {
        titulo: "Teclado Mecânico (Exemplo)",
        categoria: "Periféricos",
        preco: "R$ 129,90",
        loja: "Magalu",
        imagem: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=300&q=60",
        linkAfiliado: "COLE_AQUI_SEU_LINK_DE_AFILIADO"
      }
    ];
    // ==============================

    const grid = document.getElementById("grid");
    const q = document.getElementById("q");
    const cat = document.getElementById("cat");

    function uniqueCats(items){
      return [...new Set(items.map(p => p.categoria))].sort((a,b)=>a.localeCompare(b));
    }

    function render(){
      const term = q.value.trim().toLowerCase();
      const c = cat.value;

      const filtered = produtos.filter(p=>{
        const okCat = (c === "all") || (p.categoria === c);
        const okTerm = !term || (p.titulo.toLowerCase().includes(term) || p.loja.toLowerCase().includes(term));
        return okCat && okTerm;
      });

      grid.innerHTML = filtered.map(p => `
        <article class="card">
          <div class="img">
            ${p.imagem ? `<img src="${p.imagem}" alt="${p.titulo}">` : "Sem imagem"}
          </div>
          <div class="info">
            <div class="title" title="${p.titulo}">${p.titulo}</div>
            <div class="meta">
              <span class="tag">${p.categoria}</span>
              <span class="tag">${p.loja}</span>
              ${p.preco ? `<span class="price">${p.preco}</span>` : ""}
            </div>
            <a class="btn" href="${p.linkAfiliado}" target="_blank" rel="noopener noreferrer nofollow">
              Comprar ↗
            </a>
          </div>
        </article>
      `).join("") || `<div class="note">Nenhum produto encontrado.</div>`;
    }

    function setupCats(){
      const cats = uniqueCats(produtos);
      cat.innerHTML = `<option value="all">Todas categorias</option>` + cats.map(c=>`<option value="${c}">${c}</option>`).join("");
    }

    q.addEventListener("input", render);
    cat.addEventListener("change", render);

    setupCats();
    render();
  </script>
</body>
</html>
