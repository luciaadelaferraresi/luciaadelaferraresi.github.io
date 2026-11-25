export class Corazones {
  constructor(contenedor, escenario, velocidad) {
    // ELEMENTOS DEL HTML
    this.contenedor = contenedor;
    this.escenario = escenario;

    // CONFIGURACIÓN DE CORAZONES
    // Recibe la misma velocidad que los obstáculos para
    // mantener su posición relativa entre las columnas.
    this.VELOCIDAD = velocidad;
    this.TAMANO = 48;

    // ESTADO DEL JUEGO
    // Arreglo que almacena los corazones activos,
    // sus elementos HTML y sus coordenadas x e y.
    this.lista = [];
  }

  // REINICIAR CORAZONES
  // Recupera el estado inicial al comenzar una nueva partida.

  reiniciar() {
    // Eliminar todos los corazones del escenario (DOM).
    for (const corazon of this.lista) {
      corazon.elemento.remove();
    }

    // Vaciar la lista de corazones.
    // Eliminar un objeto del arreglo no elimina
    // automáticamente su elemento HTML.
    this.lista = [];
  }

  // CREAR CORAZÓN
  // Recibe las coordenadas donde debe aparecer el corazón.
  // El controlador es quien decide cuándo y dónde crearlo.

  crear(x, y) {
    // Crear dinámicamente el elemento HTML del corazón.
    // Este div controla su posición dentro del escenario.
    const elemento = document.createElement("div");
    elemento.className = "dragon-corazon";

    // Crear el sprite para su animación.
    // Utilizamos un div interno para separar el movimiento
    // del corazón de la animación del spritesheet en CSS.
    const sprite = document.createElement("div");
    sprite.className = "corazon-sprite";

    // Incorporar el sprite al corazón
    // y agregar el corazón al escenario.
    elemento.appendChild(sprite);
    this.contenedor.appendChild(elemento);

    // Guardar el corazón y su posición en el arreglo
    // para poder moverlo, detectar colisiones y eliminarlo.
    this.lista.push({
      elemento,
      x,
      y,
    });
  }

  // ACTUALIZAR CORAZONES
  // Calcula el movimiento de los corazones en cada fotograma
  // y elimina aquellos que salen completamente del escenario.

  actualizar(dt) {
    // dt representa el tiempo transcurrido entre fotogramas
    // expresado en segundos.
    // Permite que el movimiento no dependa de los FPS.
    const desplazamiento = this.VELOCIDAD * dt;

    // Mover los corazones hacia la izquierda.
    // Se resta el desplazamiento porque el eje X
    // aumenta hacia la derecha.
    // La coordenada Y permanece constante.
    for (const corazon of this.lista) {
      corazon.x -= desplazamiento;
    }

    // Eliminar los corazones que salen del escenario.
    // filter() genera un nuevo arreglo:
    // true conserva el elemento y false lo descarta.
    this.lista = this.lista.filter((corazon) => {
      // Sumamos el tamaño a la posición X para comprobar
      // que el corazón haya salido completamente.
      if (corazon.x + this.TAMANO < 0) {
        corazon.elemento.remove();
        return false;
      }

      return true;
    });
  }

  // DIBUJAR CORAZONES
  // Aplica visualmente las coordenadas calculadas
  // anteriormente mediante una transformación CSS.
  // Actualizar calcula la posición y dibujar la representa.

  dibujar() {
    // Aplicar la posición de cada corazón en el escenario.
    for (const corazon of this.lista) {
      corazon.elemento.style.transform = `translate(${corazon.x}px, ${corazon.y}px)`;
    }
  }
}
