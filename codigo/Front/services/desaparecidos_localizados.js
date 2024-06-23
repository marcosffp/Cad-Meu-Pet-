const apiUrl = "https://bc8bb33f-6175-4214-998c-292c322364a2-00-2ddr60lv3tm7s.worf.replit.dev/animais_perdidos";
const usersApiUrl = "https://bc8bb33f-6175-4214-998c-292c322364a2-00-2ddr60lv3tm7s.worf.replit.dev/users";

document.addEventListener("DOMContentLoaded", function () {
  const menuIcon = document.querySelector(".mobile-menu-icon button");
  const menu = document.querySelector(".menu");

  menuIcon.addEventListener("click", function () {
    menu.classList.toggle("active");
  });

  loadAndDisplayPets();
  init();
  updateCadastroButton();

  document.getElementById('Anunciar').addEventListener('click', verificarLogin);
  document.getElementById('Cadastrar').addEventListener('click', verificarLogin);
  document.querySelector('.butao-perdi a').addEventListener('click', verificarLogin);
  document.querySelector('.butao-achei a').addEventListener('click', verificarLogin);
  document.querySelector('.criar-relato a').addEventListener('click', verificarLogin);
  document.querySelector('.criar-relato:nth-child(2) a').addEventListener('click', verificarLogin);
});

document.getElementById("btnFiltrar").addEventListener("click", () => {
  const selectedStatus = document.querySelector('input[name="status"]:checked')?.value;
  const selectedTipo = document.querySelector('input[name="tipo"]:checked')?.value;
  const localizacao = document.getElementById('inputLocalizacao').value;
  loadAndDisplayPets(selectedStatus, selectedTipo, localizacao);
});


document.getElementById("btnResetar").addEventListener("click", () => {
  document.querySelectorAll('input[name="status"]').forEach((input) => (input.checked = false));
  document.querySelectorAll('input[name="tipo"]').forEach((input) => (input.checked = false));
  loadAndDisplayPets();
});


async function loadAndDisplayPets(filterStatus = null, filterTipo = null, filterLocalizacao = null) {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    const resultsSection = document.getElementById("results");
    resultsSection.innerHTML = "";
    const filteredPets = data.filter(
      (pet) =>
        (!filterStatus || pet.status.toLowerCase() === filterStatus.toLowerCase()) &&
        (!filterTipo || pet.especie.toLowerCase() === filterTipo.toLowerCase()) &&
        (!filterLocalizacao || pet.endereco.toLowerCase().includes(filterLocalizacao.toLowerCase()))
    );
    const userId = parseInt(localStorage.getItem('userId'));
    filteredPets.forEach((pet) => {
      const content = document.createElement("div");
      content.classList.add("pet-card");
      content.setAttribute("data-id", pet.id);

      const petImage = document.createElement("img");
      petImage.src = pet.imagemUrl;
      petImage.alt = `Imagem de ${pet.nome}`;

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

      const contacts = document.createElement("strong");
      contacts.textContent = "Contatos: " + pet.contatos;

      box.appendChild(h3);
      box.appendChild(species);
      box.appendChild(address);
      box.appendChild(description);
      box.appendChild(contacts);
      box.appendChild(status);
      content.appendChild(petImage);
      content.appendChild(box);
      resultsSection.appendChild(content);
    });
  } catch (error) {
    console.error("Erro ao carregar os dados:", error);
  }
}





async function verificarLogin(event) {
  const user = sessionStorage.getItem('userName') || localStorage.getItem('userName');
  if (!user) {
    event.preventDefault();
    window.location.href = '../html/cadastro_usuario.html';
  }
}

function displayMessage(message) {
  console.log(message);
}

function init() {
}



