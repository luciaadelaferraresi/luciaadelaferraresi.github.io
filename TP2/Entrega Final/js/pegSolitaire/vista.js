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
  }

  // Carga las imágenes de las fichas y del tablero
  cargarImagenes() {
    let archivos = {
      azul: "img/fichaAzulPegsolitaire.png",
      roja: "img/fichaRojaPegSolitaire.png",
      tablero: "img/tableroPegSolitaire.png",
    };

    // Crea una promesa por cada imagen para saber cuándo terminó de cargar
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

    // Espera a que todas las imágenes estén cargadas
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

    // Agrega una sombra cuando la ficha está siendo levantada
    if (levantada) {
      ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
      ctx.shadowBlur = 20;
      ctx.shadowOffsetY = 10;
    }

    // Dibuja la ficha con forma circular
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.closePath();

    if (imagen && imagen.complete && imagen.naturalWidth > 0) {
      // Recorta la imagen con forma circular
      ctx.clip();

      // Dibuja la imagen dentro del círculo
      ctx.drawImage(imagen, x - r, y - r, r * 2, r * 2);
    } else {
      // Dibuja un color alternativo si la imagen no está disponible
      ctx.fillStyle = tipo === "roja" ? "#e63946" : "#168bff";
      ctx.fill();
    }

    ctx.restore();
  }

  // Dibuja la imagen de fondo del tablero
  dibujarTablero(tablero) {
    let ctx = this.ctx;

    // Calcula el tamaño de la imagen dentro del Canvas
    let tamañoImagen = Math.min(this.canvas.width, this.canvas.height);
    let escala = tamañoImagen / 1024;

    let offsetX = (this.canvas.width - tamañoImagen) / 2;
    let offsetY = (this.canvas.height - tamañoImagen) / 2;

    // Coordenadas del centro del primer agujero
    this.inicioX = offsetX + 150 * escala;
    this.inicioY = offsetY + 150 * escala;

    // Distancia entre los centros de los agujeros
    this.tamañoCasilla = 120.3 * escala;

    // Limpia el Canvas antes de dibujar
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Dibuja la imagen completa del tablero
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

  // Dibuja todas las fichas que permanecen en el tablero
  dibujarFichas(tablero) {
    tablero.fichas.forEach((ficha) => {
      let posicion = this.obtenerPixeles(ficha.fila, ficha.columna);

      this.dibujarFicha(ficha.tipo, posicion.x, posicion.y, ficha.levantada);
    });
  }

  // Dibuja el tablero y todas sus fichas
  dibujar(tablero) {
    this.dibujarTablero(tablero);
    this.dibujarFichas(tablero);
  }
}
