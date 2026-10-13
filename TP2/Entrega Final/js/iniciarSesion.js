const botonRegistro = document.querySelector(".boton-registro-cuenta");

if (botonRegistro) {
  botonRegistro.addEventListener("click", function () {
    window.location.href = "registro.html";
  });
}
const formulario = document.querySelector("form");

const email = document.getElementById("email");
const contrasena = document.getElementById("contrasena");

const errorEmail = document.getElementById("error-email");
const errorContrasena = document.getElementById("error-contrasena");

formulario.addEventListener("submit", function (event) {
  event.preventDefault();

  errorEmail.textContent = "";
  errorContrasena.textContent = "";

  let formularioValido = true;

  if (email.value.trim() === "") {
    errorEmail.textContent = "Ingrese su email.";
    formularioValido = false;
  } else if (!email.validity.valid) {
    errorEmail.textContent = "Ingrese un email válido.";
    formularioValido = false;
  }

  if (contrasena.value.trim() === "") {
    errorContrasena.textContent = "Ingrese su contraseña.";
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
