// Ficha se carga desde ficha.js antes que este archivo.

// Clase que representa el tablero y controla las posiciones de las fichas
class Tablero {
  constructor() {
    // Cantidad de filas y columnas del tablero
    this.filas = 7;
    this.columnas = 7;

    // Matriz que representa las posiciones del tablero
    this.posiciones = [];

    // Arreglo que almacena las fichas que están en el tablero
    this.fichas = [];

    // Prepara el tablero con su distribución inicial
    this.inicializar();
  }

  // Inicializa la matriz y crea las fichas en sus posiciones iniciales
  inicializar() {
    // -1 = posición inexistente
    //  0 = posición válida vacía
    //  1 = posición válida ocupada

    this.posiciones = [
      [-1, -1, 1, 1, 1, -1, -1],
      [-1, -1, 1, 1, 1, -1, -1],
      [1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 0, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1],
      [-1, -1, 1, 1, 1, -1, -1],
      [-1, -1, 1, 1, 1, -1, -1],
    ];

    // Vacía el arreglo antes de volver a crear las fichas
    this.fichas = [];

    // Recorre todas las filas y columnas de la matriz
    for (let fila = 0; fila < this.filas; fila++) {
      for (let columna = 0; columna < this.columnas; columna++) {
        // Si la posición está ocupada, crea una ficha
        if (this.posiciones[fila][columna] === 1) {
          // Alterna entre fichas azules y rojas
          let tipo = this.fichas.length % 2 === 0 ? "azul" : "roja";

          // Crea la ficha indicando su fila, columna y tipo
          let ficha = new Ficha(fila, columna, tipo);

          // Agrega la ficha al arreglo
          this.fichas.push(ficha);
        }
      }
    }
  }

  // Comprueba si una fila y columna corresponden a una posición existente del tablero
  esPosicionValida(fila, columna) {
    return (
      fila >= 0 &&
      fila < this.filas &&
      columna >= 0 &&
      columna < this.columnas &&
      this.posiciones[fila][columna] !== -1
    );
  }

  // Busca y devuelve la ficha ubicada en una fila y columna determinadas
  obtenerFicha(fila, columna) {
    return this.fichas.find(
      (ficha) => ficha.fila === fila && ficha.columna === columna
    );
  }

  // Calcula y devuelve los movimientos válidos que puede realizar una ficha
  obtenerMovimientosPosibles(ficha) {
    let movimientos = [];

    // Define las cuatro direcciones en las que se puede mover una ficha
    let direcciones = [
      [-1, 0], // Arriba
      [1, 0], // Abajo
      [0, -1], // Izquierda
      [0, 1], // Derecha
    ];

    // Comprueba cada una de las direcciones
    direcciones.forEach((direccion) => {
      // Calcula la posición que se encuentra una casilla en esa dirección
      let filaIntermedia = ficha.fila + direccion[0];
      let columnaIntermedia = ficha.columna + direccion[1];

      // Calcula la posición que se encuentra dos casillas en esa dirección
      let nuevaFila = ficha.fila + direccion[0] * 2;
      let nuevaColumna = ficha.columna + direccion[1] * 2;

      // Comprueba que la posición intermedia y el destino existan en el tablero
      if (
        this.esPosicionValida(filaIntermedia, columnaIntermedia) &&
        this.esPosicionValida(nuevaFila, nuevaColumna)
      ) {
        // Busca si hay una ficha en la posición intermedia
        let fichaIntermedia = this.obtenerFicha(
          filaIntermedia,
          columnaIntermedia
        );

        // El movimiento es válido si hay una ficha intermedia y el destino está vacío
        if (fichaIntermedia && this.posiciones[nuevaFila][nuevaColumna] === 0) {
          // Guarda los datos del movimiento posible
          movimientos.push({
            fila: nuevaFila,
            columna: nuevaColumna,
            fichaIntermedia: fichaIntermedia,
          });
        }
      }
    });

    return movimientos;
  }

  // Busca el primer movimiento válido disponible para mostrar como pista
  obtenerUnaPista() {
    // Recorre todas las fichas del tablero
    for (let ficha of this.fichas) {
      // Obtiene los movimientos posibles de la ficha actual
      let movimientos = this.obtenerMovimientosPosibles(ficha);

      // Si tiene al menos un movimiento posible, devuelve el primero
      if (movimientos.length > 0) {
        return {
          ficha: ficha,
          movimiento: movimientos[0],
        };
      }
    }

    // Si ninguna ficha puede moverse, no hay pistas disponibles
    return null;
  }

  // Realiza un movimiento válido y elimina la ficha que fue saltada
  moverFicha(ficha, nuevaFila, nuevaColumna) {
    // Comprueba que la ficha pertenezca al tablero
    if (!this.fichas.includes(ficha)) {
      return false;
    }

    // Obtiene los movimientos válidos de la ficha seleccionada
    let movimientos = this.obtenerMovimientosPosibles(ficha);

    // Busca si el destino elegido está entre esos movimientos
    let movimientoValido = movimientos.find(
      (movimiento) =>
        movimiento.fila === nuevaFila && movimiento.columna === nuevaColumna
    );

    // Si el destino no es válido, no realiza el movimiento
    if (!movimientoValido) {
      return false;
    }

    // Guarda la posición original de la ficha
    let filaAnterior = ficha.fila;
    let columnaAnterior = ficha.columna;

    // Obtiene la ficha que se encuentra entre el origen y el destino
    let fichaIntermedia = movimientoValido.fichaIntermedia;

    // Busca el índice de la ficha que debe eliminarse
    let indice = this.fichas.indexOf(fichaIntermedia);

    // Elimina esa ficha del arreglo
    this.fichas.splice(indice, 1);

    // Actualiza la matriz: libera la posición de origen
    this.posiciones[filaAnterior][columnaAnterior] = 0;

    // Libera la posición de la ficha que fue saltada
    this.posiciones[fichaIntermedia.fila][fichaIntermedia.columna] = 0;

    // Marca el destino como ocupado
    this.posiciones[nuevaFila][nuevaColumna] = 1;

    // Actualiza las coordenadas de la ficha que se movió
    ficha.mover(nuevaFila, nuevaColumna);

    return true;
  }

  // Comprueba si alguna ficha todavía puede realizar un movimiento válido
  hayMovimientosPosibles() {
    return this.fichas.some(
      (ficha) => this.obtenerMovimientosPosibles(ficha).length > 0
    );
  }
}
