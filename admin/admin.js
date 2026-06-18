import { db } from "../js/firebase.js";

import {
collection,
addDoc,
getDocs,
deleteDoc,
doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";




// =======================
//  PERSONAJES
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

if(!imagenFile.type.startsWith("image/")){
    alert("Debe ser una imagen");
    return;
}

/* CLOUDINARY */

const formData = new FormData();

formData.append("file", imagenFile);
formData.append("upload_preset", "personajes");

const respuesta = await fetch(
    "https://api.cloudinary.com/v1_1/ddx8vpntj/image/upload",
    {
        method: "POST",
        body: formData
    }
);

const resultado = await respuesta.json();

if(!resultado.secure_url){
    console.log(resultado);
    throw new Error("Cloudinary no devolvió URL");
}

await addDoc(collection(db,"personajes"),{
    nombre: nombre,
    imagen: resultado.secure_url,
    createdAt: new Date()
});

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
//  GALERÍA
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

if(tipo === "imagen" && !file.type.startsWith("image/")){
    alert("Debe ser una imagen");
    return;
}

if(tipo === "video" && !file.type.startsWith("video/")){
    alert("Debe ser un video");
    return;
}

const formData = new FormData();

formData.append("file", file);
formData.append("upload_preset", "personajes");

/* SI ES VIDEO */
const endpoint =
tipo === "video"
? "https://api.cloudinary.com/v1_1/ddx8vpntj/video/upload"
: "https://api.cloudinary.com/v1_1/ddx8vpntj/image/upload";

const respuesta = await fetch(endpoint,{
    method:"POST",
    body:formData
});

const resultado = await respuesta.json();

if(!resultado.secure_url){
    console.log(resultado);
    throw new Error("Cloudinary no devolvió URL");
}

await addDoc(collection(db,"galeria"),{
    tipo: tipo,
    url: resultado.secure_url,
    createdAt: new Date()
});

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
