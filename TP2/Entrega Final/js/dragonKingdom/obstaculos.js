export class Obstaculos {
  constructor(contenedor, escenario) {
    // ELEMENTOS DEL HTML
    this.contenedor = contenedor;
    this.escenario = escenario;

    // CONFIGURACIÓN DE OBSTÁCULOS
    this.VELOCIDAD = 120;
    this.ANCHO = 90;

    // DISTANCIA HORIZONTAL ENTRE COLUMNAS
    this.DISTANCIA_MINIMA = 280;
    this.DISTANCIA_MAXIMA = 400;

    this.distanciaSiguiente = this.elegirDistancia();
    this.ultimoCentro = null;

    // CONFIGURACIÓN DE DIFICULTAD
    this.ESPACIO_INICIAL = 220;
    this.ESPACIO_MINIMO = 160;
    this.ESPACIO = this.ESPACIO_INICIAL;

    this.INTERVALO_DIFICULTAD = 15;
    this.REDUCCION_ESPACIO = 10;

    // ESTADO DEL JUEGO
    this.lista = [];
    this.distanciaRecorrida = 0;
    this.tiempoTranscurrido = 0;
  }

  // ELEGIR DISTANCIA ALEATORIA ENTRE COLUMNAS

  elegirDistancia() {
    return (
      this.DISTANCIA_MINIMA +
      Math.random() * (this.DISTANCIA_MAXIMA - this.DISTANCIA_MINIMA)
    );
  }

  // REINICIAR OBSTÁCULOS

  reiniciar() {
    this.contenedor.replaceChildren();

    this.lista = [];
    this.distanciaRecorrida = 0;
    this.tiempoTranscurrido = 0;

    this.distanciaSiguiente = this.elegirDistancia();
    this.ultimoCentro = null;

    this.ESPACIO = this.ESPACIO_INICIAL;
  }

  // CREAR PAREJA DE COLUMNAS

  crear() {
    const alto = this.escenario.clientHeight;
    const margen = 65;

    // Calcular los límites del hueco
    const centroMinimo = margen + this.ESPACIO / 2;
    const centroMaximo = alto - margen - this.ESPACIO / 2;

    // Elegir una altura aleatoria
    let centro;

    if (this.ultimoCentro === null) {
      centro =
        centroMinimo + Math.random() * Math.max(0, centroMaximo - centroMinimo);
    } else {
      const cambioMaximo = 65;

      centro = this.ultimoCentro + (Math.random() * 2 - 1) * cambioMaximo;

      centro = Math.max(centroMinimo, Math.min(centroMaximo, centro));
    }

    this.ultimoCentro = centro;

    // Límites verticales de las columnas
    const limiteSuperior = centro - this.ESPACIO / 2;
    const inicioInferior = centro + this.ESPACIO / 2;

    // COLUMNA SUPERIOR

    const superior = document.createElement("div");
    superior.className = "dragon-columna superior";
    superior.style.height = `${limiteSuperior}px`;

    // COLUMNA INFERIOR

    const inferior = document.createElement("div");
    inferior.className = "dragon-columna inferior";
    inferior.style.top = `${inicioInferior}px`;
    inferior.style.height = `${alto - inicioInferior}px`;

    // Agregar columnas al escenario
    this.contenedor.append(superior, inferior);

    // Guardar pareja de columnas
    const obstaculo = {
      x: this.escenario.clientWidth,
      superior,
      inferior,
    };

    this.lista.push(obstaculo);

    return obstaculo;
  }

  // AUMENTAR DIFICULTAD

  actualizarDificultad(dt) {
    this.tiempoTranscurrido += dt;

    // Aumentar un nivel cada 15 segundos
    const niveles = Math.floor(
      this.tiempoTranscurrido / this.INTERVALO_DIFICULTAD
    );

    // Reducir progresivamente el hueco
    this.ESPACIO = Math.max(
      this.ESPACIO_MINIMO,
      this.ESPACIO_INICIAL - niveles * this.REDUCCION_ESPACIO
    );
  }

  // OBTENER ESPACIO HORIZONTAL ENTRE COLUMNAS

  obtenerZonaLibre() {
    const distancia = this.distanciaSiguiente;
    const margen = 35;

    // Después de la columna actual
    const inicio = this.ANCHO + margen;

    // Antes de la próxima columna
    const fin = distancia - margen;

    if (fin <= inicio) {
      return null;
    }

    return {
      inicio,
      fin,
      ancho: fin - inicio,
    };
  }

  // ACTUALIZAR OBSTÁCULOS

  actualizar(dt) {
    let creados = 0;

    // Actualizar dificultad
    this.actualizarDificultad(dt);

    // Calcular desplazamiento
    const desplazamiento = this.VELOCIDAD * dt;

    this.distanciaRecorrida += desplazamiento;

    // Crear nuevas parejas de columnas
    while (this.distanciaRecorrida >= this.distanciaSiguiente) {
      this.distanciaRecorrida -= this.distanciaSiguiente;

      this.crear();
      creados++;

      // Elegir distancia para la próxima pareja
      this.distanciaSiguiente = this.elegirDistancia();
    }

    // Mover columnas hacia la izquierda
    for (const obstaculo of this.lista) {
      obstaculo.x -= desplazamiento;
    }

    // Eliminar columnas fuera del escenario
    this.lista = this.lista.filter((obstaculo) => {
      if (obstaculo.x + this.ANCHO < 0) {
        obstaculo.superior.remove();
        obstaculo.inferior.remove();

        return false;
      }

      return true;
    });

    // Informar cuántas parejas nuevas se crearon
    return creados;
  }

  // DIBUJAR OBSTÁCULOS

  dibujar() {
    for (const obstaculo of this.lista) {
      const posicion = `translateX(${obstaculo.x}px)`;

      obstaculo.superior.style.transform = posicion;
      obstaculo.inferior.style.transform = posicion;
    }
  }
}
