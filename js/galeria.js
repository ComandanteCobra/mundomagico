import { db } from "./firebase.js";

import {
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


async function cargarGaleria(){

const contenedor = document.getElementById("carousel");

const querySnapshot = await getDocs(collection(db,"galeria"));

querySnapshot.forEach((doc)=>{

const data = doc.data();

if(data.tipo === "imagen"){

contenedor.innerHTML += `
<img src="${data.url}" alt="galeria">
`;

}else{

contenedor.innerHTML += `
<video autoplay muted loop playsinline>
    <source src="${data.url}" type="video/mp4">
</video>
`;

}

});

}

cargarGaleria();
