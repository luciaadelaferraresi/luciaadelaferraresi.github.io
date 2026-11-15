export class Dragon {
  constructor(elemento, escenario) {
    // ELEMENTOS DEL HTML
    this.elemento = elemento;
    this.escenario = escenario;

    // CONFIGURACIÓN DEL DRAGÓN
    this.GRAVEDAD = 1600;
    this.IMPULSO = -520;
    this.ANCHO = 100;
    this.ALTO = 134;

    // POSICIÓN Y VELOCIDAD INICIAL
    this.x = 180;
    this.y = 100;
    this.vy = 0;
  }

  // REINICIAR DRAGÓN

  reiniciar() {
    // Recuperar la posición y velocidad iniciales
    this.x = 180;
    this.y = 100;
    this.vy = 0;

    this.dibujar();
  }

  // IMPULSAR DRAGÓN

  impulsar() {
    // Aplicar una velocidad negativa para subir
    this.vy = this.IMPULSO;
  }

  // ACTUALIZAR FÍSICA

  actualizar(dt) {
    // Aplicar gravedad a la velocidad vertical
    this.vy += this.GRAVEDAD * dt;

    // Actualizar la posición vertical del dragón
    this.y += this.vy * dt;

    // OBTENER LÍMITES DEL ESCENARIO

    const altoEscenario = this.escenario.clientHeight;

    // Evitar que el dragón salga por arriba
    if (this.y < 0) {
      this.y = 0;
      this.vy = 0;
    }

    // Evitar que el dragón salga por abajo
    if (this.y + this.ALTO > altoEscenario) {
      this.y = altoEscenario - this.ALTO;
      this.vy = 0;
    }
  }

  // DIBUJAR DRAGÓN

  dibujar() {
    // Inclinar el dragón según su velocidad vertical
    const angulo = Math.max(-25, Math.min(75, this.vy / 22));

    // Aplicar posición y rotación al elemento HTML
    this.elemento.style.transform = `translate(${this.x}px, ${this.y}px) rotate(${angulo}deg)`;
  }
}
