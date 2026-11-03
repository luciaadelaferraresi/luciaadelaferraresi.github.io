// Clase que representa una ficha del juego

class Ficha {
  // Constructor: inicializa las propiedades de la ficha

  constructor(fila, columna, tipo) {
    this.fila = fila;
    this.columna = columna;
    this.tipo = tipo;
    this.levantada = false;
  }

  // Indica que la ficha está siendo levantada
  levantar() {
    this.levantada = true;
  }
  // Indica que la ficha fue soltada
  soltar() {
    this.levantada = false;
  }
  // Actualiza la posición de la ficha
  mover(nuevaFila, nuevaColumna) {
    this.fila = nuevaFila;

    this.columna = nuevaColumna;
  }
}
