import { Juego } from "./juego.js";

// Crea el juego cuando el documento está cargado
document.addEventListener("DOMContentLoaded", () => {
  const juego = new Juego();

  // Permite iniciar el juego desde el botón JUGAR
  window.iniciarJuego = () => {
    juego.iniciar();
  };

  // Permite detener el juego desde la navegación
  window.detenerJuego = () => {
    juego.detenerTemporizador();
  };
  // Permite reiniciar el juego desde el botón
  window.reiniciarJuego = () => {
    juego.reiniciar();
  };
});
