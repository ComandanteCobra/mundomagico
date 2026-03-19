import { db } from "./firebase.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


async function cargarPersonajes(){

  const contenedor = document.querySelector(".personajes-grid");

  const querySnapshot = await getDocs(collection(db,"personajes"));

  querySnapshot.forEach((doc)=>{

    const data = doc.data();

    contenedor.innerHTML += `
      <div class="personaje-card">
        <img src="${data.imagen}" alt="${data.nombre}">
        <h3>${data.nombre}</h3>
        <a class="btn-personaje"
           href="https://wa.me/525951080493?text=Hola%20quiero%20cotizar%20el%20personaje%20${data.nombre}">
           Quiero este personaje
        </a>
      </div>
    `;

  });

}

cargarPersonajes();