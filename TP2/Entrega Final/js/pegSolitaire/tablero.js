import { Ficha } from "./ficha.js";

// Clase que representa el tablero y controla sus posiciones
export class Tablero {
  constructor() {
    this.filas = 7;
    this.columnas = 7;
    this.posiciones = [];
    this.fichas = [];

    this.inicializar();
  }

  // Inicializa las posiciones del tablero
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

    this.fichas = [];

    for (let fila = 0; fila < this.filas; fila++) {
      for (let columna = 0; columna < this.columnas; columna++) {
        if (this.posiciones[fila][columna] === 1) {
          let tipo = this.fichas.length % 2 === 0 ? "azul" : "roja";

          let ficha = new Ficha(fila, columna, tipo);

          this.fichas.push(ficha);
        }
      }
    }
  }

  // Comprueba si una posición pertenece al tablero
  esPosicionValida(fila, columna) {
    return (
      fila >= 0 &&
      fila < this.filas &&
      columna >= 0 &&
      columna < this.columnas &&
      this.posiciones[fila][columna] !== -1
    );
  }

  // Busca una ficha en una posición determinada
  obtenerFicha(fila, columna) {
    return this.fichas.find(
      (ficha) => ficha.fila === fila && ficha.columna === columna
    );
  }

  // Devuelve los movimientos posibles de una ficha
  obtenerMovimientosPosibles(ficha) {
    let movimientos = [];

    let direcciones = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];

    direcciones.forEach((direccion) => {
      let filaIntermedia = ficha.fila + direccion[0];
      let columnaIntermedia = ficha.columna + direccion[1];

      let nuevaFila = ficha.fila + direccion[0] * 2;
      let nuevaColumna = ficha.columna + direccion[1] * 2;

      // Comprobar que ambas posiciones sean válidas
      if (
        this.esPosicionValida(filaIntermedia, columnaIntermedia) &&
        this.esPosicionValida(nuevaFila, nuevaColumna)
      ) {
        let fichaIntermedia = this.obtenerFicha(
          filaIntermedia,
          columnaIntermedia
        );

        // La posición intermedia debe estar ocupada
        // y el destino debe estar vacío
        if (fichaIntermedia && this.posiciones[nuevaFila][nuevaColumna] === 0) {
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
  // Busca un movimiento válido para mostrar como pista
  obtenerUnaPista() {
    for (let ficha of this.fichas) {
      let movimientos = this.obtenerMovimientosPosibles(ficha);

      if (movimientos.length > 0) {
        return {
          ficha: ficha,
          movimiento: movimientos[0],
        };
      }
    }

    return null;
  }
  // Realiza un movimiento y elimina la ficha saltada
  moverFicha(ficha, nuevaFila, nuevaColumna) {
    if (!this.fichas.includes(ficha)) {
      return false;
    }

    let movimientos = this.obtenerMovimientosPosibles(ficha);

    let movimientoValido = movimientos.find(
      (movimiento) =>
        movimiento.fila === nuevaFila && movimiento.columna === nuevaColumna
    );

    if (!movimientoValido) {
      return false;
    }

    let filaAnterior = ficha.fila;
    let columnaAnterior = ficha.columna;

    let fichaIntermedia = movimientoValido.fichaIntermedia;

    // Eliminar solamente la ficha saltada
    let indice = this.fichas.indexOf(fichaIntermedia);
    this.fichas.splice(indice, 1);

    // Actualizar las posiciones de la matriz
    this.posiciones[filaAnterior][columnaAnterior] = 0;

    this.posiciones[fichaIntermedia.fila][fichaIntermedia.columna] = 0;

    this.posiciones[nuevaFila][nuevaColumna] = 1;

    // Mover la ficha seleccionada
    ficha.mover(nuevaFila, nuevaColumna);

    return true;
  }

  // Comprueba si queda algún movimiento posible
  hayMovimientosPosibles() {
    return this.fichas.some(
      (ficha) => this.obtenerMovimientosPosibles(ficha).length > 0
    );
  }
}
