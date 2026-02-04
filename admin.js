// admin.js placeholderimport { firebaseConfig } from "./firebase-config.js";

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
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const $ = id => document.getElementById(id);

$("btnLogin").onclick = async () => {
  try {
    await signInWithEmailAndPassword(
      auth,
      $("email").value,
      $("senha").value
    );
  } catch (e) {
    alert("Erro no login: " + e.message);
    console.error(e);
  }
};


$("sair").onclick = () => signOut(auth);

$("salvar").onclick = async () => {
  await addDoc(collection(db, "produtos"), {
    titulo: $("titulo").value,
    categoria: $("categoria").value,
    preco: $("preco").value,
    loja: $("loja").value,
    imagem: $("imagem").value,
    linkAfiliado: $("link").value,
    criadoEm: serverTimestamp()
  });
  listar();
};

async function listar(){
  const snap = await getDocs(collection(db, "produtos"));
  $("lista").innerHTML = "";
  snap.forEach(d => {
    const p = d.data();
    $("lista").innerHTML += `
      <div>
        <b>${p.titulo}</b>
        <button onclick="deletar('${d.id}')">Excluir</button>
      </div>
    `;
  });
}

window.deletar = async id => {
  await deleteDoc(doc(db, "produtos", id));
  listar();
};

onAuthStateChanged(auth, user => {
  $("login").style.display = user ? "none" : "block";
  $("painel").style.display = user ? "block" : "none";
  if(user) listar();
});
