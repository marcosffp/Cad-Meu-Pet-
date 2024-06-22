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

document.getElementById("editForm").addEventListener("submit", function (event) {
  event.preventDefault();
  const id = document.getElementById("editId").value;
  const relato = {
    status: document.getElementById("status").value,
    especie: document.getElementById("especie").value,
    genero: document.getElementById("genero").value,
    nome: document.getElementById("nome").value,
    endereco: document.getElementById("endereco").value,
    contatos: document.getElementById("contatos").value,
    descricao: document.getElementById("descricao").value,
    imagemUrl: document.getElementById("imagemUrl").value
  };
  updatePet(id, relato);
});

async function loadAndDisplayPets(filterStatus = null, filterTipo = null, filterLocalizacao = null) {
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      const resultsSection = document.getElementById("results");
      const userId = parseInt(localStorage.getItem('userId'));
      
      // Filtra os pets conforme os filtros fornecidos
      let filteredPets = data;
      if (filterStatus) {
        filteredPets = filteredPets.filter(pet => pet.status === filterStatus);
      }
      if (filterTipo) {
        filteredPets = filteredPets.filter(pet => pet.especie === filterTipo);
      }
      if (filterLocalizacao) {
        filteredPets = filteredPets.filter(pet => pet.endereco.includes(filterLocalizacao));
      }
  
      resultsSection.innerHTML = "";  // Limpa os resultados anteriores
  
      filteredPets.forEach((pet) => {
        if (pet.userId === userId) {  // Verifica se o pet pertence ao usuário logado
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
  
          const editDeleteContainer = document.createElement("div");
          editDeleteContainer.classList.add("edit-delete-container");
  
          const editButton = document.createElement("button");
          editButton.setAttribute("type", "button");
          editButton.classList.add("btn", "btn-custom-green");
          editButton.setAttribute("data-bs-toggle", "modal");
          editButton.setAttribute("data-bs-target", "#editModal");
          editButton.textContent = "Editar";
          editButton.addEventListener("click", function () {
            document.getElementById("editId").value = pet.id;
            document.getElementById("status").value = pet.status;
            document.getElementById("especie").value = pet.especie;
            document.getElementById("genero").value = pet.genero;
            document.getElementById("nome").value = pet.nome;
            document.getElementById("endereco").value = pet.endereco;
            document.getElementById("contatos").value = pet.contatos;
            document.getElementById("descricao").value = pet.descricao;
            document.getElementById("imagemUrl").value = pet.imagemUrl;
          });
          editDeleteContainer.appendChild(editButton);
  
          const deleteButton = document.createElement("button");
          deleteButton.setAttribute("type", "button");
          deleteButton.classList.add("btn", "btn-danger", "mx-2");
          deleteButton.textContent = "Excluir";
          deleteButton.addEventListener("click", function () {
            if (confirm("Tem certeza que deseja excluir este animal perdido?")) {
              deletePet(pet.id, loadAndDisplayPets);
            }
          });
          editDeleteContainer.appendChild(deleteButton);
          box.appendChild(editDeleteContainer);
  
          content.appendChild(petImage);
          content.appendChild(box);
          resultsSection.appendChild(content);
        }
      });
    } catch (error) {
      console.error("Erro ao carregar e exibir os pets:", error);
    }
  }
  

async function updatePet(id, pet) {
  try {
    const response = await fetch(`${apiUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pet),
    });
    const data = await response.json();
    console.log("Anúncio alterado com sucesso:", data);
    displayMessage("Anúncio alterado com sucesso");
    updatePetCard(id, pet);
  } catch (error) {
    console.error('Erro ao atualizar Anúncio via API JSONServer:', error);
    displayMessage("Erro ao atualizar Anúncio");
  }
}

async function deletePet(id, refreshFunction) {
  try {
    const response = await fetch(`${apiUrl}/${id}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    console.log("Anúncio removido com sucesso:", data);
    displayMessage("Anúncio removido com sucesso");

    const usersResponse = await fetch(usersApiUrl);
    const usersData = await usersResponse.json();
    usersData.forEach(async (user) => {
      const index = user.animais_perdidos.indexOf(id);
      if (index !== -1) {
        user.animais_perdidos.splice(index, 1);
        try {
          const updateUserResponse = await fetch(`${usersApiUrl}/${user.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
          });
          const updateUserData = await updateUserResponse.json();
          console.log(`ID ${id} removido da lista animais_perdidos do usuário ${user.id}`);
        } catch (error) {
          console.error(`Erro ao atualizar usuário ${user.id} na API:`, error);
        }
      }
    });

    if (refreshFunction) refreshFunction();
  } catch (error) {
    console.error('Erro ao remover Anúncio via API JSONServer:', error);
  }
}

async function verificarLogin(event) {
  const user = sessionStorage.getItem('userName') || localStorage.getItem('userName');
  if (!user) {
    event.preventDefault();
    window.location.href = '../html/cadastro_usuario.html';
  }
}

function updateCadastroButton() {
  const btnCadastrar = document.getElementById('btn-cadastrar');
  const user = sessionStorage.getItem('userName') || localStorage.getItem('userName');
  if (user) {
    btnCadastrar.textContent = 'Logado';
    btnCadastrar.href = '../html/editor_perfil.html';
  } else {
    btnCadastrar.textContent = 'Cadastrar';
    btnCadastrar.href = '../html/cadastro_usuario.html';
  }
}

function displayMessage(message) {
  console.log(message);
}

function init() {
}

function updatePetCard(id, updatedPet) {
  const card = document.querySelector(`.pet-card[data-id="${id}"]`);
  if (card) {
    card.querySelector('img').src = updatedPet.imagemUrl;
    card.querySelector('h3').textContent = updatedPet.nome;
    card.querySelector('.pet-info strong').textContent = updatedPet.especie;
    card.querySelector('.pet-info p:nth-child(3)').textContent = updatedPet.endereco;
    card.querySelector('.pet-info p:nth-child(4)').textContent = updatedPet.descricao;
    card.querySelector('.pet-info strong:nth-child(5)').textContent = "Contatos: " + updatedPet.contatos;
    card.querySelector('.status').textContent = updatedPet.status;
  }
}
