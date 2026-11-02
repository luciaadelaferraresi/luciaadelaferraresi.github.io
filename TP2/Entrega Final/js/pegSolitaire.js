// Obtiene los elementos de la página
const botonJugar = document.getElementById("boton-jugar");
const contenidoJuego = document.querySelector(".contenido-juego");
const zonaJuego = document.getElementById("zona-juego");

const botonVolver = document.getElementById("volver");
const botonReiniciar = document.getElementById("reiniciar");
const botonVolverFinal = document.getElementById("volver-final");

// Muestra la pantalla de partida al presionar JUGAR
botonJugar.addEventListener("click", function () {
  contenidoJuego.hidden = true;
  zonaJuego.hidden = false;

  if (window.iniciarJuego) {
    window.iniciarJuego();
  }
});

// Vuelve a la presentación y reinicia la partida
function volverPresentacion() {
  zonaJuego.hidden = true;
  contenidoJuego.hidden = false;

  if (window.salirJuego) {
    window.salirJuego();
  }
}

// Botón Volver de la partida
botonVolver.addEventListener("click", volverPresentacion);

// Botón Volver de la pantalla final
botonVolverFinal.addEventListener("click", volverPresentacion);

// Reinicia la partida sin salir de la pantalla de juego
botonReiniciar.addEventListener("click", function () {
  if (window.reiniciarJuego) {
    window.reiniciarJuego();
  }
});
