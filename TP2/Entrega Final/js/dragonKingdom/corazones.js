export class Corazones {
  constructor(contenedor, escenario, velocidad) {
    // ELEMENTOS DEL HTML
    this.contenedor = contenedor;
    this.escenario = escenario;

    // CONFIGURACIÓN DE CORAZONES
    this.VELOCIDAD = velocidad;
    this.TAMANO = 48;

    // ESTADO DEL JUEGO
    this.lista = [];
  }

  // REINICIAR CORAZONES

  reiniciar() {
    // Eliminar todos los corazones del escenario
    for (const corazon of this.lista) {
      corazon.elemento.remove();
    }

    // Vaciar la lista de corazones
    this.lista = [];
  }

  // CREAR CORAZÓN

  crear(x, y) {
    // Crear el elemento HTML del corazón
    const elemento = document.createElement("div");
    elemento.className = "dragon-corazon";

    // Crear el sprite para su animación
    const sprite = document.createElement("div");
    sprite.className = "corazon-sprite";

    // Agregar el corazón al escenario
    elemento.appendChild(sprite);
    this.contenedor.appendChild(elemento);

    // Guardar el corazón y su posición
    this.lista.push({
      elemento,
      x,
      y,
    });
  }

  // ACTUALIZAR CORAZONES

  actualizar(dt) {
    // Calcular el desplazamiento según el tiempo transcurrido
    const desplazamiento = this.VELOCIDAD * dt;

    // Mover los corazones hacia la izquierda
    for (const corazon of this.lista) {
      corazon.x -= desplazamiento;
    }

    // Eliminar los corazones que salen del escenario
    this.lista = this.lista.filter((corazon) => {
      if (corazon.x + this.TAMANO < 0) {
        corazon.elemento.remove();
        return false;
      }

      return true;
    });
  }

  // DIBUJAR CORAZONES

  dibujar() {
    // Aplicar la posición de cada corazón en el escenario
    for (const corazon of this.lista) {
      corazon.elemento.style.transform = `translate(${corazon.x}px, ${corazon.y}px)`;
    }
  }
}
