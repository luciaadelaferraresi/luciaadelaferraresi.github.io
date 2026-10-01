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

  

  fetch('https://vj.interfaces.jima.com.ar/api')
    .then(response => response.json())
    .then(games => {
      
    const contenedor = document.getElementById('juegoAPI');
      let contador= 0;
    games.forEach(game => {
      if (contador<=5) {
      contenedor.innerHTML += `
        <article>
          <div class="imagen-hover">
            <img class="imagen-juego-chica" src="${game.background_image}" alt="${game.name}" />
            <span class="nombre-juego">${game.name}</span>
          </div>
        </article>
      `;
      contador++;
      }
    });
     
  })
  .catch(error => {
    console.error('Error al obtener los juegos:', error);
  });


