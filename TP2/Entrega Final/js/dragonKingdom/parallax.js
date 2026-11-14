export class Parallax {
  constructor(escenario) {
    // Velocidad horizontal del mundo
    this.VELOCIDAD_MUNDO = 140;

    // Capas del paisaje
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
    for (const capa of this.capas) {
      capa.x = 0;
    }

    this.dibujar();
  }

  // ACTUALIZAR MOVIMIENTO

  actualizar(dt) {
    for (const capa of this.capas) {
      capa.x -= this.VELOCIDAD_MUNDO * capa.factor * dt;
    }
  }

  // DIBUJAR PAISAJE

  dibujar() {
    for (const capa of this.capas) {
      capa.el.style.backgroundPositionX = `${capa.x}px`;
    }
  }
}
