// Obtiene las dos secciones de la página
const botonJugar = document.getElementById("boton-jugar");
const contenidoJuego = document.querySelector(".contenido-juego");
const zonaJuego = document.getElementById("zona-juego");
const botonVolver = document.getElementById("volver");

// Muestra la pantalla de partida al presionar JUGAR
botonJugar.addEventListener("click", function () {
  // Oculta la presentación del juego
  contenidoJuego.hidden = true;

  // Muestra la pantalla de partida
  zonaJuego.hidden = false;

  // Inicia el juego
  if (window.iniciarJuego) {
    window.iniciarJuego();
  }
});

// Vuelve a la pantalla de presentación
botonVolver.addEventListener("click", function () {
  zonaJuego.hidden = true;
  contenidoJuego.hidden = false;
});
const botonReiniciar = document.getElementById("reiniciar");

botonReiniciar.addEventListener("click", function () {
  if (window.reiniciarJuego) {
    window.reiniciarJuego();
  }
});
