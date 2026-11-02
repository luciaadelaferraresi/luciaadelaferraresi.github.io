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
    this.animacionPista = null;
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
      // No dibuja la ficha en su posición original mientras se arrastra
      if (!ficha.levantada) {
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
  // Muestra una pista con efectos luminosos y una flecha de dirección
  mostrarPista(tablero, ficha, movimiento) {
    // Cancela una animación anterior
    this.cancelarPista();

    let inicio = performance.now();
    let duracion = 2500;

    // Obtiene las coordenadas de las tres posiciones
    let origen = this.obtenerPixeles(ficha.fila, ficha.columna);

    let intermedia = this.obtenerPixeles(
      movimiento.fichaIntermedia.fila,
      movimiento.fichaIntermedia.columna
    );

    let destino = this.obtenerPixeles(movimiento.fila, movimiento.columna);

    let animar = (tiempoActual) => {
      let transcurrido = tiempoActual - inicio;

      if (transcurrido >= duracion) {
        this.animacionPista = null;
        this.dibujar(tablero);
        return;
      }

      // Intensidad del efecto luminoso
      let intensidad = 0.5 + 0.5 * Math.sin(transcurrido / 180);

      // Dibuja nuevamente el tablero
      this.dibujar(tablero);

      let ctx = this.ctx;

      ctx.save();

      // Resalta la ficha que se debe mover
      ctx.beginPath();
      ctx.arc(origen.x, origen.y, this.radioFicha + 6, 0, Math.PI * 2);

      ctx.strokeStyle = "#9ee3ff";
      ctx.lineWidth = 4;
      ctx.shadowColor = "#9ee3ff";
      ctx.shadowBlur = 12 + intensidad * 12;
      ctx.globalAlpha = intensidad;
      ctx.stroke();

      // Resalta suavemente la ficha que se debe saltar
      ctx.beginPath();
      ctx.arc(intermedia.x, intermedia.y, this.radioFicha + 5, 0, Math.PI * 2);

      ctx.strokeStyle = "#ffc477";
      ctx.lineWidth = 3;
      ctx.shadowColor = "#ffc477";
      ctx.shadowBlur = 10;
      ctx.stroke();

      // Resalta el destino
      ctx.beginPath();
      ctx.arc(destino.x, destino.y, this.radioFicha + 9, 0, Math.PI * 2);

      ctx.strokeStyle = "#9ee3ff";
      ctx.lineWidth = 4;
      ctx.shadowColor = "#9ee3ff";
      ctx.shadowBlur = 18;
      ctx.stroke();

      // Dibuja una flecha desde el origen hasta el destino
      let diferenciaX = destino.x - origen.x;
      let diferenciaY = destino.y - origen.y;

      let distancia = Math.sqrt(
        diferenciaX * diferenciaX + diferenciaY * diferenciaY
      );

      let direccionX = diferenciaX / distancia;
      let direccionY = diferenciaY / distancia;

      let inicioFlecha = {
        x: origen.x + direccionX * (this.radioFicha + 10),
        y: origen.y + direccionY * (this.radioFicha + 10),
      };

      let finalFlecha = {
        x: destino.x - direccionX * (this.radioFicha + 17),
        y: destino.y - direccionY * (this.radioFicha + 17),
      };

      ctx.beginPath();
      ctx.moveTo(inicioFlecha.x, inicioFlecha.y);
      ctx.lineTo(finalFlecha.x, finalFlecha.y);

      ctx.strokeStyle = "#9ee3ff";
      ctx.lineWidth = 5;
      ctx.lineCap = "round";
      ctx.shadowColor = "#9ee3ff";
      ctx.shadowBlur = 16;
      ctx.globalAlpha = intensidad;
      ctx.stroke();

      // Punta de la flecha
      ctx.beginPath();
      ctx.moveTo(finalFlecha.x, finalFlecha.y);

      ctx.lineTo(
        finalFlecha.x - direccionX * 12 - direccionY * 9,
        finalFlecha.y - direccionY * 12 + direccionX * 9
      );

      ctx.lineTo(
        finalFlecha.x - direccionX * 12 + direccionY * 9,
        finalFlecha.y - direccionY * 12 - direccionX * 9
      );

      ctx.closePath();
      ctx.fillStyle = "#9ee3ff";
      ctx.fill();

      ctx.restore();

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
