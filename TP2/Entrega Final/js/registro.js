const botonIniciar = document.querySelector(".boton-iniciar");

if (botonIniciar) {
  botonIniciar.addEventListener("click", function () {
    window.location.href = "iniciarSesion.html";
  });
}

const formulario = document.querySelector("form");

const nombre = document.getElementById("nombre");
const nickname = document.getElementById("nickname");
const edad = document.getElementById("edad");
const email = document.getElementById("email");
const contrasena = document.getElementById("contrasena");
const repetirContrasena = document.getElementById("repetir-contrasena");

const errorNombre = document.getElementById("error-nombre");
const errorNickname = document.getElementById("error-nickname");
const errorEdad = document.getElementById("error-edad");
const errorEmail = document.getElementById("error-email");
const errorContrasena = document.getElementById("error-contrasena");
const errorRepetirContrasena = document.getElementById(
  "error-repetir-contrasena"
);
formulario.addEventListener("submit", function (event) {
  event.preventDefault();

  errorNombre.textContent = "";
  errorNickname.textContent = "";
  errorEdad.textContent = "";
  errorEmail.textContent = "";
  errorContrasena.textContent = "";
  errorRepetirContrasena.textContent = "";

  let formularioValido = true;

  if (nombre.value.trim() === "") {
    errorNombre.textContent = "Ingrese su nombre.";
    formularioValido = false;
  }

  if (nickname.value.trim() === "") {
    errorNickname.textContent = "Ingrese un nickname.";
    formularioValido = false;
  }

  if (edad.value.trim() === "") {
    errorEdad.textContent = "Ingrese su edad";
    formularioValido = false;
  } else if (Number(edad.value) < 1 || Number(edad.value) > 120) {
    errorEdad.textContent = "Ingrese una edad válida.";
    formularioValido = false;
  }

  if (email.value.trim() === "") {
    errorEmail.textContent = "Ingrese su email.";
    formularioValido = false;
  } else if (!email.validity.valid) {
    errorEmail.textContent = "Ingrese un email válido.";
    formularioValido = false;
  }

  if (contrasena.value === "") {
    errorContrasena.textContent = "Ingrese una contraseña.";
    formularioValido = false;
  } else if (contrasena.value.length < 8) {
    errorContrasena.textContent =
      "La contraseña debe tener al menos 8 caracteres.";
    formularioValido = false;
  } else if (!/[A-Z]/.test(contrasena.value)) {
    errorContrasena.textContent =
      "La contraseña debe tener al menos una mayúscula.";
    formularioValido = false;
  }

  if (repetirContrasena.value === "") {
    errorRepetirContrasena.textContent = "Repita su contraseña.";
    formularioValido = false;
  } else if (repetirContrasena.value !== contrasena.value) {
    errorRepetirContrasena.textContent = "Las contraseñas no coinciden.";
    formularioValido = false;
  }

  if (!formularioValido) {
    return;
  }

  const mensaje = document.getElementById("mensaje-exito");

  if (mensaje) {
    mensaje.classList.add("animar");

    setTimeout(function () {
      window.location.href = "home.html";
    }, 2000);
  }
});
