// Tablero, Vista y Controlador se cargan antes de este archivo.

// Clase principal que coordina el funcionamiento del juego
class Juego {
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
    // Configuración de las pistas
    this.pistasMaximas = 2;
    this.pistasRestantes = this.pistasMaximas;

    this.botonPista = document.getElementById("pista");
    this.actualizarBotonPista();
    // Permite comenzar una nueva partida desde la pantalla final
    document
      .getElementById("jugar-nuevamente")
      .addEventListener("click", () => {
        this.reiniciar();
      });
    // Conecta el botón de pista con la función correspondiente
    this.botonPista.addEventListener("click", () => {
      this.mostrarPista();
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
  // Busca y muestra una pista para ayudar al jugador

  mostrarPista() {
    if (this.terminado || this.pistasRestantes <= 0) {
      return;
    }

    // Busca un movimiento válido
    let pista = this.tablero.obtenerUnaPista();

    if (!pista) {
      return;
    }

    // Agrega cinco segundos al temporizador
    this.tiempoRestante += 5;
    this.actualizarTemporizador();

    // Descuenta una pista disponible
    this.pistasRestantes--;
    this.actualizarBotonPista();

    // Muestra la pista visualmente
    this.vista.mostrarPista(this.tablero, pista.ficha, pista.movimiento);
  }

  // Reinicia la partida desde el estado inicial
  reiniciar() {
    this.detenerTemporizador();
    this.vista.cancelarPista();
    this.terminado = false;

    this.tablero.inicializar();
    this.controlador.fichaSeleccionada = null;

    // Recupera las tres pistas
    this.pistasRestantes = this.pistasMaximas;
    this.actualizarBotonPista();

    this.pantallaFinal.hidden = true;

    this.vista.dibujar(this.tablero);
    this.actualizarCantidadFichas();

    this.iniciarTemporizador();
  }

  // Sale de la partida y deja el juego preparado para comenzar nuevamente
  salir() {
    this.detenerTemporizador();
    this.vista.cancelarPista();
    this.terminado = false;

    // Reinicia el tablero
    this.tablero.inicializar();

    this.controlador.fichaSeleccionada = null;

    // Reinicia el tiempo
    this.tiempoRestante = this.tiempoLimite;
    this.actualizarTemporizador();

    // Recupera las tres pistas
    this.pistasRestantes = this.pistasMaximas;
    this.actualizarBotonPista();

    this.actualizarCantidadFichas();

    this.pantallaFinal.hidden = true;

    this.vista.dibujar(this.tablero);
  }
  // Actualiza el botón según las pistas disponibles
  actualizarBotonPista() {
    this.botonPista.textContent = `Pista (+5 s) · ${this.pistasRestantes}`;

    this.botonPista.disabled = this.pistasRestantes <= 0 || this.terminado;
  }
  // Finaliza la partida según el resultado
  finalizarJuego(resultado) {
    if (this.terminado) return;

    this.detenerTemporizador();
    this.vista.cancelarPista();
    this.terminado = true;

    this.actualizarBotonPista();

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
}
