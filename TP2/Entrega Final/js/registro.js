const botonRegistro = document.querySelector(".boton-registro");
const botonIniciar = document.querySelector(".boton-iniciar");
if (botonRegistro) {
  botonRegistro.addEventListener("click", function () {
    window.location.href = "index.html";
  });
}
if (botonIniciar) {
  botonIniciar.addEventListener("click", function () {
    window.location.href = "iniciarSesion.html";
  });
}
