export class Parallax {
  constructor(escenario) {
    // VELOCIDAD GENERAL DEL PAISAJE
    this.VELOCIDAD_MUNDO = 120;

    // CAPAS DEL PAISAJE
    // Cada capa tiene una velocidad diferente para crear profundidad.
    // Las capas más lejanas se mueven más lento que las cercanas.
    //  // Tenemos 5 capas móviles.
    // El cielo y la luna permanecen estáticos.
    this.capas = [
      {
        el: escenario.querySelector(".nubes"),
        factor: 0.12,
        x: 0,
      },
      {
        el: escenario.querySelector(".montanas"),
        factor: 0.25,
        x: 0,
      },
      {
        el: escenario.querySelector(".castillo"),
        factor: 0.45,
        x: 0,
      },
      {
        el: escenario.querySelector(".bosque"),
        factor: 0.7,
        x: 0,
      },
      {
        el: escenario.querySelector(".arboles"),
        factor: 1,
        x: 0,
      },
    ];
  }

  // REINICIAR PAISAJE

  reiniciar() {
    // Devolver todas las capas a su posición inicial
    for (const capa of this.capas) {
      capa.x = 0;
    }

    this.dibujar();
  }

  // ACTUALIZAR MOVIMIENTO
  // Calcula la nueva posición horizontal de cada capa
  // en cada fotograma del juego.
  actualizar(dt) {
    // Desplazar cada capa según su velocidad y el tiempo transcurrido
    for (const capa of this.capas) {
      capa.x -= this.VELOCIDAD_MUNDO * capa.factor * dt;
    }
  }

  // DIBUJAR PAISAJE

  dibujar() {
    // Aplicar la posición horizontal de cada capa al fondo
    for (const capa of this.capas) {
      capa.el.style.backgroundPositionX = `${capa.x}px`;
    }
  }
}
