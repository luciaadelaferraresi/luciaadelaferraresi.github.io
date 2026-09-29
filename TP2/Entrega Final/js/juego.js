const imagenes = document.querySelectorAll(".imagen-carrusel");

const flechaIzquierda = document.querySelector(".flecha-izquierda");
const flechaDerecha = document.querySelector(".flecha-derecha");

let posiciones = [
  "posicion-izquierda",
  "posicion-centro",
  "posicion-derecha",
  "posicion-oculta-derecha",
];

let animando = false;

function actualizarPosiciones() {
  for (let i = 0; i < imagenes.length; i++) {
    imagenes[i].className = "imagen-carrusel " + posiciones[i];
  }
}

flechaDerecha.addEventListener("click", function () {
  if (animando) {
    return;
  }

  animando = true;

  posiciones.unshift(posiciones.pop());

  actualizarPosiciones();

  setTimeout(function () {
    animando = false;
  }, 800);
});

flechaIzquierda.addEventListener("click", function () {
  if (animando) {
    return;
  }

  animando = true;

  posiciones.push(posiciones.shift());

  actualizarPosiciones();

  setTimeout(function () {
    animando = false;
  }, 800);
});
