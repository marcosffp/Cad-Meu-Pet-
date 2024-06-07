const apiUrl = "http://localhost:3000/animais_perdidos";

document.addEventListener("DOMContentLoaded", function () {
  const menuIcon = document.querySelector(".mobile-menu-icon button");
  const menu = document.querySelector(".menu");

  menuIcon.addEventListener("click", function () {
    menu.classList.toggle("active");
  });

  // Mostra todos os animais perdidos inicialmente ao carregar a página
  loadAndDisplayPets();
});

function loadAndDisplayPets(filterStatus = null, filterTipo = null) {
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      const resultsSection = document.getElementById("results");
      resultsSection.innerHTML = "";

      // Filtra os animais perdidos com base nos filtros fornecidos
      const filteredPets = data.filter(
        (pet) =>
          (!filterStatus ||
            pet.status.toLowerCase() === filterStatus.toLowerCase()) &&
          (!filterTipo ||
            pet.especie.toLowerCase() === filterTipo.toLowerCase())
      );

      // Exibe os animais perdidos filtrados
      filteredPets.forEach((pet) => {
        const content = document.createElement("div");
        content.classList.add("pet-card");

        const petImage = document.createElement("img");
        petImage.src = pet.imagemUrl;

        const box = document.createElement("div");
        box.classList.add("pet-info");

        const h3 = document.createElement("h3");
        h3.textContent = pet.nome;

        const species = document.createElement("strong");
        species.textContent = pet.especie;

        const description = document.createElement("p");
        description.textContent = pet.descricao;

        const address = document.createElement("p");
        address.textContent = pet.endereco;

        const status = document.createElement("strong");
        status.classList.add("status");
        status.textContent = pet.status;

        content.appendChild(petImage);
        content.appendChild(box);
        box.appendChild(h3); // Adicionando o nome no elemento "h3"
        box.appendChild(species); // Adicionando a espécie no elemento "box"
        box.appendChild(address);
        box.appendChild(description);
        content.appendChild(status); // Movendo o status para fora do box, dentro do content

        resultsSection.appendChild(content);
      });
    })
    .catch((error) => console.error("Erro ao carregar os dados:", error));
}

// Event listener para o botão de filtragem
document.getElementById("btnFiltrar").addEventListener("click", () => {
  const selectedStatus = document.querySelector(
    'input[name="status"]:checked'
  )?.value;
  const selectedTipo = document.querySelector(
    'input[name="tipo"]:checked'
  )?.value;
  loadAndDisplayPets(selectedStatus, selectedTipo);
});

// Event listener para o botão de resetar filtros
document.getElementById("btnResetar").addEventListener("click", () => {
  document
    .querySelectorAll('input[name="status"]')
    .forEach((input) => (input.checked = false));
  document
    .querySelectorAll('input[name="tipo"]')
    .forEach((input) => (input.checked = false));
  loadAndDisplayPets();
});
