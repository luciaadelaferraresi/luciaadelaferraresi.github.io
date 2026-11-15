export class Monedas {
  constructor(contenedor, escenario, velocidad, gestorObstaculos) {
    // ELEMENTOS DEL HTML
    this.contenedor = contenedor;
    this.escenario = escenario;
    this.gestorObstaculos = gestorObstaculos;

    // CONFIGURACIÓN
    this.VELOCIDAD = velocidad;
    this.TAMANO = 45;
    this.ALTO = 45;
    this.VALOR = 10;

    // ESTADO
    this.lista = [];
  }

  // REINICIAR MONEDAS

  reiniciar() {
    for (const moneda of this.lista) {
      moneda.elemento.remove();
    }

    this.lista = [];
  }

  // CREAR MONEDA

  crear(x, y) {
    const elemento = document.createElement("div");
    elemento.className = "dragon-moneda";

    const sprite = document.createElement("div");
    sprite.className = "moneda-sprite";

    elemento.appendChild(sprite);
    this.contenedor.appendChild(elemento);

    this.lista.push({
      elemento,
      x,
      y,
    });
  }

  // ACTUALIZAR MONEDAS

  actualizar(dt) {
    const desplazamiento = this.VELOCIDAD * dt;

    // Mover monedas hacia la izquierda
    for (const moneda of this.lista) {
      moneda.x -= desplazamiento;
    }

    // Eliminar monedas fuera del escenario
    this.lista = this.lista.filter((moneda) => {
      if (moneda.x + this.TAMANO < 0) {
        moneda.elemento.remove();
        return false;
      }

      return true;
    });
  }

  // DIBUJAR MONEDAS

  dibujar() {
    for (const moneda of this.lista) {
      moneda.elemento.style.transform = `translate(${moneda.x}px, ${moneda.y}px)`;
    }
  }
}
