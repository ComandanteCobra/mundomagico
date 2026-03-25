import { db, storage } from "../js/firebase.js";

import {
collection,
addDoc,
getDocs,
deleteDoc,
doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
ref,
uploadBytes,
getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";


// =======================
// 🎭 PERSONAJES
// =======================

// SUBIR PERSONAJE
window.subirPersonaje = async function(){

try{

const nombre = document.getElementById("nombre").value.trim();
const fileInput = document.getElementById("imagen");
const imagenFile = fileInput.files[0];

if(!nombre || !imagenFile){
    alert("Completa todos los campos");
    return;
}

// validar imagen
if(!imagenFile.type.startsWith("image/")){
    alert("Debe ser una imagen");
    return;
}

// nombre único
const nombreUnico = Date.now() + "_" + imagenFile.name;

const storageRef = ref(storage, "personajes/" + nombreUnico);

await uploadBytes(storageRef, imagenFile);

const url = await getDownloadURL(storageRef);

// guardar en firestore
await addDoc(collection(db,"personajes"),{
    nombre: nombre,
    imagen: url,
    createdAt: new Date()
});

// limpiar
fileInput.value = "";
document.getElementById("nombre").value = "";

alert("Personaje agregado");

cargarPersonajes();

}catch(error){
console.error(error);
alert("Error al subir personaje");
}

}


// CARGAR PERSONAJES
async function cargarPersonajes(){

const lista = document.getElementById("lista");

if(!lista) return;

lista.innerHTML = "";

const querySnapshot = await getDocs(collection(db,"personajes"));

querySnapshot.forEach((docu)=>{

const data = docu.data();

lista.innerHTML += `
<div class="personaje-item">
    <img src="${data.imagen}">
    <span>${data.nombre}</span>
    <button onclick="eliminarPersonaje('${docu.id}')">Eliminar</button>
</div>
`;

});

}


// ELIMINAR PERSONAJE
window.eliminarPersonaje = async function(id){

try{

if(confirm("¿Eliminar personaje?")){
    await deleteDoc(doc(db,"personajes",id));
    cargarPersonajes();
}

}catch(error){
console.error(error);
alert("Error al eliminar");
}

}



// =======================
// 🖼️ GALERÍA
// =======================

// SUBIR GALERÍA
window.subirGaleria = async function(){

try{

const tipo = document.getElementById("tipo").value;
const fileInput = document.getElementById("archivoGaleria");
const file = fileInput.files[0];

if(!file){
    alert("Selecciona un archivo");
    return;
}

// validar tipo
if(tipo === "imagen" && !file.type.startsWith("image/")){
    alert("Debe ser una imagen");
    return;
}

if(tipo === "video" && !file.type.startsWith("video/")){
    alert("Debe ser un video");
    return;
}

// nombre único
const nombreUnico = Date.now() + "_" + file.name;
const ruta = "galeria/" + nombreUnico;

const storageRef = ref(storage, ruta);

await uploadBytes(storageRef, file);

const url = await getDownloadURL(storageRef);

// guardar
await addDoc(collection(db,"galeria"),{
    tipo: tipo,
    url: url,
    createdAt: new Date()
});

// limpiar
fileInput.value = "";

alert("Agregado a galería");

cargarGaleria();

}catch(error){
console.error(error);
alert("Error al subir archivo");
}

}


// CARGAR GALERÍA
async function cargarGaleria(){

const lista = document.getElementById("listaGaleria");

if(!lista) return;

lista.innerHTML = "";

const querySnapshot = await getDocs(collection(db,"galeria"));

querySnapshot.forEach((docu)=>{

const data = docu.data();

lista.innerHTML += `
<div class="galeria-item">

    ${
        data.tipo === "imagen"
        ? `<img src="${data.url}">`
        : `<video width="60" muted>
              <source src="${data.url}" type="video/mp4">
           </video>`
    }

    <button onclick="eliminarGaleria('${docu.id}')">Eliminar</button>

</div>
`;

});

}


// ELIMINAR GALERÍA
window.eliminarGaleria = async function(id){

try{

if(confirm("¿Eliminar elemento?")){
    await deleteDoc(doc(db,"galeria",id));
    cargarGaleria();
}

}catch(error){
console.error(error);
alert("Error al eliminar");
}

}



// =======================
//  INICIAR TODO
// =======================

cargarPersonajes();
cargarGaleria();


// =======================
//  LOGOUT
// =======================

window.logout = function(){
    localStorage.removeItem("admin");
    window.location.href = "index.html";
};
