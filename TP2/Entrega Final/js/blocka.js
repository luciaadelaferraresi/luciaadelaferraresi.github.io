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
  const resultado = document.getElementById("blocka-resultado");
  const resultadoTitulo = document.getElementById("blocka-resultado-titulo");
  const resultadoTexto = document.getElementById("blocka-resultado-texto");
  const siguiente = document.getElementById("blocka-siguiente");
  const volver = document.getElementById("blocka-menu");
  const configuracion = document.getElementById("blocka-configuracion");
  const opcionesCantidad = document.querySelectorAll(".blocka-opcion");

  let cantidadElegida = 4; //arreglo con las rutas a los archivos de imagen de los videojuegos que se usaran en los rompecabezas
  const imagenes = [
    "img/gow.jpg",
    "img/hugo.jpg",
    "img/snake.png",
    "img/pacman.jpg",
    "img/sonic.jpeg",
    "img/shovel knight.jpg",
    "img/tetris.jpg",
  ];
  //array con los filtros que se aplicaran al tablero segun el nivel
  const filtros = [
    "grayscale(1)",
    "brightness(130%)",
    "invert(1)",
    "sepia(1)",
    "blur(2px)",
    "saturate(250%)",
  ];
  //array que contiene los nombres de los filtros para mostrarselos al usuario en formato texto legible
  const nombresFiltros = [
    "escala de grises",
    "brillo del 30 %",
    "negativo",
    "sepia",
    "desenfoque",
    "saturación",
  ];
  let filtroActual = 0;
  const tiemposMaximos = [0, 30, 45, 60];
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
  //selecciona una imagen, prepara las piezas, aplica el filtro y reinicia el nivel
  function setupNivel() {
    corriendo = false;
    terminado = false;
    comenzar.hidden = false;
    ayuda.hidden = false;
    ayuda.disabled = true;
    tablero.hidden = false;
    clearInterval(intervalo);
    penalizacion = 0;
    tiempoInicio = 0;
    tiempoTexto.textContent = "00:00";
    nivelTexto.textContent = nivel + 1 + " / 4";
    // En el nivel 4 se selecciona un filtro aleatorio
    filtroActual =
      nivel === 3 ? Math.floor(Math.random() * filtros.length) : nivel;
    imagenActual = elegirImagen();

    // Obtengo la cantidad de piezas elegida
    const cantidad = cantidadElegida;
    // Calculo las columnas y filas
    const columnas = cantidad === 4 ? 2 : cantidad === 6 ? 3 : 4;
    const filas = cantidad / columnas;

    // Creo las piezas con una rotación inicial aleatoria
    piezas = Array.from({ length: cantidad }, (_, i) => ({
      indice: i,
      giro: [90, 180, 270][Math.floor(Math.random() * 3)],
      fija: false,
    }));

    tablero.innerHTML = "";

    // Configuro la distribución del tablero
    tablero.style.gridTemplateColumns =
      "repeat(" + columnas + ", minmax(0, 1fr))";

    tablero.style.gridTemplateRows = "repeat(" + filas + ", minmax(0, 1fr))";

    // Adapto la proporción del tablero a la cantidad de piezas
    tablero.style.aspectRatio = columnas + " / " + filas;

    piezas.forEach((pieza) => {
      const boton = document.createElement("button");

      boton.type = "button";
      boton.className = "blocka-pieza";
      boton.setAttribute(
        "aria-label",
        "Pieza " + (pieza.indice + 1) + ", rotar con clic izquierdo o derecho"
      );

      boton.dataset.indice = pieza.indice;

      // Calculo la posición de cada pieza dentro de la imagen
      const x = pieza.indice % columnas;
      const y = Math.floor(pieza.indice / columnas);

      boton.style.backgroundImage = 'url("' + imagenActual + '")';

      boton.style.backgroundSize = columnas * 100 + "% " + filas * 100 + "%";

      boton.style.backgroundPosition =
        (columnas === 1 ? 0 : (x / (columnas - 1)) * 100) +
        "% " +
        (filas === 1 ? 0 : (y / (filas - 1)) * 100) +
        "%";

      boton.style.filter = filtros[filtroActual];

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

    resultado.hidden = true;

    mensaje.textContent =
      "Nivel " +
      (nivel + 1) +
      ": filtro " +
      nombresFiltros[filtroActual] +
      ". Presioná Comenzar para iniciar el tiempo.";

    siguiente.textContent = nivel === 3 ? "JUGAR DE NUEVO" : "SIGUIENTE NIVEL";
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
    ayuda.disabled = false;
    corriendo = true;
    tiempoInicio = Date.now();
    comenzar.disabled = true;

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
    ayuda.disabled = true;
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
      nivel === 3 ? "¡Completaste Blocka!" : "¡Nivel completado!";
    resultadoTexto.textContent =
      "Tu tiempo en el nivel " +
      (nivel + 1) +
      " fue " +
      formatoTiempo(total) +
      (penalizacion ? ", incluyendo los 5 segundos de ayuda." : ".");

    siguiente.hidden = false;
  }
  function perderNivel() {
    terminado = true;
    corriendo = false;
    ayuda.disabled = true;
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

    configuracion.hidden = false;
    tablero.hidden = true;
    comenzar.hidden = true;
    ayuda.hidden = true;
    resultado.hidden = true;

    mensaje.textContent = "Elegí con cuántas piezas querés jugar.";
  });
  opcionesCantidad.forEach((opcion) => {
    opcion.addEventListener("click", () => {
      cantidadElegida = Number(opcion.dataset.cantidad);

      opcionesCantidad.forEach((boton) => {
        boton.classList.remove("seleccionada");
      });

      opcion.classList.add("seleccionada");

      // Ocultamos la pantalla de elección
      configuracion.hidden = true;

      // Preparamos y mostramos el juego
      setupNivel();

      tablero.hidden = false;
    });
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
  siguiente.addEventListener("click", () => {
    // Si perdió, vuelve a intentar el mismo nivel
    if (terminado && resultadoTitulo.textContent === "¡Tiempo agotado!") {
      setupNivel();
      return;
    }

    // Si completó el nivel 4, vuelve a elegir la cantidad de piezas
    if (nivel === 3 && terminado) {
      nivel = 0;
      juego.querySelector("#blocka-configuracion").hidden = false;
      tablero.hidden = true;
      comenzar.hidden = true;
      ayuda.hidden = true;
      resultado.hidden = true;
      mensaje.textContent = "Elegí con cuántas piezas querés jugar.";
      return;
    }

    // Si completó los niveles 1, 2 o 3, avanza al siguiente
    nivel++;
    setupNivel();
  });
})();
