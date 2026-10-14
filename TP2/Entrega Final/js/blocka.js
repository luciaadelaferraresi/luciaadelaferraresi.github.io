(function () {
  //guardo en constantes las 3 secciones ppales del HTML mediante su ID
  const portada = document.getElementById("blocka-portada");
  const juego = document.getElementById("blocka-juego");
  const entrar = document.getElementById("boton-entrar-blocka");
  if (!portada || !juego || !entrar) return; //control de errores defensivo: el script se detiene si alguna de estas tres pantallas no existe en el HTML
  //captura del resto de componentes interactivos del HTML
  const tablero = document.getElementById("blocka-tablero");
  const nivelTexto = document.getElementById("blocka-nivel");
  const tiempoTexto = document.getElementById("blocka-tiempo");
  const mensaje = document.getElementById("blocka-mensaje");
  const comenzar = document.getElementById("blocka-comenzar");
  const ayuda = document.getElementById("blocka-ayuda");
  const instrucciones = document.getElementById("blocka-instrucciones");
  const ayudaTexto = document.getElementById("blocka-ayuda-texto");
  const resultado = document.getElementById("blocka-resultado");
  const resultadoTitulo = document.getElementById("blocka-resultado-titulo");
  const resultadoTexto = document.getElementById("blocka-resultado-texto");
  const siguiente = document.getElementById("blocka-siguiente");
  const volver = document.getElementById("blocka-menu");
  //arreglo con las rutas a los archivos de imagen de los videojuegos que se usaran en los rompecabezas
  const imagenes = [
    "img/blockaPacman.jpeg",
    "img/blockaShovel.jpeg",
    "img/blockaSonic.jpeg",
    "img/blockaTetris.jpeg",
    "img/pacman.jpg",
    "img/sonic.jpeg",
    "img/shovel knight.jpg",
    "img/tetris.jpg",
  ];
  //array con los filtros que se aplicaran al tablero segun el nivel
  const filtros = ["grayscale(1)", "brightness(130%)", "invert(1)"];
  //array que contiene los nombres de los filtros para mostrarselos al usuario en formato texto legible
  const nombresFiltros = ["escala de grises", "brillo del 30 %", "negativo"];
  const tiemposMaximos = [0, 30, 45];
  let nivel = 0;
  let piezas = [];
  let corriendo = false;
  let terminado = false;
  let tiempoInicio = 0;
  let penalizacion = 0;
  let intervalo = null;
  let imagenActual = "";
  let usados = [];

  function formatoTiempo(segundos) {
    const total = Math.max(0, Math.floor(segundos));
    return (
      String(Math.floor(total / 60)).padStart(2, "0") +
      ":" +
      String(total % 60).padStart(2, "0")
    );
  }
  function tiempoTranscurrido() {
    return (Date.now() - tiempoInicio) / 1000 + penalizacion;
  }
  function actualizarTiempo() {
    if (corriendo)
      tiempoTexto.textContent = formatoTiempo(tiempoTranscurrido());
  }
  //elige aleatoriamente entre las imagenes disponibles e intenta evitar repeticiones consecutivas
  function elegirImagen() {
    const disponibles = imagenes.filter((src) => !usados.includes(src));
    if (disponibles.length === 0) usados = [];
    const lista = imagenes.filter((src) => !usados.includes(src));
    const elegida = lista[Math.floor(Math.random() * lista.length)];
    usados.push(elegida);
    return elegida;
  }
  //selecciona una imagen, prepara las cuatro piezas, aplica el filtro y reinicia el nivel
  function setupNivel() {
    corriendo = false;
    terminado = false;
    clearInterval(intervalo);
    penalizacion = 0;
    tiempoInicio = 0;
    tiempoTexto.textContent = "00:00";
    nivelTexto.textContent = nivel + 1 + " / 3";
    imagenActual = elegirImagen();
    piezas = Array.from({ length: 4 }, (_, i) => ({
      indice: i,
      giro: [90, 180, 270][Math.floor(Math.random() * 3)],
      fija: false,
    }));
    tablero.innerHTML = "";
    piezas.forEach((pieza) => {
      const boton = document.createElement("button");
      boton.type = "button";
      boton.className = "blocka-pieza";
      boton.setAttribute(
        "aria-label",
        "Pieza " + (pieza.indice + 1) + ", rotar con clic izquierdo o derecho"
      );
      boton.dataset.indice = pieza.indice;
      const x = pieza.indice % 2;
      const y = Math.floor(pieza.indice / 2);
      boton.style.backgroundImage = 'url("' + imagenActual + '")';
      boton.style.backgroundSize = "200% 200%";
      boton.style.backgroundPosition =
        (x === 0 ? "left" : "right") + " " + (y === 0 ? "top" : "bottom");
      boton.style.filter = filtros[nivel];
      boton.addEventListener("click", () => rotar(pieza.indice, -90));
      boton.addEventListener("contextmenu", (evento) => {
        evento.preventDefault();
        rotar(pieza.indice, 90);
      });
      tablero.appendChild(boton);
      actualizarPieza(pieza);
    });
    comenzar.hidden = false;
    comenzar.disabled = false;
    comenzar.textContent = "COMENZAR";
    ayuda.disabled = true;
    resultado.hidden = true;
    ayudaTexto.hidden = true;
    mensaje.textContent =
      "Nivel " +
      (nivel + 1) +
      ": filtro " +
      nombresFiltros[nivel] +
      ". Presioná Comenzar para iniciar el tiempo.";
    siguiente.textContent = nivel === 2 ? "JUGAR DE NUEVO" : "SIGUIENTE NIVEL";
    siguiente.hidden = false;
  }
  function actualizarPieza(pieza) {
    const boton = tablero.querySelector('[data-indice="' + pieza.indice + '"]');
    if (!boton) return;
    boton.style.transform = "rotate(" + pieza.giro + "deg)";
    boton.disabled = pieza.fija || terminado;
    boton.classList.toggle("fija", pieza.fija);
    if (pieza.fija)
      boton.setAttribute(
        "aria-label",
        "Pieza " + (pieza.indice + 1) + " fija y resuelta"
      );
  }
  //cambia la orientacion de una pieza en 90 grados y comprueba si se resolvio el tablero
  function rotar(indice, delta) {
    if (!corriendo || terminado) return;
    const pieza = piezas[indice];
    if (pieza.fija) return;
    pieza.giro = (pieza.giro + delta + 360) % 360;
    actualizarPieza(pieza);
    if (piezas.every((p) => p.giro === 0)) ganarNivel();
  }
  function iniciar() {
    if (corriendo || terminado) return;

    corriendo = true;
    tiempoInicio = Date.now();
    comenzar.disabled = true;
    ayuda.disabled = false;

    if (tiemposMaximos[nivel] > 0) {
      mensaje.textContent =
        "¡A jugar! Tenés " +
        tiemposMaximos[nivel] +
        " segundos para resolver el nivel.";
    } else {
      mensaje.textContent =
        "¡A jugar! Clic izquierdo: izquierda · clic derecho: derecha.";
    }
    intervalo = setInterval(() => {
      actualizarTiempo();
      if (
        tiemposMaximos[nivel] > 0 &&
        tiempoTranscurrido() >= tiemposMaximos[nivel]
      ) {
        perderNivel();
      }
    }, 250);
  }
  //detiene el tiempo, saca los filtros y muestra las opciones de finalizacion
  function ganarNivel() {
    terminado = true;
    corriendo = false;
    clearInterval(intervalo);
    const total = tiempoTranscurrido();
    tiempoTexto.textContent = formatoTiempo(total);
    tablero.querySelectorAll(".blocka-pieza").forEach((boton) => {
      boton.style.filter = "none";
      boton.disabled = true;
    });
    mensaje.textContent = "¡Imagen reconstruida correctamente!";
    comenzar.hidden = true;
    ayuda.disabled = true;
    resultado.hidden = false;
    resultadoTitulo.textContent =
      nivel === 2 ? "¡Completaste Blocka!" : "¡Nivel completado!";
    resultadoTexto.textContent =
      "Tu tiempo en el nivel " +
      (nivel + 1) +
      " fue " +
      formatoTiempo(total) +
      (penalizacion ? ", incluyendo los 5 segundos de ayuda." : ".");
    siguiente.textContent = nivel === 2 ? "JUGAR DE NUEVO" : "SIGUIENTE NIVEL";
    siguiente.hidden = false;
  }
  function perderNivel() {
    terminado = true;
    corriendo = false;
    clearInterval(intervalo);
    tiempoTexto.textContent = formatoTiempo(tiemposMaximos[nivel]);
    tablero.querySelectorAll(".blocka-pieza").forEach((boton) => {
      boton.disabled = true;
    });
    mensaje.textContent = "Se acabó el tiempo. ¡Perdiste el nivel!";
    comenzar.hidden = true;
    ayuda.disabled = true;

    resultado.hidden = false;
    resultadoTitulo.textContent = "¡Tiempo agotado!";
    resultadoTexto.textContent =
      "No lograste resolver la Blocka dentro del tiempo límite.";

    siguiente.textContent = "VOLVER A INTENTAR";
    siguiente.hidden = false;
  }

  entrar.addEventListener("click", () => {
    portada.hidden = true;
    juego.hidden = false;
    setupNivel();
  });
  comenzar.addEventListener("click", iniciar);
  ayuda.addEventListener("click", () => {
    if (!corriendo || terminado) return;
    const pieza = piezas.find((p) => !p.fija && p.giro !== 0);
    if (!pieza) return;
    pieza.giro = 0;
    pieza.fija = true;
    penalizacion += 5;
    actualizarPieza(pieza);
    actualizarTiempo();
    ayuda.disabled = true;
    mensaje.textContent =
      "¡Ayudita utilizada! Se fijó una pieza y se sumaron 5 segundos.";
    if (piezas.every((p) => p.giro === 0)) ganarNivel();
  });
  instrucciones.addEventListener("click", () => {
    ayudaTexto.hidden = !ayudaTexto.hidden;
  });
  siguiente.addEventListener("click", () => {
    if (terminado && resultadoTitulo.textContent === "¡Tiempo agotado!") {
      setupNivel();
      return;
    }
    nivel = nivel === 2 ? 0 : nivel + 1;
    setupNivel();
  });
  volver.addEventListener("click", () => {
    clearInterval(intervalo);
    corriendo = false;
    juego.hidden = true;
    portada.hidden = false;
  });
})();
