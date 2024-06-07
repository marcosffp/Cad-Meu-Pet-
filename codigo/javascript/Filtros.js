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
    const span = document.createElement("span");
    span.textContent = pet.nome;

    const description = document.createElement("p");
    description.textContent = pet.descricao;

    const address = document.createElement("p");
    address.textContent = pet.endereco;

    const status = document.createElement("p");
    const strong = document.createElement("strong");
    strong.textContent = pet.especie;

    content.append(petImage, box);
    h3.appendChild(span);
    status.appendChild(strong);
    box.append(h3, address, description, status);
    resultsSection.append(content);
  });
}

// Função para mostrar todos os animais perdidos inicialmente
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
        const span = document.createElement("span");
        span.textContent = pet.nome;

        const description = document.createElement("p");
        description.textContent = pet.descricao;

        const address = document.createElement("p");
        address.textContent = pet.endereco;

        // Criando o elemento para exibir a espécie
        const species = document.createElement("p");
        species.textContent = "Espécie: " + pet.especie; // Adicionando "Espécie: " antes da espécie

        // Movendo o status para dentro do elemento "box"
        const status = document.createElement("p");
        status.textContent = "Status: " + pet.status; // Adicionando "Status: " antes do status

        content.append(petImage, box);
        h3.appendChild(span);
        box.append(h3, species, address, description, status); // Adicionando a espécie e o status à caixa de informações
        resultsSection.append(content);
      });
    })
    .catch(error => console.error('Erro ao carregar os dados:', error));
}


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
