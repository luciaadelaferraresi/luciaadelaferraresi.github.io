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

    // Crear un objeto Ficha por cada posición ocupada
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
  // Busca si existe una ficha en una posición determinada
  obtenerFicha(fila, columna) {
    return this.fichas.find(
      (ficha) => ficha.fila === fila && ficha.columna === columna
    );
  }
  // Devuelve los movimientos posibles de una ficha
  obtenerMovimientosPosibles(ficha) {
    let movimientos = [];

    // Desplazamientos posibles: arriba, abajo, izquierda y derecha
    let direcciones = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];

    direcciones.forEach((direccion) => {
      let nuevaFila = ficha.fila + direccion[0] * 2;
      let nuevaColumna = ficha.columna + direccion[1] * 2;

      let filaIntermedia = ficha.fila + direccion[0];
      let columnaIntermedia = ficha.columna + direccion[1];

      let fichaIntermedia = this.obtenerFicha(
        filaIntermedia,
        columnaIntermedia
      );

      let destinoValido =
        nuevaFila >= 0 &&
        nuevaFila < this.filas &&
        nuevaColumna >= 0 &&
        nuevaColumna < this.columnas &&
        this.posiciones[nuevaFila][nuevaColumna] !== -1;

      let destinoOcupado = this.obtenerFicha(nuevaFila, nuevaColumna);

      if (fichaIntermedia && destinoValido && !destinoOcupado) {
        movimientos.push({
          fila: nuevaFila,
          columna: nuevaColumna,
          fichaIntermedia: fichaIntermedia,
        });
      }
    });

    return movimientos;
  }
  // Realiza un movimiento y elimina la ficha saltada
  moverFicha(ficha, nuevaFila, nuevaColumna) {
    // Guardar la posición original de la ficha
    let filaAnterior = ficha.fila;
    let columnaAnterior = ficha.columna;

    // Obtener los movimientos válidos
    let movimientos = this.obtenerMovimientosPosibles(ficha);

    // Buscar el movimiento seleccionado
    let movimientoValido = movimientos.find(
      (movimiento) =>
        movimiento.fila === nuevaFila && movimiento.columna === nuevaColumna
    );

    // Si el movimiento no es válido, no modificar el tablero
    if (!movimientoValido) {
      return false;
    }

    // Eliminar la ficha que estaba en el medio
    let fichaIntermedia = movimientoValido.fichaIntermedia;
    let indice = this.fichas.indexOf(fichaIntermedia);

    this.fichas.splice(indice, 1);

    // Actualizar la posición de la ficha seleccionada
    ficha.mover(nuevaFila, nuevaColumna);

    // Actualizar las posiciones del tablero
    this.posiciones[filaAnterior][columnaAnterior] = 0;
    this.posiciones[fichaIntermedia.fila][fichaIntermedia.columna] = 0;
    this.posiciones[nuevaFila][nuevaColumna] = 1;

    return true;
  }
}
