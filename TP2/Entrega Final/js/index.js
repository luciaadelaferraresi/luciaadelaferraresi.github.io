document.addEventListener("DOMContentLoaded", function () {
  let porcentaje = 0;
  const loading = document.getElementById("loading");
  const textoPorcentaje = document.getElementById("loading-porcentaje");

  const intervalo = setInterval(function () {
    porcentaje++;
    textoPorcentaje.textContent = porcentaje + "%";

    if (porcentaje >= 100) {
      clearInterval(intervalo);

      setTimeout(function () {
        loading.style.display = "none";
      }, 100);
    }
  }, 50);
});
