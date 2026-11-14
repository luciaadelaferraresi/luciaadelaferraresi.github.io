import { Dragon } from "./dragon.js";
import { Parallax } from "./parallax.js";

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

    this.puntos.textContent = "0";
    this.vidas.textContent = "3";

    this.obstaculos.replaceChildren();
    this.elementos.replaceChildren();

    this.dragon.reiniciar();
    this.parallax.reiniciar();

    this.entrada.impulso = false;

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

  // ACTUALIZAR JUEGO

  actualizar(dt) {
    if (this.estado !== "iniciado") return;

    // Procesar entrada del teclado
    if (this.entrada.impulso) {
      this.dragon.impulsar();
      this.entrada.impulso = false;
    }

    // Actualizar componentes
    this.dragon.actualizar(dt);
    this.parallax.actualizar(dt);
  }

  // DIBUJAR JUEGO

  dibujar() {
    this.dragon.dibujar();
    this.parallax.dibujar();
  }

  // GAME LOOP

  frame(ahora) {
    let dt = (ahora - this.anterior) / 1000;
    this.anterior = ahora;

    dt = Math.min(dt, 0.05);

    this.actualizar(dt);
    this.dibujar();

    requestAnimationFrame(this.frame);
  }
}
