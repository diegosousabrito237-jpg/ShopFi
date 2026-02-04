import { firebaseConfig } from "./firebase-config.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const $ = (id) => document.getElementById(id);

function msg(t) {
  // se não existir elemento de msg, mostra alert
  const el = $("loginMsg") || $("saveMsg");
  if (el) el.textContent = t;
  else if (t) alert(t);
}

$("btnLogin").onclick = async () => {
  try {
    await signInWithEmailAndPassword(auth, $("email").value.trim(), $("senha").value);
  } catch (e) {
    alert("Erro no login: " + e.message);
    console.error(e);
  }
};

$("sair").onclick = async () => {
  await signOut(auth);
};

$("salvar").onclick = async () => {
  try {
    await addDoc(collection(db, "produtos"), {
      titulo: $("titulo").value.trim(),
      categoria: $("categoria").value.trim(),
      preco: $("preco").value.trim(),
      loja: $("loja").value.trim(),
      imagem: $("imagem").value.trim(),
      linkAfiliado: $("link").value.trim(),
      criadoEm: serverTimestamp()
    });

    // limpa campos
    ["titulo","categoria","preco","loja","imagem","link"].forEach(id => $(id).value = "");
    await listar();
  } catch (e) {
    alert("Erro ao salvar: " + e.message);
    console.error(e);
  }
};

async function listar() {
  const lista = $("lista");
  if (!lista) return;

  lista.innerHTML = "Carregando...";

  try {
    const q = query(collection(db, "produtos"), orderBy("criadoEm", "desc"));
    const snap = await getDocs(q);

    if (snap.empty) {
      lista.innerHTML = "Nenhum produto cadastrado ainda.";
      return;
    }

    lista.innerHTML = "";
    snap.forEach((d) => {
      const p = d.data();
      const div = document.createElement("div");
      div.style.display = "flex";
      div.style.justifyContent = "space-between";
      div.style.alignItems = "center";
      div.style.gap = "10px";
      div.style.padding = "10px";
      div.style.border = "1px solid #23314d";
      div.style.borderRadius = "10px";
      div.style.margin = "8px 0";
      div.innerHTML = `
        <div>
          <b>${p.titulo || "Sem título"}</b><br>
          <small style="color:#a8b3cf">${p.categoria || ""} ${p.preco ? "• "+p.preco : ""}</small>
        </div>
        <button style="background:#ef4444;border:0;border-radius:8px;padding:8px 10px;color:#fff;cursor:pointer">
          Excluir
        </button>
      `;
      div.querySelector("button").onclick = async () => {
        await deleteDoc(doc(db, "produtos", d.id));
        listar();
      };
      lista.appendChild(div);
    });
  } catch (e) {
    lista.innerHTML = "Erro ao carregar lista: " + e.message;
    console.error(e);
  }
}

onAuthStateChanged(auth, (user) => {
  $("login").style.display = user ? "none" : "block";
  $("painel").style.display = user ? "block" : "none";
  if (user) listar();
});
