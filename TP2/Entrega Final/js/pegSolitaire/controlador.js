// Clase encargada de controlar la interacción del usuario con el juego
export class Controlador {
  // Constructor: recibe el tablero y la vista
  constructor(tablero, vista) {
    this.tablero = tablero;
    this.vista = vista;

    this.fichaSeleccionada = null;
    this.desplazamientoX = 0;
    this.desplazamientoY = 0;

    // Registra los eventos del mouse en el Canvas
    this.vista.canvas.addEventListener("mousedown", (evento) => {
      this.seleccionarFicha(evento);
    });

    this.vista.canvas.addEventListener("mousemove", (evento) => {
      this.arrastrarFicha(evento);
    });

    this.vista.canvas.addEventListener("mouseup", (evento) => {
      this.soltarFicha(evento);
    });

    this.vista.canvas.addEventListener("mouseleave", () => {
      this.cancelarMovimiento();
    });
  }

  // Convierte las coordenadas del mouse en coordenadas del Canvas
  obtenerPosicionMouse(evento) {
    let rect = this.vista.canvas.getBoundingClientRect();

    let escalaX = this.vista.canvas.width / rect.width;
    let escalaY = this.vista.canvas.height / rect.height;

    return {
      x: (evento.clientX - rect.left) * escalaX,
      y: (evento.clientY - rect.top) * escalaY,
    };
  }

  // Busca si el usuario hizo clic sobre alguna ficha
  seleccionarFicha(evento) {
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

      this.desplazamientoX = mouse.x - posicion.x;
      this.desplazamientoY = mouse.y - posicion.y;

      this.fichaSeleccionada.levantar();
    }

    this.vista.dibujar(this.tablero);
  }

  // Mueve visualmente la ficha mientras se arrastra
  arrastrarFicha(evento) {
    if (!this.fichaSeleccionada) {
      return;
    }

    let mouse = this.obtenerPosicionMouse(evento);

    this.vista.dibujar(this.tablero);

    this.vista.dibujarFicha(
      this.fichaSeleccionada.tipo,
      mouse.x - this.desplazamientoX,
      mouse.y - this.desplazamientoY,
      true
    );
  }

  // Intenta soltar la ficha en una nueva posición
  soltarFicha(evento) {
    if (!this.fichaSeleccionada) {
      return;
    }

    let mouse = this.obtenerPosicionMouse(evento);

    let columna = Math.round(
      (mouse.x - this.vista.inicioX) / this.vista.tamañoCasilla
    );

    let fila = Math.round(
      (mouse.y - this.vista.inicioY) / this.vista.tamañoCasilla
    );

    // El tablero comprueba si el movimiento cumple las reglas
    let movimientoRealizado = this.tablero.moverFicha(
      this.fichaSeleccionada,
      fila,
      columna
    );

    this.fichaSeleccionada.soltar();
    this.fichaSeleccionada = null;

    // Actualiza el dibujo después del movimiento
    this.vista.dibujar(this.tablero);

    if (movimientoRealizado) {
      console.log("Movimiento válido");
    } else {
      console.log("Movimiento no válido");
    }
  }

  // Cancela el arrastre si el mouse sale del Canvas
  cancelarMovimiento() {
    if (this.fichaSeleccionada) {
      this.fichaSeleccionada.soltar();
      this.fichaSeleccionada = null;
      this.vista.dibujar(this.tablero);
    }
  }
}
