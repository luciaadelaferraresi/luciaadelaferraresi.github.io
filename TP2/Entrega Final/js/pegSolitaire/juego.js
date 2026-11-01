import { Tablero } from "./tablero.js";
import { Vista } from "./vista.js";
import { Controlador } from "./controlador.js";

// Clase principal que coordina el funcionamiento del juego
export class Juego {
  // Constructor: obtiene el Canvas y crea los objetos del juego
  constructor() {
    this.canvas = document.getElementById("tablero");

    this.tablero = new Tablero();
    this.vista = new Vista(this.canvas);
    this.controlador = new Controlador(this.tablero, this.vista);

    // Configuración del temporizador
    this.tiempoLimite = 300;
    this.tiempoRestante = this.tiempoLimite;
    this.temporizador = null;

    // Obtiene el elemento HTML donde se muestra el tiempo
    this.elementoTemporizador = document.getElementById("temporizador");
  }

  // Carga las imágenes e inicia el juego
  async iniciar() {
    try {
      await this.vista.cargarImagenes();

      // Dibuja el tablero y las fichas
      this.vista.dibujar(this.tablero);

      // Inicia el temporizador
      this.iniciarTemporizador();

      console.log("Juego iniciado correctamente");
    } catch (error) {
      console.error("Error al iniciar el juego:", error);
    }
  }

  // Inicia la cuenta regresiva del juego
  iniciarTemporizador() {
    // Evita que se ejecuten varios temporizadores al mismo tiempo
    this.detenerTemporizador();

    // Restablece el tiempo inicial
    this.tiempoRestante = this.tiempoLimite;

    this.actualizarTemporizador();

    // Actualiza el tiempo cada segundo
    this.temporizador = setInterval(() => {
      this.tiempoRestante--;

      this.actualizarTemporizador();

      // Comprueba si se terminó el tiempo
      if (this.tiempoRestante <= 0) {
        this.finalizarJuego();
      }
    }, 1000);
  }

  // Actualiza el tiempo mostrado en pantalla
  actualizarTemporizador() {
    let minutos = Math.floor(this.tiempoRestante / 60);
    let segundos = this.tiempoRestante % 60;

    // Agrega un cero delante cuando el número tiene un solo dígito
    let tiempoFormateado =
      String(minutos).padStart(2, "0") +
      ":" +
      String(segundos).padStart(2, "0");

    this.elementoTemporizador.textContent = tiempoFormateado;
  }

  // Detiene el temporizador
  detenerTemporizador() {
    if (this.temporizador !== null) {
      clearInterval(this.temporizador);
      this.temporizador = null;
    }
  }

  // Finaliza el juego cuando se termina el tiempo
  finalizarJuego() {
    this.detenerTemporizador();

    alert("¡Se terminó el tiempo!");

    console.log("Partida finalizada por tiempo");
  }
  // Reinicia la partida desde el estado inicial
  reiniciar() {
    // Detiene el temporizador actual
    this.detenerTemporizador();

    // Recupera la distribución original del tablero
    this.tablero.inicializar();

    // Limpia cualquier ficha que haya quedado seleccionada
    this.controlador.fichaSeleccionada = null;

    // Vuelve a dibujar el tablero con las 32 fichas
    this.vista.dibujar(this.tablero);

    // Reinicia el temporizador
    this.iniciarTemporizador();
  }
}
