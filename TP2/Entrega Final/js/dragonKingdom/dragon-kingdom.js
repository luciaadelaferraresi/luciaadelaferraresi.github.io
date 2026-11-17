import { Dragon } from "./dragon.js";
import { Parallax } from "./parallax.js";
import { Obstaculos } from "./obstaculos.js";
import { Corazones } from "./corazones.js";
import { Monedas } from "./monedas.js";

export class DragonKingdom {
  constructor() {
    // ELEMENTOS DEL HTML

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

    // Verificar que existan todos los elementos necesarios del HTML
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

    this.dragon = new Dragon(this.personajeEl, this.escenario);

    this.parallax = new Parallax(this.escenario);

    this.gestorObstaculos = new Obstaculos(this.obstaculos, this.escenario);

    // Los coleccionables se desplazan a la misma velocidad
    // que las columnas.

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

    this.tiempoInvulnerable = 0;
    this.DURACION_INVULNERABILIDAD = 1.5;

    // CONTROL DEL TECLADO

    this.entrada = {
      impulso: false,
    };

    // CONTROL DEL TIEMPO Y LA POSICIÓN DE LA PÁGINA

    this.anterior = performance.now();
    this.posicionPresentacion = 0;

    // CONFIGURAR EVENTOS

    this.configurarEventos();

    // PREPARAR ESTADO INICIAL

    this.prepararPartida();

    this.estado = "inactivo";
    this.juego.dataset.estado = this.estado;
    this.zonaJuego.hidden = true;

    // INICIAR EL ÚNICO GAME LOOP

    this.frame = this.frame.bind(this);
    requestAnimationFrame(this.frame);
  }

  // PREPARAR PARTIDA

  prepararPartida() {
    // Establecer el estado preparado y ocultar la pantalla final
    this.estado = "preparado";
    this.juego.dataset.estado = this.estado;
    this.pantallaFinal.hidden = true;

    // Reiniciar puntos y vidas
    this.puntos.textContent = "0";
    this.vidas.textContent = "3";

    // Limpiar elementos del escenario
    this.obstaculos.replaceChildren();
    this.elementos.replaceChildren();

    // Reiniciar todos los componentes del juego
    this.dragon.reiniciar();
    this.parallax.reiniciar();
    this.gestorObstaculos.reiniciar();
    this.gestorCorazones.reiniciar();
    this.gestorMonedas.reiniciar();

    // Reiniciar controles y efectos de daño
    this.entrada.impulso = false;
    this.tiempoInvulnerable = 0;
    this.personajeEl.classList.remove("dragon-danado");

    // Mostrar los controles iniciales
    this.mensaje.hidden = false;
    this.comenzar.hidden = false;
    this.reiniciar.hidden = true;
    this.volver.hidden = false;
  }

  // INICIAR PARTIDA

  iniciarPartida() {
    // Cambiar el estado para comenzar el movimiento
    this.estado = "iniciado";

    // Sincronizar el estado del juego con las animaciones CSS
    this.juego.dataset.estado = this.estado;

    // Ocultar el mensaje inicial y mostrar reiniciar
    this.mensaje.hidden = true;
    this.comenzar.hidden = true;
    this.reiniciar.hidden = false;

    // Crear la primera pareja de columnas
    this.gestorObstaculos.crear();
  }

  // CONFIGURAR EVENTOS

  configurarEventos() {
    // TECLADO

    document.addEventListener("keydown", (e) => {
      // Detectar ESPACIO e ignorar las pulsaciones mantenidas
      if (e.code !== "Space" || e.repeat) return;

      // Permitir el impulso solo durante la partida
      if (this.estado !== "iniciado") return;

      // Evitar el desplazamiento de la página
      e.preventDefault();

      // Solicitar un impulso en el siguiente fotograma
      this.entrada.impulso = true;
    });

    // BOTÓN JUGAR

    this.botonJugar.addEventListener("click", () => {
      // Guardar la posición de la página para volver después
      this.posicionPresentacion = window.scrollY;

      this.prepararPartida();

      // Mostrar el juego y desplazar la página hacia arriba
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

    this.jugarOtraVez.addEventListener("click", () => {
      this.prepararPartida();
      this.iniciarPartida();
      this.jugarOtraVez.blur();
    });

    // VOLVER DESDE LA PANTALLA FINAL

    this.volverFinal.addEventListener("click", () => {
      this.volver.click();
    });
  }

  // CREAR MONEDAS Y CORAZONES ENTRE COLUMNAS

  crearColeccionables() {
    // Obtener la zona horizontal disponible
    const zona = this.gestorObstaculos.obtenerZonaLibre();

    if (!zona) return;

    const anchoEscenario = this.escenario.clientWidth;
    const altoEscenario = this.escenario.clientHeight;

    // ELEGIR COLECCIONABLE

    const probabilidad = Math.random();

    let gestor;

    if (probabilidad < 0.5) {
      // 50% de probabilidad de moneda
      gestor = this.gestorMonedas;
    } else if (probabilidad < 0.63) {
      // 13% de probabilidad de corazón
      gestor = this.gestorCorazones;
    } else {
      // 37% de probabilidad de que no aparezca nada
      return;
    }

    // CALCULAR POSICIÓN HORIZONTAL

    // Centrar el coleccionable entre dos parejas de columnas
    const x = anchoEscenario + zona.inicio + (zona.ancho - gestor.TAMANO) / 2;

    // CALCULAR POSICIÓN VERTICAL

    // Elegir una altura aleatoria dejando márgenes
    const margenVertical = 80;

    const alturaDisponible = Math.max(
      0,
      altoEscenario - margenVertical * 2 - (gestor.ALTO || gestor.TAMANO)
    );

    const y = margenVertical + Math.random() * alturaDisponible;

    // Crear la moneda o el corazón
    gestor.crear(x, y);
  }

  // DETECTAR COLISIONES CON MONEDAS

  // Se utiliza la técnica AABB, que comprueba
  // si dos rectángulos se superponen.

  comprobarMonedas() {
    const dragon = this.dragon;

    // Zona de colisión más pequeña que el dibujo
    const margenHorizontal = 25;
    const margenVertical = 22;

    // Calcular los límites del cuerpo del dragón
    const dragonIzquierda = dragon.x + margenHorizontal;
    const dragonDerecha = dragon.x + dragon.ANCHO - margenHorizontal;
    const dragonArriba = dragon.y + margenVertical;
    const dragonAbajo = dragon.y + dragon.ALTO - margenVertical;

    // Revisar todas las monedas del escenario
    this.gestorMonedas.lista = this.gestorMonedas.lista.filter((moneda) => {
      const monedaIzquierda = moneda.x;
      const monedaDerecha = moneda.x + this.gestorMonedas.TAMANO;
      const monedaArriba = moneda.y;
      const monedaAbajo = moneda.y + this.gestorMonedas.ALTO;

      // Comprobar si se superponen los rectángulos
      const colision =
        dragonDerecha > monedaIzquierda &&
        dragonIzquierda < monedaDerecha &&
        dragonAbajo > monedaArriba &&
        dragonArriba < monedaAbajo;

      if (colision) {
        // Sumar los puntos correspondientes a la moneda
        const puntosActuales = Number(this.puntos.textContent);
        this.puntos.textContent = puntosActuales + this.gestorMonedas.VALOR;

        // Eliminar la moneda recogida
        moneda.elemento.remove();

        return false;
      }

      return true;
    });
  }

  // DETECTAR COLISIONES CON CORAZONES

  comprobarCorazones() {
    const dragon = this.dragon;

    // Ajustar la zona de colisión del dragón
    const margen = 15;

    const dragonIzquierda = dragon.x + margen;
    const dragonDerecha = dragon.x + dragon.ANCHO - margen;
    const dragonArriba = dragon.y + margen;
    const dragonAbajo = dragon.y + dragon.ALTO - margen;

    // Revisar todos los corazones del escenario
    this.gestorCorazones.lista = this.gestorCorazones.lista.filter(
      (corazon) => {
        // Comprobar si el dragón toca un corazón
        const colision =
          dragonDerecha > corazon.x &&
          dragonIzquierda < corazon.x + this.gestorCorazones.TAMANO &&
          dragonAbajo > corazon.y &&
          dragonArriba < corazon.y + this.gestorCorazones.TAMANO;

        if (colision) {
          const vidasActuales = Number(this.vidas.textContent);

          // Sumar una vida sin límite máximo
          this.vidas.textContent = vidasActuales + 1;

          // Eliminar el corazón recogido
          corazon.elemento.remove();

          return false;
        }

        return true;
      }
    );
  }

  // DETECTAR COLISIONES CON COLUMNAS

  // Primero se comprueba la coincidencia horizontal.
  // Luego se verifica si el dragón invade el espacio
  // ocupado por la columna superior o inferior.

  comprobarObstaculos() {
    // Evitar recibir daño durante la invulnerabilidad
    if (this.tiempoInvulnerable > 0) return;

    const dragon = this.dragon;

    // Ajustar la zona de colisión al cuerpo del dragón
    const margenHorizontal = 30;
    const margenVertical = 35;

    // Calcular los límites del dragón
    const dragonIzquierda = dragon.x + margenHorizontal;
    const dragonDerecha = dragon.x + dragon.ANCHO - margenHorizontal;
    const dragonArriba = dragon.y + margenVertical;
    const dragonAbajo = dragon.y + dragon.ALTO - margenVertical;

    // Revisar cada pareja de columnas
    for (const obstaculo of this.gestorObstaculos.lista) {
      // Ajustar los límites horizontales de las columnas
      const margenColumna = 8;

      const columnaIzquierda = obstaculo.x + margenColumna;
      const columnaDerecha =
        obstaculo.x + this.gestorObstaculos.ANCHO - margenColumna;

      // Comprobar si coinciden horizontalmente
      const colisionHorizontal =
        dragonDerecha > columnaIzquierda && dragonIzquierda < columnaDerecha;

      if (!colisionHorizontal) continue;

      // Obtener el límite inferior de la columna superior
      const limiteSuperior = parseFloat(obstaculo.superior.style.height);

      // Obtener el límite superior de la columna inferior
      const inicioInferior = parseFloat(obstaculo.inferior.style.top);

      // Comprobar si el dragón toca alguna de las dos columnas
      const tocaSuperior = dragonArriba < limiteSuperior;
      const tocaInferior = dragonAbajo > inicioInferior;

      if (tocaSuperior || tocaInferior) {
        this.recibirDanio();
        return;
      }
    }
  }

  // RESTAR VIDA AL CHOCAR

  recibirDanio() {
    const vidasActuales = Number(this.vidas.textContent);

    if (vidasActuales <= 0) return;

    // Restar una vida
    const vidasRestantes = vidasActuales - 1;

    // Actualizar el contador
    this.vidas.textContent = vidasRestantes;

    // Comprobar si se terminaron las vidas
    if (vidasRestantes === 0) {
      this.terminarPartida();
      return;
    }

    // Activar invulnerabilidad temporal
    this.tiempoInvulnerable = this.DURACION_INVULNERABILIDAD;

    // Mostrar la animación de daño
    this.personajeEl.classList.add("dragon-danado");
  }

  // TERMINAR PARTIDA

  terminarPartida() {
    // Cambiar el estado para detener la partida
    this.estado = "terminado";
    this.juego.dataset.estado = this.estado;

    this.entrada.impulso = false;

    // Mostrar los puntos finales
    this.puntosFinal.textContent = this.puntos.textContent;

    // Mostrar la pantalla de derrota
    this.pantallaFinal.hidden = false;

    // Ocultar el mensaje inicial
    this.mensaje.hidden = true;

    // Ocultar los botones inferiores
    this.comenzar.hidden = true;
    this.reiniciar.hidden = true;
    this.volver.hidden = true;

    // Quitar la animación de daño
    this.personajeEl.classList.remove("dragon-danado");
  }

  // ACTUALIZAR JUEGO

  actualizar(dt) {
    // No actualizar el juego si la partida no está iniciada
    if (this.estado !== "iniciado") return;

    // ACTUALIZAR INVULNERABILIDAD

    if (this.tiempoInvulnerable > 0) {
      this.tiempoInvulnerable -= dt;

      // Quitar la animación cuando termina la invulnerabilidad
      if (this.tiempoInvulnerable <= 0) {
        this.tiempoInvulnerable = 0;
        this.personajeEl.classList.remove("dragon-danado");
      }
    }

    // PROCESAR TECLADO

    if (this.entrada.impulso) {
      this.dragon.impulsar();
      this.entrada.impulso = false;
    }

    // ACTUALIZAR DRAGÓN Y FONDO

    this.dragon.actualizar(dt);
    this.parallax.actualizar(dt);

    // ACTUALIZAR OBSTÁCULOS

    const nuevosObstaculos = this.gestorObstaculos.actualizar(dt);

    // Crear coleccionables según las parejas nuevas
    for (let i = 0; i < nuevosObstaculos; i++) {
      this.crearColeccionables();
    }

    // ACTUALIZAR COLECCIONABLES

    this.gestorCorazones.actualizar(dt);
    this.gestorMonedas.actualizar(dt);

    // COMPROBAR COLISIONES CON COLUMNAS

    this.comprobarObstaculos();

    // No seguir comprobando si terminó la partida
    if (this.estado !== "iniciado") return;

    // COMPROBAR COLISIONES CON COLECCIONABLES

    this.comprobarMonedas();
    this.comprobarCorazones();
  }

  // DIBUJAR JUEGO

  dibujar() {
    // Actualizar visualmente todos los componentes
    this.dragon.dibujar();
    this.parallax.dibujar();
    this.gestorObstaculos.dibujar();
    this.gestorCorazones.dibujar();
    this.gestorMonedas.dibujar();
  }

  // GAME LOOP

  // Bucle principal que actualiza la lógica y dibuja
  // los elementos del videojuego en cada fotograma.

  frame(ahora) {
    // Calcular el tiempo transcurrido entre fotogramas
    // y convertirlo de milisegundos a segundos
    let dt = (ahora - this.anterior) / 1000;
    this.anterior = ahora;

    // Limitar dt a 0.05 segundos para evitar
    // saltos grandes de movimiento
    dt = Math.min(dt, 0.05);

    // Primero actualizar la lógica y después dibujar
    this.actualizar(dt);
    this.dibujar();

    // Solicitar el siguiente fotograma del navegador
    requestAnimationFrame(this.frame);
  }
}
