// Tablero, Vista y Controlador se cargan antes de este archivo.

// Clase principal que coordina el funcionamiento del juego
class Juego {
  constructor() {
    // Obtiene el elemento Canvas donde se dibuja el tablero
    this.canvas = document.getElementById("tablero");

    // Indica si la partida terminó
    this.terminado = false;

    // Crea el modelo del tablero y su representación visual
    this.tablero = new Tablero();
    this.vista = new Vista(this.canvas);

    // Crea el controlador y le pasa el tablero, la vista y dos funciones:
    // una para verificar el estado del juego y otra para comprobar si la partida sigue activa
    this.controlador = new Controlador(
      this.tablero,
      this.vista,
      () => this.verificarEstado(),
      () => !this.terminado
    );

    // Configuración del temporizador: duración inicial de cinco minutos
    this.tiempoLimite = 300;
    this.tiempoRestante = this.tiempoLimite;
    this.temporizador = null;

    // Obtiene los elementos HTML donde se muestran el tiempo y las fichas restantes
    this.elementoTemporizador = document.getElementById("temporizador");
    this.elementoFichas = document.getElementById("fichas-restantes");

    // Obtiene los elementos de la pantalla que aparece al finalizar la partida
    this.pantallaFinal = document.getElementById("pantalla-final");
    this.tituloFinal = document.getElementById("titulo-final");
    this.mensajeFinal = document.getElementById("mensaje-final");

    // Configuración de la cantidad de pistas disponibles
    this.pistasMaximas = 2;
    this.pistasRestantes = this.pistasMaximas;

    // Obtiene el botón de pistas y actualiza su contenido
    this.botonPista = document.getElementById("pista");
    this.actualizarBotonPista();

    // Permite comenzar una nueva partida desde la pantalla final
    document
      .getElementById("jugar-nuevamente")
      .addEventListener("click", () => {
        this.reiniciar();
      });

    // Conecta el botón de pista con la función que muestra un movimiento posible
    this.botonPista.addEventListener("click", () => {
      this.mostrarPista();
    });
  }

  // Carga las imágenes necesarias y prepara el juego para comenzar
  async iniciar() {
    try {
      // Espera a que todas las imágenes estén cargadas
      await this.vista.cargarImagenes();

      this.terminado = false;

      // Dibuja el tablero y actualiza la cantidad inicial de fichas
      this.vista.dibujar(this.tablero);
      this.actualizarCantidadFichas();

      // Oculta la pantalla final si estaba visible
      if (this.pantallaFinal) {
        this.pantallaFinal.hidden = true;
      }

      // Comienza la cuenta regresiva
      this.iniciarTemporizador();

      console.log("Juego iniciado correctamente");
    } catch (error) {
      // Muestra un mensaje en la consola si ocurre un error al cargar las imágenes
      console.error("Error al iniciar el juego:", error);
    }
  }

  // Inicia la cuenta regresiva del tiempo disponible
  iniciarTemporizador() {
    // Evita que haya más de un temporizador activo
    this.detenerTemporizador();

    // Restablece el tiempo inicial y lo muestra en pantalla
    this.tiempoRestante = this.tiempoLimite;
    this.actualizarTemporizador();

    // Ejecuta esta función cada un segundo
    this.temporizador = setInterval(() => {
      this.tiempoRestante--;

      // Actualiza el tiempo que se muestra en pantalla
      this.actualizarTemporizador();

      // Finaliza la partida cuando el tiempo llega a cero
      if (this.tiempoRestante <= 0) {
        this.finalizarJuego("tiempo");
      }
    }, 1000);
  }

  // Convierte el tiempo restante a minutos y segundos y lo muestra en pantalla
  actualizarTemporizador() {
    let minutos = Math.floor(this.tiempoRestante / 60);
    let segundos = this.tiempoRestante % 60;

    // Completa con un cero a la izquierda cuando el valor tiene un solo dígito
    let tiempoFormateado =
      String(minutos).padStart(2, "0") +
      ":" +
      String(segundos).padStart(2, "0");

    this.elementoTemporizador.textContent = tiempoFormateado;
  }

  // Actualiza la cantidad de fichas que quedan en el tablero
  actualizarCantidadFichas() {
    if (this.elementoFichas) {
      this.elementoFichas.textContent = this.tablero.fichas.length;
    }
  }

  // Detiene el temporizador si está activo
  detenerTemporizador() {
    if (this.temporizador !== null) {
      clearInterval(this.temporizador);
      this.temporizador = null;
    }
  }

  // Comprueba si el jugador ganó o perdió después de un movimiento
  verificarEstado() {
    // Evita seguir comprobando una partida que ya terminó
    if (this.terminado) {
      return;
    }

    // Actualiza la cantidad de fichas restantes
    this.actualizarCantidadFichas();

    // Victoria: queda una sola ficha en el tablero
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
    // No permite utilizar pistas si la partida terminó o no quedan disponibles
    if (this.terminado || this.pistasRestantes <= 0) {
      return;
    }

    // Busca un movimiento válido en el tablero
    let pista = this.tablero.obtenerUnaPista();

    // Si no encuentra movimientos posibles, no muestra ninguna pista
    if (!pista) {
      return;
    }

    // Agrega cinco segundos al tiempo restante
    this.tiempoRestante += 5;
    this.actualizarTemporizador();

    // Descuenta una pista y actualiza el botón
    this.pistasRestantes--;
    this.actualizarBotonPista();

    // Muestra visualmente el movimiento sugerido
    this.vista.mostrarPista(this.tablero, pista.ficha, pista.movimiento);
  }

  // Reinicia la partida y recupera todos los valores iniciales
  reiniciar() {
    // Detiene el temporizador y cualquier animación de pista activa
    this.detenerTemporizador();
    this.vista.cancelarPista();

    this.terminado = false;

    // Vuelve a crear el tablero con su distribución inicial
    this.tablero.inicializar();

    // Quita la selección de ficha del controlador
    this.controlador.fichaSeleccionada = null;

    // Recupera las pistas disponibles
    this.pistasRestantes = this.pistasMaximas;
    this.actualizarBotonPista();

    // Oculta la pantalla final
    this.pantallaFinal.hidden = true;

    // Dibuja el tablero nuevamente y actualiza la cantidad de fichas
    this.vista.dibujar(this.tablero);
    this.actualizarCantidadFichas();

    // Inicia nuevamente el temporizador
    this.iniciarTemporizador();
  }

  // Sale de la partida y deja el juego preparado para comenzar nuevamente
  salir() {
    // Detiene el temporizador y la animación de pista
    this.detenerTemporizador();
    this.vista.cancelarPista();

    this.terminado = false;

    // Restablece el tablero a su distribución inicial
    this.tablero.inicializar();

    // Quita cualquier ficha que haya quedado seleccionada
    this.controlador.fichaSeleccionada = null;

    // Restablece el tiempo disponible
    this.tiempoRestante = this.tiempoLimite;
    this.actualizarTemporizador();

    // Recupera las pistas disponibles
    this.pistasRestantes = this.pistasMaximas;
    this.actualizarBotonPista();

    // Actualiza la cantidad de fichas y oculta la pantalla final
    this.actualizarCantidadFichas();
    this.pantallaFinal.hidden = true;

    // Dibuja el tablero en su estado inicial
    this.vista.dibujar(this.tablero);
  }

  // Actualiza el texto y el estado del botón según las pistas disponibles
  actualizarBotonPista() {
    this.botonPista.textContent = `Pista (+5 s) · ${this.pistasRestantes}`;

    // Deshabilita el botón si no quedan pistas o la partida terminó
    this.botonPista.disabled = this.pistasRestantes <= 0 || this.terminado;
  }

  // Finaliza la partida y muestra el mensaje correspondiente al resultado
  finalizarJuego(resultado) {
    // Evita finalizar una partida más de una vez
    if (this.terminado) return;

    // Detiene el temporizador y cualquier animación activa
    this.detenerTemporizador();
    this.vista.cancelarPista();

    this.terminado = true;

    // Actualiza el botón de pistas porque la partida terminó
    this.actualizarBotonPista();

    // Muestra la pantalla final
    this.pantallaFinal.hidden = false;

    // Configura el mensaje según el resultado de la partida
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
