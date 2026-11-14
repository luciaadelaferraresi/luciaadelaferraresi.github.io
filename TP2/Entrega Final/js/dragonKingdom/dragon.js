export class Dragon {
  constructor(elemento, escenario) {
    // Elementos del HTML
    this.elemento = elemento;
    this.escenario = escenario;

    // Configuración
    this.GRAVEDAD = 1600;
    this.IMPULSO = -520;
    this.ANCHO = 100;
    this.ALTO = 134;

    // Posición y velocidad inicial
    this.x = 180;
    this.y = 100;
    this.vy = 0;
  }

  // REINICIAR DRAGÓN

  reiniciar() {
    this.x = 180;
    this.y = 100;
    this.vy = 0;

    this.dibujar();
  }

  // IMPULSAR DRAGÓN

  impulsar() {
    this.vy = this.IMPULSO;
  }

  // ACTUALIZAR FÍSICA

  actualizar(dt) {
    // Gravedad
    this.vy += this.GRAVEDAD * dt;

    // Movimiento vertical
    this.y += this.vy * dt;

    // Límites del escenario
    const altoEscenario = this.escenario.clientHeight;

    if (this.y < 0) {
      this.y = 0;
      this.vy = 0;
    }

    if (this.y + this.ALTO > altoEscenario) {
      this.y = altoEscenario - this.ALTO;
      this.vy = 0;
    }
  }

  // DIBUJAR DRAGÓN

  dibujar() {
    const angulo = Math.max(-25, Math.min(75, this.vy / 22));

    this.elemento.style.transform = `translate(${this.x}px, ${this.y}px) rotate(${angulo}deg)`;
  }
}
