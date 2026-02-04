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
<!doctype html>
<html lang="pt-br">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>ShopFi • Admin</title>
  <meta name="robots" content="noindex,nofollow" />
  <style>
    body{margin:0;background:#0b0f17;color:#e8eefc;font-family:system-ui}
    .wrap{max-width:980px;margin:0 auto;padding:16px}
    .card{background:#121a29;border:1px solid #23314d;border-radius:18px;padding:14px;margin:12px 0}
    input{width:100%;padding:10px;border-radius:12px;border:1px solid #23314d;background:#0e1626;color:#e8eefc;outline:none;margin:6px 0}
    button{padding:10px 12px;border:0;border-radius:12px;background:#3b82f6;color:white;font-weight:800;cursor:pointer}
    .row{display:grid;grid-template-columns:1fr 1fr;gap:10px}
    @media(max-width:700px){.row{grid-template-columns:1fr}}
    .muted{color:#a8b3cf;font-size:13px}
    .danger{background:#ef4444}
    a{color:#93c5fd}
  </style>
</head>
<body>
  <div class="wrap">
    <div style="display:flex;justify-content:space-between;gap:10px;align-items:center;flex-wrap:wrap">
      <h1 style="margin:10px 0">ShopFi • Admin</h1>
      <a href="./index.html">← voltar pra vitrine</a>
    </div>

    <div id="status" class="muted">Carregando...</div>

    <div class="card" id="boxLogin">
      <h2>Login</h2>
      <div class="muted">Use o e-mail/senha que você criou no Firebase Authentication.</div>
      <input id="email" placeholder="E-mail" autocomplete="username" />
      <input id="senha" placeholder="Senha" type="password" autocomplete="current-password" />
      <button id="btnLogin">Entrar</button>
      <div id="loginMsg" class="muted" style="margin-top:10px"></div>
    </div>

    <div class="card" id="boxAdmin" style="display:none">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap">
        <h2 style="margin:0">Painel</h2>
        <button id="btnSair" class="danger">Sair</button>
      </div>

      <form id="formProduto" class="card">
        <h3 style="margin-top:0">Adicionar produto</h3>
        <input id="ptitulo" placeholder="Título (ex: Headset Gamer)" required />
        <div class="row">
          <input id="pcategoria" placeholder="Categoria (ex: Acessórios)" />
          <input id="ploja" placeholder="Loja (ex: Shopee/Amazon)" />
        </div>
        <div class="row">
          <input id="ppreco" placeholder="Preço (ex: R$ 79,90)" />
          <input id="pimagem" placeholder="Imagem (URL)" />
        </div>
        <input id="plink" placeholder="Link de afiliado (obrigatório)" required />
        <button type="submit">Salvar</button>
        <div id="saveMsg" class="muted" style="margin-top:10px"></div>
      </form>

      <div class="card">
        <h3 style="margin-top:0">Produtos cadastrados</h3>
        <div id="lista"></div>
      </div>
    </div>
  </div>

  <script type="module" src="./admin.js"></script>
</body>
</html>
// firebase-config.js
export const firebaseConfig = {
  apiKey: "COLE_AQUI",
  authDomain: "COLE_AQUI",
  projectId: "COLE_AQUI",
  storageBucket: "COLE_AQUI",
  messagingSenderId: "COLE_AQUI",
  appId: "COLE_AQUI"
};
import { firebaseConfig } from "./firebase-config.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getFirestore, collection, getDocs, query, orderBy
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function carregarProdutos() {
  const col = collection(db, "produtos");
  const q = query(col, orderBy("criadoEm", "desc"));
  const snap = await getDocs(q);

  return snap.docs.map(d => {
    const data = d.data();
    return {
      id: d.id,
      titulo: data.titulo || "",
      categoria: data.categoria || "",
      preco: data.preco || "",
      loja: data.loja || "",
      imagem: data.imagem || "",
      linkAfiliado: data.linkAfiliado || ""
    };
  });
}
import { firebaseConfig } from "./firebase-config.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

import {
  getFirestore, collection, addDoc, serverTimestamp, getDocs,
  deleteDoc, doc, query, orderBy
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const $ = (id) => document.getElementById(id);
const setText = (id, t) => { const el=$(id); if(el) el.textContent=t; };

function esc(s){
  return String(s ?? "")
    .replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;")
    .replaceAll('"',"&quot;").replaceAll("'","&#039;");
}

async function listar() {
  const lista = $("lista");
  lista.innerHTML = `<div class="muted">Carregando...</div>`;

  const col = collection(db, "produtos");
  const q = query(col, orderBy("criadoEm", "desc"));
  const snap = await getDocs(q);

  if (snap.empty) {
    lista.innerHTML = `<div class="muted">Nenhum produto cadastrado ainda.</div>`;
    return;
  }

  lista.innerHTML = "";
  snap.forEach((d) => {
    const p = d.data();

    const div = document.createElement("div");
    div.style.border = "1px solid #23314d";
    div.style.padding = "10px";
    div.style.borderRadius = "12px";
    div.style.marginBottom = "10px";
    div.style.background = "#0e1626";

    div.innerHTML = `
      <b>${esc(p.titulo || "Sem título")}</b><br>
      <span style="color:#a8b3cf;font-size:12px">
        ${esc(p.categoria || "")}${p.categoria ? " • " : ""}
        ${esc(p.loja || "")}${p.loja ? " • " : ""}
        ${esc(p.preco || "")}
      </span><br>
      <a href="${esc(p.linkAfiliado || "#")}" target="_blank" rel="noopener noreferrer">Ver link</a>
      ${p.imagem ? ` • <a href="${esc(p.imagem)}" target="_blank" rel="noopener noreferrer">Ver imagem</a>` : ""}
      <br><br>
      <button data-id="${d.id}" style="background:#ef4444">Excluir</button>
    `;

    div.querySelector("button").onclick = async () => {
      try{
        await deleteDoc(doc(db, "produtos", d.id));
        await listar();
      }catch(e){
        alert("Erro ao excluir: " + (e?.message || e));
      }
    };

    lista.appendChild(div);
  });
}

$("btnLogin").onclick = async () => {
  setText("loginMsg", "Entrando...");
  try {
    await signInWithEmailAndPassword(auth, $("email").value.trim(), $("senha").value);
    setText("loginMsg", "Login ok.");
  } catch (e) {
    setText("loginMsg", "Erro no login: " + (e?.message || e));
  }
};

$("btnSair").onclick = async () => {
  await signOut(auth);
};

$("formProduto").onsubmit = async (e) => {
  e.preventDefault();
  setText("saveMsg", "Salvando...");

  const titulo = $("ptitulo").value.trim();
  const categoria = $("pcategoria").value.trim();
  const preco = $("ppreco").value.trim();
  const loja = $("ploja").value.trim();
  const imagem = $("pimagem").value.trim();
  const linkAfiliado = $("plink").value.trim();

  if (!titulo || !linkAfiliado) {
    setText("saveMsg", "Título e Link de afiliado são obrigatórios.");
    return;
  }

  try {
    await addDoc(collection(db, "produtos"), {
      titulo, categoria, preco, loja, imagem, linkAfiliado,
      criadoEm: serverTimestamp()
    });
    e.target.reset();
    setText("saveMsg", "Produto salvo ✅");
    await listar();
  } catch (e2) {
    setText("saveMsg", "Erro ao salvar: " + (e2?.message || e2));
  }
};

onAuthStateChanged(auth, (user) => {
  if (user) {
    $("boxLogin").style.display = "none";
    $("boxAdmin").style.display = "block";
    setText("status", "Logado: " + user.email);
    listar();
  } else {
    $("boxLogin").style.display = "block";
    $("boxAdmin").style.display = "none";
    setText("status", "Deslogado.");
  }
});
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /produtos/{docId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
