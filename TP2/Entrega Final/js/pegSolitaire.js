// Obtiene los elementos HTML necesarios para controlar la navegación
const botonJugar = document.getElementById("boton-jugar");
const contenidoJuego = document.querySelector(".contenido-juego");
const zonaJuego = document.getElementById("zona-juego");

const botonVolver = document.getElementById("volver");
const botonReiniciar = document.getElementById("reiniciar");
const botonVolverFinal = document.getElementById("volver-final");

// Muestra la pantalla de partida cuando el usuario presiona el botón JUGAR
botonJugar.addEventListener("click", function () {
  // Oculta la presentación y muestra la zona del juego
  contenidoJuego.hidden = true;
  zonaJuego.hidden = false;

  // Agrega una clase al body para aplicar los estilos correspondientes a la partida
  document.body.classList.add("partida-activa");

  // Inicia el juego si la función está disponible
  if (typeof window.iniciarJuego === "function") {
    window.iniciarJuego();
  }
});

// Vuelve a la pantalla de presentación y prepara una nueva partida
function volverPresentacion() {
  // Oculta el juego y vuelve a mostrar la presentación
  zonaJuego.hidden = true;
  contenidoJuego.hidden = false;

  // Quita la clase utilizada durante la partida
  document.body.classList.remove("partida-activa");

  // Sale del juego si la función está disponible
  if (typeof window.salirJuego === "function") {
    window.salirJuego();
  }
}

// Asocia el botón VOLVER de la partida con la función de navegación
botonVolver.addEventListener("click", volverPresentacion);

// Permite volver a la presentación desde la pantalla final
botonVolverFinal.addEventListener("click", volverPresentacion);

// Reinicia la partida sin salir de la pantalla del juego
botonReiniciar.addEventListener("click", function () {
  // Ejecuta la función de reinicio si está disponible
  if (typeof window.reiniciarJuego === "function") {
    window.reiniciarJuego();
  }
});
