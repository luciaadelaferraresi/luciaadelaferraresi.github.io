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
      !this.personajeEl
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

    // Mostrar pantalla inicial
    this.mensaje.hidden = false;
    this.comenzar.hidden = false;
    this.reiniciar.hidden = true;
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
      this.reiniciar.focus({ preventScroll: true });
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
    } else if (probabilidad < 0.58) {
      // 8% de probabilidad de corazón
      gestor = this.gestorCorazones;
    } else {
      // En este espacio no aparece nada
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

    // Usamos una zona de colisión un poco menor
    // que el dibujo del dragón.
    const margen = 15;

    const dragonIzquierda = dragon.x + margen;
    const dragonDerecha = dragon.x + dragon.ANCHO - margen;
    const dragonArriba = dragon.y + margen;
    const dragonAbajo = dragon.y + dragon.ALTO - margen;

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

  // ACTUALIZAR JUEGO

  actualizar(dt) {
    if (this.estado !== "iniciado") return;

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
    this.comprobarMonedas();
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
