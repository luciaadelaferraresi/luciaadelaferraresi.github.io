export class Dragon {
  constructor(elemento, escenario) {
    // ELEMENTOS DEL HTML
    this.elemento = elemento;
    this.escenario = escenario;

    // CONFIGURACIÓN DEL DRAGÓN
    //Aceleración hacia abajo
    this.GRAVEDAD = 1600;
    //Velocidad vertical aplicada al saltar
    this.IMPULSO = -520;

    //Ancho del dragón
    this.ANCHO = 100;
    //Alto del dragón
    this.ALTO = 134;

    // POSICIÓN Y VELOCIDAD INICIAL
    this.x = 180;
    this.y = 100;
    this.vy = 0;
  }

  // REINICIAR DRAGÓN
  //Se encarga de recuperar el estado inicial del dragón cuando se prepara una nueva partida.
  reiniciar() {
    // Recuperar la posición y velocidad iniciales
    this.x = 180;
    this.y = 100;
    this.vy = 0;

    // Reiniciar las animaciones
    this.elemento.classList.remove("dragon-impulso", "dragon-planeo");

    this.dibujar();
  }

  // IMPULSAR DRAGÓN
  //Se ejecuta cuando el controlador procesa una pulsación de la tecla ESPACIO.
  impulsar() {
    // Aplicar una velocidad negativa para subir
    this.vy = this.IMPULSO;

    // Activar la animación de aleteo
    this.elemento.classList.remove("dragon-planeo");
    this.elemento.classList.add("dragon-impulso");
  }

  // ACTUALIZAR FÍSICA

  actualizar(dt) {
    this.vy += this.GRAVEDAD * dt;
    this.y += this.vy * dt;

    const altoEscenario = this.escenario.clientHeight;
    let tocaLimite = false;

    // Colisión con el cielo
    if (this.y <= 0) {
      this.y = 0;
      this.vy = 0;
      tocaLimite = true;
    }

    // Colisión con el piso
    if (this.y + this.ALTO >= altoEscenario) {
      this.y = altoEscenario - this.ALTO;
      this.vy = 0;
      tocaLimite = true;
    }

    if (this.vy >= 0) {
      this.elemento.classList.remove("dragon-impulso");
      this.elemento.classList.add("dragon-planeo");
    }

    return tocaLimite;
  }

  // DIBUJAR DRAGÓN
  //Se encarga de representar visualmente la posición y la inclinación del dragón.
  dibujar() {
    // Inclinar el dragón según su velocidad vertical
    const angulo = Math.max(-25, Math.min(75, this.vy / 22));

    // Aplicar posición y rotación al elemento HTML
    this.elemento.style.transform = `translate(${this.x}px, ${this.y}px) rotate(${angulo}deg)`;
  }
}
