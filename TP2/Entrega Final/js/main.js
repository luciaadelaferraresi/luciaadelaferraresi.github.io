const botonSidebar = document.querySelector(".boton-sidebar");
const sidebar = document.querySelector(".sidebar");
botonSidebar.addEventListener("click", function () {
  sidebar.classList.toggle("abierto");
});
const botonPerfil = document.querySelector(".boton-perfil");
const menuPerfil = document.querySelector(".menu-perfil");

if (botonPerfil && menuPerfil) {
  botonPerfil.addEventListener("click", function () {
    menuPerfil.classList.toggle("abierto");
  });
}
