const imagenes = [
  "img/pegsolitaire1.png",

  "img/pegsolitaire2.png",

  "img/pegsolitaire3.png",

  "img/peg1.png",
];

let imagenActual = 0;

const imagenCarrusel = document.querySelector(".imagen-carrusel img");

const flechaIzquierda = document.querySelector(".flecha-izquierda");

const flechaDerecha = document.querySelector(".flecha-derecha");
flechaDerecha.addEventListener("click", function () {
  imagenActual++;

  if (imagenActual === imagenes.length) {
    imagenActual = 0;
  }

  imagenCarrusel.classList.add("ocultando");

  setTimeout(function () {
    imagenCarrusel.src = imagenes[imagenActual];
    imagenCarrusel.classList.remove("ocultando");
  }, 400);
});
flechaIzquierda.addEventListener("click", function () {
  imagenActual--;

  if (imagenActual < 0) {
    imagenActual = imagenes.length - 1;
  }

  imagenCarrusel.classList.add("ocultando");

  setTimeout(function () {
    imagenCarrusel.src = imagenes[imagenActual];
    imagenCarrusel.classList.remove("ocultando");
  }, 400);
});
