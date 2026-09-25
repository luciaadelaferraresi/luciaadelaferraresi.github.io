const botonIniciar = document.querySelector(".boton-registro");
const botonRegistro = document.querySelector(".boton-registro-cuenta");

if (botonIniciar) {
  botonIniciar.addEventListener("click", function () {
    window.location.href = "index.html";
  });
}

if (botonRegistro) {
  botonRegistro.addEventListener("click", function () {
    window.location.href = "registro.html";
  });
}
