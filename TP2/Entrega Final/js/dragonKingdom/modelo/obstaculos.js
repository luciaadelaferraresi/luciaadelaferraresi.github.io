export class Obstaculos {
  constructor(contenedor, escenario) {
    // ELEMENTOS DEL HTML
    this.contenedor = contenedor;
    this.escenario = escenario;

    // CONFIGURACIÓN DE OBSTÁCULOS
    this.VELOCIDAD = 120;
    this.ANCHO = 90;

    // DISTANCIA HORIZONTAL ENTRE PAREJAS DE COLUMNAS
    this.DISTANCIA_MINIMA = 280;
    this.DISTANCIA_MAXIMA = 400;

    // Distancia hasta la próxima pareja y altura del último hueco
    this.distanciaSiguiente = this.elegirDistancia();
    this.ultimoCentro = null;

    // CONFIGURACIÓN DE DIFICULTAD
    // El espacio entre columnas se reduce con el tiempo.
    this.ESPACIO_INICIAL = 240;
    this.ESPACIO_MINIMO = 190;
    this.ESPACIO = this.ESPACIO_INICIAL;

    this.INTERVALO_DIFICULTAD = 10;
    this.REDUCCION_ESPACIO = 10;

    // ESTADO DEL JUEGO
    this.lista = [];
    this.distanciaRecorrida = 0;
    this.tiempoTranscurrido = 0;
  }

  // ELEGIR DISTANCIA ALEATORIA ENTRE COLUMNAS

  elegirDistancia() {
    // Devolver una distancia entre el mínimo y el máximo
    return (
      this.DISTANCIA_MINIMA +
      Math.random() * (this.DISTANCIA_MAXIMA - this.DISTANCIA_MINIMA)
    );
  }

  // REINICIAR OBSTÁCULOS

  reiniciar() {
    // Eliminar las columnas del escenario
    this.contenedor.replaceChildren();

    // Reiniciar las posiciones y el tiempo
    this.lista = [];
    this.distanciaRecorrida = 0;
    this.tiempoTranscurrido = 0;

    this.distanciaSiguiente = this.elegirDistancia();
    this.ultimoCentro = null;

    // Recuperar el espacio inicial entre columnas
    this.ESPACIO = this.ESPACIO_INICIAL;
  }

  // CREAR PAREJA DE COLUMNAS

  crear() {
    const alto = this.escenario.clientHeight;
    const margen = 65;

    // Calcular hasta dónde puede ubicarse el centro del hueco
    // para dejar un margen arriba y abajo del escenario.
    const centroMinimo = margen + this.ESPACIO / 2;
    const centroMaximo = alto - margen - this.ESPACIO / 2;

    // ELEGIR ALTURA DEL HUECO

    let centro;

    if (this.ultimoCentro === null) {
      // Primera pareja: elegir una altura aleatoria
      centro =
        centroMinimo + Math.random() * Math.max(0, centroMaximo - centroMinimo);
    } else {
      // Las siguientes parejas cambian de altura gradualmente
      // para evitar saltos demasiado grandes entre huecos.
      const cambioMaximo = 100;

      centro = this.ultimoCentro + (Math.random() * 2 - 1) * cambioMaximo;

      centro = Math.max(centroMinimo, Math.min(centroMaximo, centro));
    }

    // Guardar la altura para la próxima pareja
    this.ultimoCentro = centro;

    // Calcular dónde termina la columna superior
    // y dónde comienza la inferior.
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

    // Agregar las dos columnas al escenario
    this.contenedor.append(superior, inferior);

    // Guardar la pareja de columnas y su posición horizontal
    const obstaculo = {
      x: this.escenario.clientWidth,
      superior,
      inferior,
    };

    this.lista.push(obstaculo);

    return obstaculo;
  }

  // AUMENTAR DIFICULTAD
  //Cada 15 segundos, el espacio vertical se reduce 10 píxeles hasta llegar a un mínimo de 210.
  actualizarDificultad(dt) {
    // Acumular el tiempo transcurrido
    this.tiempoTranscurrido += dt;

    // Calcular cuántos niveles de dificultad pasaron
    const niveles = Math.floor(
      this.tiempoTranscurrido / this.INTERVALO_DIFICULTAD
    );

    // Reducir el hueco sin superar el mínimo establecido
    this.ESPACIO = Math.max(
      this.ESPACIO_MINIMO,
      this.ESPACIO_INICIAL - niveles * this.REDUCCION_ESPACIO
    );
  }

  // OBTENER ESPACIO HORIZONTAL ENTRE COLUMNAS
  //Calcula el espacio horizontal disponible entre dos parejas
  //consecutivas de columnas para colocar monedas y
  // corazones sin superponerlos con las torres.
  obtenerZonaLibre() {
    // Calcular una zona libre para ubicar coleccionables
    const distancia = this.distanciaSiguiente;
    const margen = 35;

    // Dejar espacio después de la columna actual
    const inicio = this.ANCHO + margen;

    // Dejar espacio antes de la próxima columna
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

    // Actualizar dificultad según el tiempo transcurrido
    this.actualizarDificultad(dt);

    // Calcular cuánto avanzan las columnas en este fotograma
    const desplazamiento = this.VELOCIDAD * dt;

    this.distanciaRecorrida += desplazamiento;

    // Crear nuevas parejas cuando se alcanza la distancia indicada
    while (this.distanciaRecorrida >= this.distanciaSiguiente) {
      this.distanciaRecorrida -= this.distanciaSiguiente;

      this.crear();
      creados++;

      // Elegir la distancia de la próxima pareja
      this.distanciaSiguiente = this.elegirDistancia();
    }

    // Mover todas las columnas hacia la izquierda
    for (const obstaculo of this.lista) {
      obstaculo.x -= desplazamiento;
    }

    // Eliminar las columnas que salieron del escenario
    this.lista = this.lista.filter((obstaculo) => {
      if (obstaculo.x + this.ANCHO < 0) {
        obstaculo.superior.remove();
        obstaculo.inferior.remove();

        return false;
      }

      return true;
    });

    // Informar cuántas parejas se crearon para generar coleccionables
    return creados;
  }

  // DIBUJAR OBSTÁCULOS

  dibujar() {
    // Aplicar la posición horizontal a cada pareja de columnas
    for (const obstaculo of this.lista) {
      const posicion = `translateX(${obstaculo.x}px)`;

      obstaculo.superior.style.transform = posicion;
      obstaculo.inferior.style.transform = posicion;
    }
  }
}
