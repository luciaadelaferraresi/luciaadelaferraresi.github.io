import { Dragon } from "../modelo/dragon.js";
import { Parallax } from "../vista/parallax.js";
import { Obstaculos } from "../modelo/obstaculos.js";
import { Corazones } from "../modelo/corazones.js";
import { Monedas } from "../modelo/monedas.js";

export class DragonKingdom {
  constructor() {
    // ELEMENTOS DEL HTML
    // Obtenemos referencias a los elementos del DOM mediante sus ID.

    this.juego = document.getElementById("dragon-juego");
    this.zonaJuego = document.getElementById("dragon-zona");
    this.escenario = document.getElementById("dragon-escenario");

    // BOTONES DEL JUEGO

    this.botonJugar = document.getElementById("boton-entrar-dragon");
    this.comenzar = document.getElementById("dragon-comenzar");
    this.reiniciar = document.getElementById("dragon-reiniciar");
    this.volver = document.getElementById("dragon-volver");

    // MENSAJE Y CONTADORES

    this.mensaje = document.getElementById("dragon-mensaje");
    this.puntos = document.getElementById("dragon-puntos");
    this.vidas = document.getElementById("dragon-vidas");

    // PANTALLA FINAL

    this.pantallaFinal = document.getElementById("dragon-pantalla-final");
    this.puntosFinal = document.getElementById("dragon-puntos-final");
    this.jugarOtraVez = document.getElementById("dragon-jugar-otra-vez");
    this.volverFinal = document.getElementById("dragon-volver-final");

    // ELEMENTOS DEL ESCENARIO

    this.obstaculos = document.getElementById("dragon-obstaculos");
    this.elementos = document.getElementById("dragon-elementos");
    this.personajeEl = document.getElementById("dragon-personaje");

    // COMPROBAR ELEMENTOS

    if (
      !this.juego ||
      !this.zonaJuego ||
      !this.escenario ||
      !this.botonJugar ||
      !this.comenzar ||
      !this.reiniciar ||
      !this.volver ||
      !this.mensaje ||
      !this.puntos ||
      !this.vidas ||
      !this.obstaculos ||
      !this.elementos ||
      !this.personajeEl ||
      !this.pantallaFinal ||
      !this.puntosFinal ||
      !this.jugarOtraVez ||
      !this.volverFinal
    ) {
      console.warn("Dragon Kingdom: faltan elementos del HTML.");
      return;
    }

    // COMPONENTES DEL JUEGO
    // Instanciamos las clases que administran cada componente.

    this.dragon = new Dragon(this.personajeEl, this.escenario);

    this.parallax = new Parallax(this.escenario);

    this.gestorObstaculos = new Obstaculos(this.obstaculos, this.escenario);

    // Los coleccionables se desplazan a la misma velocidad
    // que las columnas para mantener su posición relativa.

    this.gestorCorazones = new Corazones(
      this.elementos,
      this.escenario,
      this.gestorObstaculos.VELOCIDAD
    );

    this.gestorMonedas = new Monedas(
      this.elementos,
      this.escenario,
      this.gestorObstaculos.VELOCIDAD,
      this.gestorObstaculos
    );

    // ESTADO DEL JUEGO

    // inactivo: fuera del videojuego
    // preparado: esperando para comenzar
    // iniciado: partida en curso
    // terminado: fin de la partida

    this.estado = "inactivo";

    // CONTROL DE DAÑO E INVULNERABILIDAD
    // Después de un choque no fatal, el dragón permanece
    // invulnerable durante 1.5 segundos.

    this.tiempoInvulnerable = 0;
    this.DURACION_INVULNERABILIDAD = 1.5;

    // CONTROL DEL TECLADO
    // Almacena si el usuario solicitó un impulso.
    // La acción se procesa dentro del game loop.

    this.entrada = {
      impulso: false,
    };

    // CONTROL DEL TIEMPO Y LA POSICIÓN DE LA PÁGINA

    this.anterior = performance.now();
    this.posicionPresentacion = 0;

    this.configurarEventos();

    // PREPARAR ESTADO INICIAL

    this.prepararPartida();

    this.estado = "inactivo";
    this.juego.dataset.estado = this.estado;
    this.zonaJuego.hidden = true;

    this.frame = this.frame.bind(this);
    requestAnimationFrame(this.frame);
  }

  // PREPARAR PARTIDA
  // Restablece todos los componentes y contadores.
  // Deja el juego preparado, pero sin iniciar el movimiento.

  prepararPartida() {
    // Establecer el estado preparado y ocultar la pantalla final
    this.estado = "preparado";
    this.juego.dataset.estado = this.estado;
    this.pantallaFinal.hidden = true;

    // Reiniciar puntos y vidas
    this.puntos.textContent = "0";
    this.vidas.textContent = "3";

    // Limpiar elementos del escenario.
    this.obstaculos.replaceChildren();
    this.elementos.replaceChildren();

    // Reiniciar todos los componentes del juego.
    this.dragon.reiniciar();
    this.parallax.reiniciar();
    this.gestorObstaculos.reiniciar();
    this.gestorCorazones.reiniciar();
    this.gestorMonedas.reiniciar();

    // Reiniciar controles y efectos de daño
    this.entrada.impulso = false;
    this.tiempoInvulnerable = 0;
    this.personajeEl.classList.remove("dragon-danado");

    // Mostrar los controles iniciales.
    // hidden permite mostrar u ocultar elementos HTML.
    this.mensaje.hidden = false;
    this.comenzar.hidden = false;
    this.reiniciar.hidden = true;
    this.volver.hidden = false;
  }

  // INICIAR PARTIDA
  // Habilita la actualización de la lógica del juego.

  iniciarPartida() {
    // Cambiar el estado para comenzar el movimiento
    this.estado = "iniciado";

    this.juego.dataset.estado = this.estado;

    this.mensaje.hidden = true;
    this.comenzar.hidden = true;
    this.reiniciar.hidden = false;

    // Crear la primera pareja de columnas
    this.gestorObstaculos.crear();
  }

  // CONFIGURAR EVENTOS
  // Relaciona las acciones del usuario con los métodos del juego.

  configurarEventos() {
    // TECLADO

    document.addEventListener("keydown", (e) => {
      if (e.code !== "Space" || e.repeat) return;

      if (this.estado !== "iniciado") return;

      e.preventDefault();

      this.entrada.impulso = true;
    });

    // BOTÓN JUGAR
    // Permite pasar de la presentación al escenario.

    this.botonJugar.addEventListener("click", () => {
      this.posicionPresentacion = window.scrollY;

      this.prepararPartida();

      this.zonaJuego.hidden = false;
      document.body.classList.add("partida-activa");

      window.scrollTo(0, 0);
      this.comenzar.focus({ preventScroll: true });
    });

    // BOTÓN COMENZAR

    this.comenzar.addEventListener("click", () => {
      this.iniciarPartida();

      this.comenzar.blur();
    });

    // BOTÓN REINICIAR
    // Restablece la partida y espera que el usuario comience.

    this.reiniciar.addEventListener("click", () => {
      this.prepararPartida();
      this.comenzar.focus({ preventScroll: true });
    });

    // BOTÓN VOLVER

    this.volver.addEventListener("click", () => {
      this.prepararPartida();

      // Salir del juego y recuperar la presentación
      this.estado = "inactivo";
      this.juego.dataset.estado = this.estado;

      this.zonaJuego.hidden = true;
      document.body.classList.remove("partida-activa");

      // Volver a la posición anterior de la página
      this.botonJugar.focus({ preventScroll: true });
      window.scrollTo(0, this.posicionPresentacion);
    });

    // JUGAR OTRA VEZ DESDE LA PANTALLA FINAL
    // Reinicia y comienza directamente una nueva partida.

    this.jugarOtraVez.addEventListener("click", () => {
      this.prepararPartida();
      this.iniciarPartida();
      this.jugarOtraVez.blur();
    });

    // VOLVER DESDE LA PANTALLA FINAL
    // Reutiliza el evento del botón volver para no duplicar lógica.

    this.volverFinal.addEventListener("click", () => {
      this.volver.click();
    });
  }

  // CREAR MONEDAS Y CORAZONES ENTRE COLUMNAS

  crearColeccionables() {
    // Obtener la zona horizontal disponible entre parejas de columnas.
    // Así evitamos generar coleccionables dentro de los obstáculos.
    const zona = this.gestorObstaculos.obtenerZonaLibre();

    if (!zona) return;

    const anchoEscenario = this.escenario.clientWidth;
    const altoEscenario = this.escenario.clientHeight;

    // Margen para evitar generar elementos demasiado cerca
    // de los bordes superior e inferior.
    const margenVertical = 80;

    // GENERAR MONEDA

    // Se genera una moneda por cada llamada con una zona válida.
    const xMoneda =
      anchoEscenario +
      zona.inicio +
      zona.ancho / 2 -
      this.gestorMonedas.TAMANO / 2;

    // Calcular el rango vertical disponible considerando
    // los márgenes y la altura completa de la moneda.
    const alturaMoneda = Math.max(
      0,
      altoEscenario - margenVertical * 2 - this.gestorMonedas.ALTO
    );

    // Elegir una posición vertical aleatoria.
    const yMoneda = margenVertical + Math.random() * alturaMoneda;

    this.gestorMonedas.crear(xMoneda, yMoneda);

    // GENERAR CORAZÓN

    // 25% de probabilidad de aparición independiente.
    // La generación del corazón no impide generar la moneda.
    if (Math.random() < 0.25) {
      const alturaCorazon = Math.max(
        0,
        altoEscenario - margenVertical * 2 - this.gestorCorazones.TAMANO
      );

      // Elegir una posición vertical aleatoria.
      const yCorazon = margenVertical + Math.random() * alturaCorazon;

      // Separar horizontalmente ambos coleccionables
      // para evitar que se superpongan.
      const separacion = 15;

      // Espacio total necesario: ancho de la moneda,
      // ancho del corazón y separación entre ambos.
      const espacioNecesario =
        this.gestorMonedas.TAMANO + this.gestorCorazones.TAMANO + separacion;

      // Solo crear el corazón si ambos elementos entran
      // dentro de la zona disponible.
      if (zona.ancho >= espacioNecesario) {
        const inicio = anchoEscenario + zona.inicio;

        // Centrar el conjunto de coleccionables en la zona libre.
        const xInicio = inicio + (zona.ancho - espacioNecesario) / 2;

        // at(-1) obtiene la última moneda agregada al arreglo.
        const moneda = this.gestorMonedas.lista.at(-1);

        // Reubicar la moneda y colocar el corazón a su derecha.
        moneda.x = xInicio;

        const xCorazon = xInicio + this.gestorMonedas.TAMANO + separacion;

        this.gestorCorazones.crear(xCorazon, yCorazon);
      }
    }
  }

  // DETECTAR COLISIONES CON MONEDAS

  comprobarMonedas() {
    const dragon = this.dragon;

    // Zona de colisión más pequeña que el dibujo.
    // Los márgenes reducen la hitbox para aproximarla
    // al cuerpo visible del dragón.
    const margenHorizontal = 25;
    const margenVertical = 22;

    // Calcular los cuatro límites del cuerpo del dragón.
    const dragonIzquierda = dragon.x + margenHorizontal;
    const dragonDerecha = dragon.x + dragon.ANCHO - margenHorizontal;
    const dragonArriba = dragon.y + margenVertical;
    const dragonAbajo = dragon.y + dragon.ALTO - margenVertical;

    // Revisar todas las monedas del escenario.
    // filter permite detectar y eliminar las monedas recogidas.
    this.gestorMonedas.lista = this.gestorMonedas.lista.filter((moneda) => {
      const monedaIzquierda = moneda.x;
      const monedaDerecha = moneda.x + this.gestorMonedas.TAMANO;
      const monedaArriba = moneda.y;
      const monedaAbajo = moneda.y + this.gestorMonedas.ALTO;

      // Existe colisión si se cumplen las cuatro condiciones.
      // Las primeras dos comprueban la superposición horizontal
      // y las últimas dos, la superposición vertical.
      const colision =
        dragonDerecha > monedaIzquierda &&
        dragonIzquierda < monedaDerecha &&
        dragonAbajo > monedaArriba &&
        dragonArriba < monedaAbajo;

      if (colision) {
        const puntosActuales = Number(this.puntos.textContent);
        this.puntos.textContent = puntosActuales + this.gestorMonedas.VALOR;

        // Eliminar la moneda recogida del DOM.
        moneda.elemento.remove();

        // false elimina la moneda del arreglo resultante,
        // evitando que pueda recogerse más de una vez.
        return false;
      }

      // Conservar las monedas que no fueron recogidas.
      return true;
    });
  }

  // DETECTAR COLISIONES CON CORAZONES

  comprobarCorazones() {
    const dragon = this.dragon;

    const margen = 15;

    const dragonIzquierda = dragon.x + margen;
    const dragonDerecha = dragon.x + dragon.ANCHO - margen;
    const dragonArriba = dragon.y + margen;
    const dragonAbajo = dragon.y + dragon.ALTO - margen;

    // Revisar todos los corazones del escenario.
    this.gestorCorazones.lista = this.gestorCorazones.lista.filter(
      (corazon) => {
        // Comprobar la superposición horizontal y vertical.
        const colision =
          dragonDerecha > corazon.x &&
          dragonIzquierda < corazon.x + this.gestorCorazones.TAMANO &&
          dragonAbajo > corazon.y &&
          dragonArriba < corazon.y + this.gestorCorazones.TAMANO;

        if (colision) {
          const vidasActuales = Number(this.vidas.textContent);

          this.vidas.textContent = vidasActuales + 1;

          // Eliminar el corazón recogido del DOM
          corazon.elemento.remove();

          return false;
        }

        return true;
      }
    );
  }

  // DETECTAR COLISIONES CON COLUMNAS

  comprobarObstaculos() {
    // Evitar recibir daño durante la invulnerabilidad.
    // Si todavía queda tiempo, no se comprueban las colisiones.
    if (this.tiempoInvulnerable > 0) return;

    const dragon = this.dragon;

    // Ajustar la zona de colisión al cuerpo del dragón.
    // No se utiliza el rectángulo completo del sprite.
    const margenHorizontal = 30;
    const margenVertical = 35;

    // Calcular los límites de la hitbox del dragón.
    const dragonIzquierda = dragon.x + margenHorizontal;
    const dragonDerecha = dragon.x + dragon.ANCHO - margenHorizontal;
    const dragonArriba = dragon.y + margenVertical;
    const dragonAbajo = dragon.y + dragon.ALTO - margenVertical;

    // Revisar cada pareja de columnas.
    for (const obstaculo of this.gestorObstaculos.lista) {
      // Ajustar los límites horizontales de las columnas.
      const margenColumna = 8;

      const columnaIzquierda = obstaculo.x + margenColumna;
      const columnaDerecha =
        obstaculo.x + this.gestorObstaculos.ANCHO - margenColumna;

      // Comprobar si coinciden horizontalmente.
      const colisionHorizontal =
        dragonDerecha > columnaIzquierda && dragonIzquierda < columnaDerecha;

      // Si no coinciden horizontalmente, pasar a la siguiente pareja.
      // No es necesario comprobar la posición vertical.
      if (!colisionHorizontal) continue;

      // Obtener el límite inferior de la columna superior.
      const limiteSuperior = parseFloat(obstaculo.superior.style.height);

      // Obtener el límite superior de la columna inferior.
      const inicioInferior = parseFloat(obstaculo.inferior.style.top);

      // Si el borde superior del dragón está por encima
      // del hueco, toca la columna superior.
      const tocaSuperior = dragonArriba < limiteSuperior;

      // Si el borde inferior del dragón está por debajo
      // del hueco, toca la columna inferior.
      const tocaInferior = dragonAbajo > inicioInferior;

      // Basta con tocar una de las dos columnas para recibir daño.
      if (tocaSuperior || tocaInferior) {
        this.recibirDanio();

        return;
      }
    }
  }

  // RESTAR VIDA AL CHOCAR
  // Administra las consecuencias de una colisión con las columnas.

  recibirDanio() {
    const vidasActuales = Number(this.vidas.textContent);

    // Evitar que el contador tenga valores negativos.
    if (vidasActuales <= 0) return;

    // Restar una vida.
    const vidasRestantes = vidasActuales - 1;

    // Actualizar el contador.
    this.vidas.textContent = vidasRestantes;

    // La partida termina cuando el jugador se queda sin vidas.
    if (vidasRestantes === 0) {
      this.terminarPartida();
      return;
    }

    // Si todavía tiene vidas, activar invulnerabilidad temporal.
    this.tiempoInvulnerable = this.DURACION_INVULNERABILIDAD;

    // Activar la animación CSS de parpadeo por daño.
    this.personajeEl.classList.add("dragon-danado");
  }

  // TERMINAR PARTIDA

  terminarPartida() {
    this.estado = "terminado";
    this.juego.dataset.estado = this.estado;

    // Descartar cualquier impulso pendiente.
    this.entrada.impulso = false;

    // Mostrar los puntos finales obtenidos durante la partida.
    this.puntosFinal.textContent = this.puntos.textContent;

    // Mostrar la pantalla de derrota.
    this.pantallaFinal.hidden = false;

    // Ocultar el mensaje inicial.
    this.mensaje.hidden = true;

    // Ocultar los botones inferiores.
    this.comenzar.hidden = true;
    this.reiniciar.hidden = true;
    this.volver.hidden = true;

    // Quitar la animación de daño.
    this.personajeEl.classList.remove("dragon-danado");
  }

  // ACTUALIZAR JUEGO
  // Coordina la actualización de todos los componentes
  // y comprueba las interacciones entre ellos.
  // Se ejecuta en cada fotograma desde el game loop.

  actualizar(dt) {
    // No actualizar el juego si la partida no está iniciada.
    // Esto permite mantener un único game loop para todos los estados.
    if (this.estado !== "iniciado") return;

    // ACTUALIZAR INVULNERABILIDAD

    if (this.tiempoInvulnerable > 0) {
      // Restar el tiempo transcurrido en cada fotograma.
      this.tiempoInvulnerable -= dt;

      // Cuando llega a cero, el dragón vuelve a ser vulnerable
      // y se desactiva la animación de parpadeo.
      if (this.tiempoInvulnerable <= 0) {
        this.tiempoInvulnerable = 0;
        this.personajeEl.classList.remove("dragon-danado");
      }
    }

    if (this.entrada.impulso) {
      this.dragon.impulsar();
      this.entrada.impulso = false;
    }

    // ACTUALIZAR DRAGÓN Y FONDO

    // Comprobar si el dragón toca el piso o el cielo
    const tocaLimite = this.dragon.actualizar(dt);

    if (tocaLimite && this.tiempoInvulnerable <= 0) {
      this.recibirDanio();
    }

    // Detener la actualización si perdió su última vida
    if (this.estado !== "iniciado") return;
    this.parallax.actualizar(dt);

    // ACTUALIZAR OBSTÁCULOS
    // El gestor devuelve cuántas parejas nuevas se crearon.

    const nuevosObstaculos = this.gestorObstaculos.actualizar(dt);

    // Generar coleccionables cuando aparecen nuevas parejas,
    // en lugar de intentar generarlos en todos los fotogramas.
    for (let i = 0; i < nuevosObstaculos; i++) {
      this.crearColeccionables();
    }

    // ACTUALIZAR COLECCIONABLES
    // Calcular sus nuevas posiciones y eliminar los que
    // salieron completamente del escenario.

    this.gestorCorazones.actualizar(dt);
    this.gestorMonedas.actualizar(dt);

    // COMPROBAR COLISIONES CON COLUMNAS
    // Las colisiones se comprueban después de actualizar posiciones.

    this.comprobarObstaculos();

    // Si una colisión terminó la partida, no seguir comprobando
    // coleccionables para evitar sumar puntos o vidas después de perder.
    if (this.estado !== "iniciado") return;

    // COMPROBAR COLISIONES CON COLECCIONABLES

    this.comprobarMonedas();
    this.comprobarCorazones();
  }

  // DIBUJAR JUEGO
  // Aplica visualmente el estado calculado por actualizar().
  // Cada componente se encarga de su propia representación.

  dibujar() {
    this.dragon.dibujar();
    this.parallax.dibujar();
    this.gestorObstaculos.dibujar();
    this.gestorCorazones.dibujar();
    this.gestorMonedas.dibujar();
  }

  // GAME LOOP
  // Bucle principal que actualiza la lógica y dibuja
  // los elementos del videojuego en cada fotograma.
  // requestAnimationFrame sincroniza el ciclo con
  // el proceso de renderizado del navegador.

  frame(ahora) {
    // Calcular el tiempo transcurrido entre fotogramas.
    // dt permite calcular los desplazamientos según el tiempo
    let dt = (ahora - this.anterior) / 1000;
    this.anterior = ahora;

    dt = Math.min(dt, 0.05);

    // Primero actualizar la lógica y después dibujar.
    this.actualizar(dt);
    this.dibujar();

    requestAnimationFrame(this.frame);
  }
}
