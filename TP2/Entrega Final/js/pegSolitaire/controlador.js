// Clase encargada de controlar la interacción del usuario con el juego
export class Controlador {
  constructor(tablero, vista, alMover, puedeJugar) {
    this.tablero = tablero;
    this.vista = vista;

    // Funciones que recibe de Juego
    this.alMover = alMover;
    this.puedeJugar = puedeJugar;

    this.fichaSeleccionada = null;
    this.desplazamientoX = 0;
    this.desplazamientoY = 0;

    // Guarda los movimientos posibles de la ficha seleccionada
    this.movimientosDisponibles = [];

    // Registra los eventos del mouse
    this.vista.canvas.addEventListener("mousedown", (evento) => {
      this.seleccionarFicha(evento);
    });

    this.vista.canvas.addEventListener("mousemove", (evento) => {
      this.arrastrarFicha(evento);
    });

    // Permite soltar la ficha incluso fuera del Canvas
    window.addEventListener("mouseup", (evento) => {
      this.soltarFicha(evento);
    });
  }

  // Convierte las coordenadas del mouse a coordenadas del Canvas
  obtenerPosicionMouse(evento) {
    let rect = this.vista.canvas.getBoundingClientRect();

    let escalaX = this.vista.canvas.width / rect.width;
    let escalaY = this.vista.canvas.height / rect.height;

    return {
      x: (evento.clientX - rect.left) * escalaX,
      y: (evento.clientY - rect.top) * escalaY,
    };
  }

  // Selecciona una ficha al hacer clic sobre ella
  seleccionarFicha(evento) {
    // No permite seleccionar fichas si la partida terminó
    if (!this.puedeJugar()) {
      return;
    }

    // Cancela las animaciones anteriores
    this.vista.cancelarPista();
    this.vista.cancelarDestinos();

    let mouse = this.obtenerPosicionMouse(evento);

    this.fichaSeleccionada = this.tablero.fichas.find((ficha) => {
      let posicion = this.vista.obtenerPixeles(ficha.fila, ficha.columna);

      let distanciaX = mouse.x - posicion.x;
      let distanciaY = mouse.y - posicion.y;

      return (
        Math.sqrt(distanciaX * distanciaX + distanciaY * distanciaY) <=
        this.vista.radioFicha
      );
    });

    if (this.fichaSeleccionada) {
      let posicion = this.vista.obtenerPixeles(
        this.fichaSeleccionada.fila,
        this.fichaSeleccionada.columna
      );

      // Guarda dónde agarró el usuario la ficha
      this.desplazamientoX = mouse.x - posicion.x;
      this.desplazamientoY = mouse.y - posicion.y;

      this.fichaSeleccionada.levantar();

      // Obtiene los destinos válidos de la ficha
      this.movimientosDisponibles = this.tablero.obtenerMovimientosPosibles(
        this.fichaSeleccionada
      );

      // Muestra los destinos con una animación
      this.vista.mostrarDestinos(this.tablero, this.fichaSeleccionada);
    } else {
      this.movimientosDisponibles = [];
    }

    this.vista.dibujar(this.tablero);
  }

  // Mueve visualmente la ficha mientras se arrastra
  arrastrarFicha(evento) {
    if (!this.fichaSeleccionada) {
      return;
    }

    // Detiene el pulso animado para evitar interferencias
    this.vista.cancelarDestinos();

    let mouse = this.obtenerPosicionMouse(evento);

    // Dibuja nuevamente el tablero
    this.vista.dibujar(this.tablero);

    // Mantiene visibles los destinos posibles
    this.vista.dibujarIndicadoresDestinos(this.movimientosDisponibles, 1);

    // Calcula la posición de la ficha arrastrada
    let x = mouse.x - this.desplazamientoX;
    let y = mouse.y - this.desplazamientoY;

    // Dibuja la ficha siguiendo al mouse
    this.vista.dibujarFicha(this.fichaSeleccionada.tipo, x, y, true);
  }

  // Intenta realizar el movimiento al soltar la ficha
  soltarFicha(evento) {
    if (!this.fichaSeleccionada) {
      return;
    }

    // Cancela los indicadores de destino
    this.vista.cancelarDestinos();

    // Comprueba que la partida siga activa
    if (!this.puedeJugar()) {
      this.fichaSeleccionada.soltar();
      this.fichaSeleccionada = null;
      this.movimientosDisponibles = [];

      this.vista.dibujar(this.tablero);
      return;
    }

    let mouse = this.obtenerPosicionMouse(evento);

    // Calcula el centro de la ficha arrastrada
    let centroX = mouse.x - this.desplazamientoX;
    let centroY = mouse.y - this.desplazamientoY;

    // Convierte las coordenadas a fila y columna
    let columna = Math.round(
      (centroX - this.vista.inicioX) / this.vista.tamañoCasilla
    );

    let fila = Math.round(
      (centroY - this.vista.inicioY) / this.vista.tamañoCasilla
    );

    // Comprueba si el movimiento cumple las reglas
    let movimientoRealizado = this.tablero.moverFicha(
      this.fichaSeleccionada,
      fila,
      columna
    );

    // Libera la ficha
    this.fichaSeleccionada.soltar();
    this.fichaSeleccionada = null;
    this.movimientosDisponibles = [];

    // Actualiza el tablero
    this.vista.dibujar(this.tablero);

    // Avisa a Juego si se realizó un movimiento válido
    if (movimientoRealizado && this.alMover) {
      this.alMover();
    }
  }
}
