// Clase encargada de controlar la interacción del usuario con el juego
class Controlador {
  constructor(tablero, vista, alMover, puedeJugar) {
    this.tablero = tablero;
    this.vista = vista;

    // Funciones que recibe de Juego para verificar el estado de la partida
    this.alMover = alMover;
    this.puedeJugar = puedeJugar;

    // Almacena la ficha seleccionada y su desplazamiento respecto al mouse
    this.fichaSeleccionada = null;
    this.desplazamientoX = 0;
    this.desplazamientoY = 0;

    // Guarda los movimientos posibles de la ficha seleccionada
    this.movimientosDisponibles = [];

    // Registra los eventos del mouse sobre el Canvas
    this.vista.canvas.addEventListener("mousedown", (evento) => {
      this.seleccionarFicha(evento);
    });

    this.vista.canvas.addEventListener("mousemove", (evento) => {
      this.arrastrarFicha(evento);
    });

    // Detecta cuándo se suelta el mouse, incluso fuera del Canvas
    window.addEventListener("mouseup", (evento) => {
      this.soltarFicha(evento);
    });
  }

  // Convierte las coordenadas de la pantalla a coordenadas internas del Canvas
  obtenerPosicionMouse(evento) {
    // Obtiene la posición y el tamaño del Canvas en la pantalla
    let rect = this.vista.canvas.getBoundingClientRect();

    // Calcula la escala entre el tamaño visible y el tamaño interno del Canvas
    let escalaX = this.vista.canvas.width / rect.width;
    let escalaY = this.vista.canvas.height / rect.height;

    // Devuelve la posición del mouse adaptada a las dimensiones del Canvas
    return {
      x: (evento.clientX - rect.left) * escalaX,
      y: (evento.clientY - rect.top) * escalaY,
    };
  }

  // Selecciona una ficha cuando el usuario hace clic sobre ella
  seleccionarFicha(evento) {
    // No permite seleccionar fichas si la partida terminó
    if (!this.puedeJugar()) {
      return;
    }

    // Cancela las animaciones anteriores para evitar interferencias
    this.vista.cancelarPista();
    this.vista.cancelarDestinos();

    // Obtiene la posición del mouse dentro del Canvas
    let mouse = this.obtenerPosicionMouse(evento);

    // Busca si el mouse está dentro del área de alguna ficha
    this.fichaSeleccionada = this.tablero.fichas.find((ficha) => {
      let posicion = this.vista.obtenerPixeles(ficha.fila, ficha.columna);

      // Calcula la distancia entre el mouse y el centro de la ficha
      let distanciaX = mouse.x - posicion.x;
      let distanciaY = mouse.y - posicion.y;

      // Comprueba si la distancia está dentro del radio de la ficha
      return (
        Math.sqrt(distanciaX * distanciaX + distanciaY * distanciaY) <=
        this.vista.radioFicha
      );
    });

    if (this.fichaSeleccionada) {
      // Obtiene las coordenadas del centro de la ficha seleccionada
      let posicion = this.vista.obtenerPixeles(
        this.fichaSeleccionada.fila,
        this.fichaSeleccionada.columna
      );

      // Guarda la distancia entre el mouse y el centro de la ficha
      // para mantener el punto de agarre durante el arrastre
      this.desplazamientoX = mouse.x - posicion.x;
      this.desplazamientoY = mouse.y - posicion.y;

      // Marca la ficha como levantada visualmente
      this.fichaSeleccionada.levantar();

      // Obtiene los movimientos válidos de la ficha seleccionada
      this.movimientosDisponibles = this.tablero.obtenerMovimientosPosibles(
        this.fichaSeleccionada
      );

      // Muestra los destinos posibles mediante una animación
      this.vista.mostrarDestinos(this.tablero, this.fichaSeleccionada);
    } else {
      // Si no se seleccionó ninguna ficha, limpia los movimientos disponibles
      this.movimientosDisponibles = [];
    }

    // Actualiza el dibujo del tablero
    this.vista.dibujar(this.tablero);
  }

  // Mueve visualmente la ficha mientras el usuario mantiene presionado el mouse
  arrastrarFicha(evento) {
    // Si no hay una ficha seleccionada, no realiza ninguna acción
    if (!this.fichaSeleccionada) {
      return;
    }

    // Detiene la animación de los destinos mientras se arrastra la ficha
    this.vista.cancelarDestinos();

    // Obtiene la posición actual del mouse
    let mouse = this.obtenerPosicionMouse(evento);

    // Redibuja el tablero sin modificar la posición real de las fichas
    this.vista.dibujar(this.tablero);

    // Mantiene visibles los destinos posibles durante el arrastre
    this.vista.dibujarIndicadoresDestinos(this.movimientosDisponibles, 1);

    // Calcula la posición de la ficha teniendo en cuenta el punto de agarre
    let x = mouse.x - this.desplazamientoX;
    let y = mouse.y - this.desplazamientoY;

    // Dibuja la ficha siguiendo el movimiento del mouse
    this.vista.dibujarFicha(this.fichaSeleccionada.tipo, x, y);
  }

  // Intenta realizar el movimiento cuando el usuario suelta la ficha
  soltarFicha(evento) {
    // Si no hay una ficha seleccionada, no realiza ninguna acción
    if (!this.fichaSeleccionada) {
      return;
    }

    // Cancela la animación de los destinos
    this.vista.cancelarDestinos();

    // Comprueba que la partida siga activa
    if (!this.puedeJugar()) {
      this.fichaSeleccionada.soltar();
      this.fichaSeleccionada = null;
      this.movimientosDisponibles = [];

      // Redibuja el tablero sin realizar el movimiento
      this.vista.dibujar(this.tablero);
      return;
    }

    // Obtiene la posición del mouse al soltar la ficha
    let mouse = this.obtenerPosicionMouse(evento);

    // Calcula el centro de la ficha arrastrada
    let centroX = mouse.x - this.desplazamientoX;
    let centroY = mouse.y - this.desplazamientoY;

    // Convierte las coordenadas del Canvas a una fila y una columna del tablero
    let columna = Math.round(
      (centroX - this.vista.inicioX) / this.vista.tamañoCasilla
    );

    let fila = Math.round(
      (centroY - this.vista.inicioY) / this.vista.tamañoCasilla
    );

    // Intenta realizar el movimiento según las reglas del tablero
    let movimientoRealizado = this.tablero.moverFicha(
      this.fichaSeleccionada,
      fila,
      columna
    );

    // Libera la ficha y limpia la selección
    this.fichaSeleccionada.soltar();
    this.fichaSeleccionada = null;
    this.movimientosDisponibles = [];

    // Redibuja el tablero con el resultado del movimiento
    this.vista.dibujar(this.tablero);

    // Avisa a Juego si el movimiento fue válido para verificar el estado de la partida
    if (movimientoRealizado && this.alMover) {
      this.alMover();
    }
  }
}
