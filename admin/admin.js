import { db } from "../js/firebase.js";

import {
collection,
addDoc,
getDocs,
deleteDoc,
doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
getStorage,
ref,
uploadBytes,
getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";


const firebaseConfig = {
    apiKey: "AIzaSyC6ucn_SfxpHwifFtawdGCQvaap1YlnK-g",
    authDomain: "cobraweb-9f803.firebaseapp.com",
    projectId: "cobraweb-9f803",
    storageBucket: "cobraweb-9f803.firebasestorage.app",
    messagingSenderId: "1069149879530",
    appId: "1:1069149879530:web:b3c90b04175fbab0492b93"
  };

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

window.subirPersonaje = async function(){

const nombre = document.getElementById("nombre").value;
const imagenFile = document.getElementById("imagen").files[0];

const storageRef = ref(storage, "personajes/"+imagenFile.name);

await uploadBytes(storageRef, imagenFile);

const url = await getDownloadURL(storageRef);

await addDoc(collection(db,"personajes"),{
nombre:nombre,
imagen:url
});

alert("Personaje agregado");

location.reload();

}

async function cargar(){

const lista = document.getElementById("lista");

const querySnapshot = await getDocs(collection(db,"personajes"));

querySnapshot.forEach((docu)=>{

const data = docu.data();

lista.innerHTML += `
<div class="personaje">
${data.nombre}
<button onclick="eliminar('${docu.id}')">Eliminar</button>
</div>
`;

});

}

window.eliminar = async function(id){

await deleteDoc(doc(db,"personajes",id));

location.reload();

}

cargar();
