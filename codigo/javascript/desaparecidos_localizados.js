// Função para carregar os dados da API JSONServer
function loadJSON() {
  fetch('https://bc8bb33f-6175-4214-998c-292c322364a2-00-2ddr60lv3tm7s.worf.replit.dev/animais_perdidos')
    .then(response => response.json())
    .then(data => {
      // Chama a função de filtragem após carregar os dados da API
      filterPets(data);
    })
    .catch(error => console.error('Erro ao carregar os dados:', error));
}

// Função para filtrar os animais perdidos
function filterPets(data) {
  const resultsSection = document.getElementById("results");
  resultsSection.innerHTML = "";

  const selectedStatus = document.querySelector('input[name="status"]:checked')?.value.toLowerCase();
  const selectedTipo = document.querySelector('input[name="tipo"]:checked')?.value.toLowerCase();

  // Filtra os animais perdidos com base no status e tipo selecionados
  const filteredPets = data.filter(pet => pet.status.toLowerCase() === selectedStatus && pet.especie.toLowerCase() === selectedTipo);

  // Exibe os animais perdidos filtrados
  filteredPets.forEach(pet => {
    const content = document.createElement("div");
    content.classList.add("pet-card");

    const petImage = document.createElement("img");
    petImage.src = pet.imagemUrl;

    const box = document.createElement("div");
    box.classList.add("pet-info");

    const h3 = document.createElement("h3");
    h3.textContent = pet.nome;

    // Criando o elemento para exibir a espécie abaixo do nome em forma de strong
    const species = document.createElement("strong");
    species.textContent = "Espécie: " + pet.especie;

    const description = document.createElement("p");
    description.textContent = pet.descricao;

    const address = document.createElement("p");
    address.textContent = pet.endereco;

    // Criando o elemento para exibir o status
    const status = document.createElement("strong");
    status.classList.add("status");
    status.textContent = pet.status;

    content.appendChild(petImage);
    content.appendChild(box);
    h3.appendChild(species); // Adicionando a espécie abaixo do nome
    box.appendChild(h3);
    box.appendChild(address);
    box.appendChild(description);
    box.appendChild(status); // Movendo o status para dentro do elemento "box"

    resultsSection.appendChild(content);
  });
}
// Função para mostrar todos os animais perdidos inicialmente
function showAllPets() {
  fetch('https://bc8bb33f-6175-4214-998c-292c322364a2-00-2ddr60lv3tm7s.worf.replit.dev/animais_perdidos')
    .then(response => response.json())
    .then(data => {
      const resultsSection = document.getElementById("results");
      resultsSection.innerHTML = "";

      // Exibe todos os animais perdidos
      data.forEach(pet => {
        const content = document.createElement("div");
        content.classList.add("pet-card");

        const petImage = document.createElement("img");
        petImage.src = pet.imagemUrl;

        const box = document.createElement("div");
        box.classList.add("pet-info");

        const h3 = document.createElement("h3");
        h3.textContent = pet.nome;

        // Criando o elemento para exibir a espécie abaixo do nome em forma de strong
        const species = document.createElement("strong");
        species.textContent = pet.especie;
        species.style.display = "block"; // Certificando que a espécie esteja em um novo bloco abaixo do nome

        const description = document.createElement("p");
        description.textContent = pet.descricao;

        const address = document.createElement("p");
        address.textContent = pet.endereco;

        // Criando o elemento para exibir o status no canto superior direito
        const status = document.createElement("strong");
        status.classList.add("status");
        status.textContent = pet.status;

        content.appendChild(petImage);
        content.appendChild(box);
        h3.appendChild(species); // Adicionando a espécie abaixo do nome
        box.appendChild(h3);
        box.appendChild(address);
        box.appendChild(description);
        content.appendChild(status); // Movendo o status para fora do box, dentro do content

        resultsSection.appendChild(content);
      });
    })
    .catch(error => console.error('Erro ao carregar os dados:', error));
}

// Chamar a função para mostrar todos os animais perdidos inicialmente
showAllPets();

// Event listener para o botão de filtragem
document.getElementById("btnFiltrar").addEventListener("click", loadJSON);

// Event listener para o menu mobile
document.addEventListener("DOMContentLoaded", function () {
  const menuIcon = document.querySelector(".mobile-menu-icon button");
  const menu = document.querySelector(".menu");

  menuIcon.addEventListener("click", function () {
    menu.classList.toggle("active");
  });

  // Mostra todos os animais perdidos inicialmente ao carregar a página
  showAllPets();
});
