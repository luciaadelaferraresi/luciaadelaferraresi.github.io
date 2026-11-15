export class Corazones {
  constructor(contenedor, escenario, velocidad) {
    // ELEMENTOS DEL HTML
    this.contenedor = contenedor;
    this.escenario = escenario;

    // CONFIGURACIÓN
    this.VELOCIDAD = velocidad;
    this.TAMANO = 48;

    // ESTADO
    this.lista = [];
  }

  // REINICIAR CORAZONES

  reiniciar() {
    for (const corazon of this.lista) {
      corazon.elemento.remove();
    }

    this.lista = [];
  }

  // CREAR CORAZÓN

  crear(x, y) {
    const elemento = document.createElement("div");
    elemento.className = "dragon-corazon";

    const sprite = document.createElement("div");
    sprite.className = "corazon-sprite";

    elemento.appendChild(sprite);
    this.contenedor.appendChild(elemento);

    this.lista.push({
      elemento,
      x,
      y,
    });
  }

  // ACTUALIZAR CORAZONES

  actualizar(dt) {
    const desplazamiento = this.VELOCIDAD * dt;

    // Mover corazones hacia la izquierda
    for (const corazon of this.lista) {
      corazon.x -= desplazamiento;
    }

    // Eliminar corazones fuera del escenario
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
    for (const corazon of this.lista) {
      corazon.elemento.style.transform = `translate(${corazon.x}px, ${corazon.y}px)`;
    }
  }
}
