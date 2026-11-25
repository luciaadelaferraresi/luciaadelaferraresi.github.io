export class Monedas {
  constructor(contenedor, escenario, velocidad, gestorObstaculos) {
    // ELEMENTOS DEL HTML
    this.contenedor = contenedor;
    this.escenario = escenario;
    this.gestorObstaculos = gestorObstaculos;

    // CONFIGURACIÓN DE MONEDAS
    // Recibe la misma velocidad que los obstáculos para
    // mantener su posición relativa entre las columnas.
    this.VELOCIDAD = velocidad;
    this.TAMANO = 45;
    this.ALTO = 45;

    // Cantidad de puntos que otorga cada moneda recolectada.
    this.VALOR = 10;

    // ESTADO DEL JUEGO
    // Arreglo que almacena las monedas activas,
    // sus elementos HTML y sus coordenadas x e y.
    this.lista = [];
  }

  // REINICIAR MONEDAS
  // Recupera el estado inicial al comenzar una nueva partida.

  reiniciar() {
    // Eliminar todas las monedas del escenario (DOM).
    for (const moneda of this.lista) {
      moneda.elemento.remove();
    }

    // Vaciar la lista de monedas.
    this.lista = [];
  }

  // CREAR MONEDA
  // Recibe las coordenadas donde debe aparecer la moneda.
  // El controlador es quien decide cuándo y dónde crearla.

  crear(x, y) {
    // Crear dinámicamente el elemento HTML de la moneda.
    // Este div controla su posición dentro del escenario.
    const elemento = document.createElement("div");
    elemento.className = "dragon-moneda";

    // Crear el sprite para su animación.
    // Utilizamos un div interno para separar el movimiento
    // de la moneda de la animación del spritesheet en CSS.
    const sprite = document.createElement("div");
    sprite.className = "moneda-sprite";

    // Incorporar el sprite a la moneda
    // y agregar la moneda al escenario.
    elemento.appendChild(sprite);
    this.contenedor.appendChild(elemento);

    // Guardar la moneda y su posición en el arreglo
    // para poder moverla, detectar colisiones y eliminarla.
    this.lista.push({
      elemento,
      x,
      y,
    });
  }

  // ACTUALIZAR MONEDAS
  // Calcula el movimiento de las monedas en cada fotograma
  // y elimina aquellas que salen completamente del escenario.

  actualizar(dt) {
    const desplazamiento = this.VELOCIDAD * dt;

    // Mover las monedas hacia la izquierda.
    // Se resta el desplazamiento porque el eje X
    // aumenta hacia la derecha.
    // La coordenada Y permanece constante.
    for (const moneda of this.lista) {
      moneda.x -= desplazamiento;
    }

    // Eliminar las monedas que salen del escenario.
    this.lista = this.lista.filter((moneda) => {
      if (moneda.x + this.TAMANO < 0) {
        moneda.elemento.remove();
        return false;
      }

      return true;
    });
  }

  // DIBUJAR MONEDAS
  // Aplica visualmente las coordenadas calculadas
  // anteriormente mediante una transformación CSS.
  // Actualizar calcula la posición y dibujar la representa.

  dibujar() {
    // Aplicar la posición de cada moneda en el escenario.
    for (const moneda of this.lista) {
      moneda.elemento.style.transform = `translate(${moneda.x}px, ${moneda.y}px)`;
    }
  }
}
