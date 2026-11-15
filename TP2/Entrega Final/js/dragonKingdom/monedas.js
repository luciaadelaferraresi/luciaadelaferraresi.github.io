export class Monedas {
  constructor(contenedor, escenario, velocidad, gestorObstaculos) {
    // ELEMENTOS DEL HTML
    this.contenedor = contenedor;
    this.escenario = escenario;
    this.gestorObstaculos = gestorObstaculos;

    // CONFIGURACIÓN DE MONEDAS
    this.VELOCIDAD = velocidad;
    this.TAMANO = 45;
    this.ALTO = 45;
    this.VALOR = 10;

    // ESTADO DEL JUEGO
    this.lista = [];
  }

  // REINICIAR MONEDAS

  reiniciar() {
    // Eliminar todas las monedas del escenario
    for (const moneda of this.lista) {
      moneda.elemento.remove();
    }

    // Vaciar la lista de monedas
    this.lista = [];
  }

  // CREAR MONEDA

  crear(x, y) {
    // Crear el elemento HTML de la moneda
    const elemento = document.createElement("div");
    elemento.className = "dragon-moneda";

    // Crear el sprite para su animación
    const sprite = document.createElement("div");
    sprite.className = "moneda-sprite";

    // Agregar la moneda al escenario
    elemento.appendChild(sprite);
    this.contenedor.appendChild(elemento);

    // Guardar la moneda y su posición
    this.lista.push({
      elemento,
      x,
      y,
    });
  }

  // ACTUALIZAR MONEDAS

  actualizar(dt) {
    // Calcular el desplazamiento según el tiempo transcurrido
    const desplazamiento = this.VELOCIDAD * dt;

    // Mover las monedas hacia la izquierda
    for (const moneda of this.lista) {
      moneda.x -= desplazamiento;
    }

    // Eliminar las monedas que salen del escenario
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
    // Aplicar la posición de cada moneda en el escenario
    for (const moneda of this.lista) {
      moneda.elemento.style.transform = `translate(${moneda.x}px, ${moneda.y}px)`;
    }
  }
}
