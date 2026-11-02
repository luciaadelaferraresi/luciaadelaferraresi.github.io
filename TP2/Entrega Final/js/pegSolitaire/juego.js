import { Tablero } from "./tablero.js";
import { Vista } from "./vista.js";
import { Controlador } from "./controlador.js";

// Clase principal que coordina el funcionamiento del juego
export class Juego {
  constructor() {
    this.canvas = document.getElementById("tablero");

    // Indica si la partida terminó
    this.terminado = false;

    this.tablero = new Tablero();
    this.vista = new Vista(this.canvas);

    // El controlador avisa cuando se realiza un movimiento válido
    this.controlador = new Controlador(
      this.tablero,
      this.vista,
      () => this.verificarEstado(),
      () => !this.terminado
    );

    // Configuración del temporizador
    this.tiempoLimite = 300;
    this.tiempoRestante = this.tiempoLimite;
    this.temporizador = null;

    // Elementos HTML
    this.elementoTemporizador = document.getElementById("temporizador");
    this.elementoFichas = document.getElementById("fichas-restantes");

    // Pantalla final
    this.pantallaFinal = document.getElementById("pantalla-final");
    this.tituloFinal = document.getElementById("titulo-final");
    this.mensajeFinal = document.getElementById("mensaje-final");
    // Permite comenzar una nueva partida desde la pantalla final
    document
      .getElementById("jugar-nuevamente")
      .addEventListener("click", () => {
        this.reiniciar();
      });
  }

  // Carga las imágenes e inicia el juego
  async iniciar() {
    try {
      await this.vista.cargarImagenes();

      this.terminado = false;

      this.vista.dibujar(this.tablero);
      this.actualizarCantidadFichas();

      if (this.pantallaFinal) {
        this.pantallaFinal.hidden = true;
      }

      this.iniciarTemporizador();

      console.log("Juego iniciado correctamente");
    } catch (error) {
      console.error("Error al iniciar el juego:", error);
    }
  }

  // Inicia la cuenta regresiva
  iniciarTemporizador() {
    this.detenerTemporizador();

    this.tiempoRestante = this.tiempoLimite;
    this.actualizarTemporizador();

    this.temporizador = setInterval(() => {
      this.tiempoRestante--;

      this.actualizarTemporizador();

      if (this.tiempoRestante <= 0) {
        this.finalizarJuego("tiempo");
      }
    }, 1000);
  }

  // Actualiza el tiempo mostrado en pantalla
  actualizarTemporizador() {
    let minutos = Math.floor(this.tiempoRestante / 60);
    let segundos = this.tiempoRestante % 60;

    let tiempoFormateado =
      String(minutos).padStart(2, "0") +
      ":" +
      String(segundos).padStart(2, "0");

    this.elementoTemporizador.textContent = tiempoFormateado;
  }

  // Actualiza la cantidad de fichas restantes
  actualizarCantidadFichas() {
    if (this.elementoFichas) {
      this.elementoFichas.textContent = this.tablero.fichas.length;
    }
  }

  // Detiene el temporizador
  detenerTemporizador() {
    if (this.temporizador !== null) {
      clearInterval(this.temporizador);
      this.temporizador = null;
    }
  }

  // Comprueba si el jugador ganó o perdió
  verificarEstado() {
    if (this.terminado) {
      return;
    }

    this.actualizarCantidadFichas();

    // Victoria: queda una sola ficha
    if (this.tablero.fichas.length === 1) {
      this.finalizarJuego("victoria");
      return;
    }

    // Derrota: no quedan movimientos posibles
    if (!this.tablero.hayMovimientosPosibles()) {
      this.finalizarJuego("derrota");
    }
  }

  // Finaliza la partida y muestra el mensaje correspondiente
  finalizarJuego(resultado) {
    if (this.terminado) {
      return;
    }

    this.detenerTemporizador();
    this.terminado = true;

    this.pantallaFinal.hidden = false;

    if (resultado === "victoria") {
      this.tituloFinal.textContent = "¡Ganaste!";
      this.mensajeFinal.textContent =
        "¡Excelente! Lograste completar el desafío.";
    }

    if (resultado === "derrota") {
      this.tituloFinal.textContent = "¡Te quedaste sin movimientos!";
      this.mensajeFinal.textContent =
        "Ya no hay movimientos posibles. ¡Intentá nuevamente!";
    }

    if (resultado === "tiempo") {
      this.tituloFinal.textContent = "¡Se terminó el tiempo!";
      this.mensajeFinal.textContent =
        "El tiempo se agotó antes de completar el desafío.";
    }
  }

  // Reinicia la partida desde el estado inicial
  reiniciar() {
    this.detenerTemporizador();

    this.terminado = false;

    this.tablero.inicializar();

    this.controlador.fichaSeleccionada = null;

    this.pantallaFinal.hidden = true;

    this.vista.dibujar(this.tablero);

    this.actualizarCantidadFichas();

    this.iniciarTemporizador();
  }

  // Sale de la partida y deja el juego preparado para comenzar nuevamente
  salir() {
    this.detenerTemporizador();

    this.terminado = false;

    this.tablero.inicializar();

    this.controlador.fichaSeleccionada = null;

    this.tiempoRestante = this.tiempoLimite;
    this.actualizarTemporizador();

    this.actualizarCantidadFichas();

    this.pantallaFinal.hidden = true;

    this.vista.dibujar(this.tablero);
  }
}
