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

    this.botonJugar = document.getElementById("boton-entrar-dragon");
    this.comenzar = document.getElementById("dragon-comenzar");
    this.reiniciar = document.getElementById("dragon-reiniciar");
    this.volver = document.getElementById("dragon-volver");

    this.mensaje = document.getElementById("dragon-mensaje");
    this.puntos = document.getElementById("dragon-puntos");
    this.vidas = document.getElementById("dragon-vidas");

    // PANTALLA FINAL
    this.pantallaFinal = document.getElementById("dragon-pantalla-final");
    this.puntosFinal = document.getElementById("dragon-puntos-final");
    this.jugarOtraVez = document.getElementById("dragon-jugar-otra-vez");
    this.volverFinal = document.getElementById("dragon-volver-final");

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

    this.dragon = new Dragon(this.personajeEl, this.escenario);

    this.parallax = new Parallax(this.escenario);

    this.gestorObstaculos = new Obstaculos(this.obstaculos, this.escenario);

    // Los coleccionables usan la misma velocidad
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

    this.estado = "inactivo";
    // CONTROL DE DAÑO
    this.tiempoInvulnerable = 0;
    this.DURACION_INVULNERABILIDAD = 1.5;

    this.entrada = {
      impulso: false,
    };

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
    this.estado = "preparado";
    this.juego.dataset.estado = this.estado;
    this.pantallaFinal.hidden = true;
    // Reiniciar puntos y vidas
    this.puntos.textContent = "0";
    this.vidas.textContent = "3";

    // Limpiar elementos del escenario
    this.obstaculos.replaceChildren();
    this.elementos.replaceChildren();

    // Reiniciar componentes
    this.dragon.reiniciar();
    this.parallax.reiniciar();
    this.gestorObstaculos.reiniciar();
    this.gestorCorazones.reiniciar();
    this.gestorMonedas.reiniciar();

    this.entrada.impulso = false;
    this.tiempoInvulnerable = 0;
    this.personajeEl.classList.remove("dragon-danado");

    this.mensaje.hidden = false;
    this.comenzar.hidden = false;
    this.reiniciar.hidden = true;
    this.volver.hidden = false;
  }

  // INICIAR PARTIDA

  iniciarPartida() {
    this.estado = "iniciado";
    this.juego.dataset.estado = this.estado;

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
      if (e.code !== "Space" || e.repeat) return;
      if (this.estado !== "iniciado") return;

      e.preventDefault();
      this.entrada.impulso = true;
    });

    // BOTÓN JUGAR

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

    this.reiniciar.addEventListener("click", () => {
      this.prepararPartida();
      this.comenzar.focus({ preventScroll: true });
    });

    // BOTÓN VOLVER

    this.volver.addEventListener("click", () => {
      this.prepararPartida();

      this.estado = "inactivo";
      this.juego.dataset.estado = this.estado;

      this.zonaJuego.hidden = true;
      document.body.classList.remove("partida-activa");

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
    const zona = this.gestorObstaculos.obtenerZonaLibre();

    if (!zona) return;

    const anchoEscenario = this.escenario.clientWidth;
    const altoEscenario = this.escenario.clientHeight;

    // Elegir qué objeto aparecerá
    const probabilidad = Math.random();

    let gestor;

    if (probabilidad < 0.5) {
      // 50% de probabilidad de moneda
      gestor = this.gestorMonedas;
    } else if (probabilidad < 0.63) {
      // 13% de probabilidad de corazón
      gestor = this.gestorCorazones;
    } else {
      // No aparece ningún coleccionable
      return;
    }
    // Centrar horizontalmente el coleccionable
    // entre las dos parejas de columnas.
    const x = anchoEscenario + zona.inicio + (zona.ancho - gestor.TAMANO) / 2;

    // Elegir una altura dentro del escenario
    const margenVertical = 80;

    const alturaDisponible = Math.max(
      0,
      altoEscenario - margenVertical * 2 - (gestor.ALTO || gestor.TAMANO)
    );

    const y = margenVertical + Math.random() * alturaDisponible;

    // Crear moneda o corazón
    gestor.crear(x, y);
  }

  // DETECTAR COLISIONES CON MONEDAS

  comprobarMonedas() {
    const dragon = this.dragon;

    // Zona de colisión más pequeña que el dibujo
    const margenHorizontal = 25;
    const margenVertical = 22;

    // Límites del cuerpo del dragón
    const dragonIzquierda = dragon.x + margenHorizontal;
    const dragonDerecha = dragon.x + dragon.ANCHO - margenHorizontal;
    const dragonArriba = dragon.y + margenVertical;
    const dragonAbajo = dragon.y + dragon.ALTO - margenVertical;

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
        // Sumar puntos
        const puntosActuales = Number(this.puntos.textContent);
        this.puntos.textContent = puntosActuales + this.gestorMonedas.VALOR;

        // Eliminar moneda recogida
        moneda.elemento.remove();

        return false;
      }

      return true;
    });
  }

  comprobarCorazones() {
    const dragon = this.dragon;
    const margen = 15;

    const dragonIzquierda = dragon.x + margen;
    const dragonDerecha = dragon.x + dragon.ANCHO - margen;
    const dragonArriba = dragon.y + margen;
    const dragonAbajo = dragon.y + dragon.ALTO - margen;

    this.gestorCorazones.lista = this.gestorCorazones.lista.filter(
      (corazon) => {
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

  comprobarObstaculos() {
    // Si el dragón es invulnerable, no recibe daño
    if (this.tiempoInvulnerable > 0) return;

    const dragon = this.dragon;

    // Zona de colisión ajustada al cuerpo del dragón
    const margenHorizontal = 30;
    const margenVertical = 35;

    // Límites del dragón
    const dragonIzquierda = dragon.x + margenHorizontal;
    const dragonDerecha = dragon.x + dragon.ANCHO - margenHorizontal;
    const dragonArriba = dragon.y + margenVertical;
    const dragonAbajo = dragon.y + dragon.ALTO - margenVertical;

    // Revisar cada pareja de columnas
    for (const obstaculo of this.gestorObstaculos.lista) {
      // Ajustar la colisión al dibujo de las columnas
      const margenColumna = 8;

      const columnaIzquierda = obstaculo.x + margenColumna;
      const columnaDerecha =
        obstaculo.x + this.gestorObstaculos.ANCHO - margenColumna;

      // Comprobar si coinciden horizontalmente
      const colisionHorizontal =
        dragonDerecha > columnaIzquierda && dragonIzquierda < columnaDerecha;

      if (!colisionHorizontal) continue;

      // Altura de la columna superior
      const limiteSuperior = parseFloat(obstaculo.superior.style.height);

      // Inicio de la columna inferior
      const inicioInferior = parseFloat(obstaculo.inferior.style.top);

      // Comprobar si toca alguna columna
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

    const vidasRestantes = vidasActuales - 1;

    // Actualizar contador
    this.vidas.textContent = vidasRestantes;

    // Comprobar derrota
    if (vidasRestantes === 0) {
      this.terminarPartida();
      return;
    }

    // Activar invulnerabilidad
    this.tiempoInvulnerable = this.DURACION_INVULNERABILIDAD;

    // Mostrar animación de daño
    this.personajeEl.classList.add("dragon-danado");
  }

  // TERMINAR PARTIDA

  // TERMINAR PARTIDA

  // TERMINAR PARTIDA

  terminarPartida() {
    this.estado = "terminado";
    this.juego.dataset.estado = this.estado;

    this.entrada.impulso = false;

    // Mostrar puntos finales
    this.puntosFinal.textContent = this.puntos.textContent;

    // Mostrar pantalla de derrota
    this.pantallaFinal.hidden = false;

    // Ocultar mensaje inicial
    this.mensaje.hidden = true;

    // Ocultar TODOS los botones inferiores
    this.comenzar.hidden = true;
    this.reiniciar.hidden = true;
    this.volver.hidden = true;

    // Quitar animación de daño
    this.personajeEl.classList.remove("dragon-danado");
  }

  // ACTUALIZAR JUEGO

  actualizar(dt) {
    if (this.estado !== "iniciado") return;
    // ACTUALIZAR INVULNERABILIDAD

    if (this.tiempoInvulnerable > 0) {
      this.tiempoInvulnerable -= dt;

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

    // Crear coleccionables en las zonas libres
    for (let i = 0; i < nuevosObstaculos; i++) {
      this.crearColeccionables();
    }

    // ACTUALIZAR COLECCIONABLES

    this.gestorCorazones.actualizar(dt);
    this.gestorMonedas.actualizar(dt);

    // COMPROBAR COLISIONES
    this.comprobarObstaculos();

    // Si perdió, no seguir comprobando coleccionables
    if (this.estado !== "iniciado") return;

    this.comprobarMonedas();
    this.comprobarCorazones();
  }

  // DIBUJAR JUEGO

  dibujar() {
    this.dragon.dibujar();
    this.parallax.dibujar();
    this.gestorObstaculos.dibujar();
    this.gestorCorazones.dibujar();
    this.gestorMonedas.dibujar();
  }

  // GAME LOOP

  frame(ahora) {
    let dt = (ahora - this.anterior) / 1000;
    this.anterior = ahora;

    // Evitar saltos grandes de movimiento
    dt = Math.min(dt, 0.05);

    // Primero actualizar, después dibujar
    this.actualizar(dt);
    this.dibujar();

    requestAnimationFrame(this.frame);
  }
}
