// Clase encargada de representar visualmente el juego
class Vista {
  // Constructor: recibe el Canvas donde se dibujará el juego
  constructor(canvas) {
    this.canvas = canvas;

    // Obtiene el contexto 2D para dibujar en el Canvas
    this.ctx = canvas.getContext("2d");

    // Define el radio de las fichas
    this.radioFicha = 25;

    // Almacena las imágenes del tablero y de las fichas
    this.imagenes = {};

    // Coordenadas iniciales y distancia entre las casillas del tablero
    this.inicioX = 0;
    this.inicioY = 0;
    this.tamañoCasilla = 0;

    // Guarda los identificadores de las animaciones activas
    this.animacionPista = null;
    this.animacionDestinos = null;
  }

  // Carga las imágenes de las fichas y del tablero
  cargarImagenes() {
    // Asocia cada nombre con la ruta de su imagen
    let archivos = {
      azul: "img/fichaAzulPegsolitaire.png",
      roja: "img/fichaRojaPegSolitaire.png",
      tablero: "img/tableroPegSolitaire.png",
    };

    // Recorre las imágenes y crea una promesa para cada carga
    let cargas = Object.entries(archivos).map(([nombre, ruta]) => {
      return new Promise((resolve, reject) => {
        let imagen = new Image();

        // Guarda la imagen cuando termina de cargarse correctamente
        imagen.onload = () => {
          this.imagenes[nombre] = imagen;
          resolve();
        };

        // Informa si ocurre un error al cargar la imagen
        imagen.onerror = () => {
          reject(new Error("No se pudo cargar la imagen: " + ruta));
        };

        // Inicia la carga de la imagen
        imagen.src = ruta;
      });
    });

    // Espera a que todas las imágenes estén cargadas antes de continuar
    return Promise.all(cargas);
  }

  // Convierte la posición de una casilla (fila y columna)
  // en coordenadas X e Y para dibujarla en el Canvas
  obtenerPixeles(fila, columna) {
    // Calcula las coordenadas según la posición de la casilla
    let x = this.inicioX + columna * this.tamañoCasilla;
    let y = this.inicioY + fila * this.tamañoCasilla;

    return { x, y };
  }

  // Dibuja una ficha utilizando su imagen
  dibujarFicha(tipo, x, y, levantada = false) {
    let r = this.radioFicha;
    let ctx = this.ctx;
    let imagen = this.imagenes[tipo];

    // Guarda la configuración actual del contexto
    ctx.save();

    // Agrega una sombra cuando la ficha está levantada
    if (levantada) {
      ctx.shadowColor = "rgba(158, 227, 255, 0.45)";
      ctx.shadowBlur = 9;
      ctx.shadowOffsetY = 2;
    }

    // Define un área circular para dibujar la ficha
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.closePath();

    // Si la imagen está cargada, la dibuja dentro del círculo
    if (imagen && imagen.complete && imagen.naturalWidth > 0) {
      // Recorta la imagen con forma circular para que se ajuste a la ficha
      ctx.clip();
      ctx.drawImage(imagen, x - r, y - r, r * 2, r * 2);
    } else {
      // Si la imagen no está disponible, dibuja un círculo de color
      ctx.fillStyle = tipo === "roja" ? "#e63946" : "#168bff";
      ctx.fill();
    }

    // Restaura la configuración anterior del contexto
    ctx.restore();

    // Dibuja un borde para destacar la ficha levantada
    if (levantada) {
      ctx.save();

      ctx.beginPath();
      ctx.arc(x, y, r + 2, 0, 2 * Math.PI);

      ctx.strokeStyle = "rgba(158, 227, 255, 0.9)";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.restore();
    }
  }

  // Dibuja la imagen de fondo del tablero
  dibujarTablero(tablero) {
    let ctx = this.ctx;

    // Calcula el tamaño de la imagen para que entre en el Canvas
    let tamañoImagen = Math.min(this.canvas.width, this.canvas.height);

    // Calcula la escala tomando como referencia una imagen de 1024 píxeles
    let escala = tamañoImagen / 1024;

    // Calcula los desplazamientos necesarios para centrar la imagen
    let offsetX = (this.canvas.width - tamañoImagen) / 2;
    let offsetY = (this.canvas.height - tamañoImagen) / 2;

    // Calcula el origen y la distancia entre las casillas según la escala
    this.inicioX = offsetX + 150 * escala;
    this.inicioY = offsetY + 150 * escala;

    this.tamañoCasilla = 120.3 * escala;

    // Limpia el Canvas antes de dibujar nuevamente
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    let imagenTablero = this.imagenes.tablero;

    // Dibuja la imagen del tablero si está cargada
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

  // Dibuja todas las fichas, excepto las que deben permanecer ocultas
  dibujarFichas(tablero, fichaOculta = null) {
    tablero.fichas.forEach((ficha) => {
      // No dibuja las fichas levantadas ni la ficha que se está animando
      if (!ficha.levantada && ficha !== fichaOculta) {
        let posicion = this.obtenerPixeles(ficha.fila, ficha.columna);

        // Dibuja la ficha en las coordenadas correspondientes
        this.dibujarFicha(ficha.tipo, posicion.x, posicion.y);
      }
    });
  }

  // Dibuja el tablero y todas sus fichas
  dibujar(tablero) {
    this.dibujarTablero(tablero);
    this.dibujarFichas(tablero);
  }

  // Muestra los destinos válidos de una ficha mediante una animación
  mostrarDestinos(tablero, ficha) {
    // Cancela una animación de destinos anterior
    this.cancelarDestinos();

    // Obtiene los movimientos posibles desde el modelo del tablero
    let movimientos = tablero.obtenerMovimientosPosibles(ficha);

    // Si no hay movimientos disponibles, no inicia la animación
    if (movimientos.length === 0) {
      return;
    }

    // Función que actualiza la animación en cada cuadro
    let animar = () => {
      // Genera un efecto de pulsación modificando la intensidad de los indicadores
      let intensidad = 0.5 + 0.5 * Math.sin(performance.now() / 250);

      // Redibuja el tablero y muestra los destinos posibles
      this.dibujar(tablero);
      this.dibujarIndicadoresDestinos(movimientos, intensidad);

      // Solicita el siguiente cuadro de animación
      this.animacionDestinos = requestAnimationFrame(animar);
    };

    // Inicia la animación
    this.animacionDestinos = requestAnimationFrame(animar);
  }

  // Dibuja los círculos que indican dónde se puede soltar la ficha
  dibujarIndicadoresDestinos(movimientos, intensidad = 1) {
    let ctx = this.ctx;

    // Recorre los movimientos posibles para señalar cada destino
    movimientos.forEach((movimiento) => {
      let posicion = this.obtenerPixeles(movimiento.fila, movimiento.columna);

      ctx.save();

      // Dibuja el fondo celeste translúcido
      ctx.globalAlpha = 0.2 + intensidad * 0.1;
      ctx.fillStyle = "#9ee3ff";

      ctx.beginPath();
      ctx.arc(posicion.x, posicion.y, this.radioFicha - 2, 0, Math.PI * 2);
      ctx.fill();

      // Dibuja el borde del indicador
      ctx.globalAlpha = 0.85;
      ctx.strokeStyle = "#9ee3ff";
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.arc(posicion.x, posicion.y, this.radioFicha + 3, 0, Math.PI * 2);
      ctx.stroke();

      // Dibuja un punto blanco en el centro del destino
      ctx.globalAlpha = 0.9;
      ctx.beginPath();
      ctx.arc(posicion.x, posicion.y, 4, 0, Math.PI * 2);

      ctx.fillStyle = "#ffffff";
      ctx.fill();

      // Restaura la configuración del contexto
      ctx.restore();
    });
  }

  // Detiene la animación de los destinos posibles
  cancelarDestinos() {
    if (this.animacionDestinos !== null) {
      // Cancela el siguiente cuadro de animación pendiente
      cancelAnimationFrame(this.animacionDestinos);

      // Indica que no hay una animación activa
      this.animacionDestinos = null;
    }
  }

  // Muestra una pista mediante una animación del movimiento
  mostrarPista(tablero, ficha, movimiento) {
    // Cancela una pista anterior antes de iniciar otra
    this.cancelarPista();

    // Registra el momento de inicio y la duración de la animación
    let inicio = performance.now();
    let duracion = 1800;

    // Obtiene las coordenadas de origen, posición intermedia y destino
    let origen = this.obtenerPixeles(ficha.fila, ficha.columna);

    let intermedia = this.obtenerPixeles(
      movimiento.fichaIntermedia.fila,
      movimiento.fichaIntermedia.columna
    );

    let destino = this.obtenerPixeles(movimiento.fila, movimiento.columna);

    // Suaviza el desplazamiento de la ficha durante la animación
    let suavizar = (valor) => {
      return valor * valor * (3 - 2 * valor);
    };

    // Actualiza la animación en cada cuadro
    let animar = (tiempoActual) => {
      let transcurrido = tiempoActual - inicio;

      // Cuando termina la animación, vuelve a dibujar el tablero
      if (transcurrido >= duracion) {
        this.animacionPista = null;
        this.dibujar(tablero);
        return;
      }

      // Calcula el progreso de la animación
      let progreso = transcurrido / duracion;
      let avance;

      // Hace que la ficha avance y retroceda para señalar el movimiento
      if (progreso < 0.5) {
        avance = suavizar(progreso * 2);
      } else {
        avance = suavizar((1 - progreso) * 2);
      }

      // Calcula la posición actual de la ficha durante el desplazamiento
      let x = origen.x + (destino.x - origen.x) * avance;
      let y = origen.y + (destino.y - origen.y) * avance;

      // Genera una intensidad variable para los efectos de iluminación
      let intensidad = 0.5 + 0.5 * Math.sin(transcurrido / 180);

      // Redibuja el tablero y las demás fichas, ocultando la ficha animada
      this.dibujarTablero(tablero);
      this.dibujarFichas(tablero, ficha);

      let ctx = this.ctx;

      // Ilumina la casilla de destino
      ctx.save();

      ctx.globalAlpha = 0.12 + intensidad * 0.12;
      ctx.fillStyle = "#9ee3ff";
      ctx.shadowColor = "#9ee3ff";
      ctx.shadowBlur = 18;

      ctx.beginPath();
      ctx.arc(destino.x, destino.y, this.radioFicha + 10, 0, Math.PI * 2);

      ctx.fill();
      ctx.restore();

      // Agrega un segundo efecto para destacar el destino
      ctx.save();

      ctx.globalAlpha = 0.12 + intensidad * 0.1;
      ctx.fillStyle = "#9ee3ff";

      ctx.beginPath();
      ctx.arc(destino.x, destino.y, this.radioFicha + 8, 0, Math.PI * 2);

      ctx.fill();
      ctx.restore();

      // Resalta la ficha intermedia que debe saltarse
      ctx.save();

      ctx.globalAlpha = 0.45 + intensidad * 0.25;
      ctx.strokeStyle = "#ffc477";
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.arc(intermedia.x, intermedia.y, this.radioFicha + 4, 0, Math.PI * 2);

      ctx.stroke();
      ctx.restore();

      // Dibuja la ficha desplazándose hacia el destino
      this.dibujarFicha(ficha.tipo, x, y);

      // Solicita el siguiente cuadro de animación
      this.animacionPista = requestAnimationFrame(animar);
    };

    // Inicia la animación de la pista
    this.animacionPista = requestAnimationFrame(animar);
  }

  // Cancela la animación de la pista
  cancelarPista() {
    if (this.animacionPista !== null) {
      // Cancela el siguiente cuadro de animación pendiente
      cancelAnimationFrame(this.animacionPista);

      // Indica que no hay una animación activa
      this.animacionPista = null;
    }
  }
}
