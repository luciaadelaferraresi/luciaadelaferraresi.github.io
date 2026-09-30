const botonRegistro = document.querySelector(".boton-registro");
const botonIniciar = document.querySelector(".boton-iniciar");
if (botonRegistro) {
  botonRegistro.addEventListener("click", function (evento) {
    evento.preventDefault();

    const mensaje = document.getElementById("mensaje-exito");

    if (mensaje) {
      mensaje.classList.add("animar");

      setTimeout(() => {
        window.location.href = "index.html";
      }, 2000);
    }
  });
}
if (botonIniciar) {
  botonIniciar.addEventListener("click", function () {
    window.location.href = "iniciarSesion.html";
  });
}
