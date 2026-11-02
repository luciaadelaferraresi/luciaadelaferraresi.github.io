// Clase encargada de representar visualmente el juego
export class Vista {
  // Constructor: recibe el Canvas donde se dibujará el juego
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    this.radioFicha = 25;
    this.imagenes = {};

    this.inicioX = 0;
    this.inicioY = 0;
    this.tamañoCasilla = 0;

    // Guarda la animación de la pista
    this.animacionPista = null;
  }

  // Carga las imágenes de las fichas y del tablero
  cargarImagenes() {
    let archivos = {
      azul: "img/fichaAzulPegsolitaire.png",
      roja: "img/fichaRojaPegSolitaire.png",
      tablero: "img/tableroPegSolitaire.png",
    };

    let cargas = Object.entries(archivos).map(([nombre, ruta]) => {
      return new Promise((resolve, reject) => {
        let imagen = new Image();

        imagen.onload = () => {
          this.imagenes[nombre] = imagen;
          resolve();
        };

        imagen.onerror = () => {
          reject(new Error("No se pudo cargar la imagen: " + ruta));
        };

        imagen.src = ruta;
      });
    });

    return Promise.all(cargas);
  }

  // Calcula el centro de cada agujero en el Canvas
  obtenerPixeles(fila, columna) {
    let x = this.inicioX + columna * this.tamañoCasilla;
    let y = this.inicioY + fila * this.tamañoCasilla;

    return { x, y };
  }

  // Dibuja una ficha utilizando su imagen
  dibujarFicha(tipo, x, y, levantada = false) {
    let r = this.radioFicha;
    let ctx = this.ctx;
    let imagen = this.imagenes[tipo];

    ctx.save();

    if (levantada) {
      ctx.shadowColor = "rgba(158, 227, 255, 0.7)";
      ctx.shadowBlur = 15;
      ctx.shadowOffsetY = 5;
    }

    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.closePath();

    if (imagen && imagen.complete && imagen.naturalWidth > 0) {
      ctx.clip();
      ctx.drawImage(imagen, x - r, y - r, r * 2, r * 2);
    } else {
      ctx.fillStyle = tipo === "roja" ? "#e63946" : "#168bff";
      ctx.fill();
    }

    ctx.restore();
  }

  // Dibuja la imagen de fondo del tablero
  dibujarTablero(tablero) {
    let ctx = this.ctx;

    let tamañoImagen = Math.min(this.canvas.width, this.canvas.height);
    let escala = tamañoImagen / 1024;

    let offsetX = (this.canvas.width - tamañoImagen) / 2;
    let offsetY = (this.canvas.height - tamañoImagen) / 2;

    this.inicioX = offsetX + 150 * escala;
    this.inicioY = offsetY + 150 * escala;

    this.tamañoCasilla = 120.3 * escala;

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    let imagenTablero = this.imagenes.tablero;

    if (imagenTablero && imagenTablero.complete) {
      ctx.drawImage(
        imagenTablero,
        offsetX,
        offsetY,
        tamañoImagen,
        tamañoImagen
      );
    }
  }

  // Dibuja todas las fichas, excepto la que se está animando
  dibujarFichas(tablero, fichaOculta = null) {
    tablero.fichas.forEach((ficha) => {
      if (!ficha.levantada && ficha !== fichaOculta) {
        let posicion = this.obtenerPixeles(ficha.fila, ficha.columna);

        this.dibujarFicha(ficha.tipo, posicion.x, posicion.y);
      }
    });
  }

  // Dibuja el tablero y todas sus fichas
  dibujar(tablero) {
    this.dibujarTablero(tablero);
    this.dibujarFichas(tablero);
  }

  // Muestra una pista mediante una animación del movimiento
  mostrarPista(tablero, ficha, movimiento) {
    // Cancela una animación anterior
    this.cancelarPista();

    let inicio = performance.now();
    let duracion = 1800;

    // Posición inicial de la ficha
    let origen = this.obtenerPixeles(ficha.fila, ficha.columna);

    // Posición de la ficha que debe saltarse
    let intermedia = this.obtenerPixeles(
      movimiento.fichaIntermedia.fila,
      movimiento.fichaIntermedia.columna
    );

    // Posición de destino
    let destino = this.obtenerPixeles(movimiento.fila, movimiento.columna);

    // Suaviza el desplazamiento
    let suavizar = (valor) => {
      return valor * valor * (3 - 2 * valor);
    };

    let animar = (tiempoActual) => {
      let transcurrido = tiempoActual - inicio;

      // Cuando termina la animación, vuelve a dibujar el tablero
      if (transcurrido >= duracion) {
        this.animacionPista = null;
        this.dibujar(tablero);
        return;
      }

      let progreso = transcurrido / duracion;

      // La ficha avanza y después vuelve
      let avance;

      if (progreso < 0.5) {
        avance = suavizar(progreso * 2);
      } else {
        avance = suavizar((1 - progreso) * 2);
      }

      // Calcula la posición actual de la ficha
      let x = origen.x + (destino.x - origen.x) * avance;
      let y = origen.y + (destino.y - origen.y) * avance;

      // Intensidad suave del brillo
      let intensidad = 0.5 + 0.5 * Math.sin(transcurrido / 180);

      // Dibuja el tablero sin la ficha animada
      this.dibujarTablero(tablero);
      this.dibujarFichas(tablero, ficha);

      let ctx = this.ctx;

      // Ilumina suavemente la casilla de destino
      ctx.save();

      ctx.globalAlpha = 0.12 + intensidad * 0.12;
      ctx.fillStyle = "#9ee3ff";
      ctx.shadowColor = "#9ee3ff";
      ctx.shadowBlur = 18;

      ctx.beginPath();
      ctx.arc(destino.x, destino.y, this.radioFicha + 10, 0, Math.PI * 2);

      ctx.fill();
      ctx.restore();

      // Destello discreto en la ficha que debe saltarse
      ctx.save();

      ctx.globalAlpha = 0.2 + intensidad * 0.25;
      ctx.strokeStyle = "#ffc477";
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.arc(intermedia.x, intermedia.y, this.radioFicha + 4, 0, Math.PI * 2);

      ctx.stroke();
      ctx.restore();

      // Dibuja la ficha desplazándose
      this.dibujarFicha(ficha.tipo, x, y, true);

      this.animacionPista = requestAnimationFrame(animar);
    };

    this.animacionPista = requestAnimationFrame(animar);
  }

  // Cancela la animación de la pista
  cancelarPista() {
    if (this.animacionPista !== null) {
      cancelAnimationFrame(this.animacionPista);
      this.animacionPista = null;
    }
  }
}
